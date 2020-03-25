/*
    设计模式、、、
*/

// 单例模式 设计一个函数，在第一次执行后将之保存起来不再执行
/*
    单例模式最经典的就是弹窗了，类似与antd的message
    接下来我们自己使用单例模式模拟一个message,使用单例模式就是为了防止用户频繁点击操作生成多个弹窗
*/
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

// 策略模式:定义一系列的算法，将它们封装起来，并且可以使他们相互替代
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

/*
 命令模式：将一组特定的命令封装到一个函数里嘛，当达到执行某个命令的条件时便执行
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
