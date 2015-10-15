var type = require('component-type');
var ltgt = require('ltgt');
var fmt = require('util').format;
var toInterval = require('ltgt-to-interval');

module.exports = function V(){
  var checks = [];
  var v = function(value){
    var errors = [];
    checks.forEach(function(check){
      var errs = check(value);
      if (!errs) return;
      if (!Array.isArray(errs)) errs = [errs];
      errs.forEach(function(err){ errors.push(err) });
    });
    return {
      errors: errors,
      valid: function() {
        return errors.length == 0;
      }
    };
  };

  var types = 'number string boolean object array buffer date'.split(' ');
  types.forEach(function(t){
    v[t] = function(msg){
      checks.push(function(v){
        if (type(v) != t) return {
          value: v,
          operator: t,
          actual: type(v),
          message: msg || fmt('Expected a %s but got a %s', t, type(v))
        };
      });
      return v;
    };
  });

  v.email = function(msg){
    checks.push(function(e){
      if (!/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(e)) return {
        value: e,
        operator: 'email',
        message: msg || 'Expected a valid email address'
      };
    });
    return v;
  };

  v.equal = function(expected, msg){
    if (typeof expected == 'object') {
      checks.push(function(v){
        if (!ltgt.contains(expected, v)) return {
          value: v,
          operator: 'equal',
          expected: expected,
          message: msg || fmt('Expected a value in range %s', toInterval(expected))
        };
      });
    } else {
      checks.push(function(v){
        if (v !== expected) return {
          value: v,
          operator: 'equal',
          expected: expected,
          message: msg || fmt('Expected %j to equal %j', v, expected)
        };
      });
    }
    return v;
  };

  v.notEqual = function(notExpected, msg){
    if (typeof notExpected == 'object') {
      checks.push(function(v){
        if (ltgt.contains(notExpected, v)) return {
          value: v,
          operator: 'notEqual',
          message: msg
            || fmt('Expected a value outside range %s', toInterval(notExpected))
        };
      });
    } else {
      checks.push(function(v){
        if (v === notExpected) return {
          value: v,
          operator: 'notEqual',
          message: msg || fmt('Expected %j not to equal %j', v, notExpected)
        };
      });
    }
    return v;
  };

  v.match = function(reg, msg){
    checks.push(function(v){
      if (!reg.test(v)) return {
        value: v,
        operator: 'match',
        expected: reg,
        message: msg || fmt('Expected %j to match %s', v, reg)
      };
    });
    return v;
  };

  v.notMatch = function(reg, msg){
    checks.push(function(v){
      if (reg.test(v)) return {
        value: v,
        operator: 'notMatch',
        message: msg || fmt('Expected %j not to match %s', v, reg)
      };
    });
    return v;
  };

  v.hasKey = function(k, msg){
    checks.push(function(o){
      if (type(o) != 'object' || !(k in o)) return {
        value: o,
        operator: 'hasKey',
        expected: k,
        message: msg || fmt('Expected %j to have key %s', o, k)
      };
    });
    return v;
  };

  v.len = function(l, msg){
    if (typeof l == 'number') {
      checks.push(function(s){
        if (s == null) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: 'no length property'
        }
        if (s.length != l) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: s.length,
          message: msg || fmt('Expected %j to have length %s', s, l)
        };
      });
    } else {
      checks.push(function(s){
        if (s == null) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: 'no length property'
        }
        if (!ltgt.contains(l, s.length)) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: s.length,
          message: msg
            || fmt('Expected %j to be of length %s', s, toInterval(l))
        };
      });
    }
    return v;
  };

  v.of = function(arr, msg){
    checks.push(function(v){
      if (arr.indexOf(v) == -1) return {
        value: v,
        operator: 'of',
        expected: arr,
        message: msg || fmt('Expected %j to be of %j', v, arr)
      };
    });
    return v;
  };

  v.notOf = function(arr, msg){
    checks.push(function(v){
      if (arr.indexOf(v) > -1) return {
        value: v,
        operator: 'notOf',
        expected: arr,
        message: msg || fmt('Expected %j not to be of %j', v, arr)
      };
    });
    return v;
  };

  v.each = function(fn){
    checks.push(function(o){
      var errors = [];
      Object.keys(o).forEach(function(key){
        var errs = fn(o[key]).errors;
        errs.forEach(function(err) { errors.push(err) });
      });
      if (errors.length) return errors;
    });
    return v;
  };

  return v;
};

module.exports.putin = function(key, value, cb) {
  cb(new Error('in node, error throws you!'));
};

