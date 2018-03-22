'use strict';

function wrapMethodMissing(Class, fn) {
  var prototype = Class.prototype;
  var inner = prototype.methodMissing;
  Reflect.defineProperty(prototype, 'methodMissing', {
    value: function methodMissing(name) {
      var result = fn(name);
      if (result === undefined) {
        return inner(name);
      }
      return result;
    },
    writable: true,
    enumerable: true,
  });
}

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function decapitalize(str) {
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}

function addPrefixMethods(Class, prefixes, handler) {
  wrapMethodMissing(Class, function prefixedMethodMissing(methodName) {
    if (typeof methodName === 'symbol') {
      return undefined;
    }
    var match = prefixes.find(function(item) {
      return methodName.startsWith(item) && methodName.length > item.length;
    });
    if (!match) {
      return undefined;
    }
    var innerMethodName = decapitalize(methodName.substr(match.length));
    if (typeof handler === 'function') {
      return function prefixedMethod(value) {
        return handler.call(this, innerMethodName, match, value);
      };
    }
    return handler;
  });
}

function addSuffixMethods(Class, suffixes, handler) {
  var cleanedSuffixes = suffixes.map(function(item) {
    return [capitalize(item), item];
  });
  wrapMethodMissing(Class, function prefixedMethodMissing(methodName) {
    if (typeof methodName === 'symbol') {
      return undefined;
    }
    var match = cleanedSuffixes.find(function(item) {
      return methodName.endsWith(item[0]) && methodName.length > item[0].length;
    });
    if (!match) {
      return undefined;
    }
    var innerMethodName = methodName.substr(
      0,
      methodName.length - match[1].length
    );
    if (typeof handler === 'function') {
      return function suffixedMethod(value) {
        return handler.call(this, innerMethodName, match[1], value);
      };
    }
    return handler;
  });
}

module.exports = {
  wrapMethodMissing: wrapMethodMissing,
  addPrefixMethods: addPrefixMethods,
  addSuffixMethods: addSuffixMethods,
};
