/*
中介者模式
程序间互相通信的场景有很多，有时候10几个对象间互相通信，互相引用，造成了复杂的耦合关系。
当一个对象发生改变，就要寻找出所有与它通信的其他对象并告知。
而中介者模式正是改变了这种对象间紧密的耦合，创建一个中介者对象，所有成员都依靠中介者来互相通信，
当一个成员发生改变时，由中介者来进行广播通知。
比如机场指挥塔就是一个中介者，有了这个指挥塔，起飞的飞机才能知道所在航线有没有其他飞机/此时起飞会不会收到其他飞机的
影响
*/

/* 
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
