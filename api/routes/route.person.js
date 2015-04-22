var People;

exports.setRoute = function (db) {
	People = db.model('Person');

	return {
		list: list,
		addPerson: addPerson,
		updatePerson: updatePerson,
		purgePeople: purgePeople
	}
}

list = function (req, res) {
	People.find({}, function (err, people) {
		if (err) {
			console.log(err);
			// res.send(err);
		}
		res.json(people);
		// console.log(people);
	});
};

addPerson = function (req, res) {
	if (req.body.realm.length > 0) {
		var newTask = new People({
			pid: req.body.pid,
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			unit: req.body.unitId,
			title: req.body.title,
			location: req.body.location,
			role: req.body.role
			// abilities:[{type: Number, ref: 'Tag'}],
			// stories: [{type: Number, ref: 'Story'}],
			// assets: [{type: Number, ref: 'Asset'}]
		});

		newTask.save(function (err, result) {
			res.send(result);
		});	
	} else {
		res.send('nothing to add');
	}
};

updatePerson = function (req, res) {
	if (req.body.title.length > 0) {
		People.update(
			{personId: req.body.personId},
			{ 
				$set: {
					pid: req.body.pid,
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					unit: req.body.unitId,
					title: req.body.title,
					location: req.body.location,
					role: req.body.role
				}
			}, function	(err, rows, dbResponse) {
				res.send(rows);				
			}
		);
	} else {
		res.send('nothing to update');
	}
};

purgePeople = function (req, res) {
	// Removes all people
	People.find({}).remove().exec();

	res.send('everyone was removed');
};