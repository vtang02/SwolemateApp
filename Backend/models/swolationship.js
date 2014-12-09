var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Account = require('./account.js');
var Goal = require('./goal.js');
var Message = require('./message.js');


var Swolationship = new Schema({
	user1_ID: {type: ObjectId, ref: 'Account'},
	user2_ID: ObjectId,
goals: [Goal],
messages: [Message],
})


/*
Need methods:
- on load (session token)->(message history, active (incomplete) goals, goal history)
- 

*/




module.exports = mongoose.model('Swolationship', Swolationship);
