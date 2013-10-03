var methods = [
  'optional',
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'buffer',
  'len',
  'equal',
  'notEqual',
  'match',
  'notMatch',
  'hasKey',
  'of',
  'rules'
];

methods.forEach(function(m) {
  exports[m] = function() {
    return V(m, [].slice.call(arguments));
  }
});

function V(m, args) {
  var optional = false;
  
  var src = {
    pre: '(function(){',
    optional: '',
    checks: [],
    post: '})();'
  };
  var check = src.checks.push.bind(src.checks);

  function v(arg) {
    new Function('arg', 'Buffer', v.src())(arg, Buffer);
  }

  v.src = function() {
    return [
      src.pre,
      src.optional,
      src.checks.join('\n'),
      src.post
    ].join('\n');
  };

  v.optional = c(function() {
    src.optional = 'if (typeof arg == "undefined") return';
  });

  v.rules = c(function(rules) {
    Object.keys(rules).forEach(function(key) {
      var rule = rules[key];
      var _src = 'with({arg:arg.' + key + '}) {' + rule.src() + '}';
      check(_src);
    });
  });

  v.string = c(function() {
    check(
      'if (typeof arg != "string") throw new Error("string required")'
    );
  });

  v.number = c(function() {
    check(
      'if (typeof arg != "number") throw new Error("number required")'
    );
  });

  v.boolean = c(function() {
    check(
      'if (typeof arg != "boolean") throw new Error("boolean required")'
    );
  });

  v.object = c(function() {
    check(
      'if (typeof arg != "object" || arg == null) '+
      'throw new Error("object required")'
    );
  });

  v.array = c(function() {
    check(
      'if (!Array.isArray(arg)) throw new Error("array required")'
    );
  });

  v.buffer = c(function() {
    check(
      'if (!(arg instanceof Buffer)) throw new Error("buffer required")'
    );
  });

  v.len = c(function(len) {
    if (typeof len == 'number') {
      check(
        'if (arg.length != ' + len + ') throw new Error("wrong length")'
      );
    } else {
      if (len.gt) {
        check(
          'if (arg.length <= ' + len.gt + ') throw new Error("too short")'
        );
      }
      if (len.gte) {
        check(
          'if (arg.length < ' + len.gte + ') throw new Error("too short")'
        );
      }
      if (len.lt) {
        check(
          'if (arg.length >= ' + len.lt + ') throw new Error("too long")'
        );
      }
      if (len.lte) {
        check(
          'if (arg.length > ' + len.lte + ') throw new Error("too long")'
        );
      }
    }
  });

  v.equal = c(function(val) {
    if (typeof val != 'object') {
      check(
        'if (arg !== ' + JSON.stringify(val) + ') '+
        'throw new Error("not equal")'
      );
    } else {
      if (val.gt) {
        check(
          'if (arg <= ' + JSON.stringify(val.gt) + ') '+
          'throw new Error("too low")'
        );
      }
      if (val.gte) {
        check(
          'if (arg < ' + JSON.stringify(val.gte) + ') '+
          'throw new Error("too low")'
        );
      }
      if (val.lt) {
        check(
          'if (arg >= ' + JSON.stringify(val.lt) + ') '+
          'throw new Error("too high")'
        );
      }
      if (val.lte) {
        check(
          'if (arg > ' + JSON.stringify(val.lte) + ') '+
          'throw new Error("too high")'
        );
      }
    }
  });

  v.notEqual = c(function(val) {
    if (typeof val != 'object') {
      check(
        'if (arg === ' + JSON.stringify(val) + ') throw new Error("equal")'
      );
    } else {
      var segs = [];
      if ('gt' in val) {
        segs.push('arg > ' + JSON.stringify(val.gt));
      }
      if ('gte' in val) {
        segs.push('arg >= ' + JSON.stringify(val.gte));
      }
      if ('lt' in val) {
        segs.push('arg < ' + JSON.stringify(val.lt));
      }
      if ('lte' in val) {
        segs.push('arg <= ' + JSON.stringify(val.lte));
      }

      var cond = segs.join(' && ');

      if ('gt' in val && 'lt' in val
        || 'gt' in val && 'lte' in val
        || 'gte' in val && 'lt' in val
        || 'gte' in val && 'lte' in val
      ) {
        check('if (' + cond + ') throw new Error("not equal")');
      } else if ('gt' in val || 'gte' in val) {
        check('if (' + cond + ') throw new Error("too high")');
      } else {
        check('if (' + cond + ') throw new Error("too low")');
      }
    }
  });

  v.match = c(function(reg) {
    check(
      'if (!' + reg.toString() + '.test(arg)) '+
      'throw new Error("doesn\'t match")'
    );
  });

  v.notMatch = c(function(reg) {
    check(
      'if (' + reg.toString() + '.test(arg)) '+
      'throw new Error("does match")'
    );
  });

  v.hasKey = c(function(key) {
    check(
      'if (!(' + JSON.stringify(key) + ' in arg)) '+
      'throw new Error("doesn\'t have key")'
    );
  });

  v.of = c(function(arr) {
    check(
      'if (' + JSON.stringify(arr) + '.indexOf(arg) == -1) '+
      'throw new Error("not in array")'
    );
  });

  v[m].apply(null, args);

  return v;
}

function c(fn) {
  return function() {
    fn.apply(null, arguments);
    return this;
  }
}
