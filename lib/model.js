
'use strict';

// Dependencies:
var semver = require('semver'),
    meta   = require('../package.json');

// Pseudo-constants:
var PATTERN_PF_EXPRESSION = /^\s*\{\{.*\S+.*\}\}\s*$/;
var PATTERN_PF_VARIABLE = /@[a-z_][a-z0-9_]*/gi;

/**
 * Model.
 * @exports Model
 * @constructor Build the model from a definition.
 * @author tripu <a href="mailto:tripu@tripu.info"><code>tripu@tripu.info</code></a> <a href="http://tripu.info"><code>http://tripu.info</code></a>
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

/* function extractVariables(expression, vars) {

  var result = [],
      tmp = {},
      v,
      regex = new RegEx(PATTERN_PF_VARIABLE);
      occ;

  if (vars) {
    for (v in vars) {
      if (vars.hasOwnProperty(v)) {
        tmp.push(vars[v]);
      }
    }
  }

  while (occ = regex.exec(expression)) {
    tmp.push();
  }

  for (v in tmp) {
    if (tmp.hasOwnProperty(v)) {
    }
  }

  return result;

}; */

/**
 * Build a model.
 * @param definition
 */

Model.prototype.build = function(definition) {

  var def, content, field, vars, regex, match, id;

  if ('object' !== typeof definition) {
    throw new Error('Wrong definition!');
  }

  def = definition;

  if (!(def['pf-schema']) || !semver.satisfies(meta.version, def['pf-schema'])) {
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

exports.Model = Model;

