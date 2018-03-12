const utils = require('../src/utils');
const MetaObject = require('../src/meta-object');

describe('addPrefixedMethod', () => {
  it('should work', () => {
    class TestClass extends MetaObject {
      methodMissing(name) {
        return value => name + (value || '');
      }
    }

    utils.addPrefixedMethod(TestClass, ['small', 'large'], function(
      prefix,
      value
    ) {
      return prefix + (value || '');
    });
    const test = new TestClass();
    expect(test.foobar()).toEqual('foobar');
    expect(test.smallFoobar()).toEqual('foobarsmall');
    expect(test.largeSmallFoobar()).toEqual('foobarsmalllarge');
  });
});

describe('addSuffixedMethod', () => {
  it('should work', () => {
    class TestClass extends MetaObject {
      methodMissing(name) {
        return value => name + (value || '');
      }
    }

    utils.addSuffixedMethod(TestClass, ['color', 'width'], function(
      suffix,
      value
    ) {
      return suffix + (value || '');
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

    utils.addSuffixedMethod(TestClass, ['color', 'width'], function(
      suffix,
      value
    ) {
      return suffix + (value || '');
    });
    utils.addPrefixedMethod(TestClass, ['small', 'large'], function(
      prefix,
      value
    ) {
      return prefix + (value || '');
    });
    const test = new TestClass();
    expect(test.foobar()).toEqual('foobar');
    expect(test.foobarColor()).toEqual('foobarcolor');
    expect(test.smallFoobar()).toEqual('foobarsmall');
    expect(test.smallFoobarColor()).toEqual('foobarcolorsmall');
  });
});
