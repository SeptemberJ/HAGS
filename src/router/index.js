import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../vuex/store'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import WorkOrder from '@/pages/WorkOrder'
import Ljgz from '@/pages/Ljgz'
import Report from '@/pages/Report'
import History from '@/pages/History'
import WarnPrint from '@/pages/WarnPrint'
import HBDetail from '@/pages/HBDetail'
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
    {
      path: '/HBDetail',
      name: 'HBDetail',
      component: HBDetail,
      meta: {requireAuth: true}
    },
    {
      path: '/Ljgz',
      name: 'Ljgz',
      component: Ljgz,
      meta: {requireAuth: true}
    },
    {
      path: '/Report',
      name: 'Report',
      component: Report,
      meta: {requireAuth: true}
    },
    {
      path: '/History/:id',
      name: 'History',
      component: History,
      meta: {requireAuth: true}
    },
    {
      path: '/WarnPrint',
      name: 'WarnPrint',
      component: WarnPrint,
      meta: {requireAuth: true}
    },
    {path: '*', redirect: '/Login'}
  ]
})

// 登录控制
router.beforeEach((to, from, next) => {
  if (to.name === 'WorkOrder') {
    store.dispatch('updateCurWorkId', null)
  }
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
