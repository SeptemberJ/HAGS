<template>
  <div class="MaintenanceList">
    <!-- 查询 -->
    <el-row>
      <el-form :inline="true" id="saerchNameForm" class="demo-form-inline">
        <el-col :span="6">
          <el-form-item label="日期">
            <el-date-picker
              v-model="filterMaintenanceDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备编号">
            <el-input v-model="filterMaintenanceFid" placeholder="请输入设备编号" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备名称">
            <el-input v-model="filterMaintenanceFname" placeholder="请输入设备名称" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: left;">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <section>
      <el-table @row-dblclick="goMaintenanceDetail"
        :data="maintenanceList"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="zdr"
          label="班组长"
          width="150">
        </el-table-column>
        <el-table-column
          property="ftime"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          property="fdeviceid"
          label="设备编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="devicename"
          label="设备名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fmodel"
          label="规格型号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="bxfstatus"
          label="状态"
          width="100">
        </el-table-column>
        <el-table-column
          label="是否报修"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.isrepair == 1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="maintenanceList.length > 0" style="margin: .2rem 0;"
        @current-change="getData"
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
export default {
  name: 'MaintenanceList',
  data () {
    return {
      listLoading: false,
      maintenanceList: [],
      curPage: 1,
      pageSize: 15,
      sum: 0,
      filterMaintenanceDate: '',
      filterMaintenanceFid: '',
      filterMaintenanceFname: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.getData()
  },
  methods: {
    ...mapActions([
      'updateMaintenanceId'
    ]),
    goMaintenanceDetail (row) {
      this.updateMaintenanceId(row.id)
      this.$router.push({name: 'MaintenanceDetail'})
    },
    reset () {
      this.filterMaintenanceDate = ''
      this.filterMaintenanceFid = ''
      this.filterMaintenanceFname = ''
      this.getData()
    },
    search () {
      this.curPage = 1
      this.getData()
    },
    getData () {
      let Data = {number: this.pageSize, page_num: this.curPage, userid: this.userInfo.id}
      if (this.filterMaintenanceDate) {
        Data.ftime = this.filterMaintenanceDate
      }
      if (this.filterMaintenanceFid) {
        Data.fdeviceid = this.filterMaintenanceFid
      }
      if (this.filterMaintenanceFname) {
        Data.devicename = this.filterMaintenanceFname
      }
      this.listLoading = true
      this.Http.get('serbyrecord', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.maintenanceList = res.data.list
            this.listLoading = false
            this.sum = res.data.count
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.MaintenanceList{
  padding: 20px;
}
</style>
