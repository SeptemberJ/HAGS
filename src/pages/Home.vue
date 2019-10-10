<template>
  <div class="Home">
    <el-row>
      <el-col class="ModuleItem" :span="6" v-if="userInfo.yujing == 1">
        <div class="ItemInner" style="background: #A14F76;">预警消息</div>
      </el-col>
      <el-col class="ModuleItem" :span="6" v-if="userInfo.bigbaobiao == 1">
        <div class="ItemInner" style="background: #A14F76;" @click="toSaleReport">销售报表</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="ModuleItem" :span="6" v-for="(item, idx) in moduleList" :key="idx">
        <div class="ItemInner" @click="toWorkerOrder(item)">{{item.department}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      pathName: 'Login',
      navTxt: 'MES-SYSTEM',
      moduleList: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.getModuleList()
  },
  methods: {
    ...mapActions([
      'updateCurModule',
      'updateCurPage'
    ]),
    // 跳转工单列表
    toWorkerOrder (item) {
      this.updateCurModule(item)
      this.updateCurPage('WorkOrder')
      this.$router.push({name: 'WorkOrder'})
    },
    toSaleReport () {
      this.updateCurModule({department: '销售报表', departid: null})
      this.updateCurPage('SalesReport')
      this.$router.push({name: 'SalesReport'})
    },
    // 获取工序模块
    getModuleList () {
      this.Http.get('leaderdepart', {userid: this.userInfo.id}
      ).then(res => {
        this.moduleList = res.data.list.departlist
      }).catch((error) => {
        console.log(error)
      })
    }
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
