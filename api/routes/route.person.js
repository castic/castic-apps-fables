var People;

exports.setRoute = function (db) {
	People = db.model('Person');

	return {
		list: list,
		addPerson: addPerson,
		updatePerson: updatePerson,
		removePerson: removePerson,
		purgePeople: purgePeople
	}
}

list = function (req, res) {
	People.find({})
		.populate('unit')
		.exec(function (err, people) {
			if (err) {
				console.log(err);
				// res.send(err);
			}
			res.json(people);
			// console.log(people);
		});
};

addPerson = function (req, res) {
	if (req.body.name.length > 0) {
		var newTask = new People({
			pid: req.body.pid,
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			mobile: req.body.mobile,
			unit: req.body.unit,
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
	if (req.body.name.length > 0) {
		People.update(
			{_id: req.body._id},
			{ 
				$set: {
					pid: req.body.pid,
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					mobile: req.body.mobile,
					unit: req.body.unit,
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

removePerson = function (req, res) {
	Persons.findOne({_id: req.params.personId}).remove(function (err, message) {
		if (err) {
			res.send('nothing to delete');
		}
		console.log('removed id: ',req.params.personId, 'from the db');
		res.send(message);
	});
};

purgePeople = function (req, res) {
	// Removes all people
	People.find({}).remove().exec();

	res.send('everyone was removed');
};