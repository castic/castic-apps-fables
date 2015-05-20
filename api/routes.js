var autoIncrement = require('mongoose-auto-increment'),
	deepPopulate = require('mongoose-deep-populate');

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
	// get Model
	var dbSchema = require('./models/'+ modelName.toLowerCase() +'.js').docSchema; 
	
	// register plugins
	dbSchema.plugin(autoIncrement.plugin, modelName);
	dbSchema.plugin(deepPopulate, {});

	// register Model
	db.model(modelName, dbSchema);

	return require('./routes/route.'+ modelName.toLowerCase() +'.js').setRoute(db)
};

// registerSimpleModel = function (db, modelName, fileName) {
// 	var dbSchema = require('./models/'+ fileName +'.js').docSchema; 

// 	dbSchema.plugin(autoIncrement.plugin, modelName);
// 	db.model(modelName, dbSchema);

// 	return require('./routes/route.'+ fileName +'.js').setRoute(db)
// };