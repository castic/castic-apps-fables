var mongoose = require('mongoose');
var mongodbURL = 'mongodb://localhost/fables';
var mongodbOptions = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});
