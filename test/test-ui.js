
// Dependencies:
var fs = require('fs'),
    express = require('express'),
    Performs = require('../lib/performs').Performs;

var app = new express();

// console.dir(__dirname + '/json');
app.use(express.static(__dirname + '/json'));

// app.get('/*.json', function(req, res) {
// });

app.get('/', function(req, res) {
  var fileName = req.originalUrl;
  if (/\/$/.test(fileName)) {
    fileName += '/index.html';
  }
  fs.readFile(__dirname + '/html/' + fileName, function (err, data) {
    if (err) {
      if ('ENOENT' !== err.code || !(/favicon\.ico$/i.test(err.path))) {
        throw err;
      }
    } else {
      Performs.filter(String(data), function sendResult(data) {
        res.status(200).send(data);
      });
    }
  });
});

app.listen(3000);

