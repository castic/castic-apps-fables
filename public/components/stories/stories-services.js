var app = angular.module('fablesApp');

app.factory('StoryService', [ function (){

	return {
		getCurrentChapter: function (story) {
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

			return story.lastChapter;
		}
	}
}]);
