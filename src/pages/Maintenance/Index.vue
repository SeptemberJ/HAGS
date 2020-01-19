<template>
  <div class="MaintenanceList">
    <el-row>
      <el-col :span="24" style="text-align: right;">
        <el-button size="small" type="info" @click="toRecords">保养记录</el-button>
        <el-button size="small" type="success" @click="addMaintenance">点检</el-button>
      </el-col>
    </el-row>
    <section>
      <el-table id="hoverNoLight" @row-click="chooseEq" :row-style="rowStyle"
        :data="equipmentList"
        v-loading="listLoading"
        style="width: 100%">
        <!-- <el-table-column
          fixed
          type="index"
          width="50">
        </el-table-column> -->
        <el-table-column
          label="选择"
          width="80">
          <template slot-scope="scope">
            <el-radio v-model="curEq" :label="scope.$index" v-if="scope.row.isdianjian != 1">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          property="fstatus"
          label="设备状态">
        </el-table-column>
        <el-table-column
          property="waitdays"
          label="配件等待天数">
        </el-table-column>
        <el-table-column
          property="fdeviceid"
          label="设备编号">
        </el-table-column>
        <el-table-column
          property="devicename"
          label="设备名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fspecification"
          label="设备规格"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fmodel"
          label="型号"
          width="100">
        </el-table-column>
        <el-table-column
          property="fmanufacturer"
          label="制造商">
        </el-table-column>
      </el-table>
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
      equipmentList: [],
      curEq: -1,
      curPage: 1,
      pageSize: 15,
      sum: 0
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
    rowStyle ({row, rowIndex}) {
      if (row.isdianjian === 1) {
        return 'background: #f78989;color: white;'
      } else {
        return ''
      }
    },
    toRecords () {
      this.$router.push({name: 'MaintenanceList'})
    },
    chooseEq (row, column) {
      // console.log(row, column)
    },
    addMaintenance () {
      if (this.curEq >= 0) {
        let CurEq = this.equipmentList[this.curEq]
        this.$router.push({name: 'MaintenanceAdd', params: {id: CurEq.id, department: CurEq.department, fdeviceid: CurEq.fdeviceid, devicename: CurEq.devicename, fmodel: CurEq.fmodel}})
      } else {
        this.$message({
          message: '请先选择要点检的设备!',
          type: 'warning'
        })
      }
    },
    goMaintenanceDetail (row) {
      this.updateMaintenanceId(row.id)
      this.$router.push({name: 'MaintenanceDetail'})
    },
    getData () {
      this.Http.get('serdevice', {userid: this.userInfo.id}
      ).then(res => {
        this.equipmentList = res.data.list
        // res.data.list.map(item => {
        //   switch (item.fstatus) {
        //     case '0':
        //       item.fstatusTxt = '使用中'
        //       break
        //     case '1':
        //       item.fstatusTxt = '报修中'
        //       break
        //     case '2':
        //       item.fstatusTxt = '停机中'
        //       break
        //     case '3':
        //       item.fstatusTxt = '其他'
        //       break
        //     default:
        //       item.fstatusTxt = ''
        //   }
        //   return item
        // })
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    getData2 () {
      this.listLoading = true
      this.Http.get('serbyrecord', {number: this.pageSize, page_num: this.curPage, userid: this.userInfo.id}
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
