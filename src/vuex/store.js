import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// import { Notification, Message } from 'element-ui'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  userInfo: null,
  curPage: 'Login',
  curModuleInfo: null,
  cpjhNumber: null,
  workOrderFshortnumber: null,
  workOrderFqty: null,
  curReportInfo: null,
  topLineInfo: null,
  reportPerson: null,
  curWorkId: null,
  selectedAllList: [],
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
  },
  updateCpjhNumber ({commit, state}, CpjhNumber) {
    commit('setCpjhNumber', CpjhNumber)
  },
  updateCurWorkId ({commit, state}, CurWorkId) {
    commit('setCurWorkId', CurWorkId)
  },
  updateReportPerson ({commit, state}, Person) {
    commit('setReportPerson', Person)
  },
  updateCurPage ({commit, state}, CurPage) {
    commit('setCurPage', CurPage)
  },
  updateLjgzOption ({commit, state}, Option) {
    commit('setLjgzOption', Option)
  },
  updateCurReportInfo ({commit, state}, Info) {
    commit('setCurReportInfo', Info)
  },
  updateTopLineInfo ({commit, state}, Info) {
    commit('setTopLineInfo', Info)
  },
  updateSelectedAllList ({commit, state}, Info) {
    commit('setSelectedAllList', Info)
  }
}

const mutations = {
  setUserInfo (state, Info) {
    state.userInfo = Info
  },
  setCurModule (state, Info) {
    state.curModuleInfo = Info
  },
  setCpjhNumber (state, CpjhNumber) {
    state.cpjhNumber = CpjhNumber
  },
  setCurWorkId (state, CurWorkId) {
    state.curWorkId = CurWorkId
  },
  setReportPerson (state, Person) {
    state.reportPerson = Person
  },
  setCurPage (state, CurPage) {
    state.curPage = CurPage
  },
  setLjgzOption (state, Option) {
    state.workOrderFshortnumber = Option.fshortnumber
    state.workOrderFqty = Option.fqty
  },
  setCurReportInfo (state, Info) {
    state.curReportInfo = Info
  },
  setTopLineInfo (state, Info) {
    state.topLineInfo = Info
  },
  setSelectedAllList (state, List) {
    state.selectedAllList = List
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