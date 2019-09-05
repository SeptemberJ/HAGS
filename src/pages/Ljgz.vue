<template>
  <div class="Ljgz">
    <el-row>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="工序">
          <el-select v-model="formSearch.gongxu" placeholder="请选择" @change="search">
            <el-option
              v-for="item in GXOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="零件名称">
          <el-input v-model="formSearch.ljname" placeholder="请输入零件名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="材料名称">
          <el-input v-model="formSearch.clname" placeholder="请输入材料名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table @row-dblclick="addReportThroughRow"
      :data="ljgzList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="图纸"
        width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="tuzhi(scope.$index, scope.row)">图纸</el-button>
        </template>
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
          <el-button v-if="scope.row.fqg && ljgzFromType == 1"
            size="mini"
            type="text"
            @click="addReport(scope.$index, scope.row, '切管')">{{scope.row.fqg}}</el-button>
          <span v-else>{{scope.row.fqg}}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="qg"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="CNC"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fsk && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, 'CNC')">{{scope.row.fsk}}</el-button>
          <span v-else>{{scope.row.fsk}}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="sk"
        label="完成数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="激光"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fjg && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '激光')">{{scope.row.fjg}}</el-button>
          <span v-else>{{scope.row.fjg}}</span>
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
          <el-button v-if="scope.row.fzw && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '折弯')">{{scope.row.fzw}}</el-button>
          <span v-else>{{scope.row.fzw}}</span>
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
          <el-button v-if="scope.row.fhj && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '焊接')">{{scope.row.fhj}}</el-button>
          <span v-else>{{scope.row.fhj}}</span>
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
          <el-button v-if="scope.row.fpw && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '抛丸')">{{scope.row.fpw}}</el-button>
          <span v-else>{{scope.row.fpw}}</span>
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
          <el-button v-if="scope.row.fpt && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '喷涂')">{{scope.row.fpt}}</el-button>
          <span v-else>{{scope.row.fpt}}</span>
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
          <el-button v-if="scope.row.fbz && ljgzFromType == 1"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="addReport(scope.$index, scope.row, '包装')">{{scope.row.fbz}}</el-button>
          <span v-else>{{scope.row.fbz}}</span>
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
      ljgzFromType: 0, // 0 - WorkerOrder 1 - HBDetail
      formSearch: {
        ljname: '',
        clname: '',
        gongxu: ''
      },
      GXOptions: ['全部', '切管', 'CNC', '激光', '折弯', '焊接', '抛丸', '喷涂', '包装'],
      curPage: 1,
      pageSize: 10,
      sum: 0,
      listLoading: false,
      ljgzList: []
    }
  },
  created () {
    this.formSearch.gongxu = this.userInfo.gongxu
    this.getLjgzList()
    if (this.curWorkId) {
      this.ljgzFromType = 1
    } else {
      this.ljgzFromType = 0
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      curWorkId: state => state.curWorkId,
      workOrderFshortnumber: state => state.workOrderFshortnumber,
      workOrderFqty: state => state.workOrderFqty,
      curReportInfo: state => state.curReportInfo
    })
  },
  methods: {
    ...mapActions([
      'updateCurReportInfo',
      'updateCurPage'
    ]),
    // table双击事件 跳转report页面
    addReportThroughRow (row) {
      if (this.ljgzFromType === 0) { // 非历史纪录过来的不可以点击
        return false
      } else {
        row.gxName = this.userInfo.gongxu
        this.updateCurReportInfo(row)
        this.updateCurPage('Report')
        this.$router.push({name: 'Report'})
      }
    },
    // 通过点击工序数值跳转report页面
    addReport (idx, row, gxName) {
      if (gxName !== this.userInfo.gongxu) {
        this.$message({
          message: '对不起，您没有操作此道工序的权限!',
          type: 'warning'
        })
        return false
      }
      row.gxName = gxName
      this.updateCurReportInfo(row)
      this.updateCurPage('Report')
      this.$router.push({name: 'Report'})
    },
    // canNotAddReport () {
    //   this.$message({
    //     message: '没有此道工序!',
    //     type: 'warning'
    //   })
    // },
    // 查看图纸
    tuzhi (idx, row) {
      this.Http.get('sertuzhi', {fidz: row.fidz, fidc: row.fidc}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            window.open(res.data.maplist, '_blank')
            break
          default:
            this.$message({
              message: res.data.messge + '!',
              type: 'error'
            })
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 条件查询
    search () {
      this.curPage = 1
      this.getLjgzList()
    },
    // 重置按钮事件
    reset () {
      this.formSearch.ljname = ''
      this.formSearch.clname = ''
      this.curPage = 1
      this.getLjgzList()
    },
    // 页面切换
    handleCurrentChange () {
      this.getLjgzList()
    },
    // 获取零件管制列表
    getLjgzList () {
      let Data = {
        number: this.pageSize,
        page_num: this.curPage,
        fshortnumber: this.workOrderFshortnumber,
        fqty: this.workOrderFqty
      }
      if (this.formSearch.gongxu !== '全部') {
        Data.gongxu = this.formSearch.gongxu
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
