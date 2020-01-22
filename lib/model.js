
'use strict';

/**
 * @ module lib/model
 */

// Dependencies:
var semver  = require('semver'),
    $       = require('cheerio'),
    meta    = require('../package.json');

// Pseudo-constants:
var PATTERN_PF_EXPRESSION = /^\s*\{\{.*\S+.*\}\}\s*$/;
var PATTERN_PF_VARIABLE   = /@[a-z_][a-z0-9_]*/gi;

/**
 * Model.
 *
 * @constructor Build the model from a definition.
 * @author tripu <a href="mailto:t@tripu.info"><code>t@tripu.info</code></a> <a href="https://tripu.info/"><code>https://tripu.info</code></a>
 * @exports Model
 */

var Model = function() {

  /**
   * Fields.
   */

  this.fields = {};

  /**
   * Dependencies.
   */

  this.deps = {};

};

/**
 * Build a model.
 *
 * @param {Object} definition
 */

Model.prototype.build = function(definition) {

  var def, content, field, vars, regex, match, id;

  if ('object' !== typeof definition) {
    throw new Error('Wrong definition!');
  }

  def = definition;

  if (!(def['pf-schema']) || semver.major(meta.version) !== semver.major(def['pf-schema'])) {
    throw new Error('Version "' + def['pf-schema'] + '" not supported!');
  }

  content = def.content;

  for (field in content) {
    this.fields[content[field].id] = content[field];
  }

  for (field in this.fields) {
    if (this.fields.hasOwnProperty(field)) {
      if (this.fields[field].value && PATTERN_PF_EXPRESSION.test(this.fields[field].value)) {
        this.fields[field].dynamic = true;
        regex = new RegExp(PATTERN_PF_VARIABLE);
        while (null !== (match = regex.exec(this.fields[field].value))) {
          id = match[0].substr(1);
          if (!this.deps[id]) {
            this.deps[id] = [];
          }
          this.deps[id].push(this.fields[field].id);
        }
      }
    }
  }

};

/**
 * Create fields in a form
 *
 * @param {Node} form
 */

Model.prototype.inject = function(form) {

  var field, element;

  for (var i in this.fields) {
    field = this.fields[i];
    element = '';
    if (field.label) {
      element += '<label for ="' + field.id + '">' + field.label + '</label> ';
    }
    element += '<input id="' + field.id + '" ';
    if (field.value) {
      element += 'value="' + field.value + '"';
    }
    element += '> <br> ';
    if ($('input[type=submit]').length > 0) {
      $('input[type=submit]', form).before(element);
    } else {
      $(form).append(element);
    }
  }

};

exports.Model = Model;
