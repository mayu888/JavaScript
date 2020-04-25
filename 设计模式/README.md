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



### 策略模式

```javascript
定义一系列的算法，将它们封装起来，并且可以使他们相互替代
/*
    比较经典的就是计算员工奖金的方式以及表单验证
    这里我来写一下表单验证
*/  
class Validator{
  static strategies(){
      const emptyType=[undefined,null,'']
      return {
          isEmpty:(value,errormsg)=>{
              if(emptyType.includes(value)){
                  return errormsg;
              }
          },
          minLength:(value,length,errormsg)=>{
              if(value.length<length) return errormsg;
          }
      }
  }
  constructor(){
      this.strategies=Validator.strategies()
      this.cache=[]
  }
  add(value,rules){
      const length=rules.length;
      const strategies=this.strategies
      if(length){
          for(let i=0;i<length;i++){
              const {rule,errormsg}=rules[i]
              const ary=rule.split(':')
              this.cache.push(()=>{
                  const  strategy=ary.shift();
                  ary.unshift(value)
                  ary.push(errormsg)
                  return strategies[strategy](...ary)
              })
          }
      }
  }
  start(){
      const cache=this.cache
      const length=cache.length
      for(let i=0;i<length;i++){
          const message=cache[i]
          if(message) return message;
      }
  }
}
const truly=new Validator()
truly.add('12345',[
  {
      rule:'isEmpty',
      errormsg:'xx不能为空！'
  },
  {
      rule:'minLength:8',
      errormsg:'xx长度不能小于8位'
  }
])
const msg=truly.start()
if(msg) return msg;
```

### 享元模式

```javascript
区分出外部状态与内部状态，减少共享对象的数量
因为组装外部状态是需要花费一定时间的，所以享元模式是一种时间换空间的模式
class Modal {
    constructor(sex, underware) {
        this.sex = sex;
        this.underware = underware;
    }
    starWear() {
    }
}

class Modals {
    constructor(sex) {
        this.sex = sex;
    }
    starWear() {
    }
}
console.time('Modal')
for (let i = 0; i < 50; i++) {
    const a = new Modal('男', `第${i}件`)
    a.starWear()
}
console.timeEnd('Modal')

console.time('Modals')
const b = new Modals('男')
for (let i = 0; i < 50; i++) {
    b.underware = `第${i}件`
    b.starWear()
}
console.timeEnd('Modals')
/*
拥有享元思想的对象池
有这么一个场景：搜索地图某个店名，地图上出现了2个节点表示这个店名所在位置。紧接着又搜索另一个店名，此时出现了
6个点。那么这6个点是重新渲染出来的，当重新渲染的时候可以先回收之前的2个点，这样就少创建2个节点，减少了消耗
*/

const factory = {
    toolip: [],
    createSpot: function (text) {
        if (this.toolip.length === 0) {
            const div = document.createElement('div')
            div.textContent = text
            document.body.appendChild(div)
            return div
        } else {
            return this.toolip.shift()
        }
    },
    recoverSpot: function (spot) {
        return this.toolip.push(spot)
    }
}
let doma = []  //用来收集创建的节点
arr.forEach(dom => {
    let spot = factory.createSpot(dom)
    doma.push(spot)
})
doma.forEach(item => {
    factory.recoverSpot(item)
})
doma.length = []
const arr1 = ['点1', '点2', '点3', '点4', '点5', '点6']
arr1.forEach(dom => {
    let spot = factory.createSpot(dom)
    doma.push(spot)
})
```

### 命令模式、组合模式

```javascript
将一组特定的命令封装到一个函数里，当达到执行某个命令的条件时便执行
/*
比如根据按键事件来执行特定的命令，根据wsad按键执行唱跳rap篮球
并增加replay功能：重复之前做过的命令
*/
// 将行为封装到一起
const action={
    sing:()=>{
        console.log('唱')
    },
    jump:()=>{
        console.log('跳')
    },
    rap:()=>{
        console.log('rap');
    },
    basketball:()=>{
        console.log('篮球');
    }
}
const commandStack=[]   //缓存命令
const makeCommand=(recevier,state)=>{
    return recevier[state]
}
// 按键剑码对应的指令
const commands={
    '119':'sing',
    '115':'jump',
    '97':'rap',
    '100':'basketball'
}
const dou=document
dou.addEventListener('keypress',handleKeypress)
function handleKeypress(e){
    const keyCode=e.keyCode
    const command=makeCommand(action,commands[keyCode])  //获取命令
    if(command){
        command()
        commandStack.push(command)
    }
}
const div=document.querySelector('div')
div.addEventListener('click',handleClick)
function handleClick(){
    while(command=commandStack.shift()){
        command()
    }
}

/*
那么现在又有另一种情况，一个命令是和另一个命令为一体呢，也就是相互绑定的连个命令。
比如说：开电视和开音箱这两个指令一定是一体的（因为电视出声音必须得开音箱嘛
那么我们必须重新编写一个指令集--这就是组合模式
*/

class Command{
    constructor(){
        this.commandList=[]
    }
    add(action){
        this.commandList.push(action)
    }
    excuted(){
        const actionList=this.actionList
        const actionLength=actionList.length;
        for(let i=0;i<actionLength;i++){
            const action=actionList[i]
            action.excuted()
        }
    }
}
// 设置命令
const openDoor={
    excuted:()=>{
        console.log('开门');
    }
}

const openTv={
    excuted:()=>{
        console.log('打开电视');
    }
}
const openAudio={
    excuted:()=>{
        console.log('开音箱');
    }
}

const openComp={
    excuted:()=>{
        console.log('开电脑');
    }
}
const loginQQ={
    excuted:()=>{
        console.log('登录qq');
    }
}
/*
以上命令 开门为自己一个  开电视和开音箱为一个组合命令  开电脑和登录qq为一个组合命令
而组合命令 command1和command2与其底下分之命令就像是一棵树的枝干和叶子的关系
从第一颗树干开始，扫描每一颗树干的叶子，直到扫描完在扫描下一颗。
所以组合命令的执行又有些类似与深度优先遍历
这种命令的好处是当额外扩展命令时十分方便
*/
const command1=new Command()
command1.add(openTv)
command1.add(openAudio)

const command2=new Command()
command1.add(openComp)
command1.add(loginQQ)

const commands=new Command()
commands.add(openDoor)
commands.add(command1)
commands.add(command2)
commands.excuted()

/*
现在我们利用组合模式的特性来编写一个文件创建并读取文件名的程序 
循环读取文件名
组合模式除了要求组合对象和页对象拥有相同的接口外，还有一个必要条件就是
对一组页对象的操作具有一致性
在下面的例子中我们加入了parent来指明这个文件/文件夹的父文件夹是哪个
是为了设置职责链条，为了避免遍历整棵树
有这么一个场景：公司依据部门来发放过节金，但架构师既属于架构部有属于开发部
那么他就有可能拿到两份奖金。所以手动设置一个职责链来指明当前元素隶属于哪一级
但我们的文件读取和这种情景并不相融
*/
class Folder{
    constructor(name){
        this.list=[]
        this.name=name
        this.parent=null
    }
    add(f){
        f.parent=this;
        this.list.push(f)
    }
    read(){
        this.list.forEach(item=>{
            item.read()
        })
    }
}
class File{
    constructor(name){
        this.name=name
        this.parent=null;
    }
    add(){
        throw new Error('文件不能添加文件')
    }
    read(){
        if(!this.parent){
            return;
        }
        console.log(this.name)
    }
}

const learnBook=new Folder('学习资料')
const react=new Folder('react')
const javascript=new Folder('javascript')
const react1=new File('react1')
const react2=new File('react2')
const js1=new File('js1')
const js2=new File('js2')
learnBook.add(react)
learnBook.add(javascript)
react.add(react1)
react.add(react2)
javascript.add(js1)
javascript.add(js2)
const node=new File('node')
learnBook.add(node)
learnBook.read()

```

### 发布-订阅模式

```javascript
又称为观察者模式，它定义对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知
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
```

### 职责链模式

```javascript
使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求,直到遇到一个可以处理它的对象，我们把这些节点成为链中的节点
职责链经典场景之一就是 公交排队，付钱需要把rmb给你前边的人然后一个一个传给售票员，前边的人是各个节点，售票员是最终处理的人
/*
设定一个手机优惠券的场景：一台手机预售活动可以付500元定金，200元定金。
500元定金有100元优惠券，200元定金有50元优惠券。当然也有普通付费用户
orderType:
1：500元定金订单
2：200元定金订单
3：普通用户订单
pay:只针对付定金用户 若为false表示已下单但未付款 降为普通订单 true表示下单付款
goods 库存，只针对普通订单用户
*/

// 按照一般逻辑我们会这么写
// 可以看出来，orderType函数里嵌套了太多了if else逻辑，阅读性复用性都很差
// 若是想要在增加一种优惠券场景，恐怕改动代码要'伤筋动骨'

function orderType(orderType, pay, goods) {
  if (orderType === 1) {
    if (pay) {
      console.log('500元订单并已付款')
    } else {
      if (goods) {
        console.log('有库存,库存为' + goods);
      } else {
        console.log('无库存');
      }
    }
  } else if (orderType === 2) {
    if (pay) {
      console.log('200元订单并已付款')
    } else {
      if (goods) {
        console.log('有库存,库存为' + goods);
      } else {
        console.log('无库存');
      }
    }
  } else {
    if (goods) {
      console.log('有库存,库存为' + goods);
    } else {
      console.log('无库存');
    }
  }
}

/*
接下来我们用职责链模式重构一下逻辑
规定好每个优惠类型的函数，并且只在自身逻辑中完成只属于自己的任务，其他情况一捋返回 'unsuccess'交由下一个逻辑来判断
定义一个Chain类 来将三个优惠类型以500-300-common串联起来，若是不符合500的优惠判断300，不符合300判断普通
setNextFn就是串联起各个逻辑类型的‘纽带’，有了它，本身的逻辑不通过才会进行下一个逻辑判断
passRequest是决定着是否要进行下一轮的逻辑判单
这样每个类型订单之间就没有任何耦合关系，若是想在增加一个订单类型直接定义增加就ok
并且这样写的好处是可以选择从任何一个链路开始，并不是非要从500订单开始进行判读，若是我提前知道是200订单，那么可以直接从200开始判断
但职责链模式有一个缺点就是职责链若是过长，层层判断会十分耗费性能
*/

function orderType_500(orderType, pay, goods) {
  if (orderType === 1 && pay) {
    console.log('500元订单并已付款')
  } else {
    return 'unsuccess'
  }
}

function orderType_200(orderType, pay, goods) {
  if (orderType === 2 && pay) {
    console.log('200元订单并已付款')
  } else {
    return 'unsuccess'
  }
}

function orderType_common(orderType, pay, goods) {
  if (goods > 0) {
    console.log('普通用户，有库存' + goods);
  } else {
    console.log('库存不足！');
  }
}
class Chain {
  constructor(fn) {
    this.fn = fn;
    this.nextFn = null;
  }
  setNextFn(fn) {
    return this.nextFn = fn
  }
  passRequest() {
    const ret = this.fn.call(this, ...arguments)
    if (ret === 'unsuccess') {
      return this.nextFn && this.nextFn.passRequest.call(this.nextFn, ...arguments)
    }
    return ret
  }
}
const order500 = new Chain(orderType_500)
const order200 = new Chain(orderType_200)
const ordercommon = new Chain(orderType_common)
order500.setNextFn(order200) //500定金订单类型的下一个是300定金订单
order200.setNextFn(ordercommon) //300定金订单的下一个是普通订单

order500.passRequest(3, true, 500) //普通用户，有库存500
order500.passRequest(1, false, 300) //普通用户，有库存300
order500.passRequest(2, true, 300) //200元订单并已付款
order500.passRequest(1, true, 100) //500元订单并已付款
order200.passRequest(2, true, 100) //200元订单并已付款 直接从200元订单开始判断

// 下边是从新增加一个订单类型 并为之设置下一个职责链
function orderType_400(orderType, pay, goods) {
  if (orderType === 4 && pay) {
    console.log('400元订单并已付款')
  } else {
    return 'unsuccess'
  }
}
const order400 = new Chain(orderType_400)
order500.setNextFn(order400).setNextFn(order200)
order500.passRequest(4, true, 100) //400元订单并已付款（上边的判断条件都没变
order500.passRequest(2, false, 100) //普通用户，有库存100

// 接下来改写一下职责链模式
// after函数是将一个函数的执行放到某个函数之后（满足一定的条件

Function.prototype.after = function (fn) {
  const self = this
  return function () {
    const ret = self.call(this, ...arguments)
    if (ret === 'unsuccess') {
      return fn.call(fn, ...arguments)
    }
    return ret;
  }
}
const order = orderType_500.after(orderType_200).after(orderType_common)
order(1, true, 100) //500元订单并已付款
order(2, true, 100) //200元订单并已付款
order(2, false, 100) //普通用户，有库存100
order(1, false, 0) //库存不足！
```

### 中介者模式

```javascript
程序间互相通信的场景有很多，有时候10几个对象间互相通信，互相引用，造成了复杂的耦合关系。
当一个对象发生改变，就要寻找出所有与它通信的其他对象并告知。
而中介者模式正是改变了这种对象间紧密的耦合，创建一个中介者对象，所有成员都依靠中介者来互相通信，
当一个成员发生改变时，由中介者来进行广播通知。
/* 
比如机场指挥塔就是一个中介者，有了这个指挥塔，起飞的飞机才能知道所在航线有没有其他飞机/此时起飞会不会收到其他飞机的影响
js中的中介者例子
泡泡糖游戏-支持两个玩家对战，一方死掉另一方宣布胜利
*/
// 简易版的泡泡糖，只有胜利、死亡、失败。若一方死亡，宣布这一方失败，对方胜利
class Player{
  constructor(name){
    this.name=name;
    this.enemy=null;
  }
  win(){
    alert(this.name+'胜利')
  }
  lose(){
    alert(this.name+'失败')
  }
  die(){
    this.lose()
    this.enemy.win()
  }
}
const xiaoming=new Player('小明')
const xiaohong=new Player('小红')
// 互相设置敌人
xiaoming.enemy=xiaohong
xiaohong.enemy=xiaoming
xiaoming.die() //小明失败，小红胜利

/*
这样写虽然简单直接明了，但是当人数增多的时候，便会变得麻烦起来。假设现在分红蓝两队，每一队五个人。其中可以支持
掉线，换队。若使用互相引用的写法，那么每次人员发生变动就会产生巨大的变化，影响范围涉及到每一位队员。
*/

/* 
中介者模式改进
playerDirector就是一个中介者，所有的操作都是交给它来完成。每次成员变化由它通知其他成员
这样就减少了各成员之间的耦合性
*/

class Players{
  constructor(name,teamcolor){
    this.name=name;
    this.teamcolor=teamcolor;
    this.state='alive'
  }
  win(){
    alert(this.name+'win')
  }
  lose(){
    alert(this.name+'lose')
  }
  die(){
    this.state='died'
    playerDirector.receiveMessage('playerDead',this) //给中介者发消息，玩家死亡
  }
  changeTeam(teamcolor){
    playerDirector.receiveMessage('changeTeam',this,teamcolor) //给中介者发消息，玩家换队
  }
  remove(){
    playerDirector.receiveMessage('removePlayer',this) //给中介者发消息，玩家离开游戏
  }
}
// 创建玩家的工厂函数
function palyerFactor(name,teamcolor){
  const player=new Players(name,teamcolor)
  playerDirector.receiveMessage('addPlayer',player)  //给中介者发消息，增加玩家
  return player;
}
 const playerDirector=(function (){
   const players={}  //用来保存各个队伍各个队员
   const options={}  //保存操作
   options.addPlayer=function(player){
    const teamcolor=player.teamcolor;
    players[teamcolor]=players[teamcolor] || []
    players[teamcolor].push(player)
    console.log(players);
    
   }
   options.removePlayer=function(player){
    const teamcolor=player.teamcolor;
    const team=players[teamcolor]
    team.forEach((element,index) => {
      if(element===player){
        team.splice(index,1)
      }
    });
   }
   options.changeTeam=function(player,newteamcolor){
    options.removePlayer(player)
    player.teamcolor=newteamcolor
    options.addPlayer(player)
   }
   options.playerDead=function(player){
    const teamcolor=player.teamcolor
    const diedTeam=players[teamcolor]
    let _alldied=true
    diedTeam.forEach(player=>{
      if(player.state!=='died'){
        _alldied=false;
        return;
      }
    })
    if(_alldied===true){
      diedTeam.forEach(player=>{
        player.lose()
      })
      const otherTeam=Object.keys(players)
      otherTeam.forEach(otherTeamcolor=>{
        if(otherTeamcolor!==teamcolor){
          players[otherTeamcolor].forEach(palyer=>{
            palyer.win()
          })
        }
      })
    }
   }
   const receiveMessage=function(){
     const type=Array.prototype.shift.call(arguments)
      options[type](...arguments)
   }
   return {
    receiveMessage
   }
 })()
 const a=palyerFactor('a','red')
 const b=palyerFactor('b','red')
 const c=palyerFactor('c','red')
 const d=palyerFactor('d','red')
 const e=palyerFactor('e','red')

const f=palyerFactor('f','blue')
const j=palyerFactor('j','blue')
const k=palyerFactor('k','blue')
const l=palyerFactor('l','blue')
const m=palyerFactor('m','blue')

// a.die()
// b.die()
// c.die()
// d.die()
// e.die()

a.remove()
m.changeTeam('red')
b.die()
c.die()
d.die()
e.die()
m.die()
```

