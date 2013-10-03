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
  'of'
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
    checks: '',
    post: '})();'
  };

  function v(arg) {
    new Function('arg', 'Buffer', v.src())(arg, Buffer);
  }

  v.rules = function(rules) {
    return this;
  };

  v.src = function() {
    return Object.keys(src).reduce(function(acc, key) {
      return acc += src[key];
    }, '');
  };

  v.optional = function() {
    src.optional = 'if (typeof arg == "undefined") return\n';
    return this;
  };

  v.string = function() {
    src.checks +=
      'if (typeof arg != "string") throw new Error("string required")\n';
    return this;
  }

  v.number = function() {
    src.checks +=
      'if (typeof arg != "number") throw new Error("number required")\n';
    return this;
  };

  v.boolean = function() {
    src.checks +=
      'if (typeof arg != "boolean") throw new Error("boolean required")\n';
    return this;
  };

  v.object = function() {
    src.checks +=
      'if (typeof arg != "object" || arg == null) '+
      'throw new Error("object required")\n';
    return this;
  };

  v.array = function() {
    src.checks +=
      'if (!Array.isArray(arg)) throw new Error("array required")\n';
    return this;
  };

  v.buffer = function() {
    src.checks +=
      'if (!(arg instanceof Buffer)) throw new Error("buffer required")\n';
    return this;
  };

  v.len = function(len) {
    if (typeof len == 'number') {
      src.checks +=
        'if (arg.length != ' + len + ') throw new Error("wrong length")\n';
    } else {
      if (len.gt) {
        src.checks +=
          'if (arg.length <= ' + len.gt + ') throw new Error("too short")\n';
      }
      if (len.gte) {
        src.checks +=
          'if (arg.length < ' + len.gte + ') throw new Error("too short")\n';
      }
      if (len.lt) {
        src.checks +=
          'if (arg.length >= ' + len.lt + ') throw new Error("too long")\n';
      }
      if (len.lte) {
        src.checks +=
          'if (arg.length > ' + len.lte + ') throw new Error("too long")\n';
      }
    }
    return this;
  };

  v.equal = function(val) {
    if (typeof val != 'object') {
      src.checks +=
        'if (arg !== ' + JSON.stringify(val) + ') '+
        'throw new Error("not equal")\n';
    } else {
      if (val.gt) {
        src.checks +=
          'if (arg <= ' + JSON.stringify(val.gt) + ') '+
          'throw new Error("too low")\n';
      }
      if (val.gte) {
        src.checks +=
          'if (arg < ' + JSON.stringify(val.gte) + ') '+
          'throw new Error("too low")\n';
      }
      if (val.lt) {
        src.checks +=
          'if (arg >= ' + JSON.stringify(val.lt) + ') '+
          'throw new Error("too high")\n';
      }
      if (val.lte) {
        src.checks +=
          'if (arg > ' + JSON.stringify(val.lte) + ') '+
          'throw new Error("too high")\n';
      }
    }
    return this;
  };

  v.notEqual = function(val) {
    if (typeof val != 'object') {
      src.checks +=
        'if (arg === ' + JSON.stringify(val) + ') throw new Error("equal")\n';
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
        || 'gte' in val && 'lte' in val) {
        src.checks += 'if (' + cond + ') throw new Error("not equal")\n';
      } else if ('gt' in val || 'gte' in val) {
        src.checks += 'if (' + cond + ') throw new Error("too high")\n';
      } else {
        src.checks += 'if (' + cond + ') throw new Error("too low")\n';
      }
    }
    return this;
  };

  v.match = function(reg) {
    src.checks +=
      'if (!' + reg.toString() + '.test(arg)) '+
      'throw new Error("doesn\'t match")\n';
    return this;
  };

  v.notMatch = function(reg) {
    src.checks +=
      'if (' + reg.toString() + '.test(arg)) '+
      'throw new Error("does match")\n';
    return this;
  };

  v.hasKey = function(key) {
    src.checks +=
      'if (!(' + JSON.stringify(key) + ' in arg)) '+
      'throw new Error("doesn\'t have key")\n';
    return this;
  };

  v.of = function(arr) {
    src.checks +=
      'if (' + JSON.stringify(arr) + '.indexOf(arg) == -1) '+
      'throw new Error("not in array")\n'
    return this;
  };

  v[m].apply(null, args);

  return v;
}

