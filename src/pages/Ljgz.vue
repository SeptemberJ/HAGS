<template>
  <div class="Ljgz">
    <el-row>
      <el-col :span="24">
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
      </el-col>
      <el-col :span="24" style="text-align: right;" v-if="(userInfo.gongxu === 'CNC' || userInfo.gongxu === '焊接') && workOrderIdCNC">
        <el-button size="small" type="warning" @click="showLJList">零件列表</el-button>
      </el-col>
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
      <el-table-column v-if="(userInfo.gongxu === 'CNC' || userInfo.gongxu === '焊接') && workOrderIdCNC"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="addToLJlIST(scope.$index, scope.row)">加入零件列表</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="curModuleInfo.department == '外协'"
        label="加入外协"
        width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="addWaiXie(scope.row)">加入外协</el-button>
        </template>
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
        width="300"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="fname"
        label="零件名称"
        width="300"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="clnumber"
        label="材料代码"
        width="300"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="clname"
        label="材料名称"
        width="300"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="bbh"
        label="版本号"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="jhsnumber"
        label="计划数"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="切管"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fqg && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '切管')">{{scope.row.fqg}}</el-button>
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
          <!-- <el-button v-if="scope.row.fsk && ljgzFromType == 1" -->
          <el-button v-if="scope.row.fsk && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, 'CNC')">{{scope.row.fsk ? scope.row.fsk : '--'}}</el-button>
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
          <el-button v-if="scope.row.fjg && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '激光')">{{scope.row.fjg}}</el-button>
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
          <el-button v-if="scope.row.fzw && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '折弯')">{{scope.row.fzw}}</el-button>
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
          <el-button v-if="scope.row.fhj && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '焊接')">{{scope.row.fhj}}</el-button>
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
          <el-button v-if="scope.row.fpw && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '抛丸')">{{scope.row.fpw}}</el-button>
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
          <el-button v-if="scope.row.fpt && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '喷涂')">{{scope.row.fpt}}</el-button>
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
          <el-button v-if="scope.row.fbz && ljgzFromType != 0"
            size="mini"
            type="text"
            style="color:#606266;"
            @click="clickGongxu(scope.$index, scope.row, '包装')">{{scope.row.fbz}}</el-button>
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
    <!-- 加入的零件list -->
    <el-dialog title="零件列表" :visible.sync="dialogLJListVisible" :close-on-click-modal="false" width="850px">
      <el-table
        :data="LJListData"
        show-summary
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="fnumber"
          label="零件号"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fname"
          label="零件名称"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="clnumber"
          label="材料代码"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="clname"
          label="材料名称"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="jhsnumber"
          label="数量"
          width="70"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="removeFromList(scope.$index, scope.row, 0)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLJListVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 历史汇报纪录 -->
    <el-dialog title="汇报记录" :visible.sync="dialogHBHistoryVisible" :close-on-click-modal="false" width="700px">
      <el-row>
        <el-form :inline="true" id="saerchNameForm" class="demo-form-inline" style="width: 100%;">
          <el-col :span="16">
            <el-form-item label="汇报单号">
              <el-input v-model="huibaiWorkNo" placeholder="请输入汇报单号" size="small" clearable style="width:100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: left;">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="searchHuibao">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-table @row-dblclick="toReport"
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
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="starttime"
          label="开机时间"
          width="125"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="endtime"
          label="关机时间"
          width="125"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="freason"
          label="关机原因"
          width="90"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="create_timeTxt"
          label="汇报时间"
          width="125"
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" :disabled="!scope.row.ifCanOpen" @click="showTimeDialog(scope.$index, scope.row, 1)">开 机</el-button>
            <el-button type="danger" size="mini" :disabled="!scope.row.ifCanClose" @click="showTimeDialog(scope.$index, scope.row, 0)">关 机</el-button>
            <el-button type='primary' size="mini" @click="bootUpAgain(scope.row)">重复开机</el-button>
            <el-button type='text' @click="seeHistoryDetail(scope.row)">详 情</el-button>
            <el-button type='text' @click="seeWorkOrderPerson(scope.row)">人 员</el-button>
            <el-button type='text' v-if="userInfo.gongxu == 'CNC'" @click="ShowaAddCNC(scope.row.id)">机器设备</el-button>
          </template>
        </el-table-column> -->
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
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {secondToFormatAll} from '../util/utils'
export default {
  name: 'Ljgz',
  data () {
    return {
      // ljgzFromType: null, // 0 - WorkerOrder 1 - HBDetail 2 - salesReport
      dialogLJListVisible: false,
      listLoading: false,
      LJListData: [],
      formSearch: {
        ljname: '',
        clname: '',
        gongxu: ''
      },
      GXOptions: ['全部', '切管', 'CNC', '激光', '折弯', '焊接', '抛丸', '喷涂', '包装'],
      curPage: 1,
      pageSize: 10,
      sum: 0,
      ljgzList: [],
      dialogHBHistoryVisible: false, // 历史纪录
      huibaiWorkNo: '',
      hbHistory: [],
      curPageHB: 1,
      pageSizeHB: 5,
      sumHB: 0,
      curLjgzInfo: '',
      curChoosedGX: ''
    }
  },
  created () {
    this.formSearch.gongxu = this.ljgzFromType === 2 ? this.curSalesGX : (this.userInfo.gongxu === 'CNC' ? '全部' : this.userInfo.gongxu)
    // this.formSearch.gongxu = this.userInfo.gongxu === 'CNC' ? '全部' : this.userInfo.gongxu
    this.getLjgzList()
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      curPageStore: state => state.curPage,
      curSalesGX: state => state.curSalesGX,
      beforePage: state => state.beforePage,
      curWorkId: state => state.curWorkId,
      workOrderFshortnumber: state => state.workOrderFshortnumber,
      workOrderFqty: state => state.workOrderFqty,
      workOrderDdfbillno: state => state.workOrderDdfbillno,
      curFbillno: state => state.curFbillno,
      workOrderIdCNC: state => state.workOrderIdCNC,
      curModuleInfo: state => state.curModuleInfo
    }),
    ljgzFromType: function () {
      if (this.beforePage === 'WorkOrder') {
        return 0
      }
      if (this.beforePage === 'HBDetail') {
        return 1
      }
      if (this.beforePage === 'SalesReport') {
        return 2
      }
      // 0 - WorkerOrder 1 - HBDetail 2 - SalesReport
      // if (this.curWorkId && this.beforePage === 'HBDetail') {
      //   return 1
      // } else {
      //   if (this.beforePage === 'WorkerOrder') {
      //     return 0
      //   } else {
      //     return 2
      //   }
      // }
    }
  },
  // watch: {
  //   beforePage: function (newVal, oldVal) {
  //     if (newVal === 'WorkOrder') {
  //       this.ljgzFromType = 0
  //     }
  //     if (newVal === 'HBDetail') {
  //       this.ljgzFromType = 1
  //     }
  //     if (newVal === 'SalesReport') {
  //       this.ljgzFromType = 2
  //     }
  //     // if (oldVal === 'WorkOrder' && newVal === 'Ljgz') {
  //     //   this.ljgzFromType = 0
  //     // }
  //     // if (oldVal === 'HBDetail' && newVal === 'Ljgz') {
  //     //   debugger
  //     //   this.ljgzFromType = 1
  //     // }
  //     // if (oldVal === 'SalesReport' && newVal === 'Ljgz') {
  //     //   this.ljgzFromType = 2
  //     // }
  //   }
  // },
  methods: {
    ...mapActions([
      'updateReportBtIfShow',
      'updateCurFbillno',
      'updateCurWorkId',
      'updateCurReportInfo',
      'updateCurPage'
    ]),
    // table双击事件 跳转report页面
    addReportThroughRow (row) {
      if (this.ljgzFromType !== 1) { // 非历史纪录过来的不可以点击
        return false
      } else {
        this.clickGongxu(null, row, this.userInfo.gongxu)
        // row.gxName = this.userInfo.gongxu
        // this.updateCurReportInfo(row)
        // this.updateCurPage('Report')
        // this.$router.push({name: 'Report'})
      }
    },
    clickGongxu (idx, row, gxName) {
      if (this.ljgzFromType === 2) {
        this.showHBList(idx, row, gxName)
      } else {
        this.addReport(idx, row, gxName)
      }
    },
    showHBList (idx, row, gxName) {
      row.gxName = gxName
      this.curChoosedGX = gxName
      this.curLjgzInfo = row
      this.dialogHBHistoryVisible = true
      this.getHBHistory()
    },
    // 销售报表显示汇报历史记录
    searchHuibao () {
      this.curPageHB = 1
      this.getHBHistory()
    },
    // 汇报历史进入report界面
    toReport (row) {
      // console.log(this.curLjgzInfo)
      this.updateReportBtIfShow(false)
      this.updateCurWorkId(row.workid)
      this.updateCurFbillno(row.fbillno)
      this.updateCurReportInfo(this.curLjgzInfo)
      this.updateCurPage('Report')
      this.$router.push({name: 'Report'})
      // this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty})
      // console.log('row', row)
      // console.log(this.curLjgzInfo)
      // let forder = null
      // switch (row.gongxu) {
      //   case '切管':
      //     forder = this.curLjgzInfo.fqg
      //     break
      //   case 'CNC':
      //     forder = this.curLjgzInfo.fsk ? this.curLjgzInfo.fsk : 1
      //     break
      //   case '激光':
      //     forder = this.curLjgzInfo.fjg
      //     break
      //   case '折弯':
      //     forder = this.curLjgzInfo.fzw
      //     break
      //   case '焊接':
      //     forder = this.curLjgzInfo.fhj
      //     break
      //   case '抛丸':
      //     forder = this.curLjgzInfo.fpw
      //     break
      //   case '喷涂':
      //     forder = this.curLjgzInfo.fpt
      //     break
      //   case '包装':
      //     forder = this.curLjgzInfo.fbz
      //     break
      // }
      // // 确认是否汇报
      // this.Http.get('huibaolist2', {number: 10, page_num: 1, fidz: row.fidz, fidc: row.fidc, gongxu: row.gongxu, department: this.curModuleInfo.departid, forder: forder, jhsnumber: this.curLjgzInfo.jhsnumber, workid: row.workid, fbillno: row.fbillno}
      // ).then(res => {
      //   switch (res.data.code) {
      //     case 0:
      //       this.$confirm(res.data.message + ', 是否继续汇报?', '提示', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         type: 'warning'
      //       }).then(() => {
      //         row.gxName = row.gongxu
      //         this.updateCurReportInfo(row)
      //         this.updateCurPage('Report')
      //         this.$router.push({name: 'Report'})
      //       }).catch(() => {
      //       })
      //       break
      //     case 1:
      //       row.gxName = row.gongxu
      //       this.updateCurReportInfo(row)
      //       this.updateCurPage('Report')
      //       this.$router.push({name: 'Report'})
      //       break
      //     default:
      //       this.$message({
      //         message: res.data.message + '!',
      //         type: 'error'
      //       })
      //   }
      // }).catch((error) => {
      //   console.log(error)
      //   this.$message({
      //     message: '服务器繁忙!',
      //     type: 'error'
      //   })
      // })
    },
    // 通过点击工序数值跳转report页面
    addReport (idx, row, gxName) {
      let forder = null
      switch (gxName) {
        case '切管':
          forder = row.fqg
          break
        case 'CNC':
          forder = row.fsk ? row.fsk : 1
          break
        case '激光':
          forder = row.fjg
          break
        case '折弯':
          forder = row.fzw
          break
        case '焊接':
          forder = row.fhj
          break
        case '抛丸':
          forder = row.fpw
          break
        case '喷涂':
          forder = row.fpt
          break
        case '包装':
          forder = row.fbz
          break
      }
      if (gxName !== this.userInfo.gongxu) {
        this.$message({
          message: '对不起，您没有操作此道工序的权限!',
          type: 'warning'
        })
        return false
      }
      if (!forder) {
        return false
      }
      // 确认是否汇报
      this.Http.get('huibaolist2', {number: 10, page_num: 1, fidz: row.fidz, fidc: row.fidc, gongxu: gxName, department: this.curModuleInfo.departid, forder: forder, jhsnumber: row.jhsnumber, workid: this.curWorkId, fbillno: this.curFbillno}
      ).then(res => {
        switch (res.data.code) {
          // case 0:
          //   this.$confirm(res.data.message + ', 是否继续汇报?', '提示', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }).then(() => {
          //     row.gxName = gxName
          //     this.updateReportBtIfShow(true)
          //     this.updateCurReportInfo(row)
          //     this.updateCurPage('Report')
          //     this.$router.push({name: 'Report'})
          //   }).catch(() => {
          //   })
          //   break
          case 1:
            row.gxName = gxName
            this.updateReportBtIfShow(true)
            this.updateCurReportInfo(row)
            this.updateCurPage('Report')
            this.$router.push({name: 'Report'})
            break
          default:
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
    // canNotAddReport () {
    //   this.$message({
    //     message: '没有此道工序!',
    //     type: 'warning'
    //   })
    // },
    showLJList () {
      this.dialogLJListVisible = true
      this.getLJList()
    },
    // CNC加入零件列表
    addToLJlIST (idx, row) {
      let Data = {
        fidz: row.fidz,
        fidc: row.fidc,
        fnumber: row.fnumber,
        fname: row.fname,
        clnumber: row.clnumber,
        clname: row.clname,
        jhsfnumber: row.jhsnumber,
        pid: this.workOrderIdCNC,
        userno: this.userInfo.userno
      }
      this.Http.post('addljrecord', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '加入零件列表成功!',
              type: 'success'
            })
            break
          default:
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
    // 从加入的零件列表中移除
    removeFromList (idx, row) {
      this.Http.get('delljrecord', {id: row.id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '移除成功!',
              type: 'success'
            })
            this.getLJList()
            break
          default:
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
    // CNC获取零件列表
    getLJList () {
      this.Http.get('ljrecordlist', {id: this.workOrderIdCNC}
      ).then(res => {
        this.LJListData = res.data.list
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
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
    // 加入外协
    addWaiXie (row) {
      let Data = {
        ddfbillno: this.workOrderDdfbillno,
        fbillno: this.curFbillno,
        fidz: row.fidz,
        fidc: row.fidc,
        fnumber: row.fnumber,
        fname: row.fname,
        clnumber: row.clnumber,
        clname: row.clname,
        jhsfnumber: row.jhsnumber,
        userno: this.userInfo.userno
      }
      this.Http.post('addwxlj', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message.closeAll()
            this.$message({
              message: '加入成功!',
              type: 'success'
            })
            break
          default:
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
        fqty: this.workOrderFqty,
        fbillno: this.curFbillno,
        workid: this.curWorkId
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
      this.Http.get(this.ljgzFromType === 1 && (this.userInfo.gongxu === 'CNC' || this.userInfo.gongxu === '焊接') ? 'serljgzcnc' : 'serljgz', Data
      // this.Http.get('serljgz', Data
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
    },
    // 获取汇报历史记录
    getHBHistory () {
      let Data = {
        number: this.pageSize,
        page_num: this.curPage,
        gongxu: this.curChoosedGX,
        gdfbillno: this.curFbillno,
        fidz: this.curLjgzInfo.fidz,
        fidc: this.curLjgzInfo.fidc,
        workno: this.huibaiWorkNo
      }
      this.Http.get('serwork', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.hbHistory = res.data.list.map(item => {
              item.create_timeTxt = secondToFormatAll(item.create_time.time)
              item.ifCanOpen = !item.starttime
              item.ifCanClose = !item.endtime
              return item
            })
            this.sumHB = res.data.count
            break
          default:
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
