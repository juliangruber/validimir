var v = require('..');
var test = require('tape');

test('index', function(t) {
  var validate = v.each(v.number().equal(v.index()));

  validate([0, 1]);
  t.throws(function() { validate([0, 2]) });

  t.end();
});

