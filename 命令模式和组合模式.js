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
