var autoIncrement = require('mongoose-auto-increment');

exports.initRoutes = function (db) {

	autoIncrement.initialize(db);
	
	return {
		quests: registerModel(db, 'Quest'),
		units: registerModel(db, 'Unit'),
		people: registerModel(db, 'Person'),
		stories: registerModel(db, 'Story'),
		// ad: require('./routes/route.ad.js'),
		importFile: require('./routes/route.import.js').setRoute(db)
	}
};

registerModel = function (db, modelName) {
	var dbSchema = require('./models/'+ modelName.toLowerCase() +'.js').docSchema; 
	
	dbSchema.plugin(autoIncrement.plugin, modelName);
	db.model(modelName, dbSchema);

	return require('./routes/route.'+ modelName.toLowerCase() +'.js').setRoute(db)
};

// registerSimpleModel = function (db, modelName, fileName) {
// 	var dbSchema = require('./models/'+ fileName +'.js').docSchema; 

// 	dbSchema.plugin(autoIncrement.plugin, modelName);
// 	db.model(modelName, dbSchema);

// 	return require('./routes/route.'+ fileName +'.js').setRoute(db)
// };