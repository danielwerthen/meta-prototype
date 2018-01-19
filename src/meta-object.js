function MetaObject() {

}

MetaObject.prototype = new Proxy(MetaObject.prototype, {
  get(target, property, receiver) {
    if (Reflect.has(receiver, property)) {
      return target[property]
    }
    if (Reflect.has(receiver, 'methodMissing')) {
      return receiver.methodMissing(property)
    }
  }
});

module.exports = MetaObject;
