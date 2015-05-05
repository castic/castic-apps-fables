var express = require('express');
var server = express();

server.listen(31337);

console.log(__dirname);

server.use(express.static(__dirname));

// server.get('/', function (req, res) {
// 	res.send('index.html');
// }) 