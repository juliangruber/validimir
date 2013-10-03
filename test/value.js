var v = require('..');
var test = require('tape');

test('value', function(t) {
  var validate = v.rules({
    'a': v.string().equal(v.value('b')),
    'b': v.string(),
    'arr': v.array().each(v.rules({
      'a': v.equal(v.value('c')),
      'b': v.equal(v.value('../../a')),
      'c': v.equal('c')
    }))
  });

  validate({
    a: 'foo',
    b: 'foo',
    arr: [{
      a: 'c',
      b: 'foo',
      c: 'c'
    }]
  });

  t.throws(function() {
    validate({
      a: 'foo',
      b: 'bar',
      arr: [{ a: 'c', b: 'bar', c: 'c' }]
    });
  });

  t.end();
});
