
'use strict';

// Dependencies:
var winston = require('winston');
var utils = require('./utils');

// Pseudo-constants:
var VERSION        = require('../package.json').version;
var ENV_PRODUCTION = 'production';
var LOG_PRODUCTION = 'warn';
var LOG_DEBUGGING  = 'verbose';
var PATTERN_URL    = /^https?:\/\/\S+$/i;
var PATTERN_URL    = /^[^\r\n]+$/i;

// Static initialisation:
if (ENV_PRODUCTION === process.env.NODE_ENV) {
  winston.level = LOG_PRODUCTION;
} else {
  winston.level = LOG_DEBUGGING;
}

/**
 * Performs.
 * An HTML UI engine written in JavaScript.
 * @exports Performs
 * @constructor
 * @author tripu <a href="mailto:tripu@tripu.info"><code>tripu@tripu.info</code></a> <a href="http://tripu.info"><code>http://tripu.info</code></a>
 * [TODO] Optional parameter: definition.
 */

var Performs = function() {

  winston.debug('Instantiating Performs ' + VERSION + '…');

  /**
   * Form definition.
   */
  this.definition = null;

  /**
   * Form model.
   */
  this.model = null;

  /**
   * Form elements.
   */
  this.elements = null;

  winston.debug('Performs ' + VERSION + ' instantiated OK.');

};

/**
 * Version of the software.
 * Uses semantic versioning.
 */

Performs.version = VERSION;

/**
 * Load a form definition.
 * <code>definition</code> may be: String, URL, file, document or stream.
 * @param {Object} definition
 * [TODO] Throw an exception if this has a source already.
 */

Performs.prototype.loadDefinition = function(definition) {

  var self = this;

  if (1 !== arguments.length) {
    throw new SyntaxError();
  }

  var readDefinition = function(def) {

    if (!def) {
      self.definition = undefined;
    } else {
      self.definition = JSON.parse(def);
    }

  };

  if ('string' === typeof definition) {
    if (PATTERN_URL.test(definition)) {
      // It's a URL:
      utils.loadURL(definition, readDefinition);
    } else if (PATTERN_FILE.test(definition)) {
      // It's a file:
    } else {
      // It's the definition itself:
      // ...
    }
  } else {
  }

};

/**
 * Build the form model.
 * <code>definition</code> may be: String, URL, file, document or stream.
 * @param {Object} definition
 * [TODO] Throw an exception if this has a source already.
 */

Performs.prototype.buildModel = function() {

  if (!(this.definition)) {
    throw new Error();
  }

  if (!this.definition.schema && Number(this.definition.schema) >= Performs.version) {
  }

};

/**
 * Build a dynamic form from a JSON definition.
 * @param src Source
 * @param dst Destination
 */

Performs.prototype.perform = function(src, dst) {

  winston.debug('Performs is performing…');

  if (2 !== arguments.length) {
    throw new SyntaxError();
  }

};

exports.Performs = Performs;

