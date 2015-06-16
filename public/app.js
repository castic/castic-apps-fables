var app = angular.module('fablesApp', [
	'ngRoute', 
	'ui.bootstrap.accordion', 
	'ui.bootstrap.dropdown',
	'ngAnimate',
	'ngSanitize',
	'ngCookies',
	'ngTouch',
	'ui.select',
	'angularFileUpload'
	]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    
    $httpProvider.defaults.withCredentials = true;

    $routeProvider.
    	when('/', {
            templateUrl: 'partials/landing.html',
            controller: 'AppCtrl'
        }).
        when('/dash', {
            templateUrl: 'partials/dashboard.html',
            controller: 'AppCtrl'
        }).
        when('/stories', {
            templateUrl: 'components/stories/stories.html',
            controller: 'StoriesCtrl'
        }).
        when('/stories/view-mod/:storyId', {
            templateUrl: 'components/stories/story-mod.html',
            controller: 'StoryCtrl'
        }).
        when('/stories/view/:storyId', {
            templateUrl: 'components/stories/story.html',
            controller: 'StoryCtrl'
        }).        
        when('/stories/new', {
            templateUrl: 'partials/newstory.html',
            controller: 'NewCtrl'
        }).
        when('/admin', {
            templateUrl: 'components/admin/admin.html',
            controller: 'AdminCtrl'
        })
        .when('/login', {
            controller: 'AppCtrl'
        }).
        otherwise({
        	redirectTo: '/'
        });
}]);

app.filter('propsFilter', function() {
	return function(items, props) {
		var out = [];

		if (angular.isArray(items)) {
			items.forEach(function(item) {
				var itemMatches = false;

				var keys = Object.keys(props);
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}

		return out;
	};
});

app.run(['$rootScope', '$location', 'DataService', 'AuthService', function ($rootScope, $location, DataService, AuthService) {
	
	// $rootScope.$on('$routeChangeStart', function (event, next, current) {
			
	// 	console.log('getting userSession');
	// 	console.log( 'path: ', $location.url(), ' Logged in: ' ,AuthService.isLoggedIn() );

	// 	if ( !AuthService.isLoggedIn() ) $location.path('/login');

 //    });
}]);

app.controller('AppCtrl', ['$scope', '$interval', 'AuthService', '$location', 'DataService', function ($scope, $interval, AuthService, $location, DataService){
	$scope.tickets = {
		assignedCount: 10,
		unassignedCount: 2
	};

	DataService.setCurrentLocation('Fables');

	$scope.currentLocation = function () {
		return DataService.getCurrentLocation();
	};

	$scope.scrollHome = function () {
		window.scrollTo(0,0);
	};

	$scope.authed = false;

	$scope.$on('logged out', function (event, args) {
		$scope.authed = false;
	});

	$scope.login = function (user) {

		if (user.username.length > 0 && user.password.length > 7) {
			AuthService.login(user)
				.then(function (response) {
					$scope.authed = true;
					$location.path('/');
					console.log('Logged in successfully ', response.data.user);
				});
		}
	};

	$interval(function (){
		$scope.yPos =  document.body.scrollTop;
	}, 50);

}]);

app.service('DataService', ['$http', 'AppConfig', '$location', function ($http, AppConfig, $location) {

	var techs = [{name: 'Che'},{name: 'Amir'}, {name: 'Chris'}, {name: 'Jeremy'}];

	var loggedIn = false;

	var currentLocation = "Fables";

	return {
		setCurrentLocation: function (location) {
			currentLocation = location;
		},
		getCurrentLocation: function () {
			return currentLocation;
		},
		getStories: function () {
			return stories;
		},
		// getStory: function (id) {
		// 	var found = null;

		// 	angular.forEach(stories, function (story) {
		// 		if (story.storyId == id) {
		// 			found = story;
		// 		}
		// 	});

		// 	return found
		// },
		getTechs: function () {
			return techs;
		},
		uploadPath: function () {
			return $location.protocol() + '://' + $location.host() + ':' + $location.port() + AppConfig.apiPath + '/quests/import'
		},
		Quests: {
			list: function () {
				return $http.get(AppConfig.apiPath+'/quests');
			},
			add: function (quest) {
				console.log(quest);
				return $http.post(AppConfig.apiPath+'/quests/new', quest);
			},
			update: function (quest) {
				console.log(quest);
				return $http.put(AppConfig.apiPath+'/quests/update', quest);
			},
			remove: function (quest) {
				console.log('deleting quest');
				return $http.delete(AppConfig.apiPath+'/quests/remove/'+quest._id);
			}
			// },
			// import: function (file) {
			// 	console.log('importing quests');
			// 	return $http.post(AppConfig.apiPath+'/quests/import/', file);
			// }
		},
		Stories: {
			get: function (storyId) {
				return $http.get(AppConfig.apiPath+'/stories/'+storyId);
			},
			list: function () {
				return $http.get(AppConfig.apiPath+'/stories');
			},
			add: function (story) {
				return $http.post(AppConfig.apiPath+'/stories/new', story);
			},
			update: function (story) {
				return $http.put(AppConfig.apiPath+'/stories/update', story);
			},
			remove: function (story) {
				return $http.delete(AppConfig.apiPath+'/stories/remove/'+story._id);
			}
		},
		Units: {
			list: function () {
				return $http.get(AppConfig.apiPath+'/units');
			},
			add: function (unit) {
				return $http.post(AppConfig.apiPath+'/units/new', unit);
			},
			update: function (unit) {
				return $http.put(AppConfig.apiPath+'/units/update', unit);
			},
			remove: function (unit) {
				return $http.delete(AppConfig.apiPath+'/units/remove/'+unit._id);
			}
		},
		People: {
			list: function () {
				return $http.get(AppConfig.apiPath+'/people');
			},
			add: function (person) {
				return $http.post(AppConfig.apiPath+'/people/new', person);
			},
			update: function (person) {
				return $http.put(AppConfig.apiPath+'/people/update', person);
			}
			// Not used. We will set the status to 'Inactive' instead.
			// ,
			// remove: function (person) {
			// 	return $http.delete(AppConfig.apiPath+'/people/remove/'+person._id);
			// }
		},
		Auth: {
			login: function (user) {
				return $http.post(AppConfig.apiPath+'/login', user);
			},
			logout: function () {
				return $http.get(AppConfig.apiPath+'/logout');
			},
			isLoggedIn: function(user) {
				if (user) {
					loggedIn = true;
				} else {
					loggedIn = false;
				}
				
				return loggedIn;
			}
		}
	}
}]);

app.service('common', ['$interval', function ($interval) {
	return {
		interval: function (cb, intervalPeriod) {
	    	return $interval(cb, intervalPeriod);
	    },
	    cancelInterval: function (promise) {
	    	return $interval.cancel(promise);
	    }
	}
}]);













