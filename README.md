
# validimir

Minimalistic validation functions with a fluid api, to be used with flexible model layers or as standalone.

[![build status](https://secure.travis-ci.org/juliangruber/validimir.png)](http://travis-ci.org/juliangruber/validimir)
[![Dependency Status](https://david-dm.org/juliangruber/validimir.svg)](https://david-dm.org/juliangruber/validimir)
[![Coverage Status](https://coveralls.io/repos/juliangruber/validimir/badge.svg?branch=master&service=github)](https://coveralls.io/github/juliangruber/validimir?branch=master)

## Example

```js
var v = require('validimir');

var fn = v().object().hasKey('foo').each(v().string());

fn({ foo: 'bar', beep: 'boop' });
// => { errors: [] }

fn({ foo: 'bar', beep: 2 });
// => { errors: [{
//      value: 2,
//      operator: 'string',
//      actual: 'number',
//      message: 'Expected a string but got a number'
//    }] }

fn({ beep: 2 });
// => { errors: [
//      {
//        value: 2,
//        operator: 'string',
//        actual: 'number',
//        message: 'Expected a string but got a number'
//      },
//      {
//        value: { beep: 2 },
//        operator: 'hasKey',
//        excepted: 'foo',
//        message: 'Expected {"beep":2} to have key foo'
//      }
//    ]}
```

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install validimir
```

## API

  Validimir will provide you with a useable `.message` for errors, or you can pass in your own to each method.

### v()

  Create a new validation function.

### .number([message])
### .string([message])
### .boolean([message])
### .object([message])
### .array([message])
### .buffer([message])
### .date([message])

  Assert value is of given type. Types are exact, so `.array()` won't accept an object and vice versa.

### .email([message])

  Assert value is a valid email. The regular expression used is:

```
/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/
```

### .equal(value[, message])
### .notEqual(value[, message])

  Assert value is (or not) equal to `value`. [ltgt](http://npmjs.org/package/ltgt) ranges can be used as well.

### .match(reg[, message])
### .notMatch(reg[, message])

  Assert value matches (or doesn't match) regular expression `reg`.

### .hasKey(key[, message])

  Assert object value has key `key`.

### .len(length[, message])

  Assert value is of length `length`. [ltgt](http://npmjs.org/package/ltgt) ranges can be used as well.

### .of(array[, message])
### .notOf(array[, message])

  Assert value can (or can't) be found in `array`.

### .each(fn)

  Assert each of value - no matter whether it's an array or object - passes `fn` with should be a function returned by validimir or an api compatible module.

### .addCheck(name, fn)

  Add custom validator.

  This function adds a new validator `fn` under `name` and returns it to add it immediately if desired.

  A validator is a function that gets two arguments:
  - `expected`: The expected value. Used only on validators that need an `expected` value to check against.
  - `msg` (optional): The error message to display in case of failure

  The validation returns another function that gets the value to be checked, runs the check and returns either nothing (or any falsy value) on success or an error object on failure with the following properties:
  - `value`: The value that didn't pass the validation
  - `operator`: The name of the operator that failed. Ideally the same one as the `name` argument passed to `addCheck`)
  - `message`: Error messsage. Either a default value or the `msg` argument if passed
  - `expected`: The expected value (if passed to the validator)

  Example:

```js
var v = require('validimir');
var isIP = require('validator').isIP
var fn = v()
fn.addCheck('ip', function(msg) {
  return function(value) {
    if (!isIP(value)) {
      return {
        value: value,
        operator: 'ip',
        message: msg || 'Expected a valid IP address'
      }
    }
  }
})()

fn('not an ip')
// { errors:
//    [ { value: 'not an ip',
//        operator: 'ip',
//        message: 'Expected a valid IP address' } ],
//   valid: [Function] }

fn('127.0.0.1')
// { errors: [], valid: [Function] }
```

### .errors

  Array of errors objects found validating value. Accessible on the result of calling the validation function, e.g.

```js
var v = require('validimir');
v().number()(13).errors
```

### .valid()

  Helper function asserting `.errors.length === 0`. Accessible on the result of calling the validation function, e.g.

```js
var v = require('validimir');
v().string()('13').valid()
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
