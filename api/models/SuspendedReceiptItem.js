/**
* SuspendedReceiptItem.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

        id: {type: 'integer', autoIncrement: true, primaryKey: true},

        receiptid: { type: 'string' },

        product: { model: 'product' },

        amount: { type: 'int' },

        price: { type: 'float' },
  }
};

