var fs = require('fs'),
	Converter = require("csvtojson").core.Converter;

exports.setRoute = function (db) {
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
		    
		    var convertedObj = {
		    	json: jsonObj,
		    	fileName: file.filename,
		    	uuid: file.uuid
		    };

		    return res.send(convertedObj); 
		});	
	} else {
		res.send({});
	}
};

getJSON = function (pathToCSV) {

	var fileStream = fs.createReadStream(pathToCSV);
	
	//new converter instance 
	var csvConverter = new Converter({constructResult:true});
	 
	//read from file 
	fileStream.pipe(csvConverter);

	return csvConverter;
};