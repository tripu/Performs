
// Dependencies:
var fs = require('fs'),
    express = require('express'),
    Performs = require('../lib/performs').Performs;

var app = new express();

// console.dir(__dirname + '/json');
app.use(express.static(__dirname + '/json'));

// app.get('/*.json', function(req, res) {
// });

app.get('/*', function(req, res) {
  var fileName = req.originalUrl;
  if (/\/$/.test(fileName)) {
    fileName += '/index.html';
  }
  fs.readFile(__dirname + '/' + fileName, function (err, data) {
    if (err) {
      if ('ENOENT' !== err.code || !(/favicon\.ico$/i.test(err.path))) {
        res.status(404).send('Oops!');
      }
    } else {
      Performs.filter(String(data), function (result) {
        res.status(200).send(result);
      }, req);
    }
  });
});

app.listen(3000);

