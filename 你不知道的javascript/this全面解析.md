### this全面解析
1. 默认绑定：函数独立调用,
```js
function fn(){
	console.log(this) //window
}

'use strict'
function fn(){
	console.log(this) //undefined
}
```

2. 隐式绑定：调用位置是否有上下文对象，或者说函数有没有被包裹
```js
function fn(){
	console.log(this) //obj
}
const obj={
	fn:fn
}
obj.fn()
但要注意隐式丢失问题,虽然foo是obj的一个引用，但是它引用的是fn本身，所以调用时是fn是一个不带任何修饰的函数，所以此处为默认绑定
function fn(){
	console.log(this)
}
const obj={
	fn:fn
}
const foo=obj.fn
foo()
```
3. 显式绑定：若不想在对象内部包裹函数，而是在某个对象上强制调用函数  
Object.prototype.call和Object.prototype.apply就可以解决这个问题  
**call和apply第一个参数若为一个原始值，在内部会被new处理，new String、new Boolean...**  
call和apply本身除了第二个参数形式不一样没有任何区别  
```js
function fn(){
	console.log(this)
}
const obj1={
  fn:fn
}
const obj2={}
obj.fn.call(obj2) || obj.fn.apply(obj2)  //打印结果都为obj2
1:硬绑定：bind，它会返回一个被编码的新函数，会把传入的this指定上下文并调用原始函数
注意：bind之后this就无法再改变
function fn(){
  console.log(this)
}
const obj1={}
const obj2={}
fn.bind(obj1).bind(obj2)()  // obj1
2:API调用指定上下文:在许多js内置函数中，都提供了一个可选参数，被称为‘上下文’，作用和bind一样，来指定回调函数中的this
function callback(){
  console.log(this)  //obj
}
const obj={}
[1,2,3].forEach(callback,obj)
```

4.  new绑定  
   在js中，构造函数只是使用new操作符时被调用的函数。它们并不会属于某个类，甚至不会去实例化一个类，它们只是在被new时调用的一个普通函数。  
   使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作  

   1.  创建一个全新的对象
   2. 这个新对象会被执行[[prototype]]链接
   3. 这个新对象会被绑定到函数调用的this
   4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这歌新对象

```js
const MyClass=new Class()
//过程
function new(target,...arg){
    const obj={}
    const self=target;
    obj.__proto__=target.prototype
    const isObj=self.call(obj,...arg)
    return typeof(isObj)==='object'?isObj:obj;
  
}
```

**绑定优先级**  
显示绑定和和new绑定优先级肯定是大于隐式绑定的，但是显示绑定和new绑定那个优先级更高呢？   
被call和apply绑定的函数不能被new调用，但是可以通过bind来进行new调用。  

```js
function Fn(a){
  this.a=a
}
const obj={}
const f=Fn.bind(obj)
f(2)
const f1=new f(3)
console.log(obj) //{a:2}
console.log(f1) //f1 {a:3}
```

f被硬绑定到obj上，但是new f(3)并没有把obj中的a改为3，，相反，new修改了绑定到obj上调用f中的this，并创建了一个新对象。  

来实现一下bind。  
```js
function mybind(oThis){
  if(typeof(this)!=='function'){
    throw new TypeError(...)
  }
  const arg=Array.prototype.slice.call(arguments,1)
  const fToBind=this
  const fNOP=function(){}
  const fBound=function(){
    return fToBind.apply(
    (
    	this instanceof fNOP && oThis?this:oThis
    ),
      arg.concat(Array.prototype.slice.call(arguments))
    )
  }
  fNOP.prototype=this.prototype
  fBound.prototype=new fNOP()
  return fBound;
}
```

**判断this**  
可以根据以下优先级进行判断   
1. 判断函数是否被new调用，如果是的话this指向新创建的对象
2. 判断函数是否通过显示绑定或者硬绑定(call、apply、bind)，是的话this指向绑定的对象
3. 判断函数是否在某个上下文调用(隐式绑定)，是的话this指向的是那个上下文对象
4. 都不是则遵循默认绑定原则。严格模式指向undefined，非严格模式指向全局对象。