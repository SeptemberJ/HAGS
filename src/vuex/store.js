import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// import { Notification, Message } from 'element-ui'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  userInfo: null,
  curPage: 'Login',
  beforePage: '',
  curModuleInfo: null,
  curSalesGX: '全部',
  reportBtIfShow: true,
  cpjhNumber: null,
  workOrderFshortnumber: null,
  workOrderFqty: null,
  workOrderFbillno: null,
  workOrderDdfbillno: null,
  workOrderIdCNC: null,
  ifKeepShow: false,
  HBList: [],
  curReportInfo: null,
  topLineInfo: null,
  reportPerson: null,
  curWorkId: null,
  ifJustSee: false,
  curFbillno: null,
  selectedAllList: [],
  SR_filterOrderNo: '',
  SR_filterUSATime: '',
  SR_filterProductionKind: '',
  SR_filterProductionName: '',
  SR_filterStatus: '',
  SR_filterbl: '',
  SR_filterblnote: '',
  SR_fcheckdate: ['', ''],
  SR_filterisopen: false,
  SR_filterisrkwwc: false,
  SR_filterisyj: false,
  checkedWarnPrint: [], // 勾选的打印订单
  // mrp
  filterOrderNo_MRP: '',
  filterPerson_MRP: '',
  filterCode_MRP: '',
  ifHasTF_MRP: false,
  orderMRPId: '',
  maintenanceId: '',
  urlPre: 'http://10.0.0.13:31379/haianJK/',
  imgPreUrl: 'http://10.0.0.13:31379/upload/'
  // urlPre: 'http://ep23767307.qicp.vip:31379/haianJK/',
  // imgPreUrl: 'http://ep23767307.qicp.vip:31379/upload/'
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
  updateCurSalesGX ({commit, state}, Gongxu) {
    commit('setCurSalesGX', Gongxu)
  },
  updateReportBtIfShow ({commit, state}, STATUS) {
    commit('setReportBtIfShow', STATUS)
  },
  updateCpjhNumber ({commit, state}, CpjhNumber) {
    commit('setCpjhNumber', CpjhNumber)
  },
  updateCurWorkId ({commit, state}, CurWorkId) {
    commit('setCurWorkId', CurWorkId)
  },
  updateIfJustSee ({commit, state}, Status) {
    commit('setIfJustSee', Status)
  },
  updateCurFbillno ({commit, state}, CurFbillno) {
    commit('setCurFbillno', CurFbillno)
  },
  updateReportPerson ({commit, state}, Person) {
    commit('setReportPerson', Person)
  },
  updateCurPage ({commit, state}, CurPage) {
    commit('setCurPage', CurPage)
  },
  updateBeforePage ({commit, state}, BeforePage) {
    commit('setBeforePage', BeforePage)
  },
  updateLjgzOption ({commit, state}, Option) {
    commit('setLjgzOption', Option)
  },
  updateCheckedWarnPrint ({commit, state}, List) {
    commit('setCheckedWarnPrint', List)
  },
  updateLjgzLjgzIdCNC ({commit, state}, Id) {
    commit('setLjgzIdCNC', Id)
  },
  // updateIfKeepShow ({commit, state}, Status) {
  //   commit('setIfKeepShow', Status)
  // },
  updateCurReportInfo ({commit, state}, Info) {
    commit('setCurReportInfo', Info)
  },
  updateTopLineInfo ({commit, state}, Info) {
    commit('setTopLineInfo', Info)
  },
  updateSelectedAllList ({commit, state}, Info) {
    commit('setSelectedAllList', Info)
  },
  // MRP
  updateOrderMRPId ({commit, state}, OrderMRPId) {
    commit('setOrderMRPId', OrderMRPId)
  },
  updateMaintenanceId ({commit, state}, MaintenanceId) {
    commit('setMaintenanceId', MaintenanceId)
  }
}

const mutations = {
  setUserInfo (state, Info) {
    state.userInfo = Info
  },
  setCurModule (state, Info) {
    state.curModuleInfo = Info
  },
  setCurSalesGX (state, Gongxu) {
    state.curSalesGX = Gongxu
  },
  setReportBtIfShow (state, STATUS) {
    state.reportBtIfShow = STATUS
  },
  setCpjhNumber (state, CpjhNumber) {
    state.cpjhNumber = CpjhNumber
  },
  setCurWorkId (state, CurWorkId) {
    state.curWorkId = CurWorkId
  },
  setIfJustSee (state, Status) {
    state.ifJustSee = Status
  },
  setCurFbillno (state, curFbillno) {
    state.curFbillno = curFbillno
  },
  setReportPerson (state, Person) {
    state.reportPerson = Person
  },
  setCurPage (state, CurPage) {
    state.curPage = CurPage
  },
  setBeforePage (state, BeforePage) {
    state.beforePage = BeforePage
  },
  setLjgzOption (state, Option) {
    state.workOrderFshortnumber = Option.fshortnumber
    state.workOrderFqty = Option.fqty
    state.workOrderFbillno = Option.fbillno
    state.workOrderDdfbillno = Option.ddfbillno
  },
  setCheckedWarnPrint (state, List) {
    state.checkedWarnPrint = List
  },
  setLjgzIdCNC (state, Id) {
    state.workOrderIdCNC = Id
  },
  // setIfKeepShow (state, Status) {
  //   state.ifKeepShow = Status
  // },
  setCurReportInfo (state, Info) {
    state.curReportInfo = Info
  },
  setTopLineInfo (state, Info) {
    state.topLineInfo = Info
  },
  setSelectedAllList (state, List) {
    state.selectedAllList = List
  },
  // MRP
  setOrderMRPId (state, OrderMRPId) {
    state.orderMRPId = OrderMRPId
  },
  setMaintenanceId (state, MaintenanceId) {
    state.maintenanceId = MaintenanceId
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
