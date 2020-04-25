### 单例模式

```javascript
单例模式 设计一个函数，在第一次执行后将之保存起来不再执行
单例模式最经典的就是弹窗了，类似与antd的message
接下来我们自己使用单例模式模拟一个message,使用单例模式就是为了防止用户频繁点击操作生成多个弹窗
class Message{
  static warn(msg){
      if(!this.instance){
          this.instance=new Message(msg)
      }
      return this.instance
  }
  static clearInstance(){
      if(this.instance) this.instance=null;
  }
  constructor(msg){
      this.msg=msg
      this.timer=null;
      this.msgBox=this.createMesBox()
      document.body.appendChild(this.msgBox)
      this.appearMsg()
  }
  createMesBox(){
      if(this.msgBox) return this.msgBox
      const div=document.createElement('div')
      Object.assign(div.style,{
          width:'300px',
          paddingTop:'10px',
          paddingBottom:'10px',
          position:'absolute',
          top:'50px',
          left:'50%',
          border:'1px solid red',
          transform:'translateX(-50%)',
          textAlign:'center',
          display:'none'
      })
      return div;
  }
  appearMsg(){
      this.msgBox.textContent=this.msg;
      Object.assign(this.msgBox.style,{
          display:'block'
      })
      this.timer=setTimeout(()=>{
          Object.assign(this.msgBox.style,{
          display:'none'
      })
      clearTimeout(this.timer)
      this.timer=null;
      Message.clearInstance()
      },2000)
  }
}
/*
  给一个dom元素绑定事件，每次渲染列表都会绑定一次，这样是不好的
  我们可以在第一次绑定的时候就将之保存起来，之后每次render会判断第一次有没有被绑定
*/
function getSing(fn){
  let result;
  return function(){
      return result || (result=fn.apply(this,arguments))
  }
}
function addEvent(){
  const div=document.querySelector('div')
  div.addEventListener('click',()=>{})
  return true;
}
const bindEvent=getSing(addEvent)
function render(){
  console.log('渲染列表')
  bindEvent()
}
render()
render()
render()
render()
```

### 代理模式

```javascript
代理模式:当某种情况下不方便或者不可以直接访问某对象时,提供一个可以直接访问的代理来提供访问,这个代理就是
代理对象,由代理对象来收集,控制对这个对象的访问.
除下边给出的这两个例子外,还有ajax请求分页数据的时候,也可以使用缓存代理.
// 假设我们已经获知某个图片的地址,想请求到这个地址并将之显示在图片上,那么在网络不好的情况下可能会出现短暂的白屏
// 所以我们可以设置一个图片代理,在未加载完成时可以显示一个loading的图标,这就是预加载

const createImg=(function(){
  const img=new Image()
  document.appendChild(img)
  return {
      setSrc:(src)=>{
          img.src=src
      }
  }
})()
/*
在代理函数中,我们创建一个代理图片节点用来加载需要请求的图片,当开始加载时,直接让要显示的图片节点直接显示loading图片
然后代理图片节点加载图片地址,当加载完成,onload函数中在替换要显示的图片节点src,这样就躲避过了因网络原因加载图片出现的白屏情况
*/
const proxyCreagteImg=(function(){
  const img=new Image()
  img.onload=function(){
      createImg.setSrc(this.src)
  }
  return {
      setSrc:(src)=>{
          createImg.setSrc('本地loading的图片地址')
          img.src=src
      }
  }
})()
proxyCreagteImg.setSrc('要请求的图片地址')

/*
还可以创建一个计算乘积,计算求和的代理函数
*/

function mult(){
  let a=1;
  for(let i=0;i<arguments.length;i++){
      a=a*arguments[i]
  }
}
// 若我们有一次计算与之前的计算完全一样,那么计算函数还是会在执行一次,浪费资源
mult(1,2,3,4)
mult(1,2,3,4)  
function proxyFn(fn){
  let cache={}
  return function(){
      const key=[].join.call(arguments,',')
      if(cache[key]) return cache[key]
      return cache[key]=fn.call(this,arguments)
  }
}
// 在这个代理函数中 我们用cache缓存每次计算输入的内容,当下一次计算同样地内容时,直接从缓存中获取,这样就节省了计算资源
const result=proxyFn(mult)
result(1,2,3,4)
result(1,2,3,4)
```



