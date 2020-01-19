<template>
  <div class="TopLineBlock">
    <div class="BackBlock">
      <span class="CursorPointer" @click="back"><i class="el-icon-arrow-left" title="返回"></i></span>
    </div>
    <div class="MainBlock" v-if="curPage == 'Home' || curPage == 'ModifyPSD'"><span>MES-SYSTEM</span></div>
    <div class="MainBlock" v-if="curPage == 'WorkOrder' || curPage == 'SalesReport' || curPage == 'MRPList' || curPage == 'AddMRP' || curPage == 'MRPDetail' || curPage == 'HBDetail' || curPage == 'MaintenanceIndex' || curPage == 'MaintenanceList' || curPage == 'MaintenanceAdd' || curPage == 'MaintenanceDetail' || curPage == 'CheckedWarnPrint'"><span>{{curModuleInfo.department + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + '汇报人: ' + userInfo.fname + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0工种: ' + userInfo.gongxu}}</span></div>
    <div class="MainBlock" v-if="curPage != 'Home' && curPage != 'WorkOrder' && curPage != 'SalesReport' && curPage != 'MRPList' && curPage != 'AddMRP' && curPage != 'MRPDetail' && curPage != 'HBDetail' && curPage != 'MaintenanceIndex' && curPage != 'MaintenanceList' && curPage != 'MaintenanceAdd' && curPage != 'MaintenanceDetail' && curPage != 'CheckedWarnPrint'"><span>{{curModuleInfo.department + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + '汇报人: ' + userInfo.fname + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0成品计划数：' + workOrderFqty + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0工种: ' + userInfo.gongxu}}</span></div>
    <div class="RightAccount">您好, {{userInfo.fname}}
      <!-- <span>{{beforePage}}--{{ljgzFromType}}--{{curPage}}</span> -->
      <span class="CursorPointer" style="margin-left: 10px;" @click="toMofify"><i class="el-icon-edit" title="修改密码"></i></span>
      <span class="CursorPointer" style="margin-left: 5px;" @click="logOut"><i class="fa fa-sign-out" title="退出"></i></span>
      </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {clearCookie} from '../util/utils'
export default {
  name: 'TopLineBlock',
  data () {
    return {
      // ljgzFromType: 0 // 0 WorkerOrder 1 HBDetail 2 salesReport
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      userInfo: state => state.userInfo,
      curPage: state => state.curPage,
      beforePage: state => state.beforePage,
      workOrderIdCNC: state => state.workOrderIdCNC,
      ifKeepShow: state => state.ifKeepShow,
      workOrderFqty: state => state.workOrderFqty
    }),
    ljgzFromType: function () {
      if (this.beforePage === 'WorkOrder') {
        return 0
      }
      if (this.beforePage === 'HBDetail') {
        return 1
      }
      if (this.beforePage === 'SalesReport') {
        return 2
      }
    }
  },
  created () {
  },
  // watch: {
  //   curPage: function (newVal, oldVal) {
  //     if (oldVal === 'WorkOrder' && newVal === 'Ljgz') {
  //       this.ljgzFromType = 0
  //     }
  //     if (oldVal === 'HBDetail' && newVal === 'Ljgz') {
  //       this.ljgzFromType = 1
  //     }
  //     if (oldVal === 'SalesReport' && newVal === 'Ljgz') {
  //       this.ljgzFromType = 2
  //     }
  //   }
  // },
  methods: {
    ...mapActions([
      'updateCurPage',
      'updateCurWorkId',
      'updateBeforePage'
    ]),
    back () {
      if (this.$route.name === 'Home') {
        this.updateCurPage('Login')
        this.$router.push({name: 'Login'})
      }
      if (this.$route.name === 'SalesReport') {
        this.updateCurPage('Home')
        this.$router.push({name: 'Home'})
      }
      if (this.$route.name === 'MRPList') {
        this.updateCurPage('Home')
        this.$router.push({name: 'Home'})
      }
      if (this.$route.name === 'AddMRP') {
        this.updateCurPage('MRPList')
        this.$router.push({name: 'MRPList'})
      }
      if (this.$route.name === 'MRPDetail') {
        this.updateCurPage('MRPList')
        this.$router.push({name: 'MRPList'})
      }
      if (this.$route.name === 'MaintenanceIndex') {
        this.updateCurPage('Home')
        this.$router.push({name: 'Home'})
      }
      if (this.$route.name === 'MaintenanceList') {
        this.updateCurPage('MaintenanceIndex')
        this.$router.push({name: 'MaintenanceIndex'})
      }
      if (this.$route.name === 'MaintenanceAdd') {
        this.updateCurPage('MaintenanceIndex')
        this.$router.push({name: 'MaintenanceIndex'})
      }
      if (this.$route.name === 'MaintenanceDetail') {
        this.updateCurPage('MaintenanceList')
        this.$router.push({name: 'MaintenanceList'})
      }
      if (this.$route.name === 'WorkOrder') {
        this.updateCurPage('Home')
        this.$router.push({name: 'Home'})
      }
      if (this.$route.name === 'HBDetail') {
        this.updateCurPage('WorkOrder')
        this.$router.push({name: 'WorkOrder'})
      }
      if (this.$route.name === 'WarnPrint') {
        this.updateCurPage('WorkOrder')
        this.$router.push({name: 'WorkOrder'})
      }
      if (this.$route.name === 'Ljgz' && this.ljgzFromType === 0) {
        this.updateCurPage('WorkOrder')
        this.$router.push({name: 'WorkOrder'})
      }
      if (this.$route.name === 'Ljgz' && this.ljgzFromType === 1) {
        this.updateCurPage('HBDetail')
        this.$router.push({name: 'HBDetail'})
      }
      if (this.$route.name === 'Ljgz' && this.ljgzFromType === 2) {
        this.updateCurPage('SalesReport')
        this.$router.push({name: 'SalesReport'})
      }
      if (this.$route.name === 'CheckedWarnPrint') {
        this.updateCurPage('SalesReport')
        this.$router.push({name: 'SalesReport'})
      }
      if (this.$route.name === 'Report') {
        this.updateCurPage('Ljgz')
        this.$router.push({name: 'Ljgz'})
      }
      if (this.$route.name === 'History') {
        this.updateCurPage('Report')
        this.$router.push({name: 'Report'})
      }
      if (this.$route.name === 'ModifyPSD') {
        this.updateCurPage(this.beforePage)
        this.$router.push({name: this.beforePage})
      }
    },
    toMofify () {
      this.updateBeforePage(this.curPage)
      this.updateCurPage('ModifyPSD')
      this.$router.push({name: 'ModifyPSD'})
    },
    logOut () {
      this.$confirm('确认退出当前账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.clear('vuex-along')
        this.updateCurPage('Login')
        this.$router.push({name: 'Login'})
        clearCookie('gs_28a807940bba58c2c')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.TopLineBlock{
  width: 100%;
  height: 0.8rem;
  display: block;
  line-height: 0.8rem;
  text-align: center;
  color: white;
  font-size: .3rem;
  background: #4A5F7A;
  position: fixed;
  top: 0;
  z-index: 99;
  .BackBlock{
    width: 5%;
    float: left;
    text-align: left;
    span{
      display: inline-block;
      padding-right: .2rem;
    }
  }
  .MainBlock{
    width: 75%;
    float: left;
    span{
      width: 100%;
      height: 100%;
      display: inline-block;
    }
  }
  .RightAccount{
    width: 20%;
    float: left;
    text-align: right;
    font-size: .2rem;
    span{
      display: inline-block;
      padding-right: .2rem;
    }
  }
}
</style>
