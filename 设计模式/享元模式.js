/* 
    享元模式:区分出外部状态与内部状态，减少共享对象的数量
    因为组装外部状态是需要花费一定事件的，所以享元模式是一种时间换空间的模式
*/
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