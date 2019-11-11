import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../vuex/store'
import Login from '@/pages/Login'
import SalesReport from '@/pages/SalesReport'
import ModifyPSD from '@/pages/ModifyPSD'
import Home from '@/pages/Home'
import WorkOrder from '@/pages/WorkOrder'
import Ljgz from '@/pages/Ljgz'
import Report from '@/pages/Report'
import History from '@/pages/History'
import WarnPrint from '@/pages/WarnPrint'
import HBDetail from '@/pages/HBDetail'

import MRPList from '@/pages/MRP/OrderList'
import AddMRP from '@/pages/MRP/AddOrder'
import MRPDetail from '@/pages/MRP/OrderDetail'
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
      path: '/SalesReport',
      name: 'SalesReport',
      component: SalesReport,
      meta: {requireAuth: true}
    },
    {
      path: '/ModifyPSD',
      name: 'ModifyPSD',
      component: ModifyPSD,
      meta: {requireAuth: true}
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
    {
      path: '/MRPList',
      name: 'MRPList',
      component: MRPList,
      meta: {requireAuth: true}
    },
    {
      path: '/AddMRP',
      name: 'AddMRP',
      component: AddMRP,
      meta: {requireAuth: true}
    },
    {
      path: '/MRPDetail',
      name: 'MRPDetail',
      component: MRPDetail,
      meta: {requireAuth: true}
    },
    {path: '*', redirect: '/Login'}
  ]
})

// 登录控制
router.beforeEach((to, from, next) => {
  // store.dispatch('updateBeforePage', router.currentRoute.name)
  if (to.name === 'WorkOrder') {
    store.dispatch('updateCurWorkId', null)
  }
  if (to.meta.requireAuth) {
    if (getCookie('gs_28a807940bba58c2c')) {
      next()
      store.dispatch('updateCurPage', to.name)
    } else {
      localStorage.clear()
      next({
        path: '/Login'
      })
      store.dispatch('updateCurPage', 'Login')
    }
  } else {
    next()
    store.dispatch('updateCurPage', to.name)
  }
  // store.dispatch('changePath', to.name)
})
export default router
