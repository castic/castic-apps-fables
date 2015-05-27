var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var storySchema = new Schema({
		title: String,
		priority: {type: String, default: '1'},
		hero: {type: Number, ref: 'Person'},
		champion: {type: Number, ref: 'Person'},
		contacts: [ {type: Number, ref: 'Person'} ],
		unit: {type: Number, ref: 'Unit'},
		timeLine: [{
			id: Number,
			entryType: String,
			title: String,
			content: String,
			status: {type: String, default: 'incomplete'},
			createdBy: {type: Number, ref: 'Person'},
			completedBy: {type: Number, ref: 'Person'},
			timeCreated: { type: Date, default: Date.now() },
			tags: [String],
			details: {
				estimatedTime: Number,
				timeCompleted: Date,
				attachment: String,
			}
		}],
		assets: [{type: Number, ref: 'Asset'}],
		timeCreated: { type: Date, default: Date.now() },
		completed: Boolean
	});

exports.docSchema = storySchema;