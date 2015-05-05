var db = require('./mongodb_config.js').db,
	fables = require('./routes.js').initRoutes(db),
	express = require('express'),
	api_server = express(),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions');

// To be implemented later
var webpath = __dirname.replace('/api', '');
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

api_server.use( bodyParser.json() );       						// to support JSON-encoded bodies
api_server.use( bodyParser.urlencoded({ extended: true }));		// to support URL-encoded bodies

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
// api_server.use(express.static(webpath));
// api_server.get('/', function (req, res) {
// 	res.send(webpath+'/index.html');
// });

api_server.listen(8300);

// Quests
api_server.get('/quests', fables.quests.list);
api_server.post('/quests/new', fables.quests.addQuest);
api_server.put('/quests/update', fables.quests.updateQuest);
api_server.delete('/quests/remove/:questId', fables.quests.removeQuest);

// Units
api_server.get('/units', fables.units.list);
api_server.post('/units/new', fables.units.addUnit);
api_server.put('/units/update', fables.units.updateUnit);
api_server.delete('/units/remove/:unitId', fables.units.removeUnit);

// People
api_server.get('/people', fables.people.list);
api_server.post('/people/new', fables.people.addPerson);
api_server.put('/people/update', fables.people.updatePerson);
api_server.delete('/people/remove/:personId', fables.people.removePerson);

// Stories
api_server.get('/stories', fables.stories.list);
api_server.post('/stories/new', fables.stories.addStory);
api_server.put('/stories/update', fables.stories.updateStory);
api_server.delete('/stories/remove/:storyId', fables.stories.removeStory);

// AD routes
api_server.get('/ad-users', fables.ad.listUsers);
api_server.get('/ad-users/:username', fables.ad.getUser);
// api_server.get('/login', fables.ad.login);
api_server.post('/login', fables.ad.login);
api_server.get('/logout', fables.ad.logout);

// USE WITH CAUTION
api_server.get('/quests/remove-all', fables.quests.purgeQuests);
// api_server.get('/units/remove-all', fables.units.purgeUnits);
// api_server.get('/people/remove-all', fables.people.purgePeople);
// api_server.get('/stories/remove-all', fables.people.purgeStories);