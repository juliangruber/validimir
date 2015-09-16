var test = require('tape');
var v = require('..');

test('number', function(t) {
  t.deepEqual(v().number()(13).errors, []);
  t.deepEqual(v().number()('13').errors, [
    { value: '13', operator: 'number', actual: 'string' }
  ]);
  t.end();
});

test('string', function(t) {
  t.deepEqual(v().string()('13').errors, []);
  t.deepEqual(v().string()(13).errors, [
    { value: 13, operator: 'string', actual: 'number' }
  ]);
  t.end();
});

test('boolean', function(t) {
  t.deepEqual(v().boolean()(true).errors, []);
  t.deepEqual(v().boolean()('true').errors, [
    { value: 'true', operator: 'boolean', actual: 'string' }  
  ]);
  t.end();
});

test('object', function(t) {
  t.deepEqual(v().object()({}).errors, []);
  t.deepEqual(v().object()('true').errors, [
    { value: 'true', operator: 'object', actual: 'string' }  
  ]);
  t.end();
});


test('array', function(t) {
  t.deepEqual(v().array()([]).errors, []);
  t.deepEqual(v().array()('true').errors, [
    { value: 'true', operator: 'array', actual: 'string' }  
  ]);
  t.end();
});

test('buffer', function(t) {
  t.deepEqual(v().buffer()(new Buffer(0)).errors, []);
  t.deepEqual(v().buffer()({}).errors, [
    { value: {}, operator: 'buffer', actual: 'object' }  
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
    { value: 2, operator: 'equal', expected: 1 }
  ]);


  t.deepEquals(v().equal('1')(1).errors, [
    { value: 1, operator: 'equal', expected: '1' }  
  ]);
  t.deepEquals(v().equal({ gt: 4 })(3).errors, [
    { value: 3, operator: 'equal', expected: { gt: 4 } }  
  ]);
  t.deepEqual(v().equal({ gt: 'b' })('a').errors, [
    { value: 'a', operator: 'equal', expected: { gt: 'b' } }
  ]);
  t.end();
});

test('notEqual', function(t) {
  t.deepEqual(v().notEqual('1')(1).errors, []);
  t.deepEqual(v().notEqual({ gt: 3, lt: 5 })(6).errors, []);
  t.deepEqual(v().notEqual('1')('1').errors, [
    { value: '1', operator: 'notEqual' }
  ]);
  t.end();
});

test('match', function(t) {
  t.deepEqual(v().match(/foo/)('foo').errors, []);
  t.deepEqual(v().match(/foo/)('f').errors, [
    { value: 'f', operator: 'match', expected: /foo/ }
  ]);
  t.end();
});

test('notMatch', function(t) {
  t.deepEqual(v().notMatch(/foo/)('f').errors, []);
  t.deepEqual(v().notMatch(/foo/)('foo').errors, [
    { value: 'foo', operator: 'notMatch' }
  ]);
  t.end();
});

test('hasKey', function(t) {
  t.deepEqual(v().hasKey('a')({a:'b'}).errors, []);
  t.deepEqual(v().hasKey('b')({a:'b'}).errors, [
    { value: { a: 'b' }, operator: 'hasKey', expected: 'b' }
  ]);
  t.end();
});

test('len', function(t) {
  t.deepEqual(v().len(13)('aaaaaaaaaaaaa').errors, []);
  t.deepEqual(v().len({ gt: 3 })('aaaaa').errors, []);
  t.deepEqual(v().len({ lte: 10 })('aaaaa').errors, []);
  t.deepEqual(v().len({ gt: 3, lte: 10 })('aaaaa').errors, []);

  t.deepEqual(v().len(13)('a').errors, [
    { value: 'a', operator: 'len', expected: 13, actual: 1 }
  ]);
  t.deepEqual(v().len({ gt: 3 })('a').errors, [
    { value: 'a', operator: 'len', expected: { gt: 3 }, actual: 1 }
  ]);
  t.deepEqual(v().len({ lte: 3 })('aaaaa').errors, [
    { value: 'aaaaa', operator: 'len', expected: { lte: 3 }, actual: 5 }
  ]);
  t.deepEqual(v().len({ gt: 3, lte: 10 })('a').errors, [
    { value: 'a', operator: 'len', expected: { gt: 3, lte: 10 }, actual: 1 }
  ]);

  t.end();
});

test('of', function(t) {
  t.deepEqual(v().of(['foo', 'bar'])('foo').errors, []);
  t.deepEqual(v().of(['foo'])('bar').errors, [
    { value: 'bar', operator: 'of', expected: ['foo'] }
  ]);
  t.end();
});

test('notOf', function(t) {
  t.deepEqual(v().notOf(['foo', 'bar'])('baz').errors, []);
  t.deepEqual(v().notOf(['foo'])('foo').errors, [
    { value: 'foo', operator: 'notOf', expected: ['foo'] }
  ]);
  t.end();
});

test('integration', function(t) {
  t.deepEqual(v().of(['foo']).len(3).match(/^foo$/)
  .notEqual('bar').equal('foo').string()('foo').errors, []);
  t.end();
});
