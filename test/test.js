
/**
 * Performs test suite.
 * Performs is an HTML UI engine written in JavaScript; this is the test suite written for it.
 * @author tripu <a href="mailto:tripu@tripu.info"><code>tripu@tripu.info</code></a> <a href="http://tripu.info"><code>http://tripu.info</code></a>
 */

'use strict';

// Dependencies:
var assert       = require('assert'),
    meta         = require('../package.json'),
    utils        = require('../lib/utils'),
    Model        = require('../lib/Model').Model,
    Performs     = require('../Performs').Performs,
    dataSimplest = require('./data/simplest'),
    dataBasic    = require('./data/basic'),
    dataWithDeps = require('./data/withDeps');

// Pseudo-constants:
var URL_WRONG = 'http://i.do.not.exist';
var URL_RIGHT = 'https://tripu.github.io/Performs/data/definition/simple-contact-form.json';

describe('lib/utils', function() {

//  this.timeout(5000);

  describe('#loadURL()', function() {

    it('should return “undefined” when the URL is wrong', function(done) {
      utils.loadURL(URL_WRONG, function handler(data) {
        if (data) {
          throw new Error();
        }
        done();
      });
    });

    it('should load JSON from the right URL', function(done) {
      utils.loadURL(URL_RIGHT, function handler(data) {
        if (!data) {
          throw new Error();
        }
        done();
      });
    });

  });

});

describe('Class Model', function() {

  var m = new Model();

  it('fails with bogus input', function(){
    assert.throws(function() {
      m.build(42);
    }, Error);
  });

  it('can process the simplest JSON', function(){
    assert.doesNotThrow(function() {
      m.build(dataSimplest);
    }, Error);
    assert.deepEqual(m.fields, {});
    assert.deepEqual(m.dependencies, {});
  });

  it('understands fields and their values', function(){
    assert.doesNotThrow(function() {
      m.build(dataBasic);
    }, Error);
    assert.deepEqual(m.fields, {});
    assert.deepEqual(m.dependencies, {});
  });

  it('understands dependencies among fields', function(){
    assert.doesNotThrow(function() {
      m.build(dataWithDeps);
    }, Error);
    console.dir(m.fields);
    console.dir(m.deps);
  });

});

describe('Public interface: class Performs', function() {

  var pf = new Performs();

  it('has static property “version”, of type String, which returns the right value', function(){
    assert.equal(typeof Performs.version, 'string');
    assert.equal(Performs.version, meta.version);
  });

  it('has method “perform”, expecting 2 arguments', function(){
    assert.equal(typeof pf.perform, 'function');
    assert.throws(function() { pf.perform(); }, SyntaxError);
    assert.throws(function() { pf.perform({}); }, SyntaxError);
    assert.doesNotThrow(function() { pf.perform({}, {}); }, SyntaxError);
    assert.throws(function() { pf.perform({}, {}, {}); }, SyntaxError);
  });

  it('foo', function() {
    pf.loadDefinition(URL_RIGHT);
  });

});
