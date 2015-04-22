var db = require('./mongodb_config.js').db,
	fables = require('./routes.js').initRoutes(db),
	express = require('express'),
	api_server = express(),
	bodyParser = require('body-parser');

api_server.use( bodyParser.json() );       						// to support JSON-encoded bodies
api_server.use( bodyParser.urlencoded({ extended: true }));		// to support URL-encoded bodies

api_server.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:31337');
  // res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.sendStatus(200);
  next();
});

api_server.listen(8300);

// Quests
api_server.get('/quests', fables.quests.list);
api_server.post('/quests/new', fables.quests.addQuest);
api_server.put('/quests/update', fables.quests.updateQuest);

// Units
api_server.get('/units', fables.units.list);
api_server.post('/units/new', fables.units.addUnit);
api_server.put('/units/update', fables.units.updateUnit);

// People
api_server.get('/people', fables.people.list);
api_server.post('/people/new', fables.people.addPerson);
api_server.put('/people/update', fables.people.updatePerson);

// Stories
api_server.get('/stories', fables.stories.list);
api_server.post('/stories/new', fables.stories.addStory);
api_server.put('/stories/update', fables.stories.updateStory);

// USE WITH CAUTION
// api_server.get('/quests/remove-all', fables.quests.purgeQuests);
// api_server.get('/units/remove-all', fables.units.purgeUnits);
// api_server.get('/people/remove-all', fables.people.purgePeople);
// api_server.get('/stories/remove-all', fables.people.purgeStories);