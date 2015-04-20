var db = require('./mongodb_config.js'),
	Quests = require('./models/quest.js').quest,
	Story = require('./models/story.js'),
	Person = require('./models/person.js'),
	Unit = require('./models/unit.js');

exports.quests = function (req, res) {
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

exports.addQuest = function (req, res) {
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

exports.updateQuest = function (req, res) {
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

// exports.purgeQuests = function (req, res) {
// 	// Removes all quests
// 	Quests.find({}).remove().exec();

// 	res.send('everything was removed');
// }