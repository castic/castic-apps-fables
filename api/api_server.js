var db = require('./mongodb_config.js'),
	Quests = require('./models/quest.js').quest,
	Story = require('./models/story.js'),
	Person = require('./models/person.js'),
	Unit = require('./models/unit.js'),
	express = require('express'),
	fable = {},
	fables = require('./routes.js'),
	api_server = express();

fable = {
	listAllQuests: function	(callBack) {
		return Quests.find({}, callBack);
	},
	listChildQuests: function (questID, callBack) {
		return Quests.findOne({_id: questID}).populate('children').exec(callBack);
	}
}

function errorHandler (res, err) {
    res.status(500).send({ error: err });
}

api_server.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:31337');
  // res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.sendStatus(200);
  next();
});

api_server.listen(8300);

api_server.get('/quests', fables.quests);

// api_server.get('/quests', function (req, res) {
// 	// var newTask = new fable.quests({
// 	// 	title: "Create new db entry 3",
// 	// 	estimatedTime: 4,
// 	// 	tag: ['mongodb', 'MeanStack','nodejs'],
// 	// 	children: ['5531d80f23cc59b24985fe48']
// 	// });

// 	// newTask.save();

// 	fable.listAllQuests(function (err, quests) {
// 		if (err) {
// 			errorHandler(res, err);
// 		}
// 		res.json(quests);
// 		console.log(quests);
// 	});
// });

api_server.get('/subquests', function (req, res) {
	
	fable.listChildQuests('5531d883c64278244a5562f3', function (err, singleQuest) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.json(singleQuest.children);
		console.log(singleQuest.children);
	});

});

api_server.get('/stories', function (req, res) {
	Story.list().find({}, function (err, stories) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.json(stories);
	});
});

api_server.get('/units', function (req, res) {
	unit.list().find({}, function (err, units) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.json(units);
	});
});

api_server.get('/people', function (req, res) {
	Person.list().find({}, function (err, people) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.json(people);
	});
});

