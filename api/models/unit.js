var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var unitSchema = new Schema({
		realm: String,
		land: String
	});

exports.docSchema = unitSchema