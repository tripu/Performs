
'use strict';

// Pseudo-constants:
var PATTERN_PF_EXPRESSION = /^\s*\{\{\s*\S+\s*\}\}\s*$/;
var PATTERN_PF_VARIABLE = /@[a-z_][a-z0-9_]*/i;

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

/**
 * Build a model.
 * @param definition
 */

Model.prototype.build = function(definition) {

  var def, content, vars, id;

  if ('object' !== typeof definition) {
    throw new Error('Wrong definition! ' + (typeof definition) + ', ' + definition);
  }

  def = definition;
  content = def.content;

  for (var field in content) {
    this.fields[content[field].id] = content[field];
  }

  for (var field in this.fields) {
    if (this.fields.hasOwnProperty(field)) {
      if (this.fields[field].value && PATTERN_PF_EXPRESSION.test(this.fields[field].value)) {
        vars = this.fields[field].value.match(PATTERN_PF_VARIABLE);
        for (v in vars) {
          id = v.substr(1);
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

