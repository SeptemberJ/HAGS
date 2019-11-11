<template>
  <div class="CgList">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="采购单号">
        <el-input v-model="filterCgcode" size="mini" clearable placeholder="请输入采购单号"></el-input>
      </el-form-item>
      <el-form-item label="采购日期">
        <el-date-picker size="mini"
          v-model="filterCgtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchCgd">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="danger" icon="el-icon-plus" size="mini" @click="addCg">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="CgListData"
      @row-dblclick="seeCgdDetail"
      style="width: 100%">
      <el-table-column
        type="index"
        width="45">
      </el-table-column>
      <el-table-column
        property="cgcode"
        label="采购单号"
        width="175">
      </el-table-column>
      <el-table-column
        property="cgr"
        label="采购人"
        width="100">
      </el-table-column>
      <el-table-column
        property="cgtimeTxt"
        label="采购日期"
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
        property="sqcode"
        label="申请单号"
        width="175">
      </el-table-column>
    </el-table>
    <el-pagination v-if="CgListData.length > 0" style="margin-top: 20px;"
      @current-change="getCgList"
      :current-page.sync="curPageCg"
      :page-size="pageSizeCg"
      layout="total, prev, pager, next, jumper"
      :total="sumCg">
    </el-pagination>
    <el-dialog :close-on-click-modal="false" class="disabledWhite"
      width="90%"
      title="采购单新增"
      :visible.sync="innerCgAddVisible"
      append-to-body>
      <CgAdd ref="cgAddChild" @CloseCgAdd="CloseCgAdd" @refresh="getCgList"></CgAdd>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerCgAddVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
     <el-dialog :close-on-click-modal="false" class="disabledWhite"
      width="90%"
      title="采购详情"
      :visible.sync="innerCgDetailVisible"
      append-to-body>
      <CgDetail ref="cgDetailChild" @CloseCgDetail="CloseCgDetail"></CgDetail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerCgDetailVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {secondToFormat} from '../../util/utils'
import CgAdd from './CgAdd'
import CgDetail from './CgDetail'
export default {
  name: 'CgList',
  data () {
    return {
      CgListData: [],
      filterCgcode: '',
      filterCgtime: '',
      pageSizeCg: 10,
      curPageCg: 1,
      sumCg: 0,
      innerCgAddVisible: false,
      innerCgDetailVisible: false
    }
  },
  components: {
    CgAdd,
    CgDetail
  },
  methods: {
    addCg () {
      this.innerCgAddVisible = true
      setTimeout(() => {
        this.$refs.cgAddChild.showAdd()
      }, 10)
    },
    CloseCgAdd () {
      this.innerCgAddVisible = false
    },
    CloseCgDetail () {
      this.innerCgDetailVisible = false
    },
    searchCgd () {
      this.curPageCg = 1
      this.getCgList()
    },
    seeCgdDetail (row) {
      this.innerCgDetailVisible = true
      setTimeout(() => {
        this.$refs.cgDetailChild.showDetail()
        this.$refs.cgDetailChild.getCgDetailList(row.id)
      }, 10)
    },
    getCgList () {
      let query = {
        number: this.pageSizeCg,
        page_num: this.curPageCg
      }
      if (this.filterCgcode) {
        query.cgcode = this.filterCgcode
      }
      if (this.filterCgtime) {
        query.cgtime = this.filterCgtime
      }
      this.Http.get('wxcglist', query
      ).then(res => {
        this.CgListData = res.data.list.map(item => {
          item.cgtimeTxt = secondToFormat(item.cgtime.time)
          return item
        })
        this.sumCg = res.data.count
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
