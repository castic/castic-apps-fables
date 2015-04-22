var mongoose = require('mongoose');
	mongodbURL = 'mongodb://localhost/fables';
	mongodbOptions = { };

exports.db = mongoose.createConnection(mongodbURL, mongodbOptions);