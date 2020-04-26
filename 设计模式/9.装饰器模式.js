/*
给对象动态增加职责的方式是装饰器模式，装饰器模式能在不改变源对象自身基础的情况下，在程序运行期间为对象动态增加
职责。
一般js中为对象增加职责都是使用继承，但继承会使子类与超累造成强耦合，子类改变，超类也会改变。这样就破坏了
封装性。
*/

// 一个简单的装饰器模式
class Plane{
  fire(){
    console.log('发射子弹');
  }
}
class MissPlane{
  constructor(plane){
    this.plane=plane
  }
  fire(){
    this.plane.fire && this.plane.fire()
    console.log('发射导弹');
  }
}
class AtomPlane{
  constructor(plane){
    this.plane=plane
  }
  fire(){
    this.plane.fire && this.plane.fire()
    console.log('发射火箭');
  }
}

let plane=new Plane()
plane=new MissPlane(plane)
plane=new AtomPlane(plane)
plane.fire() //发射子弹  发射导弹  发射火箭

/*
上边为一个很简单的装饰器模式。本来一个类的职责只是发射子弹，但是经过装饰器层层装饰之后可以
发射导弹和火箭，还未改变原本的Plane
*/

// AOP模式的装饰器模式
// 假设在执行某个函数时你想要先进行某个操作，比如在发送ajax请求时，想要给每一个请求的参数增加一个属性
function ajax(url,method,param){
  console.log(param); //{name:"mayu"}
  param.age=20  
  console.log(param);
  
  // 请求的具体方法略
}
// ajax('http://www.baidu.com','post',{name:"mayu"})
//上述方法ajax函数就被污染，如果有求情不需要带上这个参数呢？所以我们定义一个方法来动态改变param参数

Function.prototype.befor=function(beforefn){
  const _self=this;
  return function(){
    beforefn.apply(this,arguments)
    return _self.apply(this,arguments)
  }
}
ajax=ajax.befor(function(url,method,param){
  param.age=11
})
ajax('http://www.baidu.com','post',{name:"mayu"})  //param {name: "mayu", age: 11}

// 另一种场景：开发过程中你想使用某个window.onload方法来进行某些操作，但是你不知道你的同事是否已经提前定义
// 这个方法，若贸然使用会改变之前已定义好的方法
window.onload=function(){
  console.log('同事写的window方法')
}
// window.onload=function(){...}  同事的方法被替换了

Function.prototype.after=function(afterfn){
  const _self=this;
  return function(){
    let ret=_self.apply(this,arguments)
    afterfn.apply(this,arguments)
    return ret
  }
}
window.onload=window.onload.after(()=>{
  console.log('我写的window方法');
})

// 一个表单校验方法
// 假设
const username='mayu'
const age=20
const job=undefined //模拟未填写

function submit(){
  if(!username){
    return alert('用户名不能为空')
  }
  if(!age){
    return alert('年龄不能为空')
  }
  if(!job){
    return alert('工作不能为空')
  }
  const param={
    username,
    age,
    job
  }
  ajax('url','post',param)
}
submit()  //此函数除了提交表单数据外，还验证了表单数据的填写，承担了两个职责，比较臃肿。
// 用AOP装饰器来进行封装

Function.prototype.formBefore=function(fn){
  const _self=this
  return function(){
    const msg=fn.apply(this,arguments)
    if(msg){
      return alert(msg)
    }
    return _self.apply(this,arguments)
  }
}
function vaildata(){
  if(!username){
    return '姓名不能为空'
  }
  if(!age){
    return '年龄不能为空'
  }
  if(!job){
    return '工作不能为空'
  }
}
let  submits=function(){
  const param={
    username,
    age,
    job
  }
  // ajax(...)
}
submits=submits.formBefore(vaildata)
submits()