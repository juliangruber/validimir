var v = require('..');
var test = require('tape');

test('src', function(t) {
  t.equal(v.string().src(),
    '(function(){'+
      '\n  if (typeof arg != \"string\") '+
      'throw new Error((typeof key == \'undefined\'?\'\':key) + '+
      '\"string required\")\n})();');
  t.end();
});
