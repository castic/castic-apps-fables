var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
	// autoIncrement = require('mongoose-auto-increment');

exports.questSchema = new Schema({
		title: String,
		estimatedTime: {
			type: Number,
			default: 15
		},
		tags: [String],
		children: [{type: Number, ref: 'Quest'}]
	});

