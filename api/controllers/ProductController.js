/**
 * Module dependencies
 */
var _ = require('underscore'),
    actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

var sid = require('shortid');
var fs = require('fs');

var mixpanel = sails.config.mixpanel;

/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

module.exports = {
	update: function(req, res) {
		Category.find(req.body.category).exec(function(err, cat){
			if (err) {
				res.send('Khong the cap nhat san pham');
			} else {
				var afterSaveFile = function() {
					delete req.body.imageDataUrl;
					Product.findOne(req.params.id).exec(function(err, product){
						if (err || !product) {
							res.send('Khong the cap nhat san pham');
						} else {
							product.name = req.body.name;
							product.price = req.body.price;
							product.category = req.body.category;
							if (req.body.image) {
								product.image = req.body.image;
							}
							product.save(function(err) {
								console.log(err);
								if (err) {
									res.send('Khong the cap nhat san pham');
								} else {
									res.send(product);
								}
							});
						}
					});
				}
				if (req.body.imageDataUrl) {
					var id = sid.generate(),
					  fileName = id + '.jpg',
					  filePath = './assets/product-photos/' + fileName,
					imageBuffer = decodeBase64Image(req.body.imageDataUrl);
					fs.writeFile(filePath, imageBuffer.data, function(err) {
						if (!err) {
							req.body.image = fileName;
							afterSaveFile();
						} else {
							res.send('Khong the cap nhat san pham')
						}
					});
				} else {
					delete req.body.image;
					afterSaveFile();
				}
			}
		});
	},

	create: function(req, res) {

		var category_name = "";
		Category.find(req.body.category).exec(function(err, cat){
			if(!err) {
				category_name = cat.name;	
				// Save image
				var id = sid.generate(),
				  fileName = id + '.jpg',
				  filePath = './assets/product-photos/' + fileName,
				imageBuffer = decodeBase64Image(req.body.imageDataUrl);
				fs.writeFile(filePath, imageBuffer.data, function(err) {
					if (!err) {
						delete req.body.imageDataUrl;
						req.body.image = fileName;
						Product.create(req.body).exec(function(err, newProduct){
							if (err) {
								res.send('khong tao duoc san pham');
							} else {
								mixpanel.track('product_created',{
									"product_name": newProduct.name,
									"product_price": newProduct.description,
									"product_category": category_name,
									"price": newProduct.price
								});
								res.status(201);
		            res.json(newProduct);
							}
						});
					} else {
						console.log(err);
						res.send('Khong the luu hinh anh san pham');
					}
				});
			} else {
				res.send('tao SAN PHAM bi loi');
			}
		});		
	},

	updateMix: function(req, res) {
		Product.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				Product.find({ id: i }).exec(function(err, rs){
					var category_name = "";
					console.log(rs[0].category);
					Category.find({id: rs[0].category}).exec(function(err2, cat){
						if (err2) {
							console.log(err2);
						} else {
							category_name = cat[0].name;
							console.log(category_name);

							mixpanel.track('Product',{
								"Name": rs[0].name,
								"Description": rs[0].description,
								"Category": category_name,
								"Price": rs[0].price
							});
						}
					});
				});
			}
		});

		res.send("DONE");
	}
	
// create: function(req, res){

 //        var data = actionUtil.parseValues(req),
 //            recipe = req.body.recipe;

 //        // Create new product
 //        Product.create(data).exec(function created (err, newProduct) {

 //            // Differentiate between waterline-originated validation errors
 //            // and serious underlying issues. Respond with badRequest if a
 //            // validation error is encountered, w/ validation info.
 //            if (err) return res.negotiate(err);

 //            // If we have the pubsub hook, use the model class's publish method
 //            // to notify all subscribers about the created item
 //            if (req._sails.hooks.pubsub) {
 //                if (req.isSocket) {
 //                    Model.subscribe(req, newProduct);
 //                    Model.introduce(newProduct);
 //                }
 //                Model.publishCreate(newProduct, !req.options.mirror && req);
 //            }

 //            // Create new recipe items
 //            recipe.forEach(function(elem){
 //                elem.product = newProduct.id;
 //                RecipeItem.create(elem).exec();
 //            })

 //            // Send JSONP-friendly response if it's supported
 //            // (HTTP 201: Created)
 //            res.status(201);
 //            res.ok(newInstance.toJSON());
 //        });
 //    }
};

