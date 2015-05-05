var autoIncrement = require('mongoose-auto-increment');

exports.initRoutes = function (db) {

	autoIncrement.initialize(db);
	
	return {
		quests: registerSimpleModel(db, 'Quest', 'quest'),
		units: registerSimpleModel(db, 'Unit', 'unit'),
		people: registerSimpleModel(db, 'Person', 'person'),
		stories: registerSimpleModel(db, 'Story', 'story'),
		ad: require('./routes/route.ad.js')
	}
};

// registerModel = function (db, modelName, fileName) {
// 	var dbSchema = require('./models/'+ fileName +'.js').docSchema; 

// 	dbSchema.plugin(autoIncrement.plugin, { model: modelName, field: fileName+'Id' });
// 	db.model(modelName, dbSchema);

// 	return require('./routes/route.'+ fileName +'.js').setRoute(db)
// };

registerSimpleModel = function (db, modelName, fileName) {
	var dbSchema = require('./models/'+ fileName +'.js').docSchema; 

	dbSchema.plugin(autoIncrement.plugin, modelName);
	db.model(modelName, dbSchema);

	return require('./routes/route.'+ fileName +'.js').setRoute(db)
};