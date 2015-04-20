var Quests = require('./models/quest.js').quest,
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
};
