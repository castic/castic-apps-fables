var activeDirectory = require('activedirectory');
var fs = require('fs');
var config = { 
	url: 'ldaps://***REMOVED***:636',
	baseDN: 'dc=ad,dc=fiu,dc=edu',
	username: '***REMOVED***@fiu.edu',
	password: '***REMOVED***',
	attributes: {
		user: [ 
			'department', 
			// 'departmentNumber', 
			'employeeID', 
			'displayName', 
			'mail', 
			// 'telephoneNumber',
			// 'physicalDeliveryOfficeName',
			// 'sAMAccountName',
			// 'memberOf',
			'fiuemployeepayplan'
		]
	},
	tlsOptions: {
		// ca: [fs.readFileSync('***REMOVED***-cert.cer')]
	}
};
var ad = new activeDirectory(config);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';	// lets ldap connect over TLS without a valid cert

exports.listUsers = function (req, res) {
	var adQuery = "(departmentNumber=2020*)(!(userAccountControl:1.2.840.113556.1.4.803:=2))";
	
	ad.findUsers(adQuery, function(err, users) {
		if (err) {
			console.log(err);
			console.log('ERROR: ' +JSON.stringify(err));
			return;
		}

		if (! users) console.log('Users not found.');
		else {
			res.send('Found '+ users.length + ' users.');
			// console.log(users);
		} 
	});
};

exports.getUser = function (req, res) {
	ad.findUser(req.params.username, function(err, user) {
		if (err) {
			console.log(err);

			console.log('ERROR: ' +JSON.stringify(err));
			return;
		}

		if (! user) console.log('User not found.');
		else res.send(user);
	});
};

exports.login = function (req, res) {
	var fablesUser = {
		username: '***REMOVED***',	//req.body.username,
		pwd: 'sudmuejo20de'+Math.random(10).toString(),	//req.body.password
	};

	if (!req.session.user) {
		req.session.user = fablesUser;
	} 

	console.log(req.session, 'in auth.login');
	res.send(req.session);
};

exports.logout = function (req, res) {
	console.log(req.session, 'in auth.logout before reset.');

	req.session.reset();
	console.log(req.session, 'in auth.logout after reset.');

	res.send(req.session);
};
