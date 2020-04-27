在读这些代码前，不了解或者不是很熟悉promise的机制的同学可以去读一下阮一峰老师的ES6入门讲的Promise。我写的这些纯粹是为了记录自己对promise的理解，其中新提出的promise方法并没有写进去(因为只知其功能还没进行研究- -..)

[Promise传送门]([http://es6.ruanyifeng.com/#docs/promise](ECMAScript 6 入门))

```js
class Promise {
  // 设置静态常量，消除魔法字符串
  static PENDING = "pending";
  static FUFILLED = "fufilled";
  static REJECTED = "rejected";

  /*
    定义reslovePromise方法是因为有这样一种情乱：
    let p=new Promise(reslove=>{
      reslove(p)
    })
    .then()
    reslove的结果就是reslove所在的函数，这种情况是不允许的，因为
    reslove的结果如果为一个promise的话，就会执行promise.then，而这个promise
    是其本身，那么就会陷入一个死循环，所以我们统一在这个函数对reslove，reject的
    结果进行比较
  */

  static reslovePromise = (promise2, x, reslove, reject, status) => {
    // 将then方法返回的promise与x  x也就是then(res=>{})的结果
    // 若两者相等，那么上边的情况就发生了，抛出一个错误
    if (promise2 === x) {
      throw new Error("Chaining cycle detected for promise!");
    } else if (x instanceof Promise) {
      x.then(
        () => {
          Promise.reslovePromise(promise2, x, reslove, reject);
        },
        err => {
          reject(err);
        }
      );
    } else {
      if (status === Promise.FUFILLED) reslove(x);
      else if (status === Promise.REJECTED) reject(x);
    }
  };
  // Promise.reslove方法 返回一个新的promise并只执行reslove方法
  static reslove = value => {
    return new Promise((reslove, reject) => reslove(value));
  };
  static reject = error => {
    return new Promise((reslove, reject) => reject(error));
  };
  static all(promises) {
    /*
    大多数情况下，参数promises都为一个数组，但是这并不是强制的，
    参数promises必须拥有Iterator方法才可以。且每一项都必须为Promise实例，
    若有一项不是，会调用Promise.resolve方法转化为Promise。
    Promise.all返回一个新的Promise，若参数promises中有一个reject，
    那么就返回这个reject的值，只有全部resolve，会返回所有resolve的结果，结果为一个数组。
    */
    const Iterator = Symbol.iterator
    if (!promises[Iterator]) return;
    return new Promise((resolve, reject) => {
      const resolveData = [];
      const rejectData = [];
      for (let i of promises) {
        if (!(i instanceof Promise)) {
          i = Promise.resolve(i)
        }
        i
          .then(data => {
            resolveData.push(data)
          }, error => {
            rejectData.push(error)
          })
      }
      setTimeout(() => {
        return rejectData.length === 0 ? resolve(resolveData) : reject(rejectData[0])
      })
    })
  }
  constructor(excutor) {
    // Promise必须传进来一个函数
    if (typeof excutor !== "function") {
      throw new Error(`${excutor} is not a function`);
    }
    this.init(); //初始化Promise 设置一些需要的值
    try {
      // 执行传进来的reslove，reject函数
      excutor(this.reslove.bind(this), this.reject.bind(this));
    } catch (e) {
      throw new Error(e);
    }
  }
  init() {
    this.value = undefined; //reslove执行的结果
    this.error = undefined; //reject执行的结果
    this.status = Promise.PENDING; //初始状态为pending

    // 这两个数组下边说
    this.resloveCallbacks = [];
    this.rejectCallbacks = [];
  }
  reslove(value) {
    // reslove执行的必要条件就是当前状态为pending
    if (this.status === Promise.PENDING) {
      this.status = Promise.FUFILLED;
      /*
        因为有可能会出现reslove(new Promise) 即reslove的结果是一个promise
        这种情况我们直接调用新promise的then方法，并把当前reslove reject传进去
        传当前reslove，reject的意义是在这种情况不能改变当前promise的值 也就是当前
        value的结果不能为一个promise，它必须为一个值
      */
      if (value instanceof Promise) {
        value.then(this.reslove.bind(this), this.reject.bind(this));
        return;
      }
      this.value = value;
      this.resloveCallbacks.forEach(callback => callback(value));
    }
  }
  // 这里没啥好说的
  reject(error) {
    if (this.status === Promise.PENDING) {
      this.error = error;
      this.status = Promise.REJECTED;
      this.rejectCallbacks.forEach(callback => callback(error));
    }
  }
  then(onReslove, onReject) {
    /*
      then方法可以传进两个函数，但一定要是函数
      并且then方法返回值也是一个新的promise
    */
    onReslove =
      typeof onReslove === "function" ? onReslove : value => value;
    onReject = typeof onReject === "function" ? onReject : error => error;
    // then方法返还一个promise 我们这里定义promise2
    let promise2;
    return (promise2 = new Promise((reslove, reject) => {
      const status = this.status;
      if (status === Promise.PENDING) {
        /*
          这里就是上边为什么要定义this.resloveCallbacks=[];  this.rejectCallbacks=[];
          两个空数组了，因为会有这样一种情况--
            new Promise(reslove=>{
              setTimeout(()=>{
                reslove(11)
              })
            })
            .then(res=>{
              console.log(res)
            })
          按照promise的设计 then方法一定要在reslove之后才执行，但是
          reslove在setTimeout中，then方法会比setTimeout先执行，此时
          promise的状态还是pending。所以说上边定义两个数组是为了将then里边的
          函数设置成reslove执行后的回调函数，这样即使then执行了，then里边的callback
          也为执行 而接下来的reslove执行 then中的函数才会执行
          reject也是同理
        */
        this.resloveCallbacks.push(value => {
          /*
            使用setTimeout来模拟promise中微任务的机制，因为js中好像除了promise并没有其他
            方法可以调用微任务。。（我知道的就promise）
          */
          setTimeout(() => {
            try {
              const x = onReslove(value);
              Promise.reslovePromise(
                promise2,
                x,
                reslove,
                reject,
                status
              );
            } catch (err) {
              reject(err);
            }
          });
        });
        this.rejectCallbacks.push(error => {
          setTimeout(() => {
            try {
              const x = onReject(error);
              Promise.reslovePromise(
                promise2,
                x,
                reslove,
                reject,
                status
              );
            } catch (err) {
              reject(err);
            }
          });
        });
      } else if (status === Promise.FUFILLED) {
        setTimeout(() => {
          try {
            const x = onReslove(this.value);
            Promise.reslovePromise(promise2, x, reslove, reject, status);
          } catch (err) {
            reject(err);
          }
        });
      } else if (status === Promise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onReject(this.error);
            Promise.reslovePromise(promise2, x, reslove, reject, status);
          } catch (error) {
            reject(err);
          }
        });
      }
    }));
  }
  // catch捕获reject中的值 error也为一个函数
  // 直接代替then中的onReject，此时promise状态为rejected
  // 所以onReject(this.error)可以拿到reject的错误值
  catch (error) {
    return this.then(null, error);
  }
}
```