/**
 * RecipeItemController
 *
 * @description :: Server-side logic for managing recipeitems
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var mixpanel = sails.config.mixpanel;
var ingredient_name = "";
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

	// Build List ingredient in mixpanel
	updateMix: function(req, res) {
		RecipeItem.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				RecipeItem.findOne({ id: i }).exec(function(err, rs){
					Ingredient.findOne({id: rs.ingredient}).exec(function(err2, ingredient){
						if (!err2) {
							Product.findOne({id: rs.product}).exec(function(err3, product){
								if (!err3) {
									mixpanel.track('Recipe',{
										"id": rs.id,
										"ingredient": ingredient.description,
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