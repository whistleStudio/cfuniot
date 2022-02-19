import Vue from 'vue'
import App from './App.vue'
import router from "@/router/index.js"
import store from "@/store"

Vue.config.productionTip = false
/* 计时器归零 */
Vue.prototype.$clearTim = function () {
  clearInterval(store.state.timGra)
}
Vue.prototype.$th = function (fn) {return ()=>{fn()}}
/* 节流 */
Vue.prototype.$throttle = function (fn, t=1000, info=1) {
  let valid = true
  return function () {
    console.log('ssss', valid)
    if (valid) {
      fn()
      valid = false
      setTimeout(() => {
        valid = true
      }, t)
    } else {
      switch (info) {
        case 1: alert('数据发送频率过快，休息一会儿吧'); break;
      }
    }
  }
}

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
