
import App from './App.vue'
import router from "@/router/index.js"
import store from "@/store"
// import * as echarts from "echarts"
import  fetchJsonp  from  "fetch-jsonp"

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
Vue.prototype.$fetchJsonp = fetchJsonp



new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
