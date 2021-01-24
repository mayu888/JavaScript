# script的执行时机

```html
<script src='a.js'></script>
<script src='b.js'></script>
<div>111</div>
```
在上面的代码中，`a.js`和`b.js`是异步下载的，也就是`a.js`文件和`b.js`文件是同时取下载的，这是浏览器的特性，但是执行机制确实顺序执行的，假设`b.js`比`a.js`先下载完，那么`b.js`中的代码是不会先执行的，会等到`a.js`代码**下载并执行完成后**才会去执行`b.js`中的代码，并且`<div>111</div>`这个dom标签是等到上面的js文件**全部下载并执行完成后才会加载**，也就是`<div>111</div>`什么时候渲染，取决于两个js文件什么时候下载并执行完。所以说`script`是会影响dom渲染的。但是有一点需要注意：若是js文件中有异步代码，那么dom解析是不需要等到异步代码执行完的。


## defer 延迟执行
```html
<script src='a.js' defer></script>
<script src='b.js' defer></script>
<div>111</div>
```
若是给script加上`defer`属性，表示遇到`</html>`标签才执行。
也就是不必等到js文件下载并执行完下边的dom就已经渲染出来了。过程是这样的：
浏览器请求`a.js` & 请求`b.js`->渲染`<div>111</div>`,渲染完成，看`a.js`和`b.js`是否已经下载完，若是下载完先执行完`a.js`在执行`b.js`。但是书上说，`b.js`并不一定在`a.js`文件执行完执行。

```html
<script src='a.js'></script>
<script src='b.js' defer></script>
<div>111</div>
```
那么这种情况呢？那么`<div>111</div>`必须等到`a.js`**下载并执行完**才会被渲染，并且`b.js`也是渲染完</html>标签才会被执行。

## async 异步加载

```html
<script src='a.js' async></script>
<script src='b.js' async></script>
<div>111</div>
```
与`defer`相同的是，带有`async`属性的script标签也不会阻塞dom渲染，就算是`a.js`和`b.js`没有下载执行完，那么`<div>111</div>`也是可以被渲染出来的。但是不同的是，它们是异步执行的，也就是说，若是`b.js`先下载完成，那么它可以立即执行，就不会等到`a.js`下载执行完。

```html
<script src='a.js'></script>
<script src='b.js' async></script>
<div>111</div>
```
那么这种情况呢？`<div>111</div>`会等到`a.js`下载并执行完才会被渲染。

# 总结
1. 不加任何属性的script标签是异步加载、同步执行的。
2. defer属性的script标签也是异步加载，同步执行，但是执行时机是渲染完</html>标签后同步执行。
3. async属性的标签是异步加载，加载完立即执行，也就是让其他标签异步渲染。