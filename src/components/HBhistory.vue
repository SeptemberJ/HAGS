<template>
  <div class="WorkOrder">
    <!-- 新增人员 -->
    <el-dialog id="addPerson" title="新增人员" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" width="500px">
      <div style="text-align: right;diplay: block;">
        <el-button type="success" size="small" @click="addPerson('hb')">新增</el-button>
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
            <!-- v-for="item in scope.row.options" selectChoosePeopleList -->
            <el-select v-model="scope.row.id" filterable :filter-method="(value) => filterMethod(value, scope.$index)" @change="(value) => changePerson(value, scope.$index)" size="mini" placeholder="请选择">
              <el-option
                v-for="item in scope.row.options"
                :key="item.id"
                :label="item.fname"
                :value="item.id">
                <span style="float: left">{{ item.fname }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.danhao }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="delPerson(scope.$index, scope.row, 'hb')">移 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="savePerson">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 当日汇报记录 汇报记录 -->
    <el-dialog title="汇报记录" :visible.sync="dialogHBHistoryVisible" :close-on-click-modal="false" width="90%">
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
      <el-table @row-dblclick="seeHistoryDetail"
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
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="endtime"
          label="关机时间"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="freason"
          label="关机原因"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="create_timeTxt"
          label="汇报时间"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
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
      <el-dialog class="time"
        width="50%"
        :title="openOrClose ==  0 ? '提交关机时间' : '提交开机时间'"
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
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="submitTime" :loading="btLoading">提 交</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- 关机后不选择汇报 -->
    <el-dialog
      width="50%"
      title="关机原因"
      :visible.sync="dialogShutDownReasonVisible"
      :close-on-click-modal="false"
      append-to-body>
      <el-form label-width="80px">
        <el-form-item label="原因">
          <el-select v-model="shutDownReason" placeholder="请选择原因">
            <el-option
              v-for="item in shutDownReasonList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="shutDownNote">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitShutDownReason" :loading="btLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- CNC添加机器设备 -->
    <el-dialog id="addCnc" title="机器设备列表" :visible.sync="dialogAddCncVisible" :close-on-click-modal="false" width="500px">
      <div style="text-align: right;diplay: block;">
        <el-button type="success" size="small" @click="addCnc">新增</el-button>
      </div>
      <!-- 机器设备list -->
      <el-table
        :data="cncRecordList"
        v-loading="listLoading"
        max-height="250"
        style="width: 100%;margin-top: .2rem;">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="设备">
          <template slot-scope="scope">
            <el-select v-model="scope.row.shebei" filterable @change="(value) => changeEquipment(value, scope.$index)" size="mini" placeholder="请选择">
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.shebei"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="机床">
          <template slot-scope="scope">
            <el-select v-model="scope.row.jichuang" filterable @change="(value) => changeJC(value, scope.$index)" size="mini" placeholder="请选择">
              <el-option
                v-for="item in scope.row.jcList"
                :key="item.id"
                :label="item.jichuang"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="delCnc(scope.$index, scope.row)">移 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCncVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="saveCnc">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 加入的汇报list v-loading="listLoading" -->
    <el-dialog title="汇报工单列表" :visible.sync="dialogHBListVisible" :close-on-click-modal="false" width="850px">
      <el-table @row-dblclick="cncToChooseLJ"
        :data="HBListData"
        ref="selectedHBList"
        show-summary
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
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="ddfbillno"
          label="订单号"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="fnumber"
          label="产品名称"
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
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="removeFromList(scope.$index, scope.row, 0)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="sureToHB">确认 并去汇报</el-button>
        <el-button @click="dialogHBListVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 工单人员列表 -->
    <el-dialog title="工单人员" :visible.sync="dialogGDPersonVisible" :close-on-click-modal="false" width="750px">
      <div style="text-align: right;diplay: block;">
        <el-button type="success" size="small" @click="addPerson('gd')">新增</el-button>
      </div>
      <!-- person list -->
      <el-table
        :data="personListGD"
        max-height="250"
        style="width: 100%;margin-top: .2rem;">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="fname"
          label="人员"
          width="125"
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          label="操作员">
          <template slot-scope="scope">
            <el-select v-model="scope.row.id" disabled size="mini" placeholder="请选择">
              <el-option
                v-for="item in scope.row.options"
                :key="item.id"
                :label="item.fname"
                :value="item.id">
                <span style="float: left">{{ item.fname }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.danhao }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column> -->
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
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" size="mini" :disabled="!scope.row.ifCanOpen" @click="showTimeGDDialog(scope.$index, scope.row, 1)">开机</el-button>
            <el-button type="danger" size="mini" :disabled="!scope.row.ifCanClose" @click="showTimeGDDialog(scope.$index, scope.row, 0)">关机</el-button>
            <el-button size="mini" @click="delPerson(scope.$index, scope.row, 'gd')">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGDPersonVisible = false">取 消</el-button>
      </div>
      <!-- 内层人员新增 -->
      <el-dialog
        width="50%"
        title="人员新增"
        :visible.sync="dialogAddPersonGDVisible"
        :close-on-click-modal="false"
        append-to-body>
        <el-select v-model="addGDPerson.id" filterable :filter-method="(value) => filterMethodGD(value)" @change="(value) => changePersonGD(value)" size="mini" placeholder="请选择人员">
          <el-option
            v-for="item in addGDPerson.options"
            :key="item.id"
            :label="item.fname"
            :value="item.id">
            <span style="float: left">{{ item.fname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.danhao }}</span>
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddPersonGDVisible = false">取 消</el-button>
          <el-button type="danger" @click="saveGDPerson" :loading="btLoading">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 内层时间选择 -->
      <el-dialog class="time"
        width="50%"
        :title="openOrClose ==  0 ? '提交关机时间' : '提交开机时间'"
        :visible.sync="dialogTimeGDVisible"
        :close-on-click-modal="false"
        append-to-body>
          <el-date-picker
            disabled
            v-model="time"
            value-format="yyyy-MM-dd HH : mm"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="submitTimeGD" :loading="btLoading">提 交</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- 开机前预警 -->
    <el-dialog
      title="预警详情"
      :visible.sync="dialogVisibleYJ"
      :showClose="true"
      fullscreen>
      <WarnPrint :warnsInfo="warnsInfo" @showTimeBox="showTimeBox"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {secondToFormat, dateToFormatAll, secondToFormatAll} from '../util/utils'
import WarnPrint from '../components/WarnPrint'
export default {
  name: 'WorkOrder',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      filterProductionName: '',
      filterOrderNo: '',
      curPage: 1,
      pageSize: 15,
      sum: 0,
      huibaoOrderList: [], // 勾选的工单列表
      orderList: [], // 工单列表
      defaultPersonList: [], // 页面默认的人员列表
      selectChoosePeopleList: [], // select可选择的person的list
      personList: [], // 汇报时新增页上所有person的list
      personListGD: [], // 工单人员新增页上所有person的list
      addGDPerson: {id: '', fname: '', userno: '', options: {}}, // 工单新增的人员
      workIdGDPerson: null, // 工单人员新增时的改的id
      personIdGDPerson: null, // 开机人员id
      dialogAddPersonGDVisible: false,
      dialogTimeGDVisible: false,
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
      curStartTmie: null, // 记录的开机时间
      time: '', // 开机或关机的提交时间
      selectedList: [], // 当前页的选中项
      selectedAllList: [], // 所有页的选中项集合
      // HBListData: [], // 汇报列表数据
      selectedHBList: [], // 勾选加入汇报列表的项
      // dialogHBListVisible: false,
      dialogGDPersonVisible: false,
      dialogShutDownReasonVisible: false,
      shutDownReasonList: [
        {label: '明天汇报', value: '明天汇报'},
        {label: '缺料', value: '缺料'},
        {label: '明天继续生产', value: '明天继续生产'},
        {label: '其他原因', value: '其他原因'}
      ],
      shutDownReason: '',
      shutDownNote: '',
      dialogAddCncVisible: false,
      cncRecordList: [], // 机器设备列表
      equipmentList: [],
      jichuangList: [],
      curJCId: null, // 当前的选择的机床id
      ifBootUpAgain: false,
      huibaiWorkNo: '', // 汇报查询
      dialogVisibleYJ: false,
      warnsInfo: '',
      OpenOrCloseRow: null // 开关机的行数据
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      userInfo: state => state.userInfo
    }),
    dialogHBListVisible: {
      get: function () {
        return this.$store.state.ifKeepShow
      },
      set: function (newValue) {
        this.$store.state.ifKeepShow = newValue
      }
    },
    HBListData: {
      get: function () {
        return this.$store.state.HBList
      },
      set: function (newValue) {
        this.$store.state.HBList = newValue
      }
    }
  },
  components: {
    WarnPrint
  },
  created () {
    this.getHBHistory()
    this.getEquipmentList()
    this.updateLjgzLjgzIdCNC(null) // 初始化LjgzIdCNC 确保只有回报列表双击才会显示加入零件列表
  },
  watch: {
    dialogVisibleYJ: function (value) {
      if (!value) {
        this.showTimeBox()
      }
    }
  },
  methods: {
    ...mapActions([
      'updateCurFbillno',
      'updateLjgzOption',
      'updateLjgzLjgzIdCNC',
      'updateCurPage',
      'updateBeforePage',
      'updateCurWorkId',
      'updateIfJustSee',
      'updateSelectedAllList'
    ]),
    // 条件查询
    search () {
      this.selectedList = []
      this.selectedAllList = []
      this.curPage = 1
      this.getWorkOrderList()
    },
    // 重置按钮事件
    reset () {
      this.filterProductionName = ''
      this.filterOrderNo = ''
      this.curPage = 1
      this.getWorkOrderList()
    },
    // 工单列表的勾选切换
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
    // 已加入的汇报列表的勾选切换 暂时无用
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
    // 当天汇报记录或者汇报记录的页面切换
    handleCurrentChangeHB () {
      if (this.ifHistoryDay) {
        this.getHBHistoryDay()
      } else {
        this.getHBHistory()
      }
    },
    // 勾选分页汇报 已更改为先加入汇报列表
    // async huibao () {
    //   let noEmptyArray = await this.ifHasNoEmpty()
    //   if (noEmptyArray.length === 0) {
    //     this.$message({
    //       message: '请先勾选需要汇报的工单!',
    //       type: 'warning'
    //     })
    //     return false
    //   } else {
    //     let ifCanHB = await this.ifCanHB()
    //     alert(ifCanHB)
    //     if (ifCanHB !== '1') {
    //       debugger
    //       this.$message({
    //         message: this.canNotAddReason + '!',
    //         type: 'warning'
    //       })
    //       return false
    //     }
    //     this.getPeopleList()
    //     this.getDefaultPeopleList()
    //     this.dialogAddFormVisible = true
    //   }
    // },
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
        jlruserno: this.userInfo.id,
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
    searchHuibao () {
      this.curPageHB = 1
      if (this.ifHistoryDay) {
        this.getHBHistoryDay()
      } else {
        this.getHBHistory()
      }
    },
    // 显示当日汇报记录
    showHBHistoryDay () {
      this.curPageHB = 1
      this.dialogHBHistoryVisible = true
      this.ifHistoryDay = true
      this.getHBHistoryDay()
    },
    // 当日汇报记录
    getHBHistoryDay () {
      let Data = {}
      if (this.huibaiWorkNo) {
        Data = {number: this.pageSizeHB, page_num: this.curPageHB, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu, workno: this.huibaiWorkNo}
      } else {
        Data = {number: this.pageSizeHB, page_num: this.curPageHB, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu}
      }
      this.Http.get('serhuibaoworknow', Data
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
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 显示汇报历史
    showHBHistory () {
      this.curPageHB = 1
      this.dialogHBHistoryVisible = true
      this.ifHistoryDay = false
      this.getHBHistory()
    },
    // 汇报历史
    getHBHistory () {
      let Data = {}
      if (this.huibaiWorkNo) {
        Data = {number: this.pageSizeHB, page_num: this.curPageHB, userid: this.userInfo.id, workno: this.huibaiWorkNo}
      } else {
        Data = {number: this.pageSizeHB, page_num: this.curPageHB, userid: this.userInfo.id}
      }
      this.Http.get('kjyjlist', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.dialogHBHistoryVisible = true
            this.hbHistory = res.data.list.map(item => {
              item.create_timeTxt = secondToFormatAll(item.create_time.time)
              item.ifCanOpen = !item.starttime
              item.ifCanClose = !item.endtime
              return item
            })
            this.sumHB = res.data.count
            break
          default:
            this.dialogHBHistoryVisible = false
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 人员开关机
    async showTimeGDDialog (idx, row, type) {
      this.personIdGDPerson = row.id
      this.openOrClose = type
      if (type === 1 && this.userInfo.gongxu === 'CNC') { // CNC开机需要验证
        let ifCanOpertionResult = await this.checkBootUp(this.workIdGDPerson)
        if (ifCanOpertionResult.code === '1') { // CNC
          this.$message({
            message: ifCanOpertionResult.message + '!',
            type: 'warning'
          })
          this.ShowaAddCNC(this.workIdGDPerson)
        } else {
          this.dialogTimeGDVisible = true
          let CurTime = await this.getCurTime()
          this.time = new Date(CurTime)// new Date()
        }
      } else {
        if (type === 0) {
          if (!row.starttime) {
            this.$message({
              message: '还未开机，不能关机!',
              type: 'warning'
            })
            return false
          }
          this.curStartTmie = row.starttime
        }
        this.dialogTimeGDVisible = true
        let CurTime = await this.getCurTime()
        this.time = new Date(CurTime)// new Date()
      }
    },
    // 预警返回触发时间框弹出
    showTimeBox () {
      this.dialogVisibleYJ = false
      this.sureShowTime(null, this.OpenOrCloseRow, this.openOrClose)
    },
    // 开关机
    async showTimeDialog (idx, row, type) {
      this.openOrClose = type
      this.OpenOrCloseRow = row
      if (type === 1) {
        let checkYJResult = await this.checkYuJing(row.id)
        if (checkYJResult.code === '1') {
          // 提示是否查看预警
          this.$confirm('有预警是否查看?', '提示', {
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            // 显示预警
            this.dialogVisibleYJ = true
            this.warnsInfo = checkYJResult.list
          }).catch(() => {
            // this.sureShowTime(idx, row, type)
          })
        } else {
          this.sureShowTime(idx, row, type)
        }
      } else {
        this.sureShowTime(idx, row, type)
      }
    },
    async sureShowTime (idx, row, type) {
      if (type === 1 && this.userInfo.gongxu === 'CNC') { // CNC开机需要验证
        let ifCanOpertionResult = await this.checkBootUp(row.id)
        if (ifCanOpertionResult.code === '1') { // CNC
          this.$message({
            message: ifCanOpertionResult.message + '!',
            type: 'warning'
          })
          this.ShowaAddCNC(row.id)
        } else {
          this.dialogTimeVisible = true
          let CurTime = await this.getCurTime()
          this.time = new Date(CurTime)// new Date()
          this.curWorkId = row.id
        }
      } else {
        if (type === 0) {
          if (!row.starttime) {
            this.$message({
              message: '还未开机，不能关机!',
              type: 'warning'
            })
            return false
          }
          this.curStartTmie = row.starttime
        }
        this.dialogTimeVisible = true
        let CurTime = await this.getCurTime()
        this.time = new Date(CurTime)// new Date()
        this.curWorkId = row.id
      }
    },
    getCurTime () {
      return new Promise((resolve, reject) => {
        this.Http.get('sertime'
        ).then(res => {
          resolve(res.data.time)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    async showTimeDialog2 (idx, row, type) {
      this.openOrClose = type
      if (type === 1) {
        this.checkYuJing(row.id)
      }
      if (type === 1 && this.userInfo.gongxu === 'CNC') { // CNC开机需要验证
        let ifCanOpertionResult = await this.checkBootUp(row.id)
        if (ifCanOpertionResult.code === '1') { // CNC
          this.$message({
            message: ifCanOpertionResult.message + '!',
            type: 'warning'
          })
          this.ShowaAddCNC(row.id)
        } else {
          this.dialogTimeVisible = true
          this.time = new Date()
          this.curWorkId = row.id
        }
      } else {
        if (type === 0) {
          if (!row.starttime) {
            this.$message({
              message: '还未开机，不能关机!',
              type: 'warning'
            })
            return false
          }
          this.curStartTmie = row.starttime
        }
        this.dialogTimeVisible = true
        this.time = new Date()
        this.curWorkId = row.id
      }
    },
    checkYuJing (Id) {
      return new Promise((resolve, reject) => {
        this.Http.get('kaijiyujing', {workid: Id}
        ).then(res => {
          resolve(res.data)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    // 重复开机
    bootUpAgain (row) {
      if (!row.endtime) {
        this.$message({
          message: '还未关机，不能重复开机!',
          type: 'warning'
        })
        return false
      }
      this.openOrClose = 2 // 重复开机
      this.curWorkId = row.id
      this.ifBootUpAgain = true
      this.getPeopleList()
      this.getDefaultPeopleList()
      this.dialogAddFormVisible = true
    },
    // CNC检查是否允许开机
    checkBootUp (id) {
      return new Promise((resolve, reject) => {
        this.Http.get('checkguanji', {workid: id}
        ).then(res => {
          resolve(res.data)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    // 开关机保存时间
    submitTime () {
      if (this.openOrClose === 0) {
        this.shutDown()
      } else {
        this.bootUp()
      }
    },
    submitTimeGD () {
      if (this.openOrClose === 0) {
        this.shutDownGD()
      } else {
        this.bootUpGD()
      }
    },
    // 提交开机时间
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
    bootUpGD () {
      this.btLoading = true
      this.Http.post('rykaiji?starttime=' + dateToFormatAll(this.time) + '&workid=' + this.workIdGDPerson + '&userno=' + this.personIdGDPerson
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '开机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeGDVisible = false
            this.getPeopleListGD()
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
    // 提交关机时间
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
            this.shutDownReason = ''
            this.dialogTimeVisible = false
            this.handleCurrentChangeHB()
            // 关机后是否进行汇报
            this.$confirm('是否汇报产量?', '提示', {
              confirmButtonText: '否',
              cancelButtonText: '是',
              type: 'warning'
            }).then(() => {
              this.dialogShutDownReasonVisible = true
            }).catch((error) => {
              console.log(error)
              // 再次弹出
              this.$confirm('请再次确认是否汇报产量?', '提示', {
                confirmButtonText: '否',
                cancelButtonText: '是',
                type: 'warning'
              }).then(() => {
                this.dialogShutDownReasonVisible = true
              }).catch((error) => {
                console.log(error)
              })
            })
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
    shutDownGD () {
      let DateStart = this.$moment(this.curStartTmie)
      let DateEnd = this.$moment(dateToFormatAll(this.time))
      let worktime = DateEnd.diff(DateStart, 'minute')
      this.btLoading = true
      this.Http.post('ryguanji?endtime=' + dateToFormatAll(this.time) + '&worktime=' + worktime + '&workid=' + this.workIdGDPerson + '&userno=' + this.personIdGDPerson
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '关机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.shutDownReason = ''
            this.dialogTimeGDVisible = false
            this.getPeopleListGD()
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
    // 提交关机原因
    submitShutDownReason () {
      if (!this.shutDownReason) {
        this.$message({
          message: '请选择关机原因!',
          type: 'warning'
        })
        return false
      } else {
        if ((this.shutDownReason === '缺料' || this.shutDownReason === '其他原因') && !this.shutDownNote) {
          this.$message({
            message: '请先输入备注再提交!',
            type: 'warning'
          })
          return false
        } else {
          this.btLoading = true
          this.Http.post('guanjireason?workid=' + this.curWorkId + '&freason=' + this.shutDownReason + '&fnote=' + this.shutDownNote
          ).then(res => {
            switch (res.data.code) {
              case '1':
                this.$message({
                  message: '关机原因提交成功!',
                  type: 'success'
                })
                this.dialogShutDownReasonVisible = false
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
        }
      }
    },
    // 查看汇报详情 已更改
    // historyDetail (row) {
    //   if (!row.endtime) {
    //     this.$message({
    //       message: '还未关机，不能进行汇报!',
    //       type: 'warning'
    //     })
    //   } else {
    //     this.updateCurWorkId(row.id)
    //     this.updateCurPage('HBDetail')
    //     this.$router.push({name: 'HBDetail'})
    //   }
    //   // this.$router.push({name: 'HBDetail', params: {id: row.id}})
    // },
    // 查看汇报详情 未关机的只能查看到详情为止
    seeHistoryDetail (row) {
      if (!row.endtime) {
        this.updateIfJustSee(true)
      } else {
        this.updateIfJustSee(false)
      }
      this.updateCurWorkId(row.id)
      this.updateCurPage('HBDetail')
      this.$router.push({name: 'HBDetail'})
    },
    // 查看工单人员
    seeWorkOrderPerson (row) {
      this.dialogGDPersonVisible = true
      this.workIdGDPerson = row.id
      this.getPeopleListGD()
    },
    // 显示CNC机器设备列表弹窗
    ShowaAddCNC (Id) {
      this.dialogAddCncVisible = true
      this.curWorkId = Id
      this.getCncRecordList(Id)
      // if (row) { // 点击行查看弹出
      //   this.dialogAddCncVisible = true
      //   this.curWorkId = row.id
      //   this.getCncRecordList(row.id)
      //   // if (row.starttime && !row.endtime) {
      //   //   debugger
      //   //   this.dialogAddCncVisible = true
      //   //   this.curWorkId = row.id
      //   //   this.getCncRecordList(row.id)
      //   // }
      // } else { // 开完机后自动弹出
      //   this.dialogAddCncVisible = true
      //   this.getCncRecordList(this.curWorkId)
      // }
    },
    // 获取CNC机器设备记录列表
    async getCncRecordList (id) {
      this.listLoading = true
      this.cncRecordList = []
      this.Http.get('sershebeilist', {workid: id}
      ).then(res => {
        res.data.list.map(async (item, idx) => {
          let resData = await this.initJCSelect(item.shebei)
          item.jcList = resData
          this.cncRecordList.push(item)
        })
        this.listLoading = false
      }).catch((error) => {
        console.log(error)
        this.listLoading = false
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 初始化机器设备列表每行记录中jichuang的下拉选项
    initJCSelect (EQ) {
      return new Promise((resolve, reject) => {
        this.Http.get('serjichuang', {shebeiid: EQ}
        ).then(res => {
          resolve(res.data.list)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    // 获取默认人员列表
    async getPeopleList () {
      let OptionList = await this.getDefaultPeopleList()
      this.Http.get('serpeople', {department: this.curModuleInfo.departid}
      ).then(res => {
        this.personList = res.data.list.map(item => {
          item.options = OptionList
          return item
        })
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 工单列表获取默认人员列表
    async getPeopleListGD () {
      let OptionList = await this.getDefaultPeopleList()
      this.Http.get('gdrylist', {workid: this.workIdGDPerson}
      ).then(res => {
        this.personListGD = res.data.list.map(item => {
          item.options = OptionList
          item.ifCanOpen = !item.starttime
          item.ifCanClose = !item.endtime
          return item
        })
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 获取新增人员时的select框选项
    getDefaultPeopleList () {
      return new Promise((resolve, reject) => {
        this.Http.get('departpeople', {worktype: this.userInfo.worktype}
        ).then(res => {
          this.selectChoosePeopleList = res.data.list
          resolve(res.data.list)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    // 获取CNC设备的select框选项
    getEquipmentList () {
      this.Http.get('sershebei'
      ).then(res => {
        this.equipmentList = res.data.list
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 切换设备的select框选项
    changeEquipment (val, idx) {
      return new Promise((resolve, reject) => {
        this.Http.get('serjichuang', {shebeiid: val}
        ).then(res => {
          this.cncRecordList[idx].jcList = res.data.list
          resolve(res.data.list)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    // 切换机床的select框选项
    changeJC (val, idx) {
      this.curJCId = val
      if (this.cncRecordList.filter(this.checkJCId).length > 1) {
        this.$message({
          message: '该机床已存在!',
          type: 'warning'
        })
        this.cncRecordList[idx].jichuang = ''
      }
    },
    // 添加一行CNC记录
    addCnc () {
      this.cncRecordList.push({id: '', shebei: '', jichuang: '', jcList: []})
    },
    delCnc (idx, row) {
      this.cncRecordList.splice(idx, 1)
    },
    // 查看机床是否重复
    checkJCId (JC) {
      return JC.jichuang === this.curJCId
    },
    // 保存CNC
    async saveCnc () {
      if (this.cncRecordList.length < 1) {
        this.$message({
          message: '请添机器设备记录!',
          type: 'warning'
        })
        return false
      }
      let ifAllSelect = await this.ifAllSelectJC() // 是否还有未选择的机床
      if (!ifAllSelect) {
        this.$message({
          message: '请将信息选择完整!',
          type: 'warning'
        })
        return false
      }
      let Data = {
        workid: this.curWorkId,
        peoplelist: this.cncRecordList
      }
      this.btLoading = true
      this.Http.post('addshebei', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '机器设备保存成功!',
              type: 'success'
            })
            // 初始化数据
            this.curJCId = ''
            this.dialogAddCncVisible = false
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
    // 人员select框是否都已选择
    ifAllSelectJC () {
      return new Promise((resolve, reject) => {
        let ifAllSelect = true
        this.cncRecordList.map((item, idx) => {
          if (!item.shebei || !item.jichuang) {
            ifAllSelect = false
          }
          if (idx === this.cncRecordList.length - 1) {
            resolve(ifAllSelect)
          }
        })
      })
    },
    // 添加人员
    addPerson (type) {
      if (type === 'gd') {
        this.dialogAddPersonGDVisible = true
        this.addGDPerson = {id: '', fname: '', userno: '', options: this.selectChoosePeopleList}
      } else {
        this.personList.push({id: '', fname: '', userno: '', options: this.selectChoosePeopleList})
      }
    },
    // 移除人员记录
    delPerson (idx, row, type) {
      if (type === 'hb') {
        this.personList.splice(idx, 1)
      } else {
        this.$confirm('此操作将删除该人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delGDPerson(row.id)
        }).catch(() => {
        })
      }
    },
    delGDPerson (Id) {
      this.Http.get('delhbry', {workid: this.workIdGDPerson, userno: Id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '人员删除成功!',
              type: 'success'
            })
            this.getPeopleListGD()
            break
          default:
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
    // 查看是否重复
    checkId (pesron) {
      return pesron.id === this.curPersonId
    },
    // 人员选项改变
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
        this.personList[idx].options = this.selectChoosePeopleList
      } else {
        this.personList[idx].options = this.selectChoosePeopleList
        this.selectChoosePeopleList.map(item => {
          if (item.id === val) {
            this.personList[idx].fname = item.fname
            this.personList[idx].userno = item.id // item.userno
          }
        })
      }
    },
    changePersonGD (val) {
      // 校验重复
      this.curPersonId = val
      if (this.personListGD.filter(this.checkId).length >= 1) {
        this.$message({
          message: '该操作员已存在!',
          type: 'error'
        })
        this.addGDPerson.id = ''
        this.addGDPerson.fname = ''
        this.addGDPerson.userno = ''
        this.curPersonId = ''
        this.addGDPerson.options = this.selectChoosePeopleList
      } else {
        this.addGDPerson.options = this.selectChoosePeopleList
        this.selectChoosePeopleList.map(item => {
          if (item.id === val) {
            this.addGDPerson.fname = item.fname
            this.addGDPerson.userno = item.id // item.userno
          }
        })
      }
    },
    // 人员过滤
    filterMethod (val, idx) {
      if (val) { // val存在
        this.personList[idx].options = this.selectChoosePeopleList.filter((item) => {
          if (!!~item.danhao.indexOf(val) || !!~item.fname.indexOf(val)) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.personList[idx].options = this.selectChoosePeopleList
      }
    },
    // 工单人员过滤
    filterMethodGD (val) {
      if (val) { // val存在
        this.addGDPerson.options = this.selectChoosePeopleList.filter((item) => {
          if (!!~item.danhao.indexOf(val) || !!~item.fname.indexOf(val)) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.addGDPerson.options = this.selectChoosePeopleList
      }
    },
    // 人员select框是否都已选择
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
    // 保存新增的工单人员
    saveGDPerson () {
      if (!this.addGDPerson.id) {
        this.$message({
          message: '请选择人员!',
          type: 'warning'
        })
        return false
      }
      this.btLoading = true
      this.Http.post('addry?workid=' + this.workIdGDPerson + '&userno=' + this.addGDPerson.id + '&fname=' + this.addGDPerson.fname
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '人员保存成功!',
              type: 'success'
            })
            this.getPeopleListGD()
            this.dialogAddPersonGDVisible = false
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
    // 提交保存新增人员
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
      if (this.ifBootUpAgain) { // 重复开机提交人员
        this.savePersonBootUpAagin()
      } else {
        if (this.userInfo.gongxu === 'CNC' || this.userInfo.gongxu === '焊接') {
          this.savePersonCNC()
        } else {
          this.savePersonOthers()
        }
      }
    },
    // 重复开机提交人员
    savePersonBootUpAagin () {
      let Data = {
        workid: this.curWorkId,
        peoplelist: this.personList.map(item => {
          item.userno = item.id
          return item
        })
        // worklist: this.HBListData,
        // gongxu: this.userInfo.gongxu,
        // fbiller: this.userInfo.fname,
        // department: this.curModuleInfo.departid,
        // jlruserno: this.userInfo.userno
      }
      this.Http.post('cfkaiji', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '人员保存成功!',
              type: 'success'
            })
            if (this.ifHistoryDay) {
              this.getHBHistoryDay()
            } else {
              this.getHBHistory()
            }
            // 初始化数据
            this.selectedList = []
            this.selectedAllList = []
            this.huibaoOrderList = []
            this.personList = []
            this.curPersonId = ''
            this.dialogAddFormVisible = false
            this.btLoading = false
            break
          case '2':
            this.$message({
              message: res.data.message + '!',
              type: 'warning'
            })
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
    // 非CNC保存人员
    savePersonOthers () {
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
            // this.curPage = 1
            this.selectedList = []
            this.selectedAllList = []
            this.huibaoOrderList = []
            this.personList = []
            this.curPersonId = ''
            this.dialogAddFormVisible = false
            this.btLoading = false
            break
          case '2':
            this.$message({
              message: res.data.message + '!',
              type: 'warning'
            })
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
    // CNC保存人员
    savePersonCNC () {
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
      }
      console.log(Data)
      this.Http.post('insertworkcnc', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '人员保存成功!',
              type: 'success'
            })
            this.getWorkOrderList()
            // 初始化数据
            // this.curPage = 1
            this.selectedList = []
            this.selectedAllList = []
            this.huibaoOrderList = []
            this.personList = []
            this.curPersonId = ''
            this.dialogAddFormVisible = false
            this.btLoading = false
            break
          case '2':
            this.$message({
              message: res.data.message + '!',
              type: 'warning'
            })
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
    // 跳转预警详情
    warnDetail (idx, row) {
      this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty})
      this.updateCurPage('WarnPrint')
      this.$router.push({name: 'WarnPrint'})
    },
    // 加入汇报列表
    addToHBList (idx, row) {
      this.Http.post('addgngdanrecord', {gongxu: this.userInfo.gongxu, fbiller: this.userInfo.fname, fbillno: row.fbillno, fshortnumber: row.FShortNumber, fnumber: row.fnumber, jhsfnumber: row.fqty, ddfbillno: row.ddfbillno, userno: this.userInfo.userno}
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
    // 显示汇报列表
    showHBlList () {
      this.dialogHBListVisible = true
      this.getHBList()
    },
    toggleHBList (status) {
      this.dialogHBListVisible = status
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
        if (ifCanHB !== '1') {
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
    // CNC
    cncToChooseLJ (row) {
      if (this.userInfo.gongxu === 'CNC' || this.userInfo.gongxu === '焊接') {
        this.updateLjgzLjgzIdCNC(row.id)
        row.FShortNumber = row.fshortnumber
        row.fqty = row.jhsnumber
        this.goLjgz(row)
      }
    },
    // 跳转零件管制
    goLjgz (row) {
      this.updateCurFbillno(row.fbillno)
      this.updateLjgzOption({fshortnumber: row.FShortNumber, fqty: row.fqty, fbillno: row.fbillno})
      this.updateBeforePage('WorkOrder')
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
      }, 5)
    },
    // 获取工单列表
    getWorkOrderList () {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.Http.post('orderList', {number: this.pageSize, page_num: this.curPage, fnumber: this.filterProductionName, ddfbillno: this.filterOrderNo}
        ).then(res => {
          switch (res.data.code) {
            case 1:
              // this.goTop()
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
