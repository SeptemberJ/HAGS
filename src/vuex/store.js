import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// import { Notification, Message } from 'element-ui'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  userInfo: null,
  curModuleInfo: null,
  urlPre: 'http://ep23767307.qicp.vip:31379/haianJK/',
  imgPreUrl: 'http://ep23767307.qicp.vip:31379/upload/'
}
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

// actions dispatch触发
const actions = {
  unitUserInfo ({commit, state}, Info) {
    commit('setUserInfo', Info)
  },
  updateCurModule ({commit, state}, Info) {
    commit('setCurModule', Info)
  }
}

const mutations = {
  setUserInfo (state, Info) {
    state.userInfo = Info
  },
  setCurModule (state, Info) {
    state.curModuleInfo = Info
  }
}

export default new Vuex.Store({
  state,
  modules: {
  },
  actions,
  mutations,
  plugins: [vuexLocal.plugin]
})
