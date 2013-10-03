var v = require('..');
var test = require('tape');

test('value', function(t) {
  var validate = v.rules({
    'a': v.string().equal(v.value('b')),
    'b': v.string()
  });

  validate({
    a: 'foo',
    b: 'foo'
  });

  t.throws(function() {
    validate({
      a: 'foo',
      b: 'bar'
    });
  });

  t.end();
});
