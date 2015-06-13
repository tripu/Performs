
'use strict';

// Dependencies:
var request = require('request'),
    url     = require('url');

/**
 * Resolve a URL that may be relative.
 */

exports.inferURL = function(req, link) {

  return url.resolve(req.protocol + '://' + req.get('host') + req.originalUrl, link);

};

/**
 * Asynchronously load a URL, and get the content.
 */

exports.loadURL = function(url, handler) {

  request(url, function(error, response, body) {

    if (error || 200 !== response.statusCode) {
      handler.call();
    } else {
      handler.call(null, body);
    }

  });

};

