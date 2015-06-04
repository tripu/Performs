
/**
 * Performs test suite.
 *
 * Performs is an HTML UI engine written in JavaScript; this is the test suite written for it.
 *
 * @author tripu <a href="mailto:tripu@tripu.info"><code>tripu@tripu.info</code></a> <a href="http://tripu.info"><code>http://tripu.info</code></a>
 */

'use strict';

// Dependencies:
var assert = require('assert'),
    meta = require('../package.json'),
    Performs = require('../lib/performs').Performs;

var performs = new Performs();

describe('API', function() {

  it('has String property “version”, which returns the right value', function(){
    assert.equal(typeof performs.version, 'string');
    assert.equal(performs.version, meta.version);
  });

  it('has method “perform”, expecting 2 arguments', function(){
    assert.equal(typeof performs.perform, 'function');
    assert.throws(function() { performs.perform(); }, SyntaxError);
    assert.throws(function() { performs.perform({}); }, SyntaxError);
    assert.doesNotThrow(function() { performs.perform({}, {}); }, SyntaxError);
    assert.throws(function() { performs.perform({}, {}, {}); }, SyntaxError);
  });

});

