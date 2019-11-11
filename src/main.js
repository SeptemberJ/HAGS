// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import Http from './util/request'
import Send from './util/send'
import '../static/css/style.css'
import 'lib-flexible'
import moment from 'moment'
import x2js from 'x2js' // xml数据处理插件
// import '../static/js/common.js'

Vue.prototype.Http = Http
Vue.prototype.Send = Send
Vue.prototype.$moment = moment
Vue.prototype.$x2js = new x2js() // 创建x2js对象，挂到vue原型上

Vue.use(Vuex)
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
