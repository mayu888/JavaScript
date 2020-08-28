
### try catch finally
一般来讲都是try先执行然后catch最后finally
```js
function f(){
  try{
    return 'try'
  }finally{
    console.log('finally')
  }
  console.log(222)
}
console.log(f()) //finally try
在代码执行顺序上是try先执行，然后return将f()的值设为'try',然后执行finally，打印'finally',最后f函数执行完毕。函数外打印f执行的结果'try'
```
throw和return一样也同样是这个道理
```js
function f(){
  try{
    throw 'try'
  }finally{
    console.log('finally')
  }
  console.log(222)
}
console.log(f())  // finally   Uncaught try
```
若是finally中抛出了异常，那么程序就会终止，同时try中return的值也会被异常值覆盖
```js
function f(){
  try{
    return 'try'
  }finally{
    throw 'finally'
  }
}
console.log(f()) //Uncaught finally
```
同时，finally中return的值也会覆盖try中return的值
```js
function f(){
  try{
    return 'try'
  }finally{
    return 'finally'
  }
}
console.log(f()) //finally
若是没有return任何值亦是如此
function f(){
  try{
    return 'try'
  }finally{
    return 
  }
}
console.log(f())  // undefined
```