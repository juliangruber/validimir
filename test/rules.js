var v = require('..');
var test = require('tape');

test('rules', function(t) {
  var validate = v.rules({
    'string': v.string(),
    'number': v.number()
  });

  validate({ string: 'string', number: 12 });
  t.throws(function() { validate({ string: 13 }) });
  t.throws(function() { validate({ string: 'string' }) });

  t.end();
});

