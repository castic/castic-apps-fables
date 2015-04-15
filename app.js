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

app.service('DataService', [function() {
	var stories = [
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
		}
	}
}]);

app.controller('StoriesCtrl', ['$scope', 'DataService', function($scope, DataService){

	$scope.stories = DataService.getStories();
	$scope.techs = DataService.getTechs();
}]);

app.controller('StoryCtrl', ['$scope', '$routeParams', 'DataService', function($scope, $routeParams, DataService){
	$scope.story = DataService.getStory($routeParams.storyId);
	console.log($scope.story);
}]);













