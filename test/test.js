var test = require('tape');
var v = require('..');

test('number', function(t) {
  t.deepEqual(v().number()(13).errors, []);
  t.equal(v().number()(13).valid(), true);
  t.deepEqual(v().number()('13').errors, [
    {
      value: '13',
      operator: 'number',
      actual: 'string',
      message: 'Expected a number but got a string'
    }
  ]);
  t.deepEqual(v().number('number')('13').errors, [
    {
      value: '13',
      operator: 'number',
      actual: 'string',
      message: 'number'
    }
  ]);
  t.equal(v().number()('13').valid(), false);
  t.end();
});

test('string', function(t) {
  t.deepEqual(v().string()('13').errors, []);
  t.deepEqual(v().string()(13).errors, [
    {
      value: 13,
      operator: 'string',
      actual: 'number',
      message: 'Expected a string but got a number'
    }
  ]);
  t.deepEqual(v().string('string')(13).errors, [
    {
      value: 13,
      operator: 'string',
      actual: 'number',
      message: 'string'
    }
  ]);
  t.end();
});

test('boolean', function(t) {
  t.deepEqual(v().boolean()(true).errors, []);
  t.deepEqual(v().boolean()('true').errors, [
    {
      value: 'true',
      operator: 'boolean',
      actual: 'string',
      message: 'Expected a boolean but got a string'
    }
  ]);
  t.deepEqual(v().boolean('boolean')('true').errors, [
    {
      value: 'true',
      operator: 'boolean',
      actual: 'string',
      message: 'boolean'
    }
  ]);
  t.end();
});

test('object', function(t) {
  t.deepEqual(v().object()({}).errors, []);
  t.deepEqual(v().object()('true').errors, [
    {
      value: 'true',
      operator: 'object',
      actual: 'string',
      message: 'Expected a object but got a string'
    }
  ]);
  t.deepEqual(v().object('object')('true').errors, [
    {
      value: 'true',
      operator: 'object',
      actual: 'string',
      message: 'object'
    }
  ]);
  t.end();
});

test('array', function(t) {
  t.deepEqual(v().array()([]).errors, []);
  t.deepEqual(v().array()('true').errors, [
    {
      value: 'true',
      operator: 'array',
      actual: 'string',
      message: 'Expected a array but got a string'
    }
  ]);
  t.deepEqual(v().array('array')('true').errors, [
    {
      value: 'true',
      operator: 'array',
      actual: 'string',
      message: 'array'
    }
  ]);
  t.end();
});

test('buffer', function(t) {
  t.deepEqual(v().buffer()(new Buffer(0)).errors, []);
  t.deepEqual(v().buffer()({}).errors, [
    {
      value: {},
      operator: 'buffer',
      actual: 'object',
      message: 'Expected a buffer but got a object'
    }
  ]);
  t.deepEqual(v().buffer('buffer')({}).errors, [
    {
      value: {},
      operator: 'buffer',
      actual: 'object',
      message: 'buffer'
    }
  ]);
  t.end();
});

test('date', function(t) {
  t.deepEqual(v().date()(new Date).errors, []);
  t.deepEqual(v().date()({}).errors, [
    {
      value: {},
      operator: 'date',
      actual: 'object',
      message: 'Expected a date but got a object'
    }
  ]);
  t.deepEqual(v().date('date')({}).errors, [
    {
      value: {},
      operator: 'date',
      actual: 'object',
      message: 'date'
    }
  ]);
  t.end();
});

test('email', function(t) {
  t.deepEqual(v().email()('foo@bar.com').errors, []);
  t.deepEqual(v().email()('foo@bar').errors, [
    {
      value: 'foo@bar',
      operator: 'email',
      message: 'Expected a valid email address'
    }
  ]);
  t.deepEqual(v().email('email')('foo@bar').errors, [
    {
      value: 'foo@bar',
      operator: 'email',
      message: 'email'
    }
  ]);
  t.deepEqual(v().email('email')(null).errors, [
    {
      value: null,
      operator: 'email',
      message: 'email'
    }
  ]);
  t.end();
});

test('equal', function(t) {
  t.deepEqual(v().equal('foo')('foo').errors, []);
  t.deepEqual(v().equal(4)(4).errors, []);

  t.deepEqual(v().equal({ gt: 4 })(6).errors, []);
  t.deepEqual(v().equal({ gt: 'a' })('b').errors, []);

  t.deepEqual(v().equal({ lt: 7 })(6).errors, []);
  t.deepEqual(v().equal({ lt: 'b' })('a').errors, []);

  t.deepEqual(v().equal(1)(2).errors, [
    {
      value: 2,
      operator: 'equal',
      expected: 1,
      message: 'Expected 2 to equal 1'
    }
  ]);
  t.deepEqual(v().equal(1, 'equal')(2).errors, [
    {
      value: 2,
      operator: 'equal',
      expected: 1,
      message: 'equal'
    }
  ]);


  t.deepEquals(v().equal('1')(1).errors, [
    {
      value: 1,
      operator: 'equal',
      expected: '1',
      message: 'Expected 1 to equal "1"'
    }
  ]);
  t.deepEquals(v().equal({ gt: 4 })(3).errors, [
    {
      value: 3,
      operator: 'equal',
      expected: { gt: 4 },
      message: 'Expected a value in range (4,'
    }
  ]);
  t.deepEquals(v().equal({ gt: 4 }, 'equal')(3).errors, [
    {
      value: 3,
      operator: 'equal',
      expected: { gt: 4 },
      message: 'equal'
    }
  ]);
  t.deepEqual(v().equal({ gt: 'b' })('a').errors, [
    {
      value: 'a',
      operator: 'equal',
      expected: { gt: 'b' },
      message: 'Expected a value in range (b,'
    }
  ]);
  t.deepEqual(v().equal(null)('a').errors, [
    {
      value: 'a',
      operator: 'equal',
      expected: null,
      message: 'Expected "a" to equal null'
    }
  ]);
  t.deepEqual(v().equal(null)(null).errors, []);
  t.end();
});

test('notEqual', function(t) {
  t.deepEqual(v().notEqual('1')(1).errors, []);
  t.deepEqual(v().notEqual({ gt: 3, lt: 5 })(6).errors, []);
  t.deepEqual(v().notEqual('1')('1').errors, [
    {
      value: '1',
      operator: 'notEqual',
      message: 'Expected "1" not to equal "1"'
    }
  ]);
  t.deepEqual(v().notEqual('1', 'not equal')('1').errors, [
    {
      value: '1',
      operator: 'notEqual',
      message: 'not equal'
    }
  ]);
  t.deepEqual(v().notEqual({ gt: 3, lt: 5 })(4).errors, [
    {
      value: 4,
      operator: 'notEqual',
      message: 'Expected a value outside range (3,5)'
    }
  ]);
  t.deepEqual(v().notEqual({ gt: 3, lt: 5 }, 'not equal')(4).errors, [
    {
      value: 4,
      operator: 'notEqual',
      message: 'not equal'
    }
  ]);
  t.deepEqual(v().notEqual(null)(null).errors, [
    {
      value: null,
      operator: 'notEqual',
      message: 'Expected null not to equal null'
    }
  ]);
  t.deepEqual(v().notEqual(null)('a').errors, []);
  t.end();
});

test('match', function(t) {
  t.deepEqual(v().match(/foo/)('foo').errors, []);
  t.deepEqual(v().match(/foo/)('f').errors, [
    {
      value: 'f',
      operator: 'match',
      expected: /foo/,
      message: 'Expected "f" to match /foo/'
    }
  ]);
  t.deepEqual(v().match(/foo/, 'match')('f').errors, [
    {
      value: 'f',
      operator: 'match',
      expected: /foo/,
      message: 'match'
    }
  ]);
  t.deepEqual(v().match(/foo/)(null).errors, [
    {
      value: null,
      operator: 'match',
      expected: /foo/,
      message: 'Expected null to match /foo/'
    }
  ]);
  t.end();
});

test('notMatch', function(t) {
  t.deepEqual(v().notMatch(/foo/)('f').errors, []);
  t.deepEqual(v().notMatch(/foo/)('foo').errors, [
    {
      value: 'foo',
      operator: 'notMatch',
      message: 'Expected "foo" not to match /foo/'
    }
  ]);
  t.deepEqual(v().notMatch(/foo/)(null).errors, [
    {
      value: null,
      operator: 'notMatch',
      message: 'Expected null not to match /foo/'
    }
  ]);
  t.deepEqual(v().notMatch(/foo/, 'not match')('foo').errors, [
    {
      value: 'foo',
      operator: 'notMatch',
      message: 'not match'
    }
  ]);
  t.end();
});

test('hasKey', function(t) {
  t.deepEqual(v().hasKey('a')({a:'b'}).errors, []);
  t.deepEqual(v().hasKey('b')({a:'b'}).errors, [
    {
      value: { a: 'b' },
      operator: 'hasKey',
      expected: 'b',
      message: 'Expected {"a":"b"} to have key b'
    }
  ]);
  t.deepEqual(v().hasKey('b', 'has key')({a:'b'}).errors, [
    {
      value: { a: 'b' },
      operator: 'hasKey',
      expected: 'b',
      message: 'has key'
    }
  ]);
  t.deepEqual(v().hasKey('b')(null).errors, [
    {
      value: null,
      operator: 'hasKey',
      expected: 'b',
      message: 'Expected null to have key b'
    }
  ]);
  t.end();
});

test('len', function(t) {
  t.deepEqual(v().len(13)('aaaaaaaaaaaaa').errors, []);
  t.deepEqual(v().len({ gt: 3 })('aaaaa').errors, []);
  t.deepEqual(v().len({ lte: 10 })('aaaaa').errors, []);
  t.deepEqual(v().len({ gt: 3, lte: 10 })('aaaaa').errors, []);

  t.deepEqual(v().len(13)('').errors, [
    {
      value: '',
      operator: 'len',
      expected: 13,
      actual: 0,
      message: 'Expected "" to have length 13'
    }
  ]);
  t.deepEqual(v().len(13, 'len')('a').errors, [
    {
      value: 'a',
      operator: 'len',
      expected: 13,
      actual: 1,
      message: 'len'
    }
  ]);
  t.deepEqual(v().len({ gt: 3 })('a').errors, [
    {
      value: 'a',
      operator: 'len',
      expected: { gt: 3 },
      actual: 1,
      message: 'Expected "a" to be of length (3,'
    }
  ]);
  t.deepEqual(v().len({ gt: 3 }, 'len')('a').errors, [
    {
      value: 'a',
      operator: 'len',
      expected: { gt: 3 },
      actual: 1,
      message: 'len'
    }
  ]);
  t.deepEqual(v().len({ lte: 3 })('aaaaa').errors, [
    {
      value: 'aaaaa',
      operator: 'len',
      expected: { lte: 3 },
      actual: 5,
      message: 'Expected "aaaaa" to be of length ,3]'
    }
  ]);
  t.deepEqual(v().len({ gt: 3, lte: 10 })('a').errors, [
    {
      value: 'a',
      operator: 'len',
      expected: { gt: 3, lte: 10 },
      actual: 1,
      message: 'Expected "a" to be of length (3,10]'
    }
  ]);
  t.deepEqual(v().len(3)(null).errors, [
    {
      value: null,
      operator: 'len',
      expected: 3,
      actual: undefined,
      message: 'Expected null to have length 3'
    }
  ]);
  t.deepEqual(v().len(3)(undefined).errors, [
    {
      value: undefined,
      operator: 'len',
      expected: 3,
      actual: undefined,
      message: 'Expected undefined to have length 3'
    }
  ]);
  t.deepEqual(v().len({ gt:3 })(null).errors, [
    {
      value: null,
      operator: 'len',
      expected: { gt: 3 },
      actual: undefined,
      message: 'Expected null to be of length (3,'
    }
  ]);
  t.deepEqual(v().len({ gt:3 })(undefined).errors, [
    {
      value: undefined,
      operator: 'len',
      expected: { gt: 3 },
      actual: undefined,
      message: 'Expected undefined to be of length (3,'
    }
  ]);

  t.end();
});

test('of', function(t) {
  t.deepEqual(v().of(['foo', 'bar'])('foo').errors, []);
  t.deepEqual(v().of(['foo'])('bar').errors, [
    {
      value: 'bar',
      operator: 'of',
      expected: ['foo'],
      message: 'Expected "bar" to be of ["foo"]'
    }
  ]);
  t.deepEqual(v().of(['foo'], 'of')('bar').errors, [
    {
      value: 'bar',
      operator: 'of',
      expected: ['foo'],
      message: 'of'
    }
  ]);
  t.end();
});

test('notOf', function(t) {
  t.deepEqual(v().notOf(['foo', 'bar'])('baz').errors, []);
  t.deepEqual(v().notOf(['foo'])('foo').errors, [
    {
      value: 'foo',
      operator: 'notOf',
      expected: ['foo'],
      message: 'Expected "foo" not to be of ["foo"]'
    }
  ]);
  t.deepEqual(v().notOf(['foo'], 'not of')('foo').errors, [
    {
      value: 'foo',
      operator: 'notOf',
      expected: ['foo'],
      message: 'not of'
    }
  ]);
  t.end();
});

test('integration', function(t) {
  t.test(function(t){
    t.deepEqual(v().of(['foo']).len(3).match(/^foo$/)
    .notEqual('bar').equal('foo').string()('foo').errors, []);
    t.end();
  });
  t.test(function(t){
    var res = v()
      .match(/\d/, 'A password must contain at least one number')
      .match(/[a-z]/, 'A password must contain at least one lowercase letter')
      .match(/[A-Z]/, 'A password must contain at least one uppercase letter')
      .match(/!@#$%^&/, 'A passwould must contain at least one of the following "!@#$%^&"')
      .len({ gte: 8, lte: 128 }, 'A password contain between 8 and 128 characters')('');
    t.equal(res.errors.length, 5);
    t.end();
  });
  t.end();
});

test('putin', function(t) {
  v.putin('foo', 'bar', function(err){
    t.equal(err.message, 'in node, error throws you!');
    t.end();
  });
});


test('custom', function(t) {
  var trueCheck = function() {};
  var falseCheck = function() { return 'Some error found'; };

  t.deepEqual(v().custom(trueCheck)(1).errors, []);
  t.deepEqual(v().custom(falseCheck)(1).errors, ['Some error found']);
  t.end();
});
