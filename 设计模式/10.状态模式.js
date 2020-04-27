/*
状态模式允许一个对象在其内部状态改变时改变他得行为，对象看起来似乎改变了它的类
状态模式的关键是区别事物的内部状态，内部状态的改变往往会带来行为模式的改变
*/

// 状态模式的电灯泡程序
// 灯泡的开关由status控制，但是这只是开关灯的逻辑。实际场景可能会更复杂，比如说一个酒店的电灯可能是这样一个状态
// 关闭-弱光-强光-彩光-关闭
// 那么ligthclick函数内部需要的逻辑判断就得更多了。每次添加一种灯光就需要重写内部逻辑，这并符合开放封闭原则。
class Light{
  constructor(){
    this.status='off'
    this.button=null;
    this.init()
  }
  init(){
    const button=document.createElement('button')
    button.textContent='开关'
    this.button=document.body.appendChild(button)
    this.button.onclick=()=>{
      this.ligthclick()
    }
  }
  ligthclick(){
    if(this.status==='off'){
      console.log('开灯');
      this.status='on'
    }else if(this.status==='on'){
      console.log('关灯');
      this.status='off'
    }
  }
}
const ligth=new Light()

// 状态模式改写灯光程序

// 关灯状态
class offLight{
  constructor(light){
    this.light=light
  }
  buttonClick(){
    console.log('弱光');  //关灯状态对应的行为
    this.light.setStatus(this.light.weaklightstatus) //状态切换
  }
}
// 弱光
class weakLight{
  constructor(light){
    this.light=light
  }
  buttonClick(){
    console.log('强光');
    this.light.setStatus(this.light.stronglightstatus)
  }
}
// 强光
class strongLight{
  constructor(light){
    this.light=light
  }
  buttonClick(){
    console.log('彩光');
    this.light.setStatus(this.light.colorlightstatus)
  }
  
}
// 彩光
class colorLight{
  constructor(light){
    this.light=light
  }
  buttonClick(){
    console.log('关灯');
    this.light.setStatus(this.light.offlightstatus)
  }
}
/*
这种形式的封装使每一个状态对应一个类，状态改变时通过改变本身状态对类的指向，然后操作对应的类
来唤醒对应的行为。不仅脱离了复杂的逻辑判断，在增加状态或者消除状态时可以直接操作外部的类就可以，
本身并不会发生改变。
*/
class Lights{
  constructor(){
    this.offlightstatus=new offLight(this)
    this.weaklightstatus=new weakLight(this)
    this.stronglightstatus=new strongLight(this)
    this.colorlightstatus=new colorLight(this)
    this.button=null;
    this.init()
  }
  init(){
    this.currentstatus=this.offlightstatus
    const button=document.createElement('button')
    button.textContent='状态模式开关'
    this.button=document.body.appendChild(button)
    this.button.onclick=()=>{
      this.buttonClick()
    }
  }
  setStatus(status){
    this.currentstatus=status
  }
  buttonClick(){
    this.currentstatus.buttonClick()
  }
}
new Lights()
