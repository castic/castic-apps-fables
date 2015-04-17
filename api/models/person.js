var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var personSchema = Schema({
		pid: Number,
		name: String,
		email: String,
		phone: String,
		unit: {type: Number, ref: 'Unit'},
		title: String,
		location: String,
		role: {
			type: String,
			enum: ['hero','champion','contact','vendor','unit']
		},
		abilities:[{type: Number, ref: 'Tag'}],
		stories: [{type: Number, ref: 'Story'}],
		assets: [{type: Number, ref: 'Asset'}]
	});

var Person  = mongoose.model('Person', storySchema);

exports.Person = Person;