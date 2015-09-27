var type = require('component-type');
var ltgt = require('ltgt');
var fmt = require('util').format;

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

  v.equal = function(expected){
    if (typeof expected == 'object') {
      checks.push(function(v){
        if (!ltgt.contains(expected, v)) return {
          value: v,
          operator: 'equal',
          expected: expected
        };
      });
    } else {
      checks.push(function(v){
        if (v !== expected) return {
          value: v,
          operator: 'equal',
          expected: expected
        };
      });
    }
    return v;
  };

  v.notEqual = function(notExpected){
    if (typeof notExpected == 'object') {
      checks.push(function(v){
        if (ltgt.contains(notExpected, v)) return {
          value: v,
          operator: 'notEqual',
        };
      });
    } else {
      checks.push(function(v){
        if (v === notExpected) return {
          value: v,
          operator: 'notEqual',
        };
      });
    }
    return v;
  };

  v.match = function(reg){
    checks.push(function(v){
      if (!reg.test(v)) return {
        value: v,
        operator: 'match',
        expected: reg
      };
    });
    return v;
  };

  v.notMatch = function(reg){
    checks.push(function(v){
      if (reg.test(v)) return {
        value: v,
        operator: 'notMatch'
      };
    });
    return v;
  };

  v.hasKey = function(k){
    checks.push(function(o){
      if (type(o) != 'object' || !(k in o)) return {
        value: o,
        operator: 'hasKey',
        expected: k
      };
    });
    return v;
  };

  v.len = function(l){
    if (typeof l == 'number') {
      checks.push(function(s){
        if (s.length != l) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: s.length
        };
      });
    } else {
      checks.push(function(s){
        if (!ltgt.contains(l, s.length)) return {
          value: s,
          operator: 'len',
          expected: l,
          actual: s.length
        };
      });
    }
    return v;
  };

  v.of = function(arr){
    checks.push(function(v){
      if (arr.indexOf(v) == -1) return {
        value: v,
        operator: 'of',
        expected: arr
      };
    });
    return v;
  };

  v.notOf = function(arr){
    checks.push(function(v){
      if (arr.indexOf(v) > -1) return {
        value: v,
        operator: 'notOf',
        expected: arr
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

