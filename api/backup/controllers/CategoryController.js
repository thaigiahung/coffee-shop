/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mixpanel = sails.config.mixpanel;

module.exports = {
	


  /**
   * `CategoryController.list()`
   */

	create: function(req,res) {

		Category.create(req.body).exec(function(err,newCategory){
			if(err) {
				res.send('tao danh muc bi loi');
			} else {
				mixpanel.track('category_created',{
					"category_name": req.body.name,
					"category_description": req.body.description
				});
				res.status(201);
                res.ok(newCategory.toJSON());
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
		console.log("update mix category");
		Category.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				Category.findOne({ id: i }).exec(function(err, rs){
					mixpanel.track('Category',{
						"Name": rs.name,
						"Description": rs.description
					});
					
				});
			}
		});
	}

};

