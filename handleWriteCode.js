
// 节流
function  throttle(fn,time,start) {
        const self=this;
        let isStart=start;
        let timer=null;
        return function() {
            if(isStart){
                fn.call(self,...arguments)
                return isStart=false
            }
            if(timer){
                return false;
            }
            timer=setTimeout(() => {
                fn.call(self,...arguments)
                clearTimeout(timer)
                timer=null
            }, time);

        }
}
// 防抖
function debounce(fn,time){
    let timer=null;
    const self=this;
    return function(){
        if(timer!==null){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            fn.call(self,arguments)
        },time)
    }
}

// bind的实现
Function.prototype.bind=function(context) {
    if(typeof(this)!=='function')return;
    context=context || window;
    const self=this;
    const args=Array.prototype.slice.call(arguments,1)
    function f(){}
    let fn=function(){
        return self.apply((
            this instanceof f?this:context),
            args.concat.call(Array.prototype.slice.call(arguments))
            )
    }
    f.prototype=this.prototype;
    fn.prototype=new f()
    return fn;
}

// 函数柯里化

// fn()()().. 形式
function currying(){
    let arr=[];
    const arg=Array.from(arguments)
    arg.forEach(item=>{
        arr.push(item);
    })
    fn=function(){
        Array.from(arguments).forEach(item=>{
            arr.push(item)
        })
        return arguments.callee;
    }
    fn.toString=function(){
        console.log(arr);
        
        return arr.reduce((a,b)=>{
            return a+b
        })
    }
    return fn
}
// fn()
// fn()
// fn() 形式
function currying(){
    let num=0
    return function(){
        const length=arguments.length;
        if(length){
            Array.from(arguments).forEach(item=>{
                num+=item;
            })
        }else{
            return num;
        }
    }
}

// new实现的原理
function myNew(target,...arg){
    const obj={}
    const self=target;
    obj.__proto__=target.prototype
    const isobj=self.call(obj,...arg)
    return typeof(isobj)==='object'?isobj:obj;
}

