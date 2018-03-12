function wrapMethodMissing(Class, fn) {
  const prototype = Class.prototype;
  const inner = prototype.methodMissing;
  prototype.methodMissing = function methodMissing(name) {
    const result = fn(name);
    if (result === undefined) {
      return inner(name);
    }
    return result;
  };
}

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function decapitalize(str) {
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}

function addPrefixedMethod(Class, prefixes, handler) {
  wrapMethodMissing(Class, function prefixedMethodMissing(methodName) {
    if (typeof methodName === 'symbol') {
      return undefined;
    }
    const match = prefixes.find(function(item) {
      return methodName.startsWith(item);
    });
    if (!match) {
      return undefined;
    }
    const innerMethodName = decapitalize(methodName.substr(match.length));
    return function prefixedMethod(value) {
      return this[innerMethodName](handler.call(this, match, value));
    };
  });
}

function addSuffixedMethod(Class, suffixes, handler) {
  const cleanedSuffixes = suffixes.map(function(item) {
    return [capitalize(item), item];
  });
  wrapMethodMissing(Class, function prefixedMethodMissing(methodName) {
    if (typeof methodName === 'symbol') {
      return undefined;
    }
    const match = cleanedSuffixes.find(function(item) {
      return methodName.endsWith(item[0]);
    });
    if (!match) {
      return undefined;
    }
    const innerMethodName = methodName.substr(
      0,
      methodName.length - match[1].length
    );
    return function prefixedMethod(value) {
      return this[innerMethodName](handler.call(this, match[1], value));
    };
  });
}

module.exports = {
  wrapMethodMissing: wrapMethodMissing,
  addPrefixedMethod: addPrefixedMethod,
  addSuffixedMethod: addSuffixedMethod,
};
