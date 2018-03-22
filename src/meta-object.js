'use strict';

function MetaObject() {}

MetaObject.prototype = new Proxy(MetaObject.prototype, {
  get(target, property, receiver) {
    if (Reflect.has(receiver, 'methodMissing')) {
      var method = receiver.methodMissing(property);
      if (method !== void 0) {
        Reflect.defineProperty(Reflect.getPrototypeOf(receiver), property, {
          value: method,
        });
      }
      return method;
    }
  },
});

module.exports = MetaObject;
