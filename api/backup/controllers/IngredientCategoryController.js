/**
 * IngredientCategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mixpanel = sails.config.mixpanel;

module.exports = {
	


  /**
   * `IngredientCategoryController.list()`
   */

	create: function(req,res) {

		IngredientCategory.create(req.body).exec(function(err,newIngredientCategory){
			if(err) {
				res.send('tao danh muc bi loi');
			} else {
				mixpanel.track('Ingredientcategory_created',{
					"Ingredientcategory_name": req.body.name,
					"Ingredientcategory_description": req.body.description
				});
				res.status(201);
                res.ok(newIngredientCategory.toJSON());
			}
		});
	},

	list: function (req, res) {
		return res.json({
			todo: 'list() is not implemented yet!'
		});
	},

		// Build List material in mixpanel
	updateMix: function(req, res) {
		console.log("update mix ingredient category");
		IngredientCategory.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				IngredientCategory.findOne({ id: i }).exec(function(err, rs){
					mixpanel.track('IngredientCategory',{
						"Name": rs.name,
						"Description": rs.description
					});
					
				});
			}
		});
	}

};

