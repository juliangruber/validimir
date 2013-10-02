var v = require('..');
var test = require('tape');

test('optional', function(t) {
  v.optional().string()();
  v.string().optional()();
  t.throws(function() { v.string()() });
  t.end();
});
