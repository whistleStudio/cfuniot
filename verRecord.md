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
*问题* 如何保证页面刷新，异步请求的数据还未加载至页面，特别是请求数据为对象并需要调用它的属性
"JSON.stringify(books) !== '[]'" 或者 加入统一的标志位
[02171749] 节流 闭包 传参