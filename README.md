# Meta-prototype

**EXPERIMENTAL**

This project aims to highlight (for now) one way of extending javascript code in a really convinient way.  With the inspiration from Ruby and other Javascript implementations, this adds functionality for "method missing". The big difference from other implementations, (that I've seen), is that this leverages the prototype behaviour to create this functionality. Whereas other implementations extends every newly created object instance in the constructor, this implementation only injects the behaviour once, at the top of the inheritance chain. In both cases the new ES2015 feature [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) is used, and in this implementation only a single instance of the proxy is created. (Given of course that my understanding of javascript execution is correct).

## methodMissing

By extending the `MetaObject` class and implementing a `methodMissing` function the dynamic behaviour is enabled.

```javascript
const { MetaObject } = require('meta-prototype')

class Parent extends MetaObject {
  foo() { return 'static' }
  methodMissing(methodName) { return () => methodName }
}

const instance = new Parent()
console.log(instance.foo()) // => 'static'
console.log(Reflect.has(instance, 'foobar')) // => false
console.log(instance.foobar()) // => 'foobar'
console.log(Reflect.has(instance, 'foobar')) // => true

```

The `methodMissing` is called if no matching property is found in an object, as an optimization the missing method gets added to the prototype of the class for future reference, meaning that `methodMissing` will only be called once for each key. This may or may not be ideal for all scenarios since you can end up with a lot of methods on a prototype and potentially run into memory issues. If this is the case, just check out the source, the code that enables the methodMissing (without also storing the method) is really slim.

Given that the method is added to the store itself, it is also important that the resulting inheritance behaviour is logical and intuitive (which this lib tries to accomplish). 

```javascript
const { MetaObject } = require('meta-prototype')

class Parent extends MetaObject {
  foo() { return 'parent' }
  methodMissing(methodName) { return () => `parent(${methodName})` }
}

class Child extends Parent {
  foo() { return 'child' }
  methodMissing(methodName) { return () => `child(${methodName})` }
}

const parent = new Parent()
const child = new Child()

console.log(parent.foo()) // => 'parent'
console.log(child.foo()) // => 'child'
console.log(parent.example1()) // => 'parent(example1)'
console.log(child.example1()) // => 'parent(example1)'
console.log(child.example2()) // => 'child(example2)'
console.log(parent.example2()) // => 'parent(example2)'
console.log(child.example2()) // => 'child(example2)'
```

In the case of `example1` it is first defined by the parent, meaning it will also be present for the child through prototypical inheritance. In the case of `example2`, the child defines it first. It will not be defined by the parent since the inheritance is in the opposite direction. So in effect, both classes gets a version of their own. This could potentially be quite confusing to a user, which is why inheritance chains and `methodMissing` functions should be crafted with care.

One very powerful case where this behaviour is useful is where you have a range of functions that you would like to extend with a prefix. 

```javascript
const { MetaObject } = require('meta-prototype')

class Styling extends MetaObject {
  methodMissing(methodName) { return (value) => ({ [methodName]: value }) }
}

class MediaStyling extends Styling {
  methodMissing(methodName) {
    if (methodName.indexOf('small') === 0 && methodName !== 'small') {
      const styleName = methodName.substr(5, 1).toLowerCase() + methodName.substr(6)
      return value => ({
        ...this[styleName](value),
        media: '( max-width: 768px )'
      })
    }
    return super.methodMissing(methodName)
  }
}

const media = new MediaStyling()

console.log(media.fontSize('15px')) // => { fontSize: '15px' }
console.log(media.smallFontSize('15px')) // => { fontSize: '15px', media: '( max-width: 768px )' }
console.log(media.largeFontSize('15px')) // => { fontSize: '15px', media: '( min-width: 769px )' }
```

With this method you can create very useful APIs with large room for extensions.



