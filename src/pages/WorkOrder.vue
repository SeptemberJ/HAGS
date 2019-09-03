<template>
  <div class="WorkOrder">
    <!-- 查询 -->
    <el-row style="margin-top:.3rem;">
      <el-form :inline="true" id="saerchNameForm" class="demo-form-inline">
        <el-col :span="8" :offset="2">
          <el-form-item label="产品名称">
            <el-input v-model="filterProductionName" placeholder="请输入产品名称" size="small" clearable style="width:100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单号">
            <el-input v-model="filterOrderNo" placeholder="请输入订单号" size="small" clearable style="width:100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: left;">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;">
          <el-form-item>
            <el-button size="small" type="info" @click="getHBHistoryDay">当日汇报记录</el-button>
            <el-button size="small" type="info" @click="getHBHistory">汇报记录</el-button>
            <el-button size="small" type="warning" @click="showHBlList">汇报列表</el-button>
            <!-- <el-button size="small" type="warning" @click="huibao">汇报</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 工单列表 -->
    <section>
      <el-table @row-dblclick="goLjgz"
        ref="selectedList"
        :data="orderList"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
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
          property="ddfbillno"
          label="订单号"
          width="120"
          show-overflow-tooltip>
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
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="addToHBList(scope.$index, scope.row)">加入汇报</el-button>
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
            <el-select v-model="scope.row.id" filterable @change="(value) => changePerson(value, scope.$index)" size="mini" placeholder="请选择">
              <el-option
                v-for="item in selectChoosePeopleList"
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
    <el-dialog :title="ifHistoryDay ? '当日汇报记录' : '汇报记录'" :visible.sync="dialogHBHistoryVisible" :close-on-click-modal="false" width="900px">
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
          property="starttime"
          label="开机时间"
          width="170"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="endtime"
          label="关机时间"
          width="170"
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
        @current-change="handleCurrentChangeHB"
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
          <el-date-picker
            disabled
            v-model="time"
            value-format="yyyy-MM-dd HH : mm"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        <!-- <el-time-picker
          disabled
          v-model="time"
          format="YY - MM - DD HH 点 mm 分"
          value-format="YY-MM-DD-HH-mm"
          placeholder="请选择时间"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }">
        </el-time-picker> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitTime" :loading="btLoading">提 交</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- 加入的汇报list -->
    <el-dialog title="汇报工单列表" :visible.sync="dialogHBListVisible" :close-on-click-modal="false" width="650px">
      <el-table
        :data="HBListData"
        ref="selectedHBList"
        v-loading="listLoading"
        @selection-change="handleSelectionChangeHBList"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <!-- <el-table-column
          type="selection"
          width="55">
        </el-table-column> -->
        <el-table-column
          property="fbillno"
          label="工单号"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="ddfbillno"
          label="订单号"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fnumber"
          label="产品名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="removeFromList(scope.$index, scope.row, 0)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="removeFromListAll">移 除</el-button> -->
        <el-button type="danger" @click="sureToHB">确认 并去汇报</el-button>
        <el-button @click="dialogHBListVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {secondToFormat, dateToFormatAll, secondToFormatAll} from '../util/utils'

export default {
  name: 'WorkOrder',
  data () {
    return {
      listLoading: true,
      btLoading: false,
      filterProductionName: '', // 5.03.AA-P-RZRXPT-HC-SBJ-003.0003
      filterOrderNo: '',
      curPage: 1,
      pageSize: 15,
      sum: 0,
      huibaoOrderList: [],
      orderList: [],
      defaultPersonList: [], // 页面默认的人员列表
      selectChoosePeopleList: [], // select可选择的person的list
      personList: [], // 新增页上所有person的list
      curPersonId: null,
      dialogAddFormVisible: false,
      dialogHBHistoryVisible: false,
      dialogTimeVisible: false,
      ifCanAddPerson: false,
      canNotAddReason: '',
      hbHistory: [],
      curPageHB: 1,
      pageSizeHB: 5,
      sumHB: 0,
      ifHistoryDay: false,
      openOrClose: 1, // 0 关机 1 开机
      curWorkId: null,
      curStartTmie: null,
      time: '',
      selectedList: [], // 当前页的选中项
      selectedAllList: [], // 所有页的选中项集合
      HBListData: [], // 汇报列表数据
      selectedHBList: [], // 勾选加入汇报列表的项
      dialogHBListVisible: false
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
      'updateCurWorkId',
      'updateSelectedAllList'
    ]),
    // 条件查询
    search () {
      this.selectedList = []
      this.selectedAllList = []
      this.curPage = 1
      this.getWorkOrderList()
    },
    // 重置
    reset () {
      this.filterProductionName = ''
      this.filterOrderNo = ''
      this.curPage = 1
      this.getWorkOrderList()
    },
    // 勾选工单列表
    handleSelectionChange (curSelection) {
      this.huibaoOrderList = []
      this.selectedList = curSelection
      this.selectedAllList[this.curPage - 1] = curSelection
      this.selectedAllList.map(itemOut => {
        itemOut.map(itemIner => {
          this.huibaoOrderList.push(itemIner)
        })
      })
    },
    handleSelectionChangeHBList (curSelection) {
      this.selectedHBList = curSelection
    },
    // 工单号的切换页
    async handleCurrentChange () {
      // this.goTop()
      let temp = this.selectedAllList[this.curPage - 1] ? this.selectedAllList[this.curPage - 1] : []
      let PurchaseList = await this.getWorkOrderList()
      this.selectedList = temp
      if (this.selectedList.length > 0) {
        this.selectedList.map((itemS) => {
          PurchaseList.map((item, idx) => {
            if (item.fbillno === itemS.fbillno) {
              this.$refs.selectedList.toggleRowSelection(PurchaseList[idx], true)
            }
          })
        })
      }
    },
    // 当天回报记录或者汇报记录的切换页
    handleCurrentChangeHB () {
      if (this.ifHistoryDay) {
        this.getHBHistoryDay()
      } else {
        this.getHBHistory()
      }
    },
    async huibao () {
      let noEmptyArray = await this.ifHasNoEmpty()
      if (noEmptyArray.length === 0) {
        this.$message({
          message: '请先勾选需要汇报的工单!',
          type: 'warning'
        })
        return false
      } else {
        let ifCanHB = await this.ifCanHB()
        if (ifCanHB === '0') {
          this.$message({
            message: this.canNotAddReason + '!',
            type: 'warning'
          })
          return false
        }
        this.getPeopleList()
        this.getDefaultPeopleList()
        this.dialogAddFormVisible = true
      }
    },
    // 分页勾选确认是否勾选为空
    ifHasNoEmpty () {
      return new Promise((resolve, reject) => {
        let noEmptyItem = this.selectedAllList.filter(item => {
          return item.length > 0
        })
        resolve(noEmptyItem)
      })
    },
    // 查询接口是否可以进行汇报
    ifCanHB () {
      let Data = {
        gongxu: this.userInfo.gongxu,
        worklist: this.HBListData
        // worklist: this.huibaoOrderList.map(item => {
        //   item.fshortnumber = item.FShortNumber
        //   return item
        // })
      }
      return new Promise((resolve, reject) => {
        this.Http.post('selectgongdan', Data
        ).then(res => {
          this.canNotAddReason = res.data.message
          resolve(res.data.code)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    // 当日汇报记录
    getHBHistoryDay () {
      this.ifHistoryDay = true
      this.Http.get('serhuibaoworknow', {number: this.pageSizeHB, page_num: this.curPageHB, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu}
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
            this.dialogHBHistoryVisible = true
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
    // 汇报历史
    getHBHistory () {
      this.ifHistoryDay = false
      this.Http.get('serhuibaowork', {number: this.pageSizeHB, page_num: this.curPageHB, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu}
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
            this.dialogHBHistoryVisible = true
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
    showTimeDialog (idx, row, type) {
      if (type === 0) {
        this.curStartTmie = row.starttime
      }
      this.dialogTimeVisible = true
      let curDate = new Date()
      this.time = curDate // curDate.getHours() + '-' + curDate.getMinutes()
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
    // 开机
    bootUp () {
      this.btLoading = true
      this.Http.post('kaiji?starttime=' + dateToFormatAll(this.time) + '&workid=' + this.curWorkId
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '开机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeVisible = false
            this.handleCurrentChangeHB()
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
    // 关机
    shutDown () {
      let DateStart = this.$moment(this.curStartTmie)
      let DateEnd = this.$moment(dateToFormatAll(this.time))
      let worktime = DateEnd.diff(DateStart, 'minute')
      this.btLoading = true
      this.Http.post('guanji?endtime=' + dateToFormatAll(this.time) + '&workid=' + this.curWorkId + '&worktime=' + worktime
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '关机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeVisible = false
            this.handleCurrentChangeHB()
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
      if (!row.endtime) {
        this.$message({
          message: '还未关机，不能进行汇报!',
          type: 'warning'
        })
      } else {
        this.updateCurWorkId(row.id)
        this.updateCurPage('HBDetail')
        this.$router.push({name: 'HBDetail'})
      }
      // this.$router.push({name: 'HBDetail', params: {id: row.id}})
    },
    // 获取默认人员列表
    getPeopleList () {
      this.Http.get('serpeople', {department: this.curModuleInfo.departid}
      ).then(res => {
        this.personList = res.data.list
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 获取select人员选项
    getDefaultPeopleList () {
      this.Http.get('departpeople', {worktype: this.userInfo.worktype}
      ).then(res => {
        this.selectChoosePeopleList = res.data.list
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    addPerson () {
      this.personList.push({id: '', fname: '', userno: ''})
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
        this.personList[idx].userno = ''
        this.curPersonId = ''
      } else {
        this.selectChoosePeopleList.map(item => {
          if (item.id === val) {
            this.personList[idx].fname = item.fname
            this.personList[idx].userno = item.id // item.userno
          }
        })
      }
    },
    // 是否都选了人员
    ifAllSelect () {
      return new Promise((resolve, reject) => {
        let ifAllSelect = true
        this.personList.map((item, idx) => {
          if (!item.id) {
            ifAllSelect = false
          }
          if (idx === this.personList.length - 1) {
            resolve(ifAllSelect)
          }
        })
      })
    },
    // 新增人员
    async savePerson () {
      if (this.personList.length < 1) {
        this.$message({
          message: '请添加操作员!',
          type: 'warning'
        })
        return false
      }
      let ifAllSelect = await this.ifAllSelect() // 是否还有未选择的新增行
      if (!ifAllSelect) {
        this.$message({
          message: '请选择操作员!',
          type: 'warning'
        })
        return false
      }
      this.btLoading = true
      let Data = {
        gongxu: this.userInfo.gongxu,
        fbiller: this.userInfo.fname,
        department: this.curModuleInfo.departid,
        jlruserno: this.userInfo.userno,
        peoplelist: this.personList.map(item => {
          item.userno = item.id
          return item
        }),
        worklist: this.HBListData
        // worklist: this.huibaoOrderList.map(item => {
        //   item.fshortnumber = item.FShortNumber
        //   return item
        // }),
      }
      this.Http.post('insertwork', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '人员保存成功!',
              type: 'success'
            })
            this.getWorkOrderList()
            // 初始化数据
            this.curPage = 1
            this.selectedList = []
            this.selectedAllList = []
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
    // 加入汇报列表
    addToHBList (idx, row) {
      // let Data = {gongxu: this.userInfo.gongxu, fbiller: this.userInfo.fname, fbillno: row.fbillno, fshortnumber: row.FShortNumber, fnumber: row.fnumber, ddfbillno: row.ddfbillno, userno: this.userInfo.userno}
      // console.log(JSON.stringify(Data))
      this.Http.post('addgngdanrecord', {gongxu: this.userInfo.gongxu, fbiller: this.userInfo.fname, fbillno: row.fbillno, fshortnumber: row.FShortNumber, fnumber: row.fnumber, ddfbillno: row.ddfbillno, userno: this.userInfo.userno}
      ).then(res => {
        switch (res.data.code) {
          case '1':
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
    showHBlList () {
      this.dialogHBListVisible = true
      this.getHBList()
    },
    // 确认去汇报
    async sureToHB () {
      if (this.HBListData.length === 0) {
        this.$message({
          message: '请先添加需要汇报的工单!',
          type: 'warning'
        })
        return false
      } else {
        let ifCanHB = await this.ifCanHB()
        if (ifCanHB === '0') {
          this.$message({
            message: this.canNotAddReason + '!',
            type: 'warning'
          })
          return false
        }
        this.dialogHBListVisible = false
        this.getPeopleList()
        this.getDefaultPeopleList()
        this.dialogAddFormVisible = true
      }
    },
    removeFromListAll () {},
    // 获取已加入汇报的工单列表
    getHBList () {
      this.Http.get('recordlist', {gongxu: this.userInfo.gongxu, fbiller: this.userInfo.fname}
      ).then(res => {
        this.HBListData = res.data.list
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 从加入汇报的工单列表中移除
    removeFromList (idx, row) {
      this.Http.get('delrecord', {recordid: row.id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '移除成功!',
              type: 'success'
            })
            this.getHBList()
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
    // 跳转零件管制
    goLjgz (row) {
      this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty})
      this.updateCurPage('Ljgz')
      this.$router.push({name: 'Ljgz'})
    },
    // toTop
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
    // 获取工单列表
    getWorkOrderList () {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.Http.post('orderList', {number: this.pageSize, page_num: this.curPage, fnumber: this.filterProductionName, ddfbillno: this.filterOrderNo}
        ).then(res => {
          switch (res.data.code) {
            case 1:
              this.orderList = res.data.orderlist.map((item, idx) => {
                item.FCheckDateTxt = secondToFormat(item.FCheckDate.time)
                item.FPlanFinishDateTxt = secondToFormat(item.FPlanFinishDate.time)
                item.fshortTxt = item.fshort === 0 ? '否' : '是' // 1  缺料
                return item
              })
              this.listLoading = false
              this.sum = res.data.orderCount
              resolve(this.orderList)
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
