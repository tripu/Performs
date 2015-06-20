
'use strict';

// Dependencies:
var winston = require('winston'),
    cheerio = require('cheerio'),
    utils   = require('./utils'),
    meta    = require('../package.json'),
    Model   = require('./model').Model;

// Pseudo-constants:
var VERSION        = meta.version;
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
 *
 * An HTML UI engine written in JavaScript.
 * @constructor
 * @author tripu <a href="mailto:tripu@tripu.info"><code>tripu@tripu.info</code></a> <a href="http://tripu.info"><code>http://tripu.info</code></a>
 * [TODO] Optional parameter: definition.
 * @exports Performs
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
 *
 * Uses semantic versioning.
 */

Performs.version = VERSION;

/**
 * Load a form definition.
 *
 * <code>definition</code> may be: String, URL, file, document or stream.
 * [TODO] Throw an exception if this has a source already.
 * @param {Object} definition
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
 *
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

/**
 * Performs as a String filter.
 *
 * @param {String}   document
 * @param {Function} handler
 * @param {Request}  req
 */

Performs.filter = function(document, handler, req, options) {

  var result = document,
      $ = cheerio.load(result),
      form = $('form[data-pf]'),
      json,
      totalForms,
      processedForms = 0;

  totalForms = form.length;

  form.each(function retrieveJSON (i, elem) {
    json = $(elem).attr('data-pf');
    json = utils.inferURL(req, json);
    utils.loadURL(json, function handleJSON (data) {

      if (data) {
        var m = new Model();
        try {
          m.build(JSON.parse(data));
        } catch (err) {
          console.log('Error: ' + err);
          $(elem).addClass('pf-failed');
        }
        m.inject($(elem));
        if (options && options.prependJSON) {
          $(elem).before('<pre class="source">' + data + '</pre>');
        }
        $(elem).addClass('pf-processed');
      } else {
        $(elem).addClass('pf-failed');
      }

      processedForms ++;

      if (processedForms === totalForms) {
        handler.call(null, $.html());
      }

    });

  });

};

exports.Performs = Performs;

