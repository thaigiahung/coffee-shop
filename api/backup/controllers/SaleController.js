/**
 * SaleController
 *
 * @description :: Server-side logic for managing sales
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// var flow = require('nimble');
var step = require('step');
var mixpanel = sails.config.mixpanel;

module.exports = {
	create: function(req, res){

        var receipt = eval("(" + req.body.receipt + ")");
        delete req.body.receipt;

        // Create new sale
        Sale.create(req.body).exec(function created (err, newSale) {

            // Differentiate between waterline-originated validation errors
            // and serious underlying issues. Respond with badRequest if a
            // validation error is encountered, w/ validation info.
            console.log(req.body.user.store.name);
            
            if (err) return res.negotiate(err);

            // Create new sale items
            var nSaleItem = receipt.length,
                j = 0;
            for(i=0; i<nSaleItem; i++){
                var saleItem = {
                    sale: newSale.id,
                    product: receipt[i][0],
                    quantity: receipt[i][1],
                    price: receipt[i][2]
                }

                SaleItem.create(saleItem).exec(function(err, newSaleItem){
                    if (err) return res.negotiate(err);

                    j++;
                    
                    if(j == nSaleItem)
                    {
                        // Send JSONP-friendly response if it's supported
                        // (HTTP 201: Created)
                        res.status(201);
                        res.ok(newSale.toJSON());
                    }
                });

                // update stock status
                RecipeItem.find({product: saleItem.product}).exec(function(err, recipeItems){
                    // TODO: handle error

                    for(k=0; k<recipeItems.length; k++){
                        var recipeItem = recipeItems[k];
                        Material.findOne(recipeItem.material).exec(function(err, material){
                            Material.update(
                                {id: material.id},
                                {instock: material.instock - saleItem.quantity*recipeItem.quantity}
                                ).exec(function(err, newMaterial){
                                    if(err)
                                        sails.log.error(err);
                                });
                        })
                    }
                })
            }            
        });
    },

    report: function(req, res){
        var user = req.user;
        var today = new Date();
        today.setHours(0, 0, 0);
        Sale.find({user: user.id, updatedAt: {'>': today}})
            .exec(function(err, sales){
                var subtotal = 0.0;
                var discount = 0.0;
                var total = 0.0;
                var totalItem = 0;

                step(
                    function calculate(){
                        var saleDetails = {};
                        for(i=0; i<sales.length; i++){
                            total += sales[i].total;
                            subtotal += sales[i].subtotal;
                            discount += sales[i].discount;
                            totalItem += sales[i].totalItem;
                            SaleItem.find({sale: sales[i].id})
                                .populate('product')
                                .exec(this);
                        }
                    },
                    function calSaleDetails(err, saleItems){
                        if(err)
                            throw err;
                        var saleDetails = {};
                        for(j=0; j<saleItems.length; j++){
                            if(saleItems[j].product === undefined)
                                continue;
                            if(saleDetails.hasOwnProperty(saleItems[j].product.name))
                                saleDetails[saleItems[j].product.name]
                                    += saleItems[j].quantity;
                            else
                                saleDetails[saleItems[j].product.name]
                                    = saleItems[j].quantity;
                        }
                        return saleDetails;
                    },
                    function render(err, saleDetails){
                        if(err)
                            throw err;
                        Material.find().exec(function(err, materials){
                            var inventoryDetails = {};
                            for(i=0; i<materials.length; i++){
                                inventoryDetails[materials[i].name] = new Array(materials[i].instock, materials[i].unit);
                            }
                            res.status(201);
                            res.ok({subtotal: subtotal, discount: discount, total: total, totalItem: totalItem, saleDetails: saleDetails, inventoryDetails: inventoryDetails});
                        })
                    }
                )
            });
    },

    updateMix : function(req, res) {

        var m_listStore;
        var m_listProduct;
        var m_listOrder=[];
        console.log("sale add");   

        Store.find().exec(function(err, listStore){
            if (!err) {
                m_listStore = listStore;    
                Product.find().exec(function(err1, listProduct){
                    if (!err1) {

                        for (var i=0; i<1000; i++) {
                            var product_id = UtilsService.getRandomInt(0,listProduct.length-1);
                            var store_id = UtilsService.getRandomInt(0,listStore.length-1);

                            var order = {
                                "store": listStore[store_id].name,
                                "product": listProduct[product_id].name,
                                "total": listProduct[product_id].price,
                                "shift": UtilsService.getRandomInt(1,2)
                            }

                            m_listOrder.push(order);
                        }
                        console.log("sale add 2");                         
                        for (var j=0; j<m_listOrder.length; j++) {
                            mixpanel.track('Order',{
                                "store": m_listOrder[j].store,
                                "product": m_listOrder[j].product,
                                "total": m_listOrder[j].total,
                                "shift": m_listOrder[j].shift
                            });
                        }

                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
        
      
        // for (var i = 0; i<100; i++) {

        // }
        
        // var orders = [
        //     {
        //         "store": "250 Dien Bien Phu",
        //         "product": "Espresso Hot",
        //         "price": receipt[i][2]
        //     },


        // ];
        // mixpanel.track('Order',{
        //     "store": "250 Dien Bien Phu",
        //     "product": receipt[i][0],
        //     "quantity": receipt[i][1],
        //     "price": receipt[i][2]
        // });
    }
};

