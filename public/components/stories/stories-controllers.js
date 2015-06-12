var app = angular.module('fablesApp');

app.controller('StoriesCtrl', ['$scope', 'DataService', 'StoryService', function ($scope, DataService, StoryService){

	$scope.quests = [];
	$scope.stories = [];
	$scope.units = [];
	$scope.people = [];

	$scope.roles = ['hero','champion','contact','vendor'];

	DataService.setCurrentLocation('Stories');
	// getQuests = function () {
	// 	DataService.Quests.list()
	// 		.success(function (quests) {
	// 			// $scope.tags = uniq(getTags(quests));
	// 			// console.log(quests);
	// 			$scope.quests = quests;
	// 			getUnits();
	// 		});
	// 	};

	// getUnits = function () {
	// 	DataService.Units.list()
	// 		.success(function (units) {
	// 			$scope.units = units;
	// 			getPeople();
	// 		});	
	// 	};
	
	// getPeople = function () {
	// 	DataService.People.list()
	// 		.success(function (people) {
	// 			$scope.people = people;
	// 			console.log('People from db: ',people);
	// 			getStories();
	// 		});	
	// 	};

	$scope.lastChapter = function (story) {
		return StoryService.getCurrentChapter(story);
	};

	getStories = function () {
		DataService.Stories.list()
			.success(function (stories) {
				console.log(stories);
				$scope.stories = stories;
			});
	};

	getStories();

	// getQuests();
}]);

app.controller('StoryCtrl', ['$scope', '$routeParams', 'DataService', 'common', function($scope, $routeParams, DataService, common){
	
	var currentChapter;
	$scope.story = {};

	DataService.setCurrentLocation('Story');

	getStory = function () {
		DataService.Stories.get($routeParams.storyId)
		.success(function (stories) {
			$scope.story = stories[0];
			getCurrentChapter($scope.story)
			// console.log($scope.story);
		});	
	};

	getStory();
	// var refreshStory = common.interval(function () {
	// 		getStory();
	// 	}, 2000);			
			
	// $scope.$on('$destroy', function() {
 //        if (refreshStory) {
 //            common.cancelInterval(refreshStory);
 //        }
 //    });
	
	updateStory = function (updatedStory) {
		DataService.Stories.update(updatedStory)
			.success(function (story) {
				console.log('saved to db ', story);	
			});
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

			// if no children
			if (quest.children.length == 0) {
				// add to timeline
				timeLine = addQuestToTimeline(quest, timeLine, newStory);
			} else {
			// if children 
				// console.log('got children');
				timeLine = addQuestToTimeline(quest, timeLine, newStory, 'Questline');
				timeLine = createTimelineEntry(newStory, quest.children, timeLine);
			}
		});

		return timeLine;
	};

	showChapterContent = function (chapter) {
		if (chapter.content) chapter.showContent = !chapter.showContent
	};

	completeChapter = function (chapter, story) {

		if (chapter.showStrikeThrough) {
			return;
		}
		
		console.log('set the chapter status');

		if (chapter.completedBy) {
			chapter.completedBy = undefined;
			chapter.details.timeCompleted = undefined;
			story.completed = false;
			chapter.status = 'incomplete';
		} else {
			chapter.completedBy = story.hero._id;
			chapter.status = 'completed';
			chapter.details.timeCompleted = Date.now();

			story.completed = story.timeLine.every(function (currentChapter, index) {
				if (currentChapter.completedBy) {
					return true;
				} else return false;
			});
		}

		console.log('The current status is: ', chapter.status)

		getCurrentChapter(story);
		updateStory(story);
	};

	$scope.saveStory = function (newStory) {

		newStory.timeLine = createTimelineEntry(newStory, newStory.questArray, []);
		newStory.title = newStory.timeLine[0].title;

		DataService.Stories.add(newStory)
			.success(function (story) {
				console.log('saved to db ', story);	
				getStories();
			});
	};

	getCurrentChapter = function (story) {
		// var currentChapter;

		var storyComplete = story.timeLine.every(function (chapter, index) {
			if ( (chapter.entryType != 'Questline') && chapter.status != 'completed' ) { 
				story.lastChapter = {
					title: chapter.title,
					index: index
				}
				return false;
			} else {
				return true;
			}
		});

		if (storyComplete) story.lastChapter = {};
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
			if ( (chapter.entryType != 'Questline') && (chapter.details) ){
				totalTime += chapter.details.estimatedTime;
			}
		});

		return totalTime;
	};

	$scope.reopenChapter = function (chapter, story) {
		chapter.completedBy = undefined;
		chapter.details.timeCompleted = undefined;
		story.completed = false;

		updateStory(story);
	};

	$scope.showChapterButtons = function (chapter) {

		if (chapter.showContent || (chapter.entryType == 'Questline') )return;

		if (currentChapter) {
			currentChapter.showButtons = false;
		}

		currentChapter = chapter;
		currentChapter.showButtons = true;
	};

	$scope.hideChapterButtons = function (chapter, story) {
		
		if (chapter.showContent || (chapter.entryType == 'Questline') )return;

		console.log('The current status before right-swipe: ', chapter.status);

		if (currentChapter) {
			currentChapter.showButtons = false;
			currentChapter = undefined;
		} else {
			if (!chapter.completedBy) {
				chapter.showStrikeThrough = !chapter.showStrikeThrough;
				chapter.status = (chapter.showStrikeThrough) ? 'removed' : 'incomplete';

				console.log('The current status after right-swipe: ', chapter.status);

				getCurrentChapter(story);
				updateStory(story);
			}
		}
	};

	$scope.selectChapter = function (chapter, story) {
		
		console.log('chapter clicked: ',chapter.title);

		if (chapter.entryType == 'Questline') return;

		if (chapter.entryType == 'Quest') {
			completeChapter(chapter, story);
		} else {
			showChapterContent(chapter);
		}
	};

	$scope.addEntry = function (entryType, story) {

		story.newChapter = {};

		story.newChapter.entryType = entryType;
		story.newChapter.createdBy = story.hero._id;
		story.newChapter.timeCreated = Date.now();

		$scope.showNewChapter = true;
	};

	$scope.cancelEntry = function (story) {
		story.newChapter = {};
		$scope.showNewChapter = false;
		// console.log('canceling entry: ',$scope.showNewChapter);
	}

	$scope.addChapter = function (story) {
		story.newChapter.insertionPoint = (story.lastChapter.index > 0) ? story.lastChapter.index : 0;
		
		story.timeLine.splice(story.newChapter.insertionPoint, 0, {
			entryType: story.newChapter.entryType,
			title: story.newChapter.title,
			content: story.newChapter.content,
			status: 'completed',
			createdBy: story.newChapter.createdBy,
			completedBy: story.newChapter.createdBy,
			timeCreated: story.newChapter.timeCreated,
			details: {
				timeCompleted: Date.now()
			}
		});

		$scope.showNewChapter = false;

		console.log(story.timeLine);
		// updateStory(story);
	};

}]);