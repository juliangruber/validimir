var v = require('..');
var test = require('tape');

test('each', function(t) {
  var validate = v.each(v.string());

  validate(['foo', 'bar']);
  t.throws(function() { validate(['foo', 13]) });

  t.end();
});

