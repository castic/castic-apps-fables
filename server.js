var db = require('./api/mongodb_config.js').db,
	fables = require('./api/routes.js').initRoutes(db),
	express = require('express'),
	api_server = express(),
	webPath = __dirname + '/public',
	uploadDir = webPath + '/uploads',
	sessions = require('client-sessions'),
	busboy = require('express-busboy');

// To be implemented later
// var webpath = __dirname.replace('/api', '');
var getOrigin = function (res) {
	// var origin,
	// 	allowedOrigins = [
	// 		'http://localhost',
	// 		'http://10.100',
	// 		'http://192.168'];

	// for (var i = allowedOrigins.length - 1; i >= 0; i--) {
	// 	if (res.req.headers.origin  == allowedOrigins[i]) {

	// 	}
	// };

	// origin = 'http://localhost';

	return res.req.headers.origin;
}

// request parser that supports multipart form data (files)
busboy.extend(api_server, {
    upload: true,
    path: uploadDir
}); 	

// For use with cookies and client-side authentication
// api_server.use( sessions({
// 	cookieName: 'session',
// 	secret: 'losejcuvejosjeufnxsosgseljwo3SVUDSvs983nsv83qIsehs783woec',
// 	duration: 60 * 30 * 1000,
// 	activeDuration: 5 * 60 * 1000
// }));

api_server.all('*', function(req, res, next) {
	// console.log(res);
	res.set('Access-Control-Allow-Origin', getOrigin(res));
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	if ('OPTIONS' == req.method) return res.sendStatus(200);
next();
});

// default webapp if served from the same port 
api_server.use(express.static(webPath));
// api_server.get('/', );

api_server.listen(8300);

// Quests
api_server.get('/api/quests', fables.quests.list);
api_server.post('/api/quests/new', fables.quests.addQuest);
api_server.put('/api/quests/update', fables.quests.updateQuest);
api_server.delete('/api/quests/remove/:questId', fables.quests.removeQuest);
api_server.post('/api/quests/import', fables.importFile.quests);

// Units
api_server.get('/api/units', fables.units.list);
api_server.post('/api/units/new', fables.units.addUnit);
api_server.put('/api/units/update', fables.units.updateUnit);
api_server.delete('/api/units/remove/:unitId', fables.units.removeUnit);

// People
api_server.get('/api/people', fables.people.list);
api_server.post('/api/people/new', fables.people.addPerson);
api_server.put('/api/people/update', fables.people.updatePerson);
api_server.delete('/api/people/remove/:personId', fables.people.removePerson);

// Stories
api_server.get('/api/stories', fables.stories.list);
api_server.get('/api/stories/:storyId', fables.stories.getStory);
api_server.post('/api/stories/new', fables.stories.addStory);
api_server.put('/api/stories/update', fables.stories.updateStory);
api_server.delete('/api/stories/remove/:storyId', fables.stories.removeStory);

// AD routes
// api_server.get('/ad-users', fables.ad.listUsers);
// api_server.get('/ad-users/:username', fables.ad.getUser);
// api_server.get('/login', fables.ad.login);
// api_server.post('/login', fables.ad.login);
// api_server.get('/logout', fables.ad.logout);

// USE WITH CAUTION
// api_server.get('/quests/remove-all', fables.quests.purgeQuests);
// api_server.get('/units/remove-all', fables.units.purgeUnits);
// api_server.get('/people/remove-all', fables.people.purgePeople);
// api_server.get('/stories/remove-all', fables.people.purgeStories);