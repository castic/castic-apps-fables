var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var personSchema = new Schema({
		pid: Number,
		name: String,
		email: String,
		phone: String,
		mobile: String,
		unit: {type: Number, ref: 'Unit'},
		title: String,
		location: String,
		role: String,
		abilities:[String],
		stories: [{type: Number, ref: 'Story'}],
		assets: [{type: Number, ref: 'Asset'}]
	});

exports.docSchema = personSchema;