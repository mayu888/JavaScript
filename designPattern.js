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

