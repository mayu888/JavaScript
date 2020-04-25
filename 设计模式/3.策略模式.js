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