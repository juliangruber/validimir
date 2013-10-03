var v = require('..');
var test = require('tape');

test('src', function(t) {
  t.equal(v.string().src(),
    '(function(){\n\nif (typeof arg != \"string\") '+
      'throw new Error(\"string required\")\n})();');
  t.end();
});
