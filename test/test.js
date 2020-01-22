
/**
 * Performs test suite.
 * Performs is an HTML UI engine written in JavaScript; this is the test suite written for it.
 * @author tripu <a href="mailto:t@tripu.info"><code>t@tripu.info</code></a> <a href="https://tripu.info/"><code>https://tripu.info</code></a>
 */

'use strict';

// Dependencies:
var assert       = require('assert'),
    meta         = require('../package.json'),
    utils        = require('../lib/utils'),
    Model        = require('../lib/model').Model,
    Performs     = require('../lib/performs').Performs,
    notSupported = require('./json/not-supported'),
    simple       = require('./json/simple'),
    withDeps     = require('./json/with-dependencies');

// Pseudo-constants:
var URL_WRONG = 'http://i-do.not/exist';
var URL_RIGHT = 'https://tripu.github.io/Performs/doc/data/definition/simple-contact-form.json';

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

  var m;

  it('fails with bogus input', function(){
    m = new Model();
    assert.throws(function() {
      m.build(42);
    }, Error);
  });

  it('fails if JSON version is not compatible', function(){
    m = new Model();
    assert.throws(function() {
      m.build(notSupported);
    }, Error);
  });

  it('can process the simplest JSON', function(){
    m = new Model();
    assert.doesNotThrow(function() {
      m.build(simple);
    }, Error);
    assert(m.fields);
    assert(m.fields.age);
    assert.equal(200, m.fields.age.max);
  });

  it('understands dependencies among fields', function(){
    m = new Model();
    assert.doesNotThrow(function() {
      m.build(withDeps);
    }, Error);
    /* console.dir(m.fields);
    console.dir(m.deps); */
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
