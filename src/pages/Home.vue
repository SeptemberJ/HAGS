<template>
  <div class="Home">
    <el-row>
      <el-col class="ModuleItem" :span="6" v-if="userInfo.yujing == 1">
        <div class="ItemInner" style="background: #A14F76;">预警消息</div>
      </el-col>
      <el-col class="ModuleItem" :span="6" v-if="userInfo.bigbaobiao == 1">
        <div class="ItemInner" style="background: #A14F76;" @click="toSaleReport">订单看板</div>
      </el-col>
      <el-col class="ModuleItem" :span="6" v-if="userInfo.gongxu == '计划'">
        <div class="ItemInner" style="background: #A14F76;" @click="toMRP">MRP</div>
      </el-col>
      <el-col class="ModuleItem" :span="6">
        <div class="ItemInner" style="background: #A14F76;" @click="toWaiXie">外协</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="ModuleItem" :span="6" v-for="(item, idx) in moduleList" :key="idx">
        <div class="ItemInner" @click="toWorkerOrder(item)">{{item.department}}</div>
      </el-col>
    </el-row>
    <HBhistory v-if="dialogHBHistoryVisible"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import {dateToFormatAll} from '../util/utils'
import HBhistory from '../components/HBhistory'
export default {
  name: 'Home',
  data () {
    return {
      pathName: 'Login',
      navTxt: 'MES-SYSTEM',
      moduleList: [],
      dialogHBHistoryVisible: false,
      curPageHB: 1,
      pageSizeHB: 5,
      sumHB: 0
      // huibaiWorkNo: '',
      // hbHistory: [],
      // dialogHBHistoryVisible: false,
      // dialogShutDownReasonVisible: false,
      // dialogAddFormVisible: false,
      // listLoading: false,
      // btLoading: false,
      // curPageHB: 1,
      // pageSizeHB: 5,
      // sumHB: 0,
      // dialogTimeVisible: false,
      // ifBootUpAgain: false,
      // curWorkId: null,
      // curStartTmie: null, // 记录的开机时间
      // openOrClose: 1, // 0 关机 1 开机
      // time: '', // 开机或关机的提交时间
      // shutDownReasonList: [
      //   {label: '明天汇报', value: '明天汇报'},
      //   {label: '缺料', value: '缺料'},
      //   {label: '明天继续生产', value: '明天继续生产'},
      //   {label: '其他原因', value: '其他原因'}
      // ],
      // shutDownReason: '',
      // shutDownNote: ''
    }
  },
  components: {
    HBhistory
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.getModuleList()
    this.checkShowHBList()
  },
  methods: {
    ...mapActions([
      'updateCurModule',
      'updateCurPage',
      'updateCurWorkId',
      'updateIfJustSee'
    ]),
    // 跳转工单列表
    toWorkerOrder (item) {
      this.updateCurModule(item)
      this.updateCurPage('WorkOrder')
      this.$router.push({name: 'WorkOrder'})
    },
    // 外协进入
    toWaiXie () {
      this.updateCurModule({departid: '', department: '外协'})
      this.updateCurPage('WorkOrder')
      this.$router.push({name: 'WorkOrder'})
    },
    toSaleReport () {
      this.updateCurModule({department: '订单看板', departid: ''})
      this.updateCurPage('SalesReport')
      this.$router.push({name: 'SalesReport'})
    },
    toMRP () {
      this.updateCurModule({department: 'MRP', departid: ''})
      this.updateCurPage('MRPList')
      this.$router.push({name: 'MRPList'})
    },
    // 获取工序模块
    getModuleList () {
      this.Http.get('leaderdepart', {userid: this.userInfo.id}
      ).then(res => {
        this.moduleList = res.data.list.departlist
      }).catch((error) => {
        console.log(error)
      })
    },
    // 汇报历史
    checkShowHBList () {
      let Data = {}
      if (this.huibaiWorkNo) {
        Data = {number: this.pageSizeHB, page_num: this.curPageHB, userid: this.userInfo.id, workno: this.huibaiWorkNo}
      } else {
        Data = {number: this.pageSizeHB, page_num: this.curPageHB, userid: this.userInfo.id}
      }
      this.Http.get('kjyjlist', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.dialogHBHistoryVisible = true
            break
          default:
            this.dialogHBHistoryVisible = false
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    }
    // searchHuibao () {
    //   this.curPageHB = 1
    //   this.checkShowHBList()
    // },
    // // 开关机
    // async showTimeDialog (idx, row, type) {
    //   this.openOrClose = type
    //   if (type === 1) {
    //     let checkYJResult = await this.checkYuJing(row.id)
    //     if (checkYJResult.code === '1') {
    //       // 提示是否查看预警
    //       this.$confirm('有预警是否查看?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         // 显示预警
    //         this.dialogVisibleYJ = true
    //         this.warnsInfo = checkYJResult.list
    //       }).catch(() => {
    //         this.sureShowTime(idx, row, type)
    //       })
    //     } else {
    //       this.sureShowTime(idx, row, type)
    //     }
    //   } else {
    //     this.sureShowTime(idx, row, type)
    //   }
    // },
    // async sureShowTime (idx, row, type) {
    //   if (type === 1 && this.userInfo.gongxu === 'CNC') { // CNC开机需要验证
    //     let ifCanOpertionResult = await this.checkBootUp(row.id)
    //     if (ifCanOpertionResult.code === '1') { // CNC
    //       this.$message({
    //         message: ifCanOpertionResult.message + '!',
    //         type: 'warning'
    //       })
    //       this.ShowaAddCNC(row.id)
    //     } else {
    //       this.dialogTimeVisible = true
    //       let CurTime = await this.getCurTime()
    //       this.time = new Date(CurTime)// new Date()
    //       this.curWorkId = row.id
    //     }
    //   } else {
    //     if (type === 0) {
    //       if (!row.starttime) {
    //         this.$message({
    //           message: '还未开机，不能关机!',
    //           type: 'warning'
    //         })
    //         return false
    //       }
    //       this.curStartTmie = row.starttime
    //     }
    //     this.dialogTimeVisible = true
    //     let CurTime = await this.getCurTime()
    //     this.time = new Date(CurTime)// new Date()
    //     this.curWorkId = row.id
    //   }
    // },
    // getCurTime () {
    //   return new Promise((resolve, reject) => {
    //     this.Http.get('sertime'
    //     ).then(res => {
    //       resolve(res.data.time)
    //     }).catch((error) => {
    //       console.log(error)
    //       this.$message({
    //         message: '服务器繁忙!',
    //         type: 'error'
    //       })
    //     })
    //   })
    // },
    // checkYuJing (Id) {
    //   return new Promise((resolve, reject) => {
    //     this.Http.get('kaijiyujing', {workid: Id}
    //     ).then(res => {
    //       resolve(res.data)
    //     }).catch((error) => {
    //       console.log(error)
    //       this.$message({
    //         message: '服务器繁忙!',
    //         type: 'error'
    //       })
    //     })
    //   })
    // },
    // // 重复开机
    // bootUpAgain (row) {
    //   if (!row.endtime) {
    //     this.$message({
    //       message: '还未关机，不能重复开机!',
    //       type: 'warning'
    //     })
    //     return false
    //   }
    //   this.openOrClose = 2 // 重复开机
    //   this.curWorkId = row.id
    //   this.ifBootUpAgain = true
    //   this.getPeopleList()
    //   this.getDefaultPeopleList()
    //   this.dialogAddFormVisible = true
    // },
    // // CNC检查是否允许开机
    // checkBootUp (id) {
    //   return new Promise((resolve, reject) => {
    //     this.Http.get('checkguanji', {workid: id}
    //     ).then(res => {
    //       resolve(res.data)
    //     }).catch((error) => {
    //       console.log(error)
    //       this.$message({
    //         message: '服务器繁忙!',
    //         type: 'error'
    //       })
    //     })
    //   })
    // },
    // // 开关机保存时间
    // submitTime () {
    //   if (this.openOrClose === 0) {
    //     this.shutDown()
    //   } else {
    //     this.bootUp()
    //   }
    // },
    // // 提交开机时间
    // bootUp () {
    //   this.btLoading = true
    //   this.Http.post('kaiji?starttime=' + dateToFormatAll(this.time) + '&workid=' + this.curWorkId
    //   ).then(res => {
    //     switch (res.data.code) {
    //       case 1:
    //         this.$message({
    //           message: '开机成功!',
    //           type: 'success'
    //         })
    //         this.btLoading = false
    //         this.dialogTimeVisible = false
    //         this.checkShowHBList()
    //         break
    //       default:
    //         this.btLoading = false
    //         this.$message({
    //           message: res.data.message + '!',
    //           type: 'error'
    //         })
    //     }
    //   }).catch((error) => {
    //     console.log(error)
    //     this.btLoading = false
    //     this.$message({
    //       message: '服务器繁忙!',
    //       type: 'error'
    //     })
    //   })
    // },
    // // 提交关机时间
    // shutDown () {
    //   let DateStart = this.$moment(this.curStartTmie)
    //   let DateEnd = this.$moment(dateToFormatAll(this.time))
    //   let worktime = DateEnd.diff(DateStart, 'minute')
    //   this.btLoading = true
    //   this.Http.post('guanji?endtime=' + dateToFormatAll(this.time) + '&workid=' + this.curWorkId + '&worktime=' + worktime
    //   ).then(res => {
    //     switch (res.data.code) {
    //       case '1':
    //         this.$message({
    //           message: '关机成功!',
    //           type: 'success'
    //         })
    //         this.btLoading = false
    //         this.shutDownReason = ''
    //         this.dialogTimeVisible = false
    //         this.checkShowHBList()
    //         // 关机后是否进行汇报
    //         this.$confirm('是否汇报产量?', '提示', {
    //           confirmButtonText: '否',
    //           cancelButtonText: '是',
    //           type: 'warning'
    //         }).then(() => {
    //           this.dialogShutDownReasonVisible = true
    //         }).catch((error) => {
    //           console.log(error)
    //           // 再次弹出
    //           this.$confirm('请再次确认是否汇报产量?', '提示', {
    //             confirmButtonText: '否',
    //             cancelButtonText: '是',
    //             type: 'warning'
    //           }).then(() => {
    //             this.dialogShutDownReasonVisible = true
    //           }).catch((error) => {
    //             console.log(error)
    //           })
    //         })
    //         break
    //       default:
    //         this.btLoading = false
    //         this.$message({
    //           message: res.data.message + '!',
    //           type: 'error'
    //         })
    //     }
    //   }).catch((error) => {
    //     console.log(error)
    //     this.btLoading = false
    //     this.$message({
    //       message: '服务器繁忙!',
    //       type: 'error'
    //     })
    //   })
    // },
    // // 提交关机原因
    // submitShutDownReason () {
    //   if (!this.shutDownReason) {
    //     this.$message({
    //       message: '请选择关机原因!',
    //       type: 'warning'
    //     })
    //     return false
    //   } else {
    //     if ((this.shutDownReason === '缺料' || this.shutDownReason === '其他原因') && !this.shutDownNote) {
    //       this.$message({
    //         message: '请先输入备注再提交!',
    //         type: 'warning'
    //       })
    //       return false
    //     } else {
    //       this.btLoading = true
    //       this.Http.post('guanjireason?workid=' + this.curWorkId + '&freason=' + this.shutDownReason + '&fnote=' + this.shutDownNote
    //       ).then(res => {
    //         switch (res.data.code) {
    //           case '1':
    //             this.$message({
    //               message: '关机原因提交成功!',
    //               type: 'success'
    //             })
    //             this.dialogShutDownReasonVisible = false
    //             this.btLoading = false
    //             break
    //           default:
    //             this.btLoading = false
    //             this.$message({
    //               message: res.data.message + '!',
    //               type: 'error'
    //             })
    //         }
    //       }).catch((error) => {
    //         console.log(error)
    //         this.btLoading = false
    //         this.$message({
    //           message: '服务器繁忙!',
    //           type: 'error'
    //         })
    //       })
    //     }
    //   }
    // },
    // // 添加人员
    // addPerson (type) {
    // },
    // // 查看汇报详情 未关机的只能查看到详情为止
    // seeHistoryDetail (row) {
    //   if (!row.endtime) {
    //     this.updateIfJustSee(true)
    //   } else {
    //     this.updateIfJustSee(false)
    //   }
    //   this.updateCurWorkId(row.id)
    //   this.updateCurPage('HBDetail')
    //   this.$router.push({name: 'HBDetail'})
    // }
  }
}
</script>

<style lang="less" scoped>
.Home{
  width: 100%;
  overflow: hidden;
  .TopLineBlock{
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: white;
    font-size: .4rem;
    background: #4A5F7A;
  }
  .ModuleItem{
    margin-top: .5rem;
    .ItemInner{
      width: calc(100% - .5rem);
      margin: 0 auto;
      height: 2rem;
      line-height: 2rem;
      font-size: .35rem;
      background: #494e8f;
      color: white;
      cursor: pointer;
    }
  }
}
</style>
