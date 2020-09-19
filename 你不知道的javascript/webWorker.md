### web Worker

**使用**
Worker类中需要传入一个js文件位置的url，这个文件将会被加载到一个worker中，随后浏览器就会启动一个独立的线程，让这个文件在这个线程中作为独立的程序运行。  
Worker之间以及和它的主程序之间不会共享任何资源或作用域，而是通过一个消息机制相互联系。
```js
const worker=new Worker("一个js文件地址");
// 侦听事件 就是固定的‘message’事件
worker.addEventListener('message',(e)=>{
  // e.data
})
// 发送事件给这个在Worker
worker.postMessage('something')
```
在Worker内部，收发消息是完全对称的
```js
addEventListener('message',(e)=>{
  //e.data
})
postMessage('something')
```
Worker和它的主程序之间是一对一的关系。通常有页面主程序来创建Worker，若是需要的话，一个Worker也可以创建它的子Worker，我们称为subWorker。有时候，把这样的细节委托给一个主Worker，由它来创建子Worker处理其他程序，这样很有用，但是兼容性可能还不太好。  
如果两个或多个页面创建的Worker指向同一个url，那么它们其实是完全独立的Worker。

**Worker环境**  
Worker内部是无法访问外部的任何资源，但是可以进行网络操作，以及设定定时器，也可以访问几个重要的全局变量和功能的本地复本，包括navigator，location，JSON和applicationCache。甚至可以通过importScript加载额外的js脚本
```js
// Worker中
importScript('a.js','b.js')
```
Worker中可以加载多个脚本，但是脚本加载过程是同步的，也就死加载脚本的过程会阻塞下边代码的执行。  

**Web Worker的应用**  
1. 处理密集型数学计算
2. 大数据集排序
3. 数据处理（压缩、音频分析、图像处理）
4. 高流量网络通信
另外，有一些讨论把canvas API暴露给worker，使得worker可以执行更高级的图形处理。

