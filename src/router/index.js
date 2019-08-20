import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../vuex/store'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import WorkOrder from '@/pages/WorkOrder'
import {getCookie} from '@/util/utils'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      meta: {requireAuth: false}
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {requireAuth: true}
    },
    {
      path: '/WorkOrder',
      name: 'WorkOrder',
      component: WorkOrder,
      meta: {requireAuth: true}
    },
    {path: '*', redirect: '/Login'}
  ]
})

// 登录控制
router.beforeEach((to, from, next) => {
  // store.dispatch('changePath', to.name)
  if (to.meta.requireAuth) {
    if (getCookie('gs_28a807940bba58c2c')) {
      next()
    } else {
      localStorage.clear()
      next({
        path: '/Login'
      })
    }
  } else {
    next()
  }
  // store.dispatch('changePath', to.name)
})
export default router
