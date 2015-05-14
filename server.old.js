var express = require('express');
var server = express();

server.listen(31337);

server.use(express.static(__dirname));

// server.get('/', function (req, res) {
// 	res.send('index.html');
// }) 