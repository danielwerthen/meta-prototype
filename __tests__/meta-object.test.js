const MetaObject = require('../src/meta-object')

describe('MetaObject', () => {
  class MyObject extends MetaObject {
    methodMissing(name) {
      return `missing method ${name}`
    }
  }
  it('allows method missing to be called', () => {
    const obj = new MyObject();
    expect(obj.foobar).toEqual('missing method foobar')
  })
})
