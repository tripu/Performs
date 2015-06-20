
'use strict';

/**
 * @module lib/utils
 */
 /* Miscellaneous utilities.
 */

// Dependencies:
var request = require('request'),
    url     = require('url');

/**
 * Resolve a URL that may be relative.
 *
 * @param {Request} req
 * @param {String}  link
 */

exports.inferURL = function(req, link) {

  return url.resolve(req.protocol + '://' + req.get('host') + req.originalUrl, link);

};

/**
 * Asynchronously load a URL, and get the content.
 *
 * @param {String}   url
 * @param {Function} handler
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

