// grab the Mixpanel factory
var Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
// real
var mixpanel = Mixpanel.init('c4672bf3734184d3590deca09f4650a7'); 
// test
// var mixpanel = Mixpanel.init('09463e082379bf033038dd530b8c973b');

console.log('mixpanel running');

exports.mixpanel = mixpanel;