var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var unitSchema = Schema({
		_id: Number,
		realm: String,
		land: String
	});

var Unit  = mongoose.model('Unit', storySchema);

exports.Unit = Unit;