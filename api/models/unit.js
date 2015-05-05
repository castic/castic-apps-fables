var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var unitSchema = new Schema({
		_id: Number,
		realm: String,
		land: String
	});

exports.docSchema = unitSchema