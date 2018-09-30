// exemple of tests: https://github.com/senchalabs/connect/blob/master/test/server.js
const assert = require('assert');
const express = require('express');
const request = require('supertest');

describe('app', function() {
  it('should be callable', function() {
    const app = express();
    assert.equal(typeof app, 'function');
  });
  it('should inherit from event emitter', function(done) {
    let app = express();
    app.on('foo', done);
    app.emit('foo');
  });
  it('should 404 without routes', function(done) {
    request(express())
        .get('/')
        .expect(404, done);
  });
});
