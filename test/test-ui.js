
// Dependencies:
var fs = require('fs'),
    express = require('express'),
    Performs = require('../lib/performs').Performs;

var app = new express();

app.use(express.static(__dirname + '/json'));

var static = function(req, res) {
  fs.readFile(__dirname + '/' + req.originalUrl, function (err, data) {
    if (err) {
      res.status(404).send('Oops!');
    } else {
      res.sendFile(__dirname + '/' + req.originalUrl);
    }
  });
};

app.get('/style.css', static);
app.get('/favicon.ico', static);
app.get(/.+\.json/i, static);

app.get(/(index\.html)?/i, function(req, res) {
  var fileName = req.originalUrl;
  if (/\/$/.test(fileName)) {
    fileName += '/index.html';
  }
  fs.readFile(__dirname + '/' + fileName, function (err, data) {
    if (err) {
      res.status(404).send('Oops!');
    } else {
      Performs.filter(String(data), function (result) {
        res.status(200).send(result);
      }, req, {prependJSON: true});
    }
  });
});

app.listen(3000);

