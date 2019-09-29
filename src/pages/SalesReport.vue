<template>
  <div class="SalesReport">
    <el-table
      :data="reportList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="date"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="date"
        label="美国下单时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="产品名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="产品类别"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="颜色"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="交期"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="初始预计完成日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="date"
        label="修改预计完成日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="date"
        label="生产工单号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="纸箱---托盘"
        width="100">
      </el-table-column><el-table-column
        prop="date"
        label="出货数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="实际完成日期"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="备注"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="焊接备料"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="喷塑备料"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="包装备料"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="外协"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="工程变更"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="质检"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="激光"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="折弯"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="CNC"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="切管"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="焊接"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="抛丸"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="喷涂"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="包装"
        width="100">
      </el-table-column>
    </el-table>
    <el-pagination v-if="reportList.length > 0" style="margin: .2rem 0;"
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
  name: 'SalesReport',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      reportList: [],
      curPage: 1,
      pageSize: 5,
      sum: 0
    }
  },
  methods: {
    handleCurrentChange () {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
