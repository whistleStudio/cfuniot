import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: "history"
})

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token")
  if (token || to.path === "/login" || to.path === "/register") {
    next()
  } else {
    next("/login")
    alert("token失效, 请重新登录")
  }


})

export default router