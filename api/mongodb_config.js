var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var mongodbURL = 'mongodb://localhost/fables';
var mongodbOptions = { };

global.db = mongoose.createConnection(mongodbURL, mongodbOptions);

autoIncrement.initialize(db);