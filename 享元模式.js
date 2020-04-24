/* 
    享元模式:区分出外部状态与内部状态，减少共享对象的数量
    因为组装外部状态是需要花费一定事件的，所以享元模式是一种时间换空间的模式
*/
class Modal{
    constructor(sex,underware){
        this.sex=sex;
        this.underware=underware;
    }
    starWear(){
    }
}

class Modals{
    constructor(sex){
        this.sex=sex;
    }
    starWear(){
    }
}
console.time('Modal')
for(let i=0;i<50;i++){
const a=new Modal('男',`第${i}件`)
a.starWear()
}
console.timeEnd('Modal')

console.time('Modals')
const b=new Modals('男')
for(let i=0;i<50;i++){
b.underware=`第${i}件`
b.starWear()
}
console.timeEnd('Modals')