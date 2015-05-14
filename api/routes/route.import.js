var fs = require('fs');

exports.setRoute = function (db) {
	return {
		quests: importQuest
	}
};

importQuest = function (req, res) {
	var file = req.files.file || {}

	console.log(file);
	res.send(file);
};