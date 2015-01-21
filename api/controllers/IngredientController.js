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
	},

	getIngredientOf1Store: function(req, res) {		
		IngredientStore.find({ store: req.param('store') }).populate('ingredient').exec(function (err, founds) {
			if(err) {
				res.json({
					'status': 0,
					'message': 'Lỗi'
				});
			}
			else if(typeof founds == "undefined" || founds.length == 0) {
				res.json(
				{
					"message": "Không tìm thấy nguyên liệu!",
					"status": 0
				});
			}
			else
			{
				var arrIngredient = [];
				founds.forEach(function(found){
					var ingre = {"ingredientid": found.ingredient.id,"ingredientname": found.ingredient.name};
					arrIngredient.push(ingre);
				});
				res.json({
					'status': 1,
					'message': 'Thành công',
					'ingredient': arrIngredient
				});
			}			
		});
	},

/**
 * [description] update the limitation of the ingredient
 * when the amount of ingredient instock reached this LIMIT
 * the system will send the notification to general manager
 *
 * [input]
 * id : id ingredient that will be update
 * amount : the LIMIT
 *
 * [output]
 * status: 0-fail, 1-success
 */
	updateLimit: function(req, res) {
		/**
		 * find one ingredient by id and storeid
		 * then update the limit equal to amount
		 */
		Ingredient.update({ id: req.param('id'), store: req.param('storeid') },
			{ limit: req.param('amount') } )
			.exec(function (err, ingredient) {

			//check if there is any error. write to the log and return fail
			if (err) {
				console.log(err);
				return res.json({"status": 0});
			}

			//check if there is no ingredient found. write to the log and return fail
			if (!ingredient || !ingredient.length) {
				console.log("Can not find any ingredient");
				return res.json({"status": 0});
			}

			//if everything is ok, return success
			return res.json({"status": 1});
		});
	}
};
