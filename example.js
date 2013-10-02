var v = require('./');

v.number()(13);
v.string()('string');
v.boolean()(true);
v.object()({});
v.array()([]);
v.buffer()(new Buffer([0]));
v.equal('foo')('foo');
v.notEqual('foo')('bar');
v.match(/foo/)('foo');
v.notMatch(/foo/)('bar');
v.hasKey('a')({a:'b'});

v.object().hasKey('a')({a:'b'});

v.len(13)('aaaaaaaaaaaaa');
v.len({ gt: 3 })('aaaaa');
v.len({ lte: 10 })('aaaaa');
v.len({ gt: 3, lte: 10 })('aaaaa');

v.equal(4)(4);
v.equal('foo')('foo');

v.equal({ gt: 4 })(6);
v.equal({ gt: 'a' })('b');

v.equal({ lt: 7 })(6);
v.equal({ lt: 'b' })('a');

v.notEqual({ gt: 3, lt: 5 })(6);

v.of(['foo', 'bar'])('foo');
