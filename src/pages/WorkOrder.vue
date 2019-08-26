<template>
  <div class="WorkOrder">
    <TopLineBlock :pathName="pathName" :navTxt='navTxt' :warnVisible='warnVisible' :detailVisible='detailVisible' :reportVisible='reportVisible' :historyVisible="historyVisible" :curPlantNumber="curPlantNumber" @closeWarnVisible='closePrint' @closeDetailVisible='closeDetail' @closeReportVisible='closeReport' @closeHistoryVisible="closeHistory"/>
    <!-- <p>{{detailVisible}}{{reportVisible}}{{historyVisible}}</p> -->
    <el-input v-if="!warnVisible && !detailVisible && !reportVisible" v-model="filterProductionName" placeholder="请输入产品名称" clearable>
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <section v-if="!warnVisible && !detailVisible && !reportVisible">
      <el-table @row-dblclick="goDetial"
        :data="orderList"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="fname"
          label="生产车间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="FCheckDateTxt"
          label="日期"
          width="140">
        </el-table-column>
        <el-table-column
          property="fbillno"
          label="工单号"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fnumber"
          label="产品名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fqty"
          label="数量"
          width="100">
        </el-table-column>
        <el-table-column
          property="FPlanFinishDateTxt"
          label="交期"
          width="140">
          <!-- <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              style="color:#606266;"
              @click="changeDate(scope.$index, scope.row)">{{scope.row.FPlanFinishDateTxt}}</el-button>
          </template> -->
        </el-table-column>
        <el-table-column
          property="fshortTxt"
          label="是否缺料"
          width="100">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              :type="scope.row.fshort === 0 ? 'danger' : ''"
              @click="notice(scope.$index, scope.row)">下达</el-button> -->
            <el-button
              size="mini"
              :type="scope.row.yjnum === 0 ? '' : 'danger'"
              @click="warnDetail(scope.$index, scope.row)">预警</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="orderList.length > 0" style="margin: .2rem 0;"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="sum">
      </el-pagination>
    </section>
    <section  v-if="warnVisible">
      <WarnPrint @closePrint="closePrint" :curFShortNumber="curFShortNumber" :timestamp="timestamp"/>
    </section>
    <section  v-if="detailVisible && !reportVisible && !historyVisible">
      <Ljgz @closeDetail="closeDetail" @addReport="addReport" :curPlantNumber="curPlantNumber" :curFShortNumber="curFShortNumber" :timestamp="timestamp"/>
    </section>
    <section  v-if="reportVisible">
      <Report @backTopLineInfo="backTopLineInfo" @closeReport="closeReport" @showHistory="showHistory" :curReportInfo="curReportInfo" :timestamp="timestamp"/>
    </section>
    <section  v-if="historyVisible">
      <History @closeHistory="closeHistory" :topLineInfo="topLineInfo" :curReportInfo="curReportInfo" :historyId="historyId" :timestamp="timestamp"/>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {secondToFormat} from '../util/utils'
import TopLineBlock from '../components/TopLine'
import WarnPrint from '../components/WarnPrint.vue'
import Ljgz from '../components/Ljgz.vue'
import Report from '../components/Report.vue'
import History from '../components/History.vue'

export default {
  name: 'WorkOrder',
  data () {
    return {
      warnVisible: false,
      detailVisible: false,
      reportVisible: false,
      historyVisible: false,
      timestamp: '', // 当前时间戳
      pathName: 'Home',
      listLoading: true,
      filterProductionName: '5.14.WLK-003', // 5.14.WLK-003
      curPage: 1,
      pageSize: 15,
      sum: 0,
      historyId: null,
      orderList: [],
      curFShortNumber: '',
      curPlantNumber: '',
      curReportInfo: null,
      topLineInfo: null
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      userInfo: state => state.userInfo
    }),
    navTxt: function () {
      return this.curModuleInfo.department + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + '汇报人: ' + this.userInfo.fname
    }
  },
  watch: {
    navTxt: function () {
      alert('kkk')
    }
  },
  components: {
    TopLineBlock,
    WarnPrint,
    Ljgz,
    Report,
    History
  },
  created () {
    this.getWorkOrderList()
  },
  methods: {
    search () {
      this.getWorkOrderList()
    },
    changeDate (idx, row) {
      this.dialogDateVisible = true
      this.finterid = row.finterid
    },
    handleCurrentChange () {
      this.getWorkOrderList()
    },
    warnDetail (idx, row) {
      this.timestamp = (new Date()).getTime()
      this.warnVisible = true
      this.curFShortNumber = row.FShortNumber
    },
    goDetial (row) {
      this.timestamp = (new Date()).getTime()
      this.detailVisible = true
      this.curFShortNumber = row.FShortNumber
      this.curPlantNumber = row.fqty
    },
    addReport (row, gxName) {
      this.timestamp = (new Date()).getTime()
      this.reportVisible = true
      this.curReportInfo = row
      this.curReportInfo.gxName = gxName
    },
    closePrint () {
      this.warnVisible = false
    },
    closeDetail () {
      this.detailVisible = false
      this.curPlantNumber = ''
    },
    closeReport () {
      this.reportVisible = false
    },
    closeHistory () {
      this.reportVisible = true
      this.historyVisible = false
    },
    showHistory (ID) {
      this.historyVisible = true
      this.historyId = ID
    },
    backTopLineInfo (Info) {
      this.topLineInfo = Info
    },
    notice (idx, row) {
      this.$confirm('确认下达?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Http.post('updateXiada?finterid=' + row.finterid + '&userid=' + this.userInfo.id
        ).then(res => {
          switch (res.data.code) {
            case 1:
              this.$message({
                message: '下达成功!',
                type: 'success'
              })
              this.getWorkOrderList()
              break
            default:
              this.$message({
                message: '下达失败!',
                type: 'error'
              })
          }
        }).catch((error) => {
          console.log(error)
        })
      }).catch(() => {
      })
    },
    getWorkOrderList () {
      let DATA = {number: this.pageSize, page_num: this.curPage}
      if (this.filterProductionName) {
        DATA.fnumber = this.filterProductionName
      }
      this.listLoading = true
      this.Http.get('orderList', DATA
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.orderList = res.data.orderlist.map((item) => {
              item.FCheckDateTxt = secondToFormat(item.FCheckDate.time)
              item.FPlanFinishDateTxt = secondToFormat(item.FPlanFinishDate.time)
              item.fshortTxt = item.fshort === 0 ? '否' : '是' // 1  缺料
              return item
            })
            this.listLoading = false
            this.sum = res.data.orderCount
            break
          default:
            this.listLoading = false
            this.$message({
              message: res.data.message + '!',
              type: 'error'
            })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
