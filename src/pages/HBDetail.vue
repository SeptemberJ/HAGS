<template>
  <div class="WorkOrder">
    <!-- 查询 -->
    <!-- <el-row style="margin-top:.3rem;">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="filterProductionName" placeholder="请输入产品名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button size="small" type="info" @click="getHBHistory">汇报记录</el-button>
          <el-button type="warning" size="small" @click="huibao">汇报</el-button>
        </el-form-item>
      </el-form>
    </el-row> -->
    <section>
      <el-table  @row-dblclick="goLjgz"
        :data="detailList"
        v-loading="listLoading"
        style="width: 100%">
        <!-- <el-table-column
          type="selection"
          width="55">
        </el-table-column> -->
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
          width="170"
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
          width="130"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="FPlanFinishDateTxt"
          label="交期"
          width="140">
        </el-table-column>
        <el-table-column
          property="fshortTxt"
          label="是否缺料"
          width="100">
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="warnDetail(scope.$index, scope.row)">预警</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination v-if="detailList.length > 0" style="margin: .2rem 0;"
        @current-change="getHBDetail"
        :current-page.sync="curPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="sum">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import {secondToFormat} from '../util/utils'

export default {
  name: 'WorkOrder',
  data () {
    return {
      listLoading: true,
      filterProductionName: '', // 5.14.WLK-003
      curPage: 1,
      pageSize: 15,
      sum: 0,
      detailList: []
    }
  },
  computed: {
    ...mapState({
      curWorkId: state => state.curWorkId
    })
  },
  created () {
    this.getHBDetail()
  },
  methods: {
    ...mapActions([
      'updateLjgzOption',
      'updateCurPage'
    ]),
    goLjgz (row) {
      this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty})
      this.updateCurPage('Ljgz')
      this.$router.push({name: 'Ljgz'})
    },
    getHBDetail () {
      this.listLoading = true
      this.Http.get('serhuibaoworkdetail', {number: this.pageSize, page_num: this.curPage, workid: this.curWorkId}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.detailList = res.data.list.map((item) => {
              item.FCheckDateTxt = item.FCheckDate.slice(0, 9)
              item.FPlanFinishDateTxt = item.FPlanFinishDate.slice(0, 9)
              item.fshortTxt = item.fshort === 0 ? '否' : '是' // 1  缺料
              return item
            })
            this.sum = res.data.count
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
.PersonList{
  margin-top: .4rem;
}
</style>
