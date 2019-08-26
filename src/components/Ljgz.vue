<template>
  <div class="Ljgz">
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
export default {
  name: 'Ljgz',
  props: ['curFShortNumber', 'curPlantNumber', 'timestamp'],
  data () {
    return {
      curPage: 1,
      pageSize: 10,
      sum: 0,
      listLoading: false,
      ljgzList: []
    }
  },
  created () {
    this.getLjgzList()
  },
  methods: {
    addReport (idx, row, gxName) {
      this.$emit('addReport', row, gxName)
    },
    canNotAddReport () {
      this.$message({
        message: '没有此道工序!',
        type: 'warning'
      })
    },
    handleCurrentChange () {
      this.getLjgzList()
    },
    getLjgzList () {
      this.listLoading = true
      this.Http.get('serljgz', {number: this.pageSize, page_num: this.curPage, fshortnumber: this.curFShortNumber, fqty: this.curPlantNumber}
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.ljgzList = res.data.orderlist.map(item => {
              item.F0Txt = item.F0 === 1 ? '✓' : ''
              item.F1Txt = item.F1 === 1 ? '✓' : ''
              item.F2Txt = item.F2 === 1 ? '✓' : ''
              item.F3Txt = item.F3 === 1 ? '✓' : ''
              item.F4Txt = item.F4 === 1 ? '✓' : ''
              // item.fqg = item.fqg ? item.fqg : '---'
              // item.fjg = item.fjg ? item.fjg : '---'
              // item.fzw = item.fzw ? item.fzw : '---'
              // item.fhj = item.fhj ? item.fhj : '---'
              // item.fpw = item.fpw ? item.fpw : '---'
              // item.fpt = item.fpt ? item.fpt : '---'
              // item.fbz = item.fbz ? item.fbz : '---'
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
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
