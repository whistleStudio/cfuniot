
import App from './App.vue'
import router from "@/router/index.js"
import store from "@/store"
// import * as echarts from "echarts"

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts




new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
