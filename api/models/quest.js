var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var questSchema = new Schema({
		title: String,
		estimatedTime: {
			type: Number,
			default: 15
		},
		tags: [String],
		children: [{type: Schema.ObjectId, ref: 'Quest'}]
	});

exports.quest =  mongoose.model('Quest', questSchema);