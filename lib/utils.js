
'use strict';

// Dependencies:
var request = require('request');

exports.loadURL = function(url, handler) {

  request(url, function(error, response, body) {

    if (error || 200 !== response.statusCode) {
      handler();
    } else {
      handler(body);
    }

  });

};

