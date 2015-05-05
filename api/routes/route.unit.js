var Units;

exports.setRoute = function (db) {
	Units = db.model('Unit');

	return {
		list: list,
		addUnit: addUnit,
		updateUnit: updateUnit,
		removeUnit: removeUnit,
		purgeUnits: purgeUnits
	}
}

list = function (req, res) {
	
	// console.log(req.session, 'in route.units.list');

	// if (req.session && req.session.user) {
		Units.find({}, function (err, units) {
			if (err) {
				console.log(err);
				// res.send(err);
			}
			res.json(units);
			// console.log(units);
		});
	// } else res.send([]);

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
	if (req.body.realm.length > 0) {
		Units.update(
			{_id: req.body._id},
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

removeUnit = function (req, res) {
	Units.findOne({_id: req.params.unitId}).remove(function (err, message) {
		if (err) {
			res.send('nothing to delete');
		}
		console.log('removed id: ',req.params.unitId, 'from the db');
		res.send(message);
	});
};

purgeUnits = function (req, res) {
	// Removes all units
	Units.find({}).remove().exec();

	res.send('everything was removed');
};