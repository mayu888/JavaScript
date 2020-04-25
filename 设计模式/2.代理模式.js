/*
    代理模式:当某种情况下不方便或者不可以直接访问某对象时,提供一个可以直接访问的代理来提供访问,这个代理就是
    代理对象,由代理对象来收集,控制对这个对象的访问.
    除下边给出的这两个例子外,还有ajax请求分页数据的时候,也可以使用缓存代理.
*/
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