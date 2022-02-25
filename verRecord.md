[02102320] bootstrap引入 base.css创建 login页面迁移 
[02121112] 创建serve文件 login逻辑迁移 devServer代理(web8081,server8082) vuex安装
[02131155] sessionStorage添加token, router.beforeEach路由拦截判定是否存在token
[02132013] /user页面布局 /user/device(ctrl,data)路由，bootstrap模态框弹出，modal父级不要设置position:fixed
[02132055] u0页面布局
[0214] u1 u2 页面布局
u0-fn: rGenCode ✔
[02151213] vuex state设置 
user-fn: rGetUserInfo ✔
NavBar view数据绑定
[02152255] 今天去医院做了推拿，感觉还行吧 行吧(和阿宝一起)
user-fn: rGetDevInfoReset ✔ 请求devs, 并初始化全局state
user-fn: rGetUserInfo 将lvl请求也加了进去
[02161130] NavBar-fn: changeAvatar ✔
NavBar-fn: changeName ✔ NavBar-fn: rUpLvl ✔ 
原user.js差密码修改
[02161738] u0-fn: rGetDevList ✔ u0-fn: regNewDev ✔ u0-fn: delDev ✔
[02162321] u0-fn: editDev ✔ u0页面完成
u1 curDevs clearTim
[02171402] 
*问题* 如何保证页面刷新，异步请求的数据还未加载至页面，特别是请求数据为对象并需要调用它的属性 **blog**
"JSON.stringify(books) !== '[]'" 或者 加入统一的标志位
[02171749] 节流 闭包 传参 utils: throttle ✔  arguments**blog**
[02172320] u1-fn: btnClick,changeRan,sendMsg (后台mqtt数据发送应该也是通的)✔ utils: getTextLen ✔ 该处理comment了
*问题* changeArrVal是否要分开写 提高效率?还有待商榷
[02180957] comment缓慢弹出用了 vue处理css animation的方法, 其实就是定义一个类，然后需要执行的时候让绑定的类值为true就行了**blog**
[02181730] 组件PComment ✔ watch属性体验不错，由数据变化需要触发的方法可以使用，需要注意newVal preVal; utils:dateFormat;u2 按钮开关和state同步, 还差图表按钮; 记得修改server tokenVerify expireTime
[02191256] 关于@绑定事件（利用闭包）view更新不会创建新的作用域; 测试OK 不刷新的话，主页面切换计时器有持续性
*问题* 后台提高鲁棒性，请求数据库文档时 判断条件!err&&doc
[02201111] dataShow ✔
*问题* data,msg逻辑有重复 考虑代码复用
[02211730] echart实例挂载
*问题*  echart v-if, invalid init, 路由跳转非刷新，无法创建新的图表实例
[02212315] u2 基本OK，还是不把图表放在v-if里面解决↑
u2 v-if 刷新多出来一坨东西，加key 复用问题 <a href="https://segmentfault.com/q/1010000039976435">解决办法链接</a> 
*问题* 删除设备时报错
[02221733] mutations内部调用getter方法, 通过commit参数传递；下次设计一定要考虑到请求的数据索引是一个是不变的ID；数据页数据规划和图表完成
*问题* 表格writeBuffer有问题
[02222316] excel请求完成 页面更新会需要些时间，有时可以加些延时
```
var event = new MouseEvent("click", {bubbles:false})
el.dispatchEvent(event)
```
[02231730] register页面重写, 数据集中, 清晰多了
vue methods里面写闭包
```
methodName: (()=>{
    return function (params) {

    }
})()
```
methods定义方法这样玩，this不是vue实例;(假设bar返回一个函数并接收一个fn参数，this.foo是一函数)
methodName: this.foo
methodName: bar(this.foo) 
但这样写就是了
methodName: fn(function () {
    this.foo()
})
开始写resetPwd页面了，之前写的居然还漏了密码重置，简直了
[02241257] resetPwd完成，基本上重构完成；console.log打包消除待解决
[02241611] 纠正了图表的3个bug, 丑化插件，还没办法跟着一起打包
[0202251318] 丑化插件没法正常打包多半是因为package.json里写的版本号不对，解决方法就是上npm查一下究竟有啥版本；另外，当一个包没法正常npm uninstall时，可能也是因为其它包版本不对没有正常安装
优化了首页加载速度，采用cdn外链引入，找cdn途径：1去npm上查查 2搜索cdn xxx
vue-router引入，比较特别项目有import会报$router重复定义错误, 解决办法: cdn引入后,卸载vue-router,并注释掉相关 import vue-router 引用