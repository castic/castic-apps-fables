var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var questSchema = require('./models/quest.js').questSchema;

var mongodbURL = 'mongodb://localhost/fables';
var mongodbOptions = { };

global.db = mongoose.createConnection(mongodbURL, mongodbOptions);

autoIncrement.initialize(db);

questSchema.plugin(autoIncrement.plugin, { model: 'Quest', field: 'questId' });

db.model('Quest', questSchema);

exports.db = db;