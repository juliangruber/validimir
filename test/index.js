var v = require('..');
var test = require('tape');

test('index', function(t) {
  var validate = v.each(v.equal(v.index()));

  validate([0, 1]);
  validate({ foo: 'foo', bar: 'bar' })
  t.throws(function() { validate([0, 2]) });
  t.throws(function() { validate({ foo: 'bar' }) });

  t.end();
});

