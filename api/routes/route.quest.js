var Quests;

exports.setRoute = function (db) {
	Quests = db.model('Quest');

	return {
		list: list,
		addQuest: addQuest,
		updateQuest: updateQuest,
		purgeQuests: purgeQuests
	}
}

list = function (req, res) {
	Quests.find({}, function (err, quests) {
		if (err) {
			console.log(err);
			// res.send(err);
		}
		res.json(quests);
		// console.log(quests);
	});

	// Removes all quests
	// Quests.find({}).remove().exec();
};

addQuest = function (req, res) {
	if (req.body.title.length > 0) {
		var newTask = new Quests({
			title: req.body.title,
			estimatedTime: req.body.estimatedTime,
			tags: [req.body.tags],
			children: []
		});

		newTask.save(function (err, result) {
			res.send(result);
		});	
	} else {
		res.send('nothing to add');
	}
};

updateQuest = function (req, res) {
	if (req.body.title.length > 0) {
		Quests.update(
			{questId: req.body.questId},
			{ 
				$set: {
					title: req.body.title,
					estimatedTime: req.body.estimatedTime,
					tags: [req.body.tags]	
				}
			}, function	(err, rows, dbResponse) {
				res.send(rows);				
			}
		);
	} else {
		res.send('nothing to update');
	}
};

purgeQuests = function (req, res) {
	// Removes all quests
	Quests.find({}).remove().exec();

	res.send('everything was removed');
};