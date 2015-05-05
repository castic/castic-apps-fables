var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var questSchema = new Schema({
		_id: Number,
		title: String,
		estimatedTime: {
			type: Number,
			default: 15
		},
		tags: [String],
		children: [{type: Number, ref: 'Quest'}]
	});

exports.docSchema = questSchema;