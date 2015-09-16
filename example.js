var v = require('./');

log(v().number()(13));
log(v().number()('foo'));

log(v().string()('string'));
log(v().string()(13));

log(v().boolean()(true));
log(v().boolean()('string'));

log(v().object()({}));
log(v().object()([]));

log(v().array()([]));
log(v().array()({}));

log(v().buffer()(new Buffer(0)));
log(v().buffer()({}));

log(v().equal('foo')('foo'));
log(v().equal('foo')('bar'));

log(v().notEqual('foo')('bar'));
log(v().notEqual('foo')('foo'));

log(v().match(/foo/)('foo'));
log(v().match(/foo/)('bar'));

log(v().notMatch(/foo/)('bar'));
log(v().notMatch(/foo/)('foo'));

log(v().hasKey('foo')({ foo: 'bar' }));
log(v().hasKey('foo')({ beep: 'boop' }));

log(v().object().hasKey('foo')({ foo: 'bar' }));
log(v().object().hasKey('foo')(13));

log(v().len(13)('aaaaaaaaaaaaa'));
log(v().len(13)('aaaaaaaaaaaa'));

log(v().of(['foo', 'bar'])('foo'));
log(v().of(['foo', 'bar'])('baz'));

log(v().notOf(['foo', 'bar'])('baz'));
log(v().notOf(['foo', 'bar'])('foo'));

log(v().len({ gt: 3 })('aaaaaaaaaaaaa'));
log(v().len({ gt: 3 })('a'));

log(v().equal({ gt: 3 })(4));
log(v().equal({ gt: 3 })(3));

log(v().notEqual({ gt: 3 })(3));
log(v().notEqual({ gt: 3 })(4));

log(v().each(v().string())(['foo', 'bar']));
log(v().each(v().string())(['foo', 13]));

function log(val){
  console.log(val.errors);
}
