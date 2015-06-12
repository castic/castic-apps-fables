var Stories;

exports.setRoute = function (db) {
	Stories = db.model('Story');

	return {
		list: list,
		getStory: getStory,
		addStory: addStory,
		updateStory: updateStory,
		removeStory: removeStory,
		purgeStories: purgeStories
	}
}

getStory = function (req, res) {
	console.log('Single story: ',req.headers);

	Stories.find({_id: req.params.storyId})
		.populate('hero champion contacts unit')
		.exec(function (err, docs) {
			var options = [
				{path: 'hero.unit', model: 'Unit'},
				{path: 'champion.unit', model: 'Unit'},
				{path: 'contacts.unit', model: 'Unit'}
			];

			if (err) {
				console.log(err);
				res.send(err);
			}

			Stories.populate(docs, options, function (err, story) {
				res.send(story);
			});
		});
};

list = function (req, res) {
	console.log('All Stories: ',req.headers);

	Stories.find({})
		.populate('hero champion contacts unit')
		.exec(function (err, docs) {
			var options = [
				{path: 'hero.unit', model: 'Unit'},
				{path: 'champion.unit', model: 'Unit'},
				{path: 'contacts.unit', model: 'Unit'}
			];

			if (err) {
				console.log(err);
				res.send(err);
			}

			Stories.populate(docs, options, function (err, stories) {
				res.json(stories);
			});
		});

	// Removes all stories
	// Stories.find({}).remove().exec();
};

addStory = function (req, res) {
	if (req.body.title.length > 0) {
		var newTask = new Stories({
			title: req.body.title,
			hero: req.body.hero,
			champion: req.body.champion,
			contacts: req.body.contacts,
			unit: req.body.unit,
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
		
		// var contacts = [];
		var updatedStory = {
			title: req.body.title,
			hero: req.body.hero._id,
			champion: req.body.champion._id,
			contacts: [],
			// unit: req.body.unit._id,
			timeLine: req.body.timeLine,
			completed: req.body.completed
			// assets: [{type: Number, ref: 'Asset'}],
			// timeCreated: { type: Date, default: Date.now }	
		};

		for (var i = req.body.contacts.length - 1; i >= 0; i--) {
			updatedStory.contacts.push(req.body.contacts[i]._id)
		};

		if (req.body.unit == null) {
			updatedStory.unit = req.body.contacts[0].unit._id;
		}

		Stories.update(
			{_id: req.body._id},
			{ 
				$set: updatedStory
			}, function	(err, rows, dbResponse) {
				console.log('Error: ', err);
				console.log('DB: ', dbResponse);
				console.log('Rows: ', rows);
				res.send(rows);				
			}
		);
	} else {
		res.send('nothing to update');
	}
};

removeStory = function (req, res) {
	Stories.findOne({_id: req.params.storyId}).remove(function (err, message) {
		if (err) {
			res.send('nothing to delete');
		}
		console.log('removed _id: ',req.params.storyId, 'from the db');
		res.send(message);
	});
};

purgeStories = function (req, res) {
	// Removes all stories
	Stories.find({}).remove().exec();

	res.send('everything was removed');
};