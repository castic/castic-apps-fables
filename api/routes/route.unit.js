var Units;

exports.setRoute = function (db) {
	Units = db.model('Unit');

	return {
		list: list,
		addUnit: addUnit,
		updateUnit: updateUnit,
		purgeUnits: purgeUnits
	}
}

list = function (req, res) {
	Units.find({}, function (err, units) {
		if (err) {
			console.log(err);
			// res.send(err);
		}
		res.json(units);
		// console.log(units);
	});
};

addUnit = function (req, res) {
	if (req.body.realm.length > 0) {
		var newTask = new Units({
			realm: req.body.realm,
			land: req.body.land
		});

		newTask.save(function (err, result) {
			res.send(result);
		});	
	} else {
		res.send('nothing to add');
	}
};

updateUnit = function (req, res) {
	if (req.body.title.length > 0) {
		Units.update(
			{unitId: req.body.unitId},
			{ 
				$set: {
					realm: req.body.realm,
					land: req.body.land
				}
			}, function	(err, rows, dbResponse) {
				res.send(rows);				
			}
		);
	} else {
		res.send('nothing to update');
	}
};

purgeUnits = function (req, res) {
	// Removes all units
	Units.find({}).remove().exec();

	res.send('everything was removed');
};