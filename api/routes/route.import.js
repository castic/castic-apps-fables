var fs = require('fs'),
	Converter = require("csvtojson").core.Converter,
	Quest;

exports.setRoute = function (db) {
	Quest = db.model('Quest');

	return {
		quests: importQuest
	}
};

importQuest = function (req, res) {
	var file = req.files.file|| {}

	console.log(file);

	// Only do import for text/csv file type
	if (file.mimetype == 'text/csv') {
		
		//end_parsed will be emitted once parsing finished 
		getJSON(file.file).on("end_parsed",function(jsonObj){
		    
			var json = transformToQuest(jsonObj, '|');

			importJSON(Quest, json, function (err, result) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				res.send(result);
			});
		});	
	} else {
		res.send({ message:'not a csv file' });
	}
};

transformToQuest = function (ary, delimiter) {
	ary.forEach(function (item) {
		if (item.tags) {
			item.tags = item.tags.split(delimiter);
		}
		if (item.children) {
			item.children = item.children.split(delimiter).map(Number);
		}
	});

	return ary;
};

getJSON = function (pathToCSV) {

	var fileStream = fs.createReadStream(pathToCSV);
	
	//new converter instance 
	var csvConverter = new Converter({constructResult:true});
	 
	//read from file 
	fileStream.pipe(csvConverter);

	return csvConverter;
};

importJSON = function (model, data, cb) {

	if (data.length > 0) {
		// console.log(model.find({}, cb));
		model.find({}).remove().exec(function (err) {
			if (err) cb(err);
			model.collection.insert(data, cb);
		})
	}
};
