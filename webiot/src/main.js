import Vue from 'vue'
import App from './App.vue'
import router from "@/router/index.js"
import store from "@/store"

Vue.config.productionTip = false

Vue.prototype.clearTim = function () {
  store.state.tim.forEach(e => {
    clearInterval(e)
  });
}

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
