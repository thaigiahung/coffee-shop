/**
 * StoreController
 *
 * @description :: Server-side logic for managing stores
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var mixpanel = sails.config.mixpanel;
module.exports = {
	create: function(req,res) {

		Store.create(req.body).exec(function(err,newCategory){
			if(err) {
				res.send('tao cua hang bi loi');
			} else {
				// mixpanel.track('Store',{
				// 	"name": req.body.name,
				// 	"address": req.body.address,
				// 	"phone": req.body.phone,
				// });
				res.status(201);
                res.ok(newCategory.toJSON());
			}
		});
	},

	updateMix: function(req, res) {
		console.log("update mix store");
		Store.find().exec(function(err, result){
			for (var i=1; i<=result.length; i++) {
				Store.findOne({ id: i }).exec(function(err, rs){
					mixpanel.track('Store',{
						"name": rs.name,
						"address": rs.address,
						"phone": rs.phone,
					});
					
				});
			}
		});
		res.send('DONE');
	},
};

