var test = require('tape');
var v = require('..');

test('number', function(t) {
  v.number()(13);
  t.throws(function() { v.number()('13') });
  t.end();
});

test('string', function(t) {
  v.string()('13');
  t.throws(function() { v.string()(13) });
  t.end();
});

test('boolean', function(t) {
  v.boolean()(true);
  t.throws(function() { v.boolean()() });
  t.end();
});

test('object', function(t) {
  v.object()({});
  t.throws(function() { v.object()(null) });
  t.throws(function() { v.object()('foo') });
  t.end();
});

test('array', function(t) {
  v.array()([]);
  t.throws(function() { v.array()({}) });
  t.end();
});

test('buffer', function(t) {
  v.buffer()(new Buffer([]));
  t.throws(function() { v.buffer()({}) });
  t.end();
});

test('equal', function(t) {
  v.equal('foo')('foo');
  v.equal(4)(4);

  v.equal({ gt: 4 })(6);
  v.equal({ gt: 'a' })('b');

  v.equal({ lt: 7 })(6);
  v.equal({ lt: 'b' })('a');

  var thrown = false;
  try {
    v.equal(1)(2);
  } catch(e) {
    thrown = true;
    t.equal(e.message, 'not equal. expected: 1, is: 2');
  } finally {
    t.assert(thrown);
  }

  t.throws(function() { v.equal('1')(1) });
  t.throws(function() { v.equal({ gt: 4 })(3) });
  t.throws(function() { v.equal({ gt: 'b' })('a') });
  t.end();
});

test('notEqual', function(t) {
  v.notEqual('1')(1);
  v.notEqual({ gt: 3, lt: 5 })(6);
  t.throws(function() { v.notEqual('1')('1') });
  t.end();
});

test('match', function(t) {
  v.match(/foo/)('foo');
  t.throws(function() { v.match(/foo/)('f') });
  t.end();
});

test('notMatch', function(t) {
  v.notMatch(/foo/)('f');
  t.throws(function() { v.notMatch(/foo/)('foo') });
  t.end();
});

test('hasKey', function(t) {
  v.hasKey('a')({a:'b'});
  t.throws(function() { v.hasKey('b')({a:'b'}) });
  t.end();
});

test('len', function(t) {
  v.len(13)('aaaaaaaaaaaaa');
  v.len({ gt: 3 })('aaaaa');
  v.len({ lte: 10 })('aaaaa');
  v.len({ gt: 3, lte: 10 })('aaaaa');

  t.throws(function() {
    v.len(13)('a');
    v.len({ gt: 3 })('a');
    v.len({ lte: 3 })('aaaaa');
    v.len({ gt: 3, lte: 10 })('a');
  });

  t.end();
});

test('of', function(t) {
  v.of(['foo', 'bar'])('foo');
  t.throws(function() { v.of(['foo'])('bar') });
  t.end();
});

test('integration', function(t) {
  v.of(['foo']).len(3).match(/^foo$/)
  .notEqual('bar').equal('foo').string()('foo');

  t.ok(true);
  t.end();
});
