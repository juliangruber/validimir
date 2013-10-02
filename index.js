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


  function v(arg) {
    if (arg === undefined) {
      if (optional) {
        return;
      } else {
        throw new Error('required');
      }
    }

    new Function('arg', 'Buffer', v.src + '})();')(arg, Buffer);
  }

  v.src  = '(function(){';

  v.optional = function() {
    optional = true;
    return this;
  };

  v.string = function() {
    v.src +=
      'if (typeof arg != "string") throw new Error("string required")\n';
    return this;
  }

  v.number = function() {
    v.src +=
      'if (typeof arg != "number") throw new Error("number required")\n';
    return this;
  };

  v.boolean = function() {
    v.src +=
      'if (typeof arg != "boolean") throw new Error("boolean required")\n';
    return this;
  };

  v.object = function() {
    v.src +=
      'if (typeof arg != "object" || arg == null) '+
      'throw new Error("object required")\n';
    return this;
  };

  v.array = function() {
    v.src +=
      'if (!Array.isArray(arg)) throw new Error("array required")\n';
    return this;
  };

  v.buffer = function() {
    v.src +=
      'if (!(arg instanceof Buffer)) throw new Error("buffer required")\n';
    return this;
  };

  v.len = function(len) {
    if (typeof len == 'number') {
      v.src +=
        'if (arg.length != ' + len + ') throw new Error("wrong length")\n';
    } else {
      if (len.gt) {
        v.src +=
          'if (arg.length <= ' + len.gt + ') throw new Error("too short")\n';
      }
      if (len.gte) {
        v.src +=
          'if (arg.length < ' + len.gte + ') throw new Error("too short")\n';
      }
      if (len.lt) {
        v.src +=
          'if (arg.length >= ' + len.lt + ') throw new Error("too long")\n';
      }
      if (len.lte) {
        v.src +=
          'if (arg.length > ' + len.lte + ') throw new Error("too long")\n';
      }
    }
    return this;
  };

  v.equal = function(val) {
    if (typeof val != 'object') {
      v.src +=
        'if (arg !== ' + JSON.stringify(val) + ') '+
        'throw new Error("not equal")\n';
    } else {
      if (val.gt) {
        v.src +=
          'if (arg <= ' + JSON.stringify(val.gt) + ') '+
          'throw new Error("too low")\n';
      }
      if (val.gte) {
        v.src +=
          'if (arg < ' + JSON.stringify(val.gte) + ') '+
          'throw new Error("too low")\n';
      }
      if (val.lt) {
        v.src +=
          'if (arg >= ' + JSON.stringify(val.lt) + ') '+
          'throw new Error("too high")\n';
      }
      if (val.lte) {
        v.src +=
          'if (arg > ' + JSON.stringify(val.lte) + ') '+
          'throw new Error("too high")\n';
      }
    }
    return this;
  };

  v.notEqual = function(val) {
    if (typeof val != 'object') {
      v.src +=
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
        v.src += 'if (' + cond + ') throw new Error("not equal")\n';
      } else if ('gt' in val || 'gte' in val) {
        v.src += 'if (' + cond + ') throw new Error("too high")\n';
      } else {
        v.src += 'if (' + cond + ') throw new Error("too low")\n';
      }
    }
    return this;
  };

  v.match = function(reg) {
    v.src +=
      'if (!' + reg.toString() + '.test(arg)) '+
      'throw new Error("doesn\'t match")\n';
    return this;
  };

  v.notMatch = function(reg) {
    v.src +=
      'if (' + reg.toString() + '.test(arg)) '+
      'throw new Error("does match")\n';
    return this;
  };

  v.hasKey = function(key) {
    v.src +=
      'if (!(' + JSON.stringify(key) + ' in arg)) '+
      'throw new Error("doesn\'t have key")\n';
    return this;
  };

  v.of = function(arr) {
    v.src +=
      'if (' + JSON.stringify(arr) + '.indexOf(arg) == -1) '+
      'throw new Error("not in array")\n'
    return this;
  };

  v[m].apply(null, args);

  return v;
}

