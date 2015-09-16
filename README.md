
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

### .number()
### .string()
### .boolean()
### .object()
### .array()
### .buffer()

### .equal(value)
### .notEqual(value)

### .match(reg)
### .notMatch(reg)

### .hasKey(key)
### .len(length)

### .of(array)
### .notOf(array)

### .each(fn)

### .valid()
### .errors

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
