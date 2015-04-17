var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var storySchema = Schema({
		storyId: Number,
		hero: {type: Number, ref: 'Person'},
		champion: {type: Number, ref: 'Person'},
		contacts: [{type: Number, ref: 'Person'}],
		unit: {type: Number, ref: 'Unit'},
		timeLine: [{
			id: Number,
			type: [{
				type: String,
				enum: ['Quest', 'Phone', 'Email', 'Face2Face', 'Note']
			}],
			title: String,
			content: String,
			createdBy: {type: Number, ref: 'Person'},
			completedBy: {type: Number, ref: 'Person'},
			timeCreated: new Date(),
			tags: [String],
			details: {
				estimatedTime: Number,
				timeCompleted: Date,
				attachment: String,
			}
		}],
		assets: [{type: Number, ref: 'Asset'}],
		timeCreated: new Date()
	});

var Story  = mongoose.model('Story', storySchema);

exports.Story = Story;