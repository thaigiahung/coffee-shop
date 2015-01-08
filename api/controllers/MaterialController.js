/**
 * MaterialController
 *
 * @description :: Server-side logic for managing materials
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mixpanel = sails.config.mixpanel;
module.exports = {
	create: function(req, res) {
		Material.create(req.body).exec(function(err, newMaterial){
			if (err) {
				console.log(err);
				res.send('Khong tao duoc Material');
			} else {
				mixpanel.track('Material',{
					"id": newMaterial.id,
					"name": newMaterial.name,
					"price": newMaterial.price,
					"description": newMaterial.description,
					"unit": newMaterial.unit,
					"instock": newMaterial.instock
				});
				res.status(201);
                res.ok(newMaterial.toJSON());
			}
		});
	},
	// Build List material in mixpanel
	updateMix: function(req, res) {
		Material.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				Material.find({ id: i }).exec(function(err, rs){
					mixpanel.track('Material',{
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
	}
};

