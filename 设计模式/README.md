### 单例模式
```
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

