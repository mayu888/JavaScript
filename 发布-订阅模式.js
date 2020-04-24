
/*
假设这么一个场景，小明想要买一个90平的屋子，但是去售楼部已经卖完了，所以小明就把电话留在售楼部
当有新的90平房子上市时，就打电话通知小明。这个例子就是发布-订阅模式，其中，售楼部为发布方，小明为
订阅方。
同时若是小明从别的售楼部买到了房子，那么就可以取消在之前售楼部定下的房子，也就是取消订阅
*/
const publishLib={}

publishLib.store={}  //用来保存发布消息的仓库

publishLib.listen=function(key,fn){
  // key为一个特征 比如说 90平的房子为一个key，85平的房子为一个key
  // 带入fn表示订阅
  const store=this.store
  if(!store[key]){
    store[key]=[]
  }
  store[key].push(fn)
}

publishLib.trgger=function(){
  // 取出key，向订阅key特征的人发布消息
  const key=Array.prototype.shift.call(arguments)
  const listenlist=this.store[key]
  if(!listenlist || !listenlist.length) return;
  listenlist.forEach(fn=>{
    fn(...arguments)
  })
}

publishLib.cancel=function(key,fn){
  // 取消订阅 若没有key，那说明根本没人订阅这一类特征的‘房子’
  // 若没有具体指明时是哪个人取消订阅，那么全部清零
  const fns=this.store[key]
  if(!fns)return;
  if(!fn) fns.length=0;
  fns.forEach((listener,index)=>{
    if(listener===fn){
      fns.splice(indedx,1)
    }
  })
}
function xiaoming90(num){
  console.log('通知小明：90平的房子有'+num+'户');
  
}
function xiaoming85(num){
  console.log('通知小明：85平的房子有'+num+'户');
  
}
function xiaohong85(num){
  console.log('通知小红：85平的房子有'+num+'户');
}

publishLib.listen('90',xiaoming90)
publishLib.listen('85',xiaoming85)
publishLib.listen('85',xiaohong85)

publishLib.trgger('90',3)
publishLib.trgger('85',13)
/*
通知小明：90平的房子有3户
通知小明：85平的房子有13户
通知小红：85平的房子有13户
*/