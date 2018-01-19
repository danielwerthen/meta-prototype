const MetaObject = require('../src/meta-object')

describe('MetaObject', () => {
  describe('Simple case', () => {
    class MyObject extends MetaObject {
      methodMissing(name) {
        return `missing method ${name}`
      }
    }
    it('allows method missing to be called', () => {
      const obj = new MyObject()
      expect(obj.foobar).toEqual('missing method foobar')
    })
  })

  describe('Extensions', () => {
    const spy = jest.fn()
    class Root extends MetaObject {
      methodMissing(name) {
        const fn = function (val) {
          return name + ' ' + val
        }
        spy()
        Reflect.defineProperty(fn, 'name', { value: name, writeable: false })
        return fn
      }
    }

    it('should actually create method on missing', () => {
      const root = new Root()
      expect(Reflect.has(root, 'foobar')).toEqual(false)
      expect(root.foobar('is called')).toEqual('foobar is called')
      expect(Reflect.has(root, 'foobar')).toEqual(true)
      expect(root.foobar.name).toEqual('foobar')
      // The created method is also available to other instances of class
      const root2 = new Root()
      expect(Reflect.has(root2, 'foobar')).toEqual(true)
      // The created method is not present in root class
      const obj = new MetaObject()
      expect(Reflect.has(obj, 'foobar')).toEqual(false)
      expect(spy.mock.calls.length).toBe(1)
    })
  })

  describe('Inhertance', () => {
    class Parent extends MetaObject {
      parentMethod1() {
        return 'static'
      }
      methodMissing() {
        return () => 'parent'
      }
    }

    class ChildA extends Parent {
      methodMissing() {
        return () => 'childA'
      }
    }

    class ChildB extends Parent {
      methodMissing(key) {
        return () => 'childB'
      }
    }

    it('preserves methods on parent', () => {
      const child = new ChildA()
      expect(child.parentMethod1()).toEqual('static')
    })

    it('encapsulates methods on siblings', () => {
      const childA = new ChildA()
      const childB = new ChildB()
      expect(childA.foobar()).toEqual('childA')
      expect(childB.foobar()).toEqual('childB')
    })

    it('exposes methods on parents to siblings', () => {
      const childA = new ChildA()
      const childB = new ChildB()
      const parent = new Parent()
      expect(childA.fooz()).toEqual('childA')
      expect(parent.fooz()).toEqual('parent')
      expect(childB.fooz()).toEqual('parent')
    })
  })
})
