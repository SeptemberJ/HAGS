<template>
  <div class="Ljgz">
    <el-row>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="零件名称">
          <el-input v-model="formSearch.ljname" placeholder="请输入零件名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="材料名称">
          <el-input v-model="formSearch.clname" placeholder="请输入材料名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      :data="ljgzList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="F0Txt"
        label="0"
        width="45">
      </el-table-column>
      <el-table-column
        property="F1Txt"
        label="1"
        width="45">
      </el-table-column>
      <el-table-column
        property="F2Txt"
        label="2"
        width="45">
      </el-table-column>
      <el-table-column
        property="F3Txt"
        label="3"
        width="45">
      </el-table-column>
      <el-table-column
        property="F4Txt"
        label="4"
        width="45">
      </el-table-column>
      <el-table-column
        property="fnumber"
        label="零件号"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="fname"
        label="零件名称"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="clnumber"
        label="材料代码"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="clname"
        label="材料名称"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="bbh"
        label="版本号"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="jhsnumber"
        label="计划数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="切管"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fqg"
            size="mini"
            type="text"
            @click="addReport(scope.$index, scope.row, '切管')">{{scope.row.fqg}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="qg"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="激光"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fjg"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '激光')">{{scope.row.fjg}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="jg"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="折弯"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fzw"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '折弯')">{{scope.row.fzw}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="zw"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="焊接"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fhj"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '焊接')">{{scope.row.fhj}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="hj"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="抛丸"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fpw"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '抛丸')">{{scope.row.fpw}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="pw"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="喷涂"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fpt"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '喷涂')">{{scope.row.fpt}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="pt"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="包装"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fbz"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '包装')">{{scope.row.fbz}}</el-button>
          <el-button v-else size="mini" type="text" @click="canNotAddReport">--</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="bz"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-pagination v-if="ljgzList.length > 0" style="margin: .2rem 0;"
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Ljgz',
  data () {
    return {
      formSearch: {
        ljname: '',
        clname: ''
      },
      curPage: 1,
      pageSize: 5,
      sum: 0,
      listLoading: false,
      ljgzList: []
    }
  },
  created () {
    this.getLjgzList()
  },
  computed: {
    ...mapState({
      workOrderFshortnumber: state => state.workOrderFshortnumber,
      workOrderFqty: state => state.workOrderFqty
    })
  },
  methods: {
    ...mapActions([
      'updateCurReportInfo',
      'updateCurPage'
    ]),
    addReport (idx, row, gxName) {
      row.gxName = gxName
      this.updateCurReportInfo(row)
      this.updateCurPage('Report')
      this.$router.push({name: 'Report'})
    },
    canNotAddReport () {
      this.$message({
        message: '没有此道工序!',
        type: 'warning'
      })
    },
    search () {
      this.page_num = 1
      this.getLjgzList()
    },
    handleCurrentChange () {
      this.getLjgzList()
    },
    getLjgzList () {
      let Data = {
        number: this.pageSize,
        page_num: this.curPage,
        fshortnumber: this.workOrderFshortnumber,
        fqty: this.workOrderFqty
      }
      if (this.formSearch.ljname && this.formSearch.ljname.trim() !== '') {
        Data.ljname = this.formSearch.ljname
      }
      if (this.formSearch.clname && this.formSearch.clname.trim() !== '') {
        Data.clname = this.formSearch.clname
      }
      this.listLoading = true
      this.Http.get('serljgz', Data
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.ljgzList = res.data.orderlist.map(item => {
              item.F0Txt = item.F0 === 1 ? '✓' : ''
              item.F1Txt = item.F1 === 1 ? '✓' : ''
              item.F2Txt = item.F2 === 1 ? '✓' : ''
              item.F3Txt = item.F3 === 1 ? '✓' : ''
              item.F4Txt = item.F4 === 1 ? '✓' : ''
              return item
            })
            this.sum = res.data.orderCount
            this.listLoading = false
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
        this.listLoading = false
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Ljgz{
  margin-top:.3rem;
}
</style>
