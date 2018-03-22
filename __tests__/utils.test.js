const utils = require('../src/utils');
const MetaObject = require('../src/meta-object');

describe('addPrefixMethods', () => {
  it('should work', () => {
    class TestClass extends MetaObject {
      methodMissing(name) {
        return value => name + (value || '');
      }
    }

    utils.addPrefixMethods(TestClass, ['small', 'large'], function(
      innerMethod,
      prefix,
      value
    ) {
      return this[innerMethod](prefix + (value || ''));
    });
    const test = new TestClass();
    expect(test.foobar()).toEqual('foobar');
    expect(test.smallFoobar()).toEqual('foobarsmall');
    expect(test.largeSmallFoobar()).toEqual('foobarsmalllarge');
  });
});

describe('addSuffixMethods', () => {
  it('should work', () => {
    class TestClass extends MetaObject {
      methodMissing(name) {
        return value => name + (value || '');
      }
    }

    utils.addSuffixMethods(TestClass, ['color', 'width'], function(
      innerMethod,
      suffix,
      value
    ) {
      return this[innerMethod](suffix + (value || ''));
    });
    const test = new TestClass();
    expect(test.foobar()).toEqual('foobar');
    expect(test.foobarColor()).toEqual('foobarcolor');
    expect(test.foobarColorWidth()).toEqual('foobarcolorwidth');
  });
});

describe('add both suffix and prefix', () => {
  it('should work', () => {
    class TestClass extends MetaObject {
      methodMissing(name) {
        return value => name + (value || '');
      }
    }

    utils.addSuffixMethods(TestClass, ['color', 'width'], function(
      innerMethod,
      suffix,
      value
    ) {
      return this[innerMethod](suffix + (value || ''));
    });
    utils.addPrefixMethods(TestClass, ['small', 'large'], function(
      innerMethod,
      prefix,
      value
    ) {
      return this[innerMethod](prefix + (value || ''));
    });
    const test = new TestClass();
    expect(test.foobar()).toEqual('foobar');
    expect(test.foobarColor()).toEqual('foobarcolor');
    expect(test.smallFoobar()).toEqual('foobarsmall');
    expect(test.smallFoobarColor()).toEqual('foobarcolorsmall');
  });
});

describe('add non-function properties', () => {
  it('should work', () => {
    class TestClass extends MetaObject {
      methodMissing(name) {
        return name;
      }
    }

    utils.addSuffixMethods(TestClass, ['color', 'width'], 'suffixed');
    utils.addPrefixMethods(TestClass, ['small', 'large'], 'prefixed');

    const test = new TestClass();
    expect(test.foobar).toEqual('foobar');
    expect(test.foobarColor).toEqual('suffixed');
    expect(test.smallFoobar).toEqual('prefixed');
    expect(test.smallFoobarColor).toEqual('prefixed');
  });
});
