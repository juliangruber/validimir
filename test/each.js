var v = require('..');
var test = require('tape');

test('each', function(t) {
  var validate = v().each(v().string());

  t.deepEqual(validate(['foo', 'bar']).errors, []);
  t.deepEqual(validate({ foo: 'foo', bar: 'bar' }).errors, []);
  t.deepEqual(validate(['foo', 13]).errors, [
    {
      value: 13,
      operator: 'string',
      actual: 'number',
      message: 'Expected a string but got a number'
    }
  ]);
  t.deepEqual(validate({ foo: 13 }).errors, [
    {
      value: 13,
      operator: 'string',
      actual: 'number',
      message: 'Expected a string but got a number'
    }
  ]);

  t.end();
});

