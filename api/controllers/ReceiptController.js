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
    indexByStore: function(req, res){
        Receipt.find({ store: req.param('store') }).populate('store').exec(function (err, receipt){
            if (err) {
                console.log(err);
                return res.json({"status": 0});
            }
            if (!receipt || !receipt.length) {
                console.log("Can not find any receipt");
                return res.json({"status": 0});
            }
            
            return res.json(receipt);
        });
        
    },
	indexRecieptItem: function(req, res){
        ReceiptItem.find({ receipt: req.param('id')}).exec(function (err, receiptItem){
            if (err) {
                console.log(err);
                return res.json({"status": 0});
            }
            if (!receiptItem || !receiptItem.length) {
                console.log("Can not find any receipt");
                return res.json({"status": 0});
            }
            return res.json(receiptItem);
        })
    }

};

