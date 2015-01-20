/**
 * WorkingScheduleController
 *
 * @description :: Server-side logic for managing Workingschedules
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	    id: {type: 'integer', autoIncrement: true, primaryKey: true},

        user: { model: 'user' },

        starttime: { type: 'datetime' },

        endtime: { type: 'datetime' },
};

