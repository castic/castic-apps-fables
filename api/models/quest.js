var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var questSchema = Schema({
	_id: Number,
	title: String,
	estimatedTime: Number,
	tag: [String],
	child: [{type: Number, ref: 'Quest'}]
});

var Quest  = mongoose.model('Quest', storySchema);

exports.list = function() {
	return Quest;
};