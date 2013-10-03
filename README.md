
# validimir

Create validation functions.

[![build status](https://secure.travis-ci.org/juliangruber/validimir.png)](http://travis-ci.org/juliangruber/validimir)

[![testling badge](https://ci.testling.com/juliangruber/validimir.png)](https://ci.testling.com/juliangruber/validimir)

## Idea

* compile validation functions once, run them on every request
* handle string ranges, so works well with LevelDBs

```js
v.equal({ gte: 'post!', lte: 'post!~' })('post!1337');
```

* fluent api, so it's flexible and pleasant

```js
v.len(3).match(/^foo$/).notEqual('bar').string()('foo');
```

* on error, throw

This is the error output from

```js
v.equal({ gt: 3 })(2);
```

```bash
if (arg <= 3) throw new Error("too low")
                    ^
Error: too low
```

## Usage

```js
var v = require('validimir');

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

test('each', function(t) {
  var validate = v.each(v.string());

  validate(['foo', 'bar']);
  validate({ foo: 'foo', bar: 'bar' })
  t.throws(function() { validate(['foo', 13]) });
  t.throws(function() { validate({ foo: 13 }) });

  t.end();
});

test('index', function(t) {
  var validate = v.each(v.number().equal(v.index()));

  validate([0, 1]);
  t.throws(function() { validate([0, 2]) });

  t.end();
});
```

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install validimir
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
