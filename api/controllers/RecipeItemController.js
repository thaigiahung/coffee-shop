/**
 * RecipeItemController
 *
 * @description :: Server-side logic for managing recipeitems
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var mixpanel = sails.config.mixpanel;
var material_name = "";
var product_name = "";

module.exports = {
	// create: function(req,res) {
	// 	Recipeitem.create(req.body).exec(function(err, NewRecipeitem){
	// 		if(!err) {
	// 			res.status(201);
	//             res.ok(newProduct.toJSON());
	// 		}
	// 	})
	// }

	// Build List material in mixpanel
	updateMix: function(req, res) {
		RecipeItem.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				RecipeItem.findOne({ id: i }).exec(function(err, rs){
					Material.findOne({id: rs.material}).exec(function(err2, material){
						if (!err2) {
							Product.findOne({id: rs.product}).exec(function(err3, product){
								if (!err3) {
									mixpanel.track('Recipe',{
										"id": rs.id,
										"material": material.description,
										"product": product.name
									});		
								}
							});		
						}
					});
				});
			}
		});
	}
};