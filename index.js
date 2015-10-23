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
  var addCheck = function(op, fn){
    v[op] = function(){
      var check = fn.apply(null, arguments);
      checks.push(check);
      return v;
    };
  };


  addCheck('custom', function(fn) {
    return fn;
  });

  var types = 'number string boolean object array buffer date'.split(' ');
  types.forEach(function(t){
    addCheck(t, function(msg){
      return function(v){
        if (type(v) != t) return {
          value: v,
          operator: t,
          actual: type(v),
          message: msg || fmt('Expected a %s but got a %s', t, type(v))
        };
      };
    });
  });

  addCheck('email', function(msg){
    return function(e){
      var match = type(e) == 'string' && /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(e);
      if (!match) return {
        value: e,
        operator: 'email',
        message: msg || 'Expected a valid email address'
      };
    };
  });

  addCheck('equal', function(expected, msg){
    if (isObj(expected)) {
      return function(v){
        if (!ltgt.contains(expected, v)) return {
          value: v,
          operator: 'equal',
          expected: expected,
          message: msg || fmt('Expected a value in range %s', toInterval(expected))
        };
      };
    } else {
      return function(v){
        if (v !== expected) return {
          value: v,
          operator: 'equal',
          expected: expected,
          message: msg || fmt('Expected %j to equal %j', v, expected)
        };
      };
    }

  });

  addCheck('notEqual', function(notExpected, msg){
    if (isObj(notExpected)) {
      return function(v){
        if (ltgt.contains(notExpected, v)) return {
          value: v,
          operator: 'notEqual',
          message: msg
            || fmt('Expected a value outside range %s', toInterval(notExpected))
        };
      };
    } else {
      return function(v){
        if (v === notExpected) return {
          value: v,
          operator: 'notEqual',
          message: msg || fmt('Expected %j not to equal %j', v, notExpected)
        };
      };
    }
  });

  addCheck('match', function(reg, msg){
    return function(v){
      if (type(v) != 'string' || !reg.test(v)) return {
        value: v,
        operator: 'match',
        expected: reg,
        message: msg || fmt('Expected %j to match %s', v, reg)
      };
    };
  });

  addCheck('notMatch', function(reg, msg){
    return function(v){
      if (type(v) != 'string' || reg.test(v)) return {
        value: v,
        operator: 'notMatch',
        message: msg || fmt('Expected %j not to match %s', v, reg)
      };
    };
  });

  addCheck('hasKey', function(k, msg){
    return function(o){
      if (type(o) != 'object' || !(k in o)) return {
        value: o,
        operator: 'hasKey',
        expected: k,
        message: msg || fmt('Expected %j to have key %s', o, k)
      };
    };
  });

  addCheck('len', function(l, msg){
    if (typeof l == 'number') {
      return function(s){
        if (getLength(s) != l) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: getLength(s),
          message: msg || fmt('Expected %j to have length %s', s, l)
        };
      };
    } else {
      return function(s){
        if (!ltgt.contains(l, getLength(s))) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: getLength(s),
          message: msg
            || fmt('Expected %j to be of length %s', s, toInterval(l))
        };
      };
    }
  });

  addCheck('of', function(arr, msg){
    return function(v){
      if (arr.indexOf(v) == -1) return {
        value: v,
        operator: 'of',
        expected: arr,
        message: msg || fmt('Expected %j to be of %j', v, arr)
      };
    };
  });

  addCheck('notOf', function(arr, msg){
    return function(v){
      if (arr.indexOf(v) > -1) return {
        value: v,
        operator: 'notOf',
        expected: arr,
        message: msg || fmt('Expected %j not to be of %j', v, arr)
      };
    };
  });

  addCheck('each', function(fn){
    return function(o){
      var errors = [];
      Object.keys(o).forEach(function(key){
        var errs = fn(o[key]).errors;
        errs.forEach(function(err) { errors.push(err) });
      });
      if (errors.length) return errors;
    };
  });

  return v;
};

module.exports.putin = function(key, value, cb) {
  cb(new Error('in node, error throws you!'));
};

function getLength(obj){
  return obj != null && typeof obj.length != 'undefined'
    ? obj.length
    : undefined;
}


function isObj(obj) {
  return Object(obj) === obj;
}
