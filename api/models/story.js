var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var storySchema = new Schema({
		storyId: Number,
		hero: {type: Number, ref: 'Person'},
		champion: {type: Number, ref: 'Person'},
		contacts: [{type: Number, ref: 'Person'}],
		unit: {type: Number, ref: 'Unit'},
		timeLine: [{
			id: Number,
			entryType: [{
				type: String,
				enum: ['Quest', 'Phone', 'Email', 'Face2Face', 'Note']
			}],
			title: String,
			content: String,
			createdBy: {type: Number, ref: 'Person'},
			completedBy: {type: Number, ref: 'Person'},
			timeCreated: { type: Date, default: Date.now },
			tags: [String],
			details: {
				estimatedTime: Number,
				timeCompleted: Date,
				attachment: String,
			}
		}],
		assets: [{type: Number, ref: 'Asset'}],
		timeCreated: { type: Date, default: Date.now }
	});

exports.Story = mongoose.model('Story', storySchema);
