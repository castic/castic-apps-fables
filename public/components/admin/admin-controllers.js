var app = angular.module('fablesApp');

app.controller('AdminCtrl', ['$scope', 'DataService', 'AuthService', '$location', 'FileUploader', 
	function ($scope, DataService, AuthService, $location, FileUploader) {
	
	$scope.quests = [];
	$scope.stories = [];
	$scope.units = [];
	$scope.people = [];
	$scope.tags = [];
	$scope.newStory = {};
	$scope.uploader = new FileUploader({url: DataService.uploadPath() });
	var currentChapter;
	$scope.roles = ['hero','champion','contact','vendor'];

	// $scope.loggedIn = function () {
	// 	return AuthService.isLoggedIn();
	// };

	// $scope.showLogin = true;
	// if ( $cookies.session ) {
	// 	$scope.loggedIn = true;
	// } else $scope.loggedIn = false;

	getQuests = function () {
		DataService.Quests.list()
			.success(function (quests) {
				$scope.tags = uniq(getTags(quests));
				// console.log(quests);
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
				// console.log('People from db: ',people);
				getStories();
			});	
		};

	getStories = function () {
		DataService.Stories.list()
			.success(function (stories) {
				console.log(stories);
				$scope.stories = stories;
			});
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
		chapter.showContent = !chapter.showContent
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

		$scope.getCurrentChapter(story);
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


	$scope.uploader.onSuccessItem = function(item, response, status, headers) {
		getQuests();
		$scope.uploader.clearQueue();
		$scope.showUpload = false;
	};

	$scope.toJson = function (obj) {
		return angular.toJson (obj, true);
	};

	$scope.getCurrentChapter = function (story) {
		var currentChapter;

		story.timeLine.every(function (chapter, index) {
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
			if ( (chapter.entryType != 'Questline') && (chapter.details.estimatedTime) ){
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

		DataService.People.add(person)
			.success(function (person) {
				console.log('saved to db ', person);	
				getPeople();
			});
	};

	$scope.editPerson = function (person) {

		// console.log('saving person: ', person);

		DataService.People.update(person)
			.success(function (person) {
				console.log('updated: ', person);	
				getPeople();
			});
	};

	$scope.removePerson = function (person) {
		person.status = 'Inactive';

		DataService.People.update(person)
			.success(function (person) {
				console.log('updated: ', person);	
				getPeople();
			});
	};

	$scope.saveUnit = function (unit) {
		DataService.Units.add(unit)
			.success(function (unit) {
				console.log('saved to db ', unit);	
				$scope.units.push(unit);
			});
	};

	$scope.editUnit = function (unit) {
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

				$scope.quests.every(function (current, index) {
					if (current._id == quest._id) {
						$scope.quests.splice(index, 1);
						return false;
					} else return true
				});
			});
	};

	$scope.saveQuest = function (quest) {

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

		DataService.Quests.update(quest)
			.success(function (rows) {
				console.log('updated ' + rows.nModified + ' item(s) in db');
				getQuests();
			});
	};

	$scope.showChapterButtons = function (chapter) {

		if (chapter.entryType == 'Questline') return;

		if (chapter.showContent) {
			chapter.showContent = false;
		}

		if (currentChapter) {
			currentChapter.showButtons = false;
		}

		currentChapter = chapter;
		currentChapter.showButtons = true;
	};

	$scope.hideChapterButtons = function (chapter, story) {
		
		if (chapter.showContent || (chapter.entryType == 'Questline') )return;

		// console.log('The current status before right-swipe: ', chapter.status);

		if (currentChapter) {
			currentChapter.showButtons = false;
			currentChapter = undefined;
		} else {
			if (!chapter.completedBy) {
				chapter.showStrikeThrough = !chapter.showStrikeThrough;
				chapter.status = (chapter.showStrikeThrough) ? 'removed' : 'incomplete';

				// console.log('The current status after right-swipe: ', chapter.status);

				$scope.getCurrentChapter(story);
				updateStory(story);
			}
		}
	};

	$scope.selectChapter = function (chapter, story) {
		
		if ( (chapter.entryType == 'Questline') || currentChapter )  return;

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
	};

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

	getQuests();

}]);