<template>
  <div class="RkList">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="入库单号">
        <el-input v-model="filterRkcode" size="mini" clearable placeholder="请输入入库单号"></el-input>
      </el-form-item>
      <el-form-item label="入库日期">
        <el-date-picker size="mini"
          v-model="filterRktime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchRkd">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="danger" icon="el-icon-plus" size="mini" @click="addRk">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="RkListData"
      @row-dblclick="seeRkdDetail"
      style="width: 100%">
      <el-table-column
        type="index"
        width="45">
      </el-table-column>
      <el-table-column
        property="rkcode"
        label="入库单号"
        width="175">
      </el-table-column>
      <el-table-column
        property="rkr"
        label="入库人"
        width="100">
      </el-table-column>
      <el-table-column
        property="rktimeTxt"
        label="入库日期"
        width="110">
      </el-table-column>
      <el-table-column
        property="gyscode"
        label="供应商代码">
      </el-table-column>
      <el-table-column
        property="gysname"
        label="供应商名称">
      </el-table-column>
      <el-table-column
        property="cgcode"
        label="采购单号"
        width="175">
      </el-table-column>
    </el-table>
    <el-pagination v-if="RkListData.length > 0" style="margin-top: 20px;"
      @current-change="getRkList"
      :current-page.sync="curPageRk"
      :page-size="pageSizeRk"
      layout="total, prev, pager, next, jumper"
      :total="sumRk">
    </el-pagination>
    <el-dialog :close-on-click-modal="false" class="disabledWhite"
      width="90%"
      title="采购单新增"
      :visible.sync="innerRkAddVisible"
      append-to-body>
      <RkAdd ref="rkAddChild" @CloseRkAdd="CloseRkAdd" @refresh="getRkList"></RkAdd>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerRkAddVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
     <el-dialog :close-on-click-modal="false" class="disabledWhite"
      width="90%"
      title="入库单详情"
      :visible.sync="innerRkDetailVisible"
      append-to-body>
      <RkDetail ref="rkDetailChild" @CloseRkDetail="CloseRkDetail"></RkDetail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerRkDetailVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {secondToFormat} from '../../util/utils'
import RkAdd from './RkAdd'
import RkDetail from './RkDetail'
export default {
  name: 'RkList',
  data () {
    return {
      RkListData: [],
      filterRkcode: '',
      filterRktime: '',
      pageSizeRk: 10,
      curPageRk: 1,
      sumRk: 0,
      innerRkAddVisible: false,
      innerRkDetailVisible: false
    }
  },
  components: {
    RkAdd,
    RkDetail
  },
  methods: {
    addRk () {
      this.innerRkAddVisible = true
      setTimeout(() => {
        this.$refs.rkAddChild.showAdd()
      }, 10)
    },
    CloseRkAdd () {
      this.innerRkAddVisible = false
    },
    CloseRkDetail () {
      this.innerRkDetailVisible = false
    },
    searchRkd () {
      this.curPageRk = 1
      this.getRkList()
    },
    seeRkdDetail (row) {
      this.innerRkDetailVisible = true
      setTimeout(() => {
        this.$refs.rkDetailChild.showDetail()
        this.$refs.rkDetailChild.getRkDetailList(row.id)
      }, 10)
    },
    getRkList () {
      let query = {
        number: this.pageSizeRk,
        page_num: this.curPageRk
      }
      if (this.filterRkcode) {
        query.rkcode = this.filterRkcode
      }
      if (this.filterRktime) {
        query.rktime = this.filterRktime
      }
      this.Http.get('wxrklist', query
      ).then(res => {
        this.RkListData = res.data.list.map(item => {
          item.rktimeTxt = secondToFormat(item.rktime.time)
          return item
        })
        this.sumRk = res.data.count
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
