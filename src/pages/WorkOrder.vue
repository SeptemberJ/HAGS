<template>
  <div class="WorkOrder">
    <!-- 查询 -->
    <el-row style="margin-top:.3rem;">
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
    </el-row>
    <section>
      <el-table @row-dblclick="goLjgz"
        :data="orderList"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
          width="100">
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
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.yjnum === 0 ? '' : 'danger'"
              @click="warnDetail(scope.$index, scope.row)">预警</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="orderList.length > 0" style="margin: .2rem 0;"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="sum">
      </el-pagination>
    </section>
    <!-- 新增人员 -->
    <el-dialog id="addPerson" title="新增人员" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" width="500px">
      <div style="text-align: right;diplay: block;">
        <el-button type="success" size="small" @click="addPerson">新增</el-button>
      </div>
      <!-- person list -->
      <el-table
        :data="personList"
        max-height="250"
        style="width: 100%;margin-top: .2rem;">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="操作员">
          <template slot-scope="scope">
            <el-select v-model="scope.row.id" @change="(value) => changePerson(value, scope.$index)" size="mini" placeholder="请选择">
              <el-option
                v-for="item in defaultPersonList"
                :key="item.id"
                :label="item.fname"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="delPerson(scope.$index, scope.row)">移 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="savePerson">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 汇报历史 -->
    <el-dialog title="汇报历史" :visible.sync="dialogHBHistoryVisible" :close-on-click-modal="false">
      <el-table @row-dblclick="historyDetail"
        :data="hbHistory"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="workno"
          label="汇报单号"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="starttimeTxt"
          label="开机时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="endtimeTxt"
          label="关机时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="create_timeTxt"
          label="汇报时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button type="success" size="mini" :disabled="!scope.row.ifCanOpen" @click="showTimeDialog(scope.$index, scope.row, 1)">开机</el-button>
            <el-button type="danger" size="mini" :disabled="!scope.row.ifCanClose" @click="showTimeDialog(scope.$index, scope.row, 0)">关机</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="hbHistory.length > 0" style="margin: .2rem 0;"
        @current-change="getHBHistory"
        :current-page.sync="curPageHB"
        :page-size="pageSizeHB"
        layout="total, prev, pager, next, jumper"
        :total="sumHB">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHBHistoryVisible = false">关 闭</el-button>
      </div>
      <!-- 内层时间选择 -->
      <el-dialog
        width="30%"
        :title="openOrClose ==  0 ? '请选择关机时间' : '请选择开机时间'"
        :visible.sync="dialogTimeVisible"
        :close-on-click-modal="false"
        append-to-body>
        <el-time-picker
          v-model="time"
          format="HH 点 mm 分"
          value-format="HH-mm"
          placeholder="请选择时间"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }">
        </el-time-picker>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitTime" :loading="btLoading">提 交</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {secondToFormat} from '../util/utils'

export default {
  name: 'WorkOrder',
  data () {
    return {
      listLoading: true,
      filterProductionName: '', // 5.14.WLK-003
      curPage: 1,
      pageSize: 15,
      sum: 0,
      huibaoOrderList: [],
      orderList: [],
      defaultPersonList: [],
      personList: [],
      curPersonId: null,
      dialogAddFormVisible: false,
      dialogHBHistoryVisible: false,
      dialogTimeVisible: false,
      hbHistory: [],
      curPageHB: 1,
      pageSizeHB: 15,
      sumHB: 0,
      openOrClose: 1, // 0 关机 1 开机
      curWorkId: null,
      time: '',
      btLoading: false
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.getWorkOrderList()
  },
  methods: {
    ...mapActions([
      'updateLjgzOption',
      'updateCurPage',
      'updateCurWorkId'
    ]),
    search () {
      this.getWorkOrderList()
    },
    handleSelectionChange (val) {
      this.huibaoOrderList = val
      // console.log(val)
    },
    handleCurrentChange () {
      // this.goTop()
      this.getWorkOrderList()
    },
    huibao () {
      if (this.huibaoOrderList.length === 0) {
        this.$message({
          message: '请先勾选需要汇报的工单!',
          type: 'warning'
        })
        return false
      } else {
        this.getPeopleList()
        this.dialogAddFormVisible = true
      }
    },
    getHBHistory () {
      this.Http.get('serhuibaowork', {number: this.pageSizeHB, page_num: this.curPageHB, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.hbHistory = res.data.list.map(item => {
              item.create_timeTxt = secondToFormat(item.create_time.time)
              item.ifCanOpen = !item.starttime
              item.ifCanClose = !item.endtime
              item.starttimeTxt = item.starttime ? (item.starttime).replace('-', '点') + '分' : ''
              item.endtimeTxt = item.endtime ? (item.endtime).replace('-', '点') + '分' : ''
              return item
            })
            this.sumHB = res.data.count
            this.dialogHBHistoryVisible = true
            break
          default:
            // this.listLoading = false
            this.$message({
              message: res.data.message + '!',
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
    showTimeDialog (idx, row, type) {
      this.dialogTimeVisible = true
      this.curWorkId = row.id
      this.openOrClose = type
    },
    submitTime () {
      if (!this.time) {
        this.$message({
          message: '请选择时间!',
          type: 'warning'
        })
        return false
      }
      if (this.openOrClose === 0) {
        this.shutDown()
      } else {
        this.bootUp()
      }
    },
    bootUp () {
      this.btLoading = true
      this.Http.post('kaiji?starttime=' + this.time + '&workid=' + this.curWorkId
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '开机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeVisible = false
            this.getHBHistory()
            break
          default:
            this.btLoading = false
            this.$message({
              message: res.data.message + '!',
              type: 'error'
            })
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    shutDown () {
      this.btLoading = true
      this.Http.post('guanji?endtime=' + this.time + '&workid=' + this.curWorkId
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '关机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeVisible = false
            this.getHBHistory()
            break
          default:
            this.btLoading = false
            this.$message({
              message: res.data.message + '!',
              type: 'error'
            })
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    historyDetail (row) {
      this.updateCurWorkId(row.id)
      this.updateCurPage('HBDetail')
      this.$router.push({name: 'HBDetail'})
      // this.$router.push({name: 'HBDetail', params: {id: row.id}})
    },
    getPeopleList () {
      this.Http.get('serpeople', {department: this.curModuleInfo.departid}
      ).then(res => {
        this.defaultPersonList = res.data.list
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    addPerson () {
      this.personList.push({id: '', fname: ''})
    },
    delPerson (idx, row) {
      this.personList.splice(idx, 1)
    },
    checkId (pesron) {
      return pesron.id === this.curPersonId
    },
    changePerson (val, idx) {
      // 校验重复
      this.curPersonId = val
      if (this.personList.filter(this.checkId).length > 1) {
        this.$message({
          message: '该操作员已存在!',
          type: 'error'
        })
        this.personList[idx].id = ''
        this.personList[idx].fname = ''
        this.curPersonId = ''
      } else {
        this.defaultPersonList.map(item => {
          if (item.id === val) {
            this.personList[idx].fname = item.fname
          }
        })
      }
    },
    savePerson () {
      if (this.personList.length < 1) {
        this.$message({
          message: '请添加操作员!',
          type: 'warning'
        })
        return false
      }
      let Data = {
        gongxu: this.userInfo.gongxu,
        fbiller: this.userInfo.fname,
        department: this.curModuleInfo.departid,
        worklist: this.huibaoOrderList.map(item => {
          item.fshortnumber = item.FShortNumber
          return item
        }),
        peoplelist: this.personList
      }
      this.Http.post('insertwork', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '汇报成功!',
              type: 'success'
            })
            this.getWorkOrderList()
            // 初始化数据
            this.huibaoOrderList = []
            this.personList = []
            this.curPersonId = ''
            this.dialogAddFormVisible = false
            this.btLoading = false
            break
          default:
            this.btLoading = false
            this.$message({
              message: res.data.message + '!',
              type: 'error'
            })
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    warnDetail (idx, row) {
      this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty})
      this.updateCurPage('WarnPrint')
      this.$router.push({name: 'WarnPrint'})
    },
    goLjgz (row) {
      this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty})
      this.updateCurPage('Ljgz')
      this.$router.push({name: 'Ljgz'})
    },
    goTop () {
      let timer = setInterval(function () {
        var sScrollTop = document.body.scrollTop || document.documentElement.scrollTop
        var iSpeed = Math.floor(-sScrollTop / 12)
        document.body.scrollTop = document.documentElement.scrollTop = sScrollTop + iSpeed
        document.body.onmousewheel = function () {
          return false
        }
        if (sScrollTop <= 0) {
          clearInterval(timer)
          document.body.onmousewheel = function () {
            return true
          }
        }
      }, 30)
    },
    getWorkOrderList () {
      let DATA = {number: this.pageSize, page_num: this.curPage}
      if (this.filterProductionName && this.filterProductionName.trim() !== '') {
        DATA.fnumber = this.filterProductionName
      }
      this.listLoading = true
      this.Http.get('orderList', DATA
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.orderList = res.data.orderlist.map((item) => {
              item.FCheckDateTxt = secondToFormat(item.FCheckDate.time)
              item.FPlanFinishDateTxt = secondToFormat(item.FPlanFinishDate.time)
              item.fshortTxt = item.fshort === 0 ? '否' : '是' // 1  缺料
              return item
            })
            this.listLoading = false
            this.sum = res.data.orderCount
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
