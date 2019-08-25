<template>
  <div class="TopLineBlock">
    <div class="BackBlock">
      <span class="CursorPointer" @click="back"><i class="el-icon-arrow-left" title="返回"></i></span>
    </div>
    <div class="MainBlock"><span>{{navTxt}} {{curPlantNumber ? '\xa0\xa0\xa0\xa0\xa0\xa0\xa0成品计划数：' + curPlantNumber : ''}}</span></div>
    <div class="RightAccount">您好,{{userInfo.fname}}<span class="CursorPointer" style="margin-left: 10px;" @click="logOut"><i class="fa fa-sign-out" title="退出"></i></span></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {clearCookie} from '../util/utils'
export default {
  name: 'TopLineBlock',
  props: ['navTxt', 'pathName', 'warnVisible', 'detailVisible', 'reportVisible', 'historyVisible', 'curPlantNumber'],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      userInfo: state => state.userInfo
    })
  },
  watch: {
    navTxt: function () {
      alert('hahah')
    }
  },
  methods: {
    back () {
      if (this.warnVisible) {
        this.$emit('closeWarnVisible')
      }
      if (this.detailVisible && !this.reportVisible && !this.historyVisible) {
        this.$emit('closeDetailVisible')
      }
      if (this.detailVisible && this.reportVisible && !this.historyVisible) {
        this.$emit('closeReportVisible')
      }
      if (this.historyVisible) {
        this.$emit('closeHistoryVisible')
      }
      if (!this.warnVisible && !this.detailVisible && !this.reportVisible) {
        this.$router.push({name: this.pathName})
      }
    },
    logOut () {
      this.$confirm('确认退出当前账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.clear('vuex-along')
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
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  color: white;
  font-size: .4rem;
  background: #4A5F7A;
  .BackBlock{
    width: 10%;
    float: left;
    text-align: left;
    span{
      display: inline-block;
      padding-right: .2rem;
    }
  }
  .MainBlock{
    width: 80%;
    float: left;
    span{
      width: 100%;
      height: 100%;
      display: inline-block;
    }
  }
  .RightAccount{
    width: 10%;
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
