var autoIncrement = require('mongoose-auto-increment');

exports.initRoutes = function (db) {

	autoIncrement.initialize(db);
	
	return {
		quests: registerModel(db, 'Quest', 'quest'),
		units: registerModel(db, 'Unit', 'unit'),
		people: registerModel(db, 'Person', 'person'),
		stories: registerModel(db, 'Story', 'story')
	}
};

registerModel = function (db, modelName, fileName) {
	var dbSchema = require('./models/'+ fileName +'.js').docSchema; 

	dbSchema.plugin(autoIncrement.plugin, { model: modelName, field: fileName+'Id' });
	db.model(modelName, dbSchema);

	return require('./routes/route.'+ fileName +'.js').setRoute(db)
};