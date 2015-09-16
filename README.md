
# validimir

Minimalistic validation functions with a fluid api, to be used with flexible model layers or as standalone.

[![build status](https://secure.travis-ci.org/juliangruber/validimir.png)](http://travis-ci.org/juliangruber/validimir)

[![testling badge](https://ci.testling.com/juliangruber/validimir.png)](https://ci.testling.com/juliangruber/validimir)

## Example

```js
var v = require('validimir');

var fn = v().object().hasKey('foo').each(v().string());

fn({ foo: 'bar', beep: 'boop' });
// => { errors: [] }

fn({ foo: 'bar', beep: 2 });
// => { errors: [{ value: 2, operator: 'string', actual: 'number' }] }

fn({ beep: 2 });
// => { errors: [
//      { value: 2, operator: 'string', actual: 'number' },
//      { value: { beep: 2 }, operator: 'hasKey', excepted: 'foo' }
//     ]}
```

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install validimir
```

## API

### v()

  Create a new validation function.

### .number()
### .string()
### .boolean()
### .object()
### .array()
### .buffer()

  Assert value is of given type. Types are exact, so `.array()` won't accept an object and vice verse.

### .equal(value)
### .notEqual(value)

  Assert value is (or not) equal to `value`. [ltgt](http://npmjs.org/package/ltgt) ranges can be used as well.

### .match(reg)
### .notMatch(reg)

  Assert value matches (or doesn't match) regular expression `reg`.

### .hasKey(key)

  Assert object value has key `key`.

### .len(length)

  Assert value is of length `length`. [ltgt](http://npmjs.org/package/ltgt) ranges can be used as well.

### .of(array)
### .notOf(array)

  Assert value can (or can't) be found in `array`.

### .each(fn)

  Assert each of value - no matter whether it's an array or object - passes `fn` with should be a function returned by validimir or an api compatible module.

### .errors

  Array of errors objects found validating value.

### .valid()

  Helper function asserting `.errors.length === 0`.

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
