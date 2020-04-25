// 职责链模式
    /*
        使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求
        直到遇到一个可以处理它的对象，我们把这些节点成为链中的节点
        职责链经典场景之一就是 公交排队，付钱需要把rmb给你前边的人然后一个一个传给售票员，前边的人是各个节点，售票员是最终处理
        的人
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
    order500.setNextFn(order200)  //500定金订单类型的下一个是300定金订单
    order200.setNextFn(ordercommon)  //300定金订单的下一个是普通订单

    order500.passRequest(3, true, 500)   //普通用户，有库存500
    order500.passRequest(1, false, 300)  //普通用户，有库存300
    order500.passRequest(2, true, 300)   //200元订单并已付款
    order500.passRequest(1, true, 100)   //500元订单并已付款
    order200.passRequest(2, true, 100)   //200元订单并已付款 直接从200元订单开始判断

// 下边是从新增加一个订单类型 并为之设置下一个职责链
    function orderType_400(orderType, pay, goods){
      if (orderType === 4 && pay) {
        console.log('400元订单并已付款')
      } else {
        return 'unsuccess'
      }
    }
    const order400=new Chain(orderType_400)
    order500.setNextFn(order400).setNextFn(order200)
    order500.passRequest(4, true, 100)   //400元订单并已付款（上边的判断条件都没变
    order500.passRequest(2, false, 100)   //普通用户，有库存100

    // 接下来改写一下职责链模式
    // after函数是将一个函数的执行放到某个函数之后（满足一定的条件

    Function.prototype.after=function(fn){
      const self=this
      return function(){
        const ret=self.call(this,...arguments)
        if(ret==='unsuccess'){
          return fn.call(fn,...arguments)
        }
        return ret;
      }
    }
    const order=orderType_500.after(orderType_200).after(orderType_common)
    order(1, true, 100) //500元订单并已付款
    order(2, true, 100) //200元订单并已付款
    order(2, false, 100) //普通用户，有库存100
    order(1, false, 0) //库存不足！