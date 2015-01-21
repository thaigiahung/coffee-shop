/**
 * IngredientController
 *
 * @description :: Server-side logic for managing materials
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 
var mixpanel = sails.config.mixpanel;
module.exports = {
	create: function(req, res) {
		Ingredient.create(req.body).exec(function(err, newIngredient){
			if (err) {
				console.log(err);
				res.send('Khong tao duoc Ingredient');
			} else {
				mixpanel.track('Ingredient',{
					"id": newIngredient.id,
					"name": newIngredient.name,
					"price": newIngredient.price,
					"description": newIngredient.description,
					"unit": newIngredient.unit,
					"instock": newIngredient.instock
				});
				res.status(201);
                res.ok(newIngredient.toJSON());
			}
		});
	},
	// Build List material in mixpanel
	updateMix: function(req, res) {
		Ingredient.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				Ingredient.find({ id: i }).exec(function(err, rs){
					mixpanel.track('Ingredient',{
						"id": rs[0].id,
						"name": rs[0].name,
						"price": rs[0].price,
						"description": rs[0].description,
						"unit": rs[0].unit,
						"instock": rs[0].instock
					});
					
				});
			}
		});
	},

/**
 * show all ingredients
 */
	view: function(req, res) {
		Ingredient.find().exec(function (err, found) {
			//check if there is any error
			if(err) {
				res.json({
					'status': 0,
					'message': 'error'
				});
			}

			//check if there is any product
			if(!found || !found.length) {
				res.json({
					'status': 0,
					'message': 'can not find any ingredient'
				});
			}

			res.json({
				'status': 1,
				'message': 'success',
				'ingredient': found
			});
		});
	}
};

