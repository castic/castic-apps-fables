var app = angular.module('casticApp', [
	'ngRoute', 
	'ui.bootstrap.accordion', 
	'ui.bootstrap.dropdown',
	'ngAnimate',
	'ngSanitize',
	'ngCookies',
	'ui.select',
	'angularFileUpload'
	]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    
    $httpProvider.defaults.withCredentials = true;

    $routeProvider.
        when('/', {
            templateUrl: 'partials/dashboard.html',
            controller: 'AppCtrl'
        }).
        when('/stories', {
            templateUrl: 'partials/stories.html',
            controller: 'StoriesCtrl'
        }).
        when('/stories/view/:storyId', {
            templateUrl: 'partials/story.html',
            controller: 'StoryCtrl'
        }).        
        when('/stories/new', {
            templateUrl: 'partials/newstory.html',
            controller: 'NewCtrl'
        }).
        when('/admin', {
            templateUrl: 'partials/admin.html',
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

app.controller('AppCtrl', ['$scope', '$interval', 'AuthService', '$location', function ($scope, $interval, AuthService, $location){
	$scope.tickets = {
		assignedCount: 10,
		unassignedCount: 2
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

app.controller('AdminCtrl', ['$scope', 'DataService', 'AuthService', '$location', '$interval', 'FileUploader', 
	function ($scope, DataService, AuthService, $location, $interval, FileUploader) {
	
	$scope.quests = [];
	$scope.stories = [];
	$scope.units = [];
	$scope.people = [];
	$scope.tags = [];
	$scope.newStory = {};
	$scope.uploader = new FileUploader({url: 'http://localhost:8300/api/quests/import'});

	// $scope.loggedIn = function () {
	// 	return AuthService.isLoggedIn();
	// };

	// $scope.showLogin = true;
	// if ( $cookies.session ) {
	// 	$scope.loggedIn = true;
	// } else $scope.loggedIn = false;

	$scope.uploader.onSuccessItem = function(item, response, status, headers) {
		// console.log('item: ', item);
		// console.log('Server Response: ',response);
		getQuests();
	};

	getQuests = function () {
		DataService.Quests.list()
			.success(function (quests) {
				$scope.tags = uniq(getTags(quests));
				console.log(quests);
				$scope.quests = quests;
				getUnits();
			});
		};

	getUnits = function () {
		DataService.Units.list()
			.success(function (units) {
				$scope.units = units;
				getPeople();
			});	
		};
	
	getPeople = function () {
		DataService.People.list()
			.success(function (people) {
				$scope.people = people;
				getStories();
			});	
		};

	getStories = function () {
		DataService.Stories.list()
			.success(function (stories) {
				// console.log(stories);
				$scope.stories = stories;
				$scope.stories.completeChapter = function (chapter, hero) {
					return completeChapter(chapter, hero);
				};
			});
	};

	completeChapter = function (chapter, hero) {
		
		if (chapter.completedBy) {
			chapter.completedBy == '';
			return;
		}

		chapter.completedBy = hero._id;
		
		if (chapter.entryType == 'Quest') {
			chapter.details.timeCompleted = Date.now;
		}

	};

	getTags = function (quests) {
		var tagsArray = [];
		
		angular.forEach(quests, function (quest) {
			angular.forEach(quest.tags, function (tag) {
				tagsArray.push(tag);
			});
		});

		return tagsArray;
	}

	uniq = function (a) {
	    return a.sort().filter(function(item, pos, ary) {
	        return !pos || item != ary[pos - 1];
	    });
	};

	getQuests();

	$scope.toJson = function (obj) {
		return angular.toJson (obj, true);
	};

	addQuestToTimeline = function (quest, timeLine, newStory, entryType) {

		var tl = {
			entryType: entryType || 'Quest',
			title: quest.title,
			createdBy: newStory.hero,
			tags: quest.tags,
			details: {
				estimatedTime: quest.estimatedTime,
			}
		};

		if (entryType == 'Questline') {
			tl.completedBy = newStory.hero
		}

		timeLine.push(tl);

		return timeLine;
	};

	createTimelineEntry = function (newStory, questArray, timeLine) {

		angular.forEach(questArray, function (quest) {

			if (quest.children.length == 0) {
				timeLine = addQuestToTimeline(quest, timeLine, newStory);
			} else {
				console.log('got children');
				timeLine = addQuestToTimeline(quest, timeLine, newStory, 'Questline');
				timeLine = createTimelineEntry(newStory, quest.children, timeLine);
			}
		});

		return timeLine;
		
	};

	$scope.saveStory = function (newStory) {

		newStory.timeLine = createTimelineEntry(newStory, newStory.questArray, []);
		// newStory.unit = newStory.unit.unitId;

		console.log(newStory);
		// $scope.stories.push(newStory);

		DataService.Stories.add(newStory)
			.success(function (story) {
				console.log('saved to db ', story);	
				getStories();
			});
	};

	updateStory = function (updatedStory) {
		DataService.Stories.update(updatedStory)
			.success(function (story) {
				console.log('saved to db ', story);	
			});
	};

	$scope.removeStory = function (story) {
		DataService.Stories.remove(story)
			.success(function (message) {
				$scope.stories.every(function (currentStory ,index) {
					if (currentStory._id == story._id) {
						$scope.stories.splice(index, 1);
						return false;
					} else return true;
				});
			});
	};

	$scope.getTotalEstimatedTime = function (timeLine) {
		var totalTime = 0;

		angular.forEach(timeLine, function (chapter) {
			if (chapter.entryType != 'Questline') {
				totalTime += chapter.details.estimatedTime;
			}
		});

		return totalTime;
	};

	$scope.completeChapter = function (chapter, story) {
		
		if (chapter.completedBy) {
			chapter.completedBy = undefined;
			chapter.details.timeCompleted = undefined;
			story.completed = false;
		} else {
			chapter.completedBy = story.hero._id;
			chapter.details.timeCompleted = Date.now();

			story.completed = story.timeLine.every(function (currentChapter, index) {
				if (currentChapter.completedBy) {
					return true;
				} else return false;
			});
		}

		updateStory(story);
	};

	$scope.reopenChapter = function (chapter, story) {
		chapter.completedBy = undefined;
		chapter.details.timeCompleted = undefined;
		story.completed = false;

		updateStory(story);
	};


	$scope.logout = function () {
		AuthService.logout()
			.then(function (response) {
				console.log(response);
				$location.path('/login');
			});
	};

	$scope.login = function (user) {
		if (user.username.length > 0 && user.password.length > 7) {
			AuthService.login(user)
				.then(function (response) {
					$scope.fableUser = response.data.user;
					$scope.showLogin = false;
					getUnits();
					console.log('Logged in successfully ', response.data.user);
				});
		}
	};

	$scope.savePerson = function (person) {
		console.log(person);

		DataService.People.add(person)
			.success(function (person) {
				console.log('saved to db ', person);	
				getPeople();
			});
	};

	$scope.editPerson = function (person) {
		console.log('before save: ',person);

		DataService.People.update(person)
			.success(function (person) {
				console.log('updated: ', person);	
				getPeople();
			});
	};

	$scope.saveUnit = function (unit) {
		console.log(unit);

		DataService.Units.add(unit)
			.success(function (unit) {
				console.log('saved to db ', unit);	
				$scope.units.push(unit);
			});
	};

	$scope.editUnit = function (unit) {
		console.log(unit);

		DataService.Units.update(unit)
			.success(function (unit) {
				console.log('updated in db ', unit);	
			});
	};

	$scope.removeUnit = function (unit) {
		DataService.Units.remove(unit)
			.success(function (message) {
				$scope.units.every(function (currentUnit ,index) {
					if (currentUnit._id == unit._id) {
						$scope.units.splice(index, 1);
						return false;
					} else return true
				});
			});
	};

	$scope.removeQuest = function (quest) {
		DataService.Quests.remove(quest)
			.success(function (message) {
				console.log(message);

				$scope.quests.every(function (current, index) {
					if (current._id == quest._id) {
						$scope.quests.splice(index, 1);
						return false;
					} else return true
				});
			});
	};

	$scope.saveQuest = function (quest) {
		// console.log(quest);

		DataService.Quests.add(quest)
			.success(function (savedQuest) {
				console.log('saved to db ', savedQuest);	
				getQuests();
			});
	};

	// $scope.importQuests = function (files) {
	// 	var file = FormData();

	// 	console.log(file);
	// 	DataService.Quest.import(file)
	// 		.success(function (file) {
	// 			console.log(file);
	// 		});
	// }

	$scope.updateQuest = function (quest) {
		console.log(quest);

		DataService.Quests.update(quest)
			.success(function (rows) {
				console.log('updated ' + rows.nModified + ' item(s) in db');
				getQuests();
			});
	};
	
}]);

app.service('DataService', ['$http', 'AppConfig', function ($http, AppConfig) {

	var techs = [{name: 'Che'},{name: 'Amir'}, {name: 'Chris'}, {name: 'Jeremy'}];

	// var apiPath = 'http://localhost:8300';

	var loggedIn = false;

	return {
		getStories: function () {
			return stories;
		},
		getStory: function (id) {
			var found = null;

			angular.forEach(stories, function (story) {
				if (story.storyId == id) {
					found = story;
				}
			});

			return found
		},
		getTechs: function () {
			return techs;
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
			},
			remove: function (person) {
				return $http.delete(AppConfig.apiPath+'/people/remove/'+person._id);
			}
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

app.controller('StoriesCtrl', ['$scope', 'DataService', function($scope, DataService){

	DataService.Stories.list()
			.success(function (stories) {
				console.log(stories);
				$scope.stories = stories;
			});

	$scope.techs = DataService.getTechs();
}]);

app.controller('StoryCtrl', ['$scope', '$routeParams', 'DataService', function($scope, $routeParams, DataService){
	$scope.story = DataService.getStory($routeParams.storyId);
	
	DataService.Quests.list()
		.success(function (quests) {
			console.log(quests);
		})
		.error(function (err, status) {

		});

	console.log($scope.story);
}]);













