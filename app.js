var app = angular.module('casticApp', [
	'ngRoute', 
	'ui.bootstrap.accordion', 
	'ui.bootstrap.dropdown',
	'ngAnimate'
	]);

app.config(['$routeProvider', function ($routeProvider) {
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
        }).
        otherwise({
        	redirectTo: '/'
        });
}]);

app.controller('AppCtrl', ['$scope', '$interval', function($scope, $interval){
	$scope.tickets = {
		assignedCount: 10,
		unassignedCount: 2
	};

	$scope.scrollHome = function () {
		window.scrollTo(0,0);
	};

	$interval(function (){
		$scope.yPos =  document.body.scrollTop;
	}, 50);

}]);

app.controller('AdminCtrl', ['$scope', 'DataService', function ($scope, DataService) {
	DataService.Quests.list()
		.success(function (quests) {
			$scope.quests = quests;
		});

	$scope.save = function (quest) {
		console.log(quest);

		DataService.Quests.add(quest)
			.success(function (quest) {
				console.log('saved to db ', quest);	
				$scope.quests.push(quest);
			});
	};

	$scope.update = function (quest) {
		console.log(quest);

		DataService.Quests.update(quest)
			.success(function (rows) {
				console.log('updated ' + rows.nModified + ' item(s) in db');	
			});
	};
	
}]);

app.service('DataService', ['$http', function ($http) {
	var storiesOld = [
		{
			storyId: 2, 
			title: 'Install mouse',
			contact: 'David Chatfield',
			tech: 'Amir',
			department: 'Chemistry',
			dateModified: '04/06/2015',
			priority: 3,
			timeline: [
				{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},{
					id: 0,
					title: 'Get Logitech Mouse',
					content: 'Found a mouse on ebay for 2 cents',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},
				{
					id: 1,
					title: 'Schedule an Appointment',
					content: '',
					complete: true,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},
				{
					id: 2,
					title: 'Received call from user',
					content: '',
					complete: true,
					type: 'call',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				},
				{
					id: 3,
					title: 'Install mouse',
					content: '',
					complete: false,
					type: 'quest',
					createBy: 'Amir',
					createdOn: '04/06/2015',
					timeCompleted: '04/06/2015'
				}
			]},
			{
			storyId: 3, 
			title: 'Install desktop',
			contact: 'Shawn Blakey',
			tech: 'Che',
			department: 'CAS',
			dateModified: '04/06/2015',
			priority: 1,
			timeline: [
			{
				id: 0,
				title: 'Get Logitech Mouse',
				content: '',
				complete: true,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 1,
				title: 'Schedule an Appointment',
				content: '',
				complete: true,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 2,
				title: 'Received call from user',
				content: '',
				complete: true,
				type: 'call',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 3,
				title: 'Install mouse',
				content: '',
				complete: false,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			}
			]},
		{
			storyId: 5, 
			title: 'Remove virus',
			contact: 'David Chatfield',
			tech: 'Amir',
			department: 'Chemistry',
			dateModified: '04/06/2015',
			priority: 1,
					timeline: [
			{
				id: 0,
				title: 'Get Logitech Mouse',
				content: '',
				complete: true,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 1,
				title: 'Schedule an Appointment',
				content: '',
				complete: true,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 2,
				title: 'Received call from user',
				content: '',
				complete: true,
				type: 'call',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 3,
				title: 'Install mouse',
				content: '',
				complete: false,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			}
			]},
		{
			storyId: 22, 
			title: 'Setup printer',
			contact: 'Anthony Manzano',
			tech: 'Amir',
			department: 'CASTIC',
			dateModified: '04/06/2015',
			priority: 2,
			timeline: [
			{
				id: 0,
				title: 'Get Logitech Mouse',
				content: '',
				complete: true,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 1,
				title: 'Schedule an Appointment',
				content: '',
				complete: true,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 2,
				title: 'Received call from user',
				content: '',
				complete: true,
				type: 'call',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			},
			{
				id: 3,
				title: 'Install mouse',
				content: '',
				complete: false,
				type: 'quest',
				createBy: 'Amir',
				createdOn: '04/06/2015',
				timeCompleted: '04/06/2015'
			}
			]
		}];

	var techs = [{name: 'Che'},{name: 'Amir'}, {name: 'Chris'}, {name: 'Jeremy'}];

	var stories = {
		hero: {
			name: String,
			email: String,
			role: {
				type: String,
				enum: ['hero', 'champion']
			},
			abilities: [{
				id: Number,
				title: String,
				quests: [{
					id: Number,
					title: String,
					estimatedTime: Number,
					type: String
				}]
			}]
		},
		champion: {
			name: String,
			email: String,
			role: {
				type: String,
				enum: ['hero', 'champion']
			},
			abilities: [{
				id: Number,
				title: String,
				quests: [{
					id: Number,
					title: String,
					estimatedTime: Number,
					type: String
				}]
			}]
		},
		contact: [{
			pid: String,
			name: String,
			phone: String,
			unit: {
				realm: String,
				land: String
			},
			title: String,
			location: String,
			email: String,
			stories: [Number],
			assets: [Number]
		}],
		unit: {
			realm: String,
			land: String
		},
		timeLine: [{
			id: Number,
			type: [{
				type: String,
				enum: [String]
			}],
			title: String,
			content: String,
			createdBy: String,
			completedBy: String,
			timeCreated: Date,
			details: {
				estimatedTime: Number,
				timeCompleted: Date,
				attachment: String,
			}
		}],
		assets: [Number],
		timeCreated: Date,
		tag: [{
			id: Number,
			title: String,
			quests: [{
				id: Number,
				title: String,
				estimatedTime: Number,
				type: String
			}]
		}]
	};

	var apiPath = 'http://localhost:8300';

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
				return $http.get(apiPath+'/quests');
			},
			add: function (quest) {
				console.log(quest);
				return $http.post(apiPath+'/quests/new', quest);
			},
			update: function (quest) {
				console.log(quest);
				return $http.put(apiPath+'/quests/update', quest);
			}
		}
	}
}]);

app.controller('StoriesCtrl', ['$scope', 'DataService', function($scope, DataService){

	$scope.stories = DataService.getStories();
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













