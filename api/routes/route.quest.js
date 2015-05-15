var Quests;

exports.setRoute = function (db) {
	Quests = db.model('Quest');

	return {
		list: list,
		addQuest: addQuest,
		updateQuest: updateQuest,
		removeQuest: removeQuest,
		purgeQuests: purgeQuests
	}
};

list = function (req, res) {
	Quests.find({})
		.populate('children')
		.exec(function (err, quests) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.json(quests);
			// console.log(quests);
		});
};

addQuest = function (req, res) {
	if (req.body.title !== "") {
		
		console.log('adding new quest... ', req.body.title);

		var newTask = new Quests({
			title: req.body.title,
			estimatedTime: req.body.estimatedTime,
			tags: req.body.tags,
			children: req.body.children
		});

		newTask.save(function (err, result) {
			console.log('...done');
			console.log(result);
			res.send(result);
		});	
	} else {
		res.send('nothing to add');
	}
};

updateQuest = function (req, res) {
	if (req.body.title.length > 0) {
		console.log(req.body._id);

		Quests.update(
			{_id: req.body._id},
			{ 
				$set: {
					title: req.body.title,
					estimatedTime: req.body.estimatedTime,
					tags: req.body.tags,
					children: req.body.children
				}
			}, function	(err, rows, dbResponse) {
				res.send(rows);				
			}
		);
	} else {
		res.send('nothing to update');
	}
};

removeQuest = function (req, res) {
	Quests.findOne({_id: req.params.questId}).remove(function (err, message) {
		if (err) {
			res.send('nothing to delete');
		}
		console.log('removed _id: ',req.params.questId, 'from the db');
		res.send(message);
	});
};

purgeQuests = function (req, res) {
	// Removes all quests
	Quests.find({}).remove().exec();

	res.send('everything was removed');
};