<template>
  <div class="Sqd">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="申请编号">
        <el-input v-model="filterSqdSqcode" size="mini" clearable placeholder="请输入申请编号"></el-input>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker size="mini"
          v-model="filterSqdSqtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSqd">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="SqdListData"
      @row-dblclick="seeSqdDetail"
      style="width: 100%">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        property="sqcode"
        label="申请编号">
      </el-table-column>
      <el-table-column
        property="sqr"
        label="申请人">
      </el-table-column>
      <el-table-column
        property="sqtimeTxt"
        label="申请日期">
      </el-table-column>
      <el-table-column
        property="jhtimeTxt"
        label="交货日期">
      </el-table-column>
    </el-table>
    <el-pagination v-if="SqdListData.length > 0" style="margin-top: 20px;"
      @current-change="getSQDList"
      :current-page.sync="curPageSqd"
      :page-size="pageSizeSqd"
      layout="total, prev, pager, next, jumper"
      :total="sumSqd">
    </el-pagination>
    <!-- 内层详情 -->
    <el-dialog :close-on-click-modal="false" class="disabledWhite"
      width="90%"
      title="申请单详情"
      :visible.sync="innerSqdVisible"
      append-to-body>
      <el-form :inline="true" :model="formWX" class="demo-form-inline">
        <el-form-item label="申请日期">
          <el-input v-model="formWX.sqrq" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="userInfo.fname" disabled></el-input>
        </el-form-item>
        <el-form-item label="要求交货日期">
          <el-input v-model="formWX.jhrq" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="SqdDetailData"
        height="450"
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="wlnumber1"
          label="零件管制表中的物料代码"
          width="230">
        </el-table-column>
        <el-table-column
          property="wlname1"
          label="零件管制表中的物料名称"
          width="230">
        </el-table-column>
        <el-table-column
          property="wlnumber2"
          label="实际应出库物料代码"
          width="230">
          <!-- <template slot-scope="scope">
            <el-select v-model="scope.row.wlnumber2" placeholder="请选择" @change="changeCKWL(scope.$index, scope.row.wlnumber2)">
              <el-option
                v-for="(item, idx) in CkwuliaoOptions"
                :key="idx"
                :label="item.fnumber"
                :value="item.fnumber">
              </el-option>
            </el-select>
          </template> -->
        </el-table-column>
        <el-table-column
          property="wlname2"
          label="实际应出库物料名称"
          width="230">
        </el-table-column>
        <el-table-column
          property="danwei"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          property="guige"
          label="规格"
          show-overflow-tooltip
          width="150">
        </el-table-column>
        <el-table-column
          property="number"
          label="应出数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="sqnumber"
          label="申请数量"
          width="120">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.sqnumber"></el-input>
          </template> -->
        </el-table-column>
        <el-table-column
          property="gx"
          label="工序"
          width="100">
          <!-- <template slot-scope="scope">
            <el-select v-model="scope.row.gx" placeholder="请选择">
              <el-option
                v-for="item in wxgxOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template> -->
        </el-table-column>
        <el-table-column
          property="fnote"
          label="备注"
          width="150">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.fnote"></el-input>
          </template> -->
        </el-table-column>
        <el-table-column
          property="cknumber"
          label="已经出库"
          width="120">
        </el-table-column>
        <el-table-column
          property="cktime"
          label="出库时间"
          width="120">
        </el-table-column>
        <el-table-column
          property="rknumber"
          label="入库数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="wrknumber"
          label="未入库数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="po"
          label="po号"
          width="120">
        </el-table-column>
        <el-table-column
          property="fbillno"
          label="工单号"
          width="120">
        </el-table-column>
        <el-table-column
          property="ddfbillno"
          label="销售订单号"
          width="120">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerSqdVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {secondToFormat, dateToFormat} from '../../util/utils'
export default {
  name: 'Sqd',
  data () {
    return {
      formWX: {
        sqrq: dateToFormat(new Date()),
        jhrq: ''
      },
      SqdListData: [],
      pageSizeSqd: 5,
      curPageSqd: 1,
      sumSqd: 0,
      filterSqdSqcode: '',
      filterSqdSqtime: '',
      innerSqdVisible: false,
      SqdDetailData: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    seeSqdDetail (row) {
      this.innerSqdVisible = true
      this.Http.get('wxsqdetaillist', {id: row.id}
      ).then(res => {
        this.SqdDetailData = res.data.entrylist
        this.formWX.sqrq = secondToFormat(res.data.list.sqtime.time)
        this.formWX.jhrq = secondToFormat(res.data.list.jhtime.time)
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    searchSqd () {
      this.curPageSqd = 1
      this.getSQDList()
    },
    // 获取申请单列表
    getSQDList () {
      let query = {
        number: this.pageSizeSqd,
        page_num: this.curPageSqd
      }
      if (this.filterSqdSqcode) {
        query.sqcode = this.filterSqdSqcode
      }
      if (this.filterSqdSqtime) {
        query.sqtime = this.filterSqdSqtime
      }
      this.Http.get('wxsqlist', query
      ).then(res => {
        this.SqdListData = res.data.list.map(item => {
          item.jhtimeTxt = secondToFormat(item.jhtime.time)
          item.sqtimeTxt = secondToFormat(item.sqtime.time)
          return item
        })
        this.sumSqd = res.data.count
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
