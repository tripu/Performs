
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
var VERSION        = require('../package.json').version;
var ENV_PRODUCTION = 'production';
var LOG_PRODUCTION = 'warn';
var LOG_DEBUGGING  = 'verbose'; // 'debug';

// Global initialisation:
if (ENV_PRODUCTION === process.env.NODE_ENV) {
  winston.level = LOG_PRODUCTION;
} else {
  winston.level = LOG_DEBUGGING;
}

/**
 * Class Performs.
 *
 * Public interface.
 */

var Performs = function () {

  winston.debug('Instantiating Performs ' + VERSION + '…');
  this.src = null;

};

/**
 * Version of the software.
 *
 * Uses semantic versioning.
 */

Performs.version = VERSION;

/**
 * Load a form definition.
 *
 * @param src Source
 */

Performs.prototype.loadDefinition = function (definition) {

  if (1 !== arguments.length) {
    throw new SyntaxError();
  }

};

/**
 * Build a dynamic form from a JSON definition.
 *
 * @param src Source
 * @param dst Destination
 */

Performs.prototype.perform = function (src, dst) {

  winston.debug('Performs is performing…');

  if (2 !== arguments.length) {
    throw new SyntaxError();
  }

};

exports.Performs = Performs;

