/**
* UserShift.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id: {type: 'integer', autoIncrement: true, primaryKey: true},

    user: { model: 'user' },

    starttime: { type: 'datetime' },

    endtime: { type: 'datetime' },

    store: { model: 'store' },
  }
};

