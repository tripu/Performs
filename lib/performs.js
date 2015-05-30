
/**
 * Performs.
 *
 * An HTML UI engine written in JavaScript.
 *
 * @author tripu <a href="mailto:tripu@tripu.info"><code>tripu@tripu.info</code></a> <a href="http://tripu.info"><code>http://tripu.info</code></a>
 */

'use strict';

// Dependencies:
var winston = require('winston');

// Pseudo-constants:
var VERSION = require('../package.json').version;

// Config:
// winston.level = 'debug';

var Performs = function () {
  winston.debug('Performs ' + VERSION + ' instantiated');
  this.version = VERSION;
}

Performs.prototype.perform = function (src, dst) {
  winston.debug('Performs is performing…');
  if (2 !== arguments.length) {
    throw new SyntaxError();
  }
};

exports.Performs = Performs;

