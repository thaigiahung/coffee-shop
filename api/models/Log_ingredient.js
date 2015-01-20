/**
* Log_ingredient.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id: { type: 'integer', autoIncrement: true, primaryKey: true},

    // ingredient: { model: 'ingredient', required: true },

    attribute: { type: 'string', required: true },

    oldvalue: { type: 'string', required: true },

    newvalue: { type: 'string', required: true },

    // user: { model: 'user', required: true },

    timechange: { type: 'datetime', required: true },

    note: { type: 'text' },
  }
};

