var Stories;

exports.setRoute = function (db) {
	Stories = db.model('Story');

	return {
		list: list,
		addStory: addStory,
		updateStory: updateStory,
		purgeStories: purgeStories
	}
}

list = function (req, res) {
	Stories.find({}, function (err, stories) {
		if (err) {
			console.log(err);
			// res.send(err);
		}
		res.json(stories);
		// console.log(stories);
	});

	// Removes all stories
	// Stories.find({}).remove().exec();
};

addStory = function (req, res) {
	if (req.body.title.length > 0) {
		var newTask = new Stories({
			title: req.body.title,
			hero: req.body.heroId,
			champion: req.body.championId,
			contacts: req.body.contacts,
			unit: req.body.unitId,
			timeLine: req.body.timeLine,
			// assets: [{type: Number, ref: 'Asset'}],
			// timeCreated: { type: Date, default: Date.now }
		});

		newTask.save(function (err, result) {
			res.send(result);
		});	
	} else {
		res.send('nothing to add');
	}
};

updateStory = function (req, res) {
	if (req.body.title.length > 0) {
		Stories.update(
			{storyId: req.body.storyId},
			{ 
				$set: {
					title: req.body.title,
					hero: req.body.heroId,
					champion: req.body.championId,
					contacts: req.body.contacts,
					unit: req.body.unitId,
					timeLine: req.body.timeLine,
					// assets: [{type: Number, ref: 'Asset'}],
					// timeCreated: { type: Date, default: Date.now }	
				}
			}, function	(err, rows, dbResponse) {
				res.send(rows);				
			}
		);
	} else {
		res.send('nothing to update');
	}
};

purgeStories = function (req, res) {
	// Removes all stories
	Stories.find({}).remove().exec();

	res.send('everything was removed');
};