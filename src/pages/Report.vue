<template>
  <div class="Report">
    <div class="TopBarBlock">
      <el-row style="margin-top:.3rem;line-height:.3rem;">
        <el-col :span="6" class="TextAlignL" v-if="curReportInfo.fnumber">零件号: {{curReportInfo.fnumber}}</el-col>
        <el-col :span="6" class="TextAlignL" v-if="!curReportInfo.fnumber">材料代码: {{curReportInfo.clnumber}}</el-col>
        <el-col :span="6" class="TextAlignL" v-if="curReportInfo.fnumber">零件名称: {{curReportInfo.fname}}</el-col>
        <el-col :span="6" class="TextAlignL" v-if="!curReportInfo.fnumber">材料名称: {{curReportInfo.clname}}</el-col>
        <el-col :span="3" class="TextAlignL">当前工序: {{curReportInfo.gxName}}</el-col>
        <el-col :span="3" class="TextAlignL">零件计划数: {{topLineInfo.jhsnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">接收数: {{topLineInfo.jhnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">剩余接收数: {{topLineInfo.syjsnumber}}</el-col>
      </el-row>
      <el-row style="height:.5rem;line-height:.5rem;">
        <el-col :span="4" class="TextAlignL">本次完工产量: {{topLineInfo.fnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">本次报废数: {{topLineInfo.badnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">库存数: {{topLineInfo.kcnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">是否返工: {{topLineInfo.isback}}</el-col>
        <el-col :span="8" class="TextAlignL">备注: {{topLineInfo.fnote}}</el-col>
      </el-row>
      <el-row style="height:.5rem;line-height:.5rem;">
        <el-col :span="4" class="TextAlignL">累计完工产量: {{topLineInfo.wcnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">累计库存数量: {{topLineInfo.wckcnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">累计报废数: {{topLineInfo.bfnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">剩余未完成数: {{topLineInfo.synumber}}</el-col>
        <el-col :span="4" class="TextAlignL">累计返工完工产量: {{topLineInfo.ljfgnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">累计返工完工报废数: {{topLineInfo.ljfgbfnumber}}</el-col>
      </el-row>
      <el-row style="height:.5rem;line-height:.5rem;">
        <el-col :span="4" class="TextAlignL">本次返工完工产量: {{topLineInfo.fgnumber}}</el-col>
        <el-col :span="4" class="TextAlignL">本次返工完工报废数: {{topLineInfo.fgbfnumber}}</el-col>
      </el-row>
      <el-row style="margin:10px 0;">
        <el-col :span="24" class="TextAlignR" v-if="ifCanAdd">
          <el-button size="small" type="Info" v-if="userInfo.gongxu == '激光'" @click="getAppendProduction">附加产品列表</el-button>
          <el-button size="small" type="success" v-if="userInfo.gongxu == '激光'" @click="addAppendProduction">附加产品新增</el-button>
          <el-button size="small" type="warning" @click="huizong">汇报</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="reportList"
      ref="selectedPersonList"
      v-loading="listLoading"
      @selection-change="handleSelectionPersonChange"
      style="width: 100%">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="username"
        label="操作工"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="starttime"
        label="开机时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="endtime"
        label="停机时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="worktime"
        label="工作时间 (分钟)"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="waittime"
        label="等待时间 (分钟)"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="freason"
        label="停机原因"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="color: #409EFF;"
            @click="edit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="medium"
            type="text"
            style="color: #F56C6C;"
            @click="dele(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="reportList.length > 0" style="margin: .2rem 0;"
      @current-change="handleCurrentChangePerson"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
    <!-- 汇报 新增 编辑 -->
    <el-dialog :title="ifEdit ? '编辑' : (ifHZ ? '汇报' : '新增')" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" width="500px">
      <el-form class="TextAlignL" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="操作工" prop="username" v-if="!ifHZ">
          <el-select v-model="form.username" placeholder="请选择操作工" :disabled="ifEdit">
            <el-option v-for="(people, idx) in peopleList" :key="idx" :label="people.fname" :value="people.fname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开机时间" prop="starttime" v-if="(ifHZ && ifHasTwoTime && isshow != 1) || ifEdit">
          <el-date-picker :disabled="ifEdit"
            v-model="form.starttime"
            type="datetime"
            value-format="yyyy-MM-dd HH : mm"
            placeholder="请选择开机时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="停机时间" prop="endtime" v-if="(ifHZ && ifHasTwoTime && isshow != 1) || ifEdit">
          <!-- format="HH 点 mm 分"
            value-format="HH-mm"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
          -->
          <el-date-picker :disabled="ifEdit"
            v-model="form.endtime"
            type="datetime"
            value-format="yyyy-MM-dd HH : mm"
            placeholder="请选择停机时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完工产量" prop="fnumber" v-if="ifHZ">
          <el-input v-model="form.fnumber" placeholder="请输入完工产量"></el-input>
        </el-form-item>
        <el-form-item label="因料报废" prop="ylbfnumber" v-if="ifHZ">
          <el-input v-model="form.ylbfnumber" placeholder="请输入因料报废数量"></el-input>
        </el-form-item>
        <el-form-item label="因料报废原因" prop="ylbffreason" v-if="ifHZ">
          <el-input v-model="form.ylbffreason" type="textarea" placeholder="请输入因料报废原因..."></el-input>
        </el-form-item>
        <el-form-item label="因工报废" prop="ygbfbumber" v-if="ifHZ">
          <el-input v-model="form.ygbfbumber" placeholder="请输入因工报废数量"></el-input>
        </el-form-item>
        <el-form-item label="因工报废原因" prop="ygbfreason" v-if="ifHZ">
          <el-input v-model="form.ygbfreason" type="textarea" placeholder="请输入因工报废原因..."></el-input>
        </el-form-item>
        <el-form-item label="报废数" prop="badnumber" v-if="ifHZ">
          <el-input v-model="form.badnumber" disabled prop="badnumber" placeholder="请输入报废数"></el-input>
        </el-form-item>
        <el-form-item label="库存数" prop="kcnumber" v-if="ifHZ">
          <el-input v-model="form.kcnumber" prop="kcnumber" placeholder="请输入库存数"></el-input>
        </el-form-item>
        <el-form-item label="是否返工" prop="isback" v-if="!ifAdd">
          <el-select v-model="form.isback" placeholder="请选择是否返工" :disabled="ifEdit">
            <el-option label="不是返工" value="不是返工"></el-option>
            <el-option label="是返工" value="是返工"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停机原因" prop="freason" v-if="!ifAdd">
          <el-select v-model="form.freason" placeholder="请选择停机原因">
            <el-option label="首检" value="首检"></el-option>
            <el-option label="停机" value="停机"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="fnote" v-if="!ifAdd">
          <el-input type="textarea" v-model="form.fnote" :disabled="ifEdit" placeholder="请输入备注..."></el-input>
        </el-form-item>
        <el-form-item label="" v-if="!ifAdd">
          <el-tag class="CursorPointer" @click="addNoteByTag('纸箱')">纸箱</el-tag>
          <el-tag class="CursorPointer" @click="addNoteByTag('工程')">工程</el-tag>
          <el-tag class="CursorPointer" @click="addNoteByTag('喷塑')">喷塑</el-tag>
          <el-tag class="CursorPointer" @click="addNoteByTag('配件不全')">配件不全</el-tag>
        </el-form-item>
        <el-form-item label="等待时间" prop="waittime" v-if="!ifAdd">
          <el-input v-model="form.waittime" placeholder="请输入等待时间">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="save('form')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 附加产品列表 -->
    <el-dialog id="appendProduction" title="附加产品列表" :visible.sync="dialogAppendListVisible" :close-on-click-modal="false" width="850px">
      <el-table
        :data="appendProductionList"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="wlname"
          label="物料名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="wlnumber"
          label="物料代码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="fjnumber"
          label="数量"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          prop="username"
          label="人员"
          width="100"
          show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="人员"
          width="100">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="seePersonAP(scope.row)" icon="el-icon-view">查看</el-button> -->
            <el-button type="primary" size="mini" @click="seePersonAP(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeAP(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="appendProductionList.length > 0" style="margin: .2rem 0;"
        @current-change="getAppendProduction"
        :current-page.sync="curPageAP"
        :page-size="pageSizeAP"
        layout="total, prev, pager, next, jumper"
        :total="sumAP">
      </el-pagination>
      <!-- 内嵌人员列表 -->
      <el-dialog
        width="50%"
        title="人员列表"
        :visible.sync="dialogAPPersonVisible"
        :close-on-click-modal="false"
        append-to-body>
        <el-table
          :data="personListDetailAP"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="username"
            label="人员"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="removeAPPerson(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAPPersonVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAppendListVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 附加产品新增 -->
    <el-dialog title="附加产品新增" :visible.sync="dialogAppendAddVisible" :close-on-click-modal="false" width="850px">
       <el-form class="TextAlignL" :model="formAppendProduction" :rules="rulesAppendProduction" ref="formAppendProduction" label-width="80px">
        <el-row v-for="(itemAppend, idx) in formAppendProduction.list" :key="itemAppend.key">
          <el-col :span="2" class="TextAlignL"><span style="margin-top:5px;display:block;">{{idx + 1}}</span></el-col>
          <el-col :span="12" class="TextAlignL">
            <el-form-item label="物料名称" :prop="'list.' + idx + '.materie'" size="mini" :rules="rulesAppendProduction.materie">
              <el-select v-model="itemAppend.materie" filterable remote :remote-method="getMaterielList" size="mini" :loading="selectLoading" placeholder="请输入物料名称" style="width: 90%;">
                <el-option v-for="(materiel, idx) in materielList" :key="idx" :label="materiel.fname" :value="materiel.fname + '|' + materiel.fnumber">
                  <span style="float: left">{{ materiel.fname }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ materiel.fnumber }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" class="TextAlignL">
            <el-form-item label="数量" :prop="'list.' + idx + '.amount'" size="mini" :rules="rulesAppendProduction.amount">
              <el-input v-model="itemAppend.amount" placeholder="请输入数量" size="mini" style="width: 90%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="TextAlignR">
            <el-button size="mini" @click.prevent="removeLine(idx)">移 除</el-button>
          </el-col>
        </el-row>
       </el-form>
      <el-button size="small" icon="el-icon-plus" @click="addLine">添加一行</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAppendAddVisible = false">取 消</el-button>
        <el-button type="danger" @click="submitAppendProduction('formAppendProduction')" :loading="btLoading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Report',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      selectLoading: false,
      dialogAddFormVisible: false,
      dialogHBHistoryVisible: false,
      dialogHBDetailVisible: false,
      dialogAppendListVisible: false,
      dialogAPPersonVisible: false,
      dialogAppendAddVisible: false,
      ifCanAdd: true,
      ifHasTwoTime: true,
      curPage: 1,
      pageSize: 50,
      sum: 0,
      hbHistory: [],
      curPageHB: 1,
      pageSizeHB: 5,
      sumHB: 0,
      ifAdd: false,
      ifEdit: false,
      ifHZ: false,
      zhubiaoid: null,
      isshow: 0,
      reportList: [], // 页面汇报列表(人员列表)
      selectedPersonList: [], // 当前页的选中项
      selectedAllPersonList: [], // 所有页的选中项集合
      huibaoIdList: [], // 汇报时勾选的人员id列表
      peopleList: [], // 选择操作人员的select选项
      pageSizeAP: 5,
      curPageAP: 1,
      sumAP: 0,
      appendProductionList: [], // 附加产品列表
      materielList: [], // 物料选项
      personListAppend: [], // 附加产品时勾选的人员列表
      formAppendProduction: {
        list: [{fname: '', fnumber: '', materie: ''}]
      },
      rulesAppendProduction: {
        materie: [
          { required: true, message: '请选择物料名称', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ]
      },
      curAPRecordId: null, // 当前附加产品记录id
      personListDetailAP: [], // 附加产品的人员详情
      topLineInfo: {
        badnumber: '',
        fnumber: '',
        isback: '',
        // ischeck: '',
        jhnumber: '',
        jhsnumber: '',
        kcnumber: '',
        synumber: '',
        fnote: '',
        wcnumber: '',
        bfnumber: '',
        syjsnumber: '',
        ljfgnumber: '',
        ljfgbfnumber: '',
        fgnumber: '',
        fgbfnumber: '',
        wckcnumber: ''
      },
      form: {
        username: '',
        starttime: '',
        endtime: '',
        fnumber: '',
        ylbfnumber: '',
        ylbffreason: '',
        ygbfbumber: '',
        ygbfreason: '',
        badnumber: '',
        kcnumber: '',
        worktime: '',
        isback: '',
        fnote: '',
        // ischeck: '',
        waittime: '',
        // tuntime: '',
        freason: ''
      },
      rules: {
        username: [
          { required: true, message: '请选择操作工', trigger: 'change' }
        ],
        isback: [
          { required: true, message: '请选择是否返工', trigger: 'change' }
        ],
        starttime: [
          { required: true, message: '请选择操开机时间', trigger: 'change' }
        ],
        endtime: [
          { required: true, message: '请选择停机时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      curReportInfo: state => state.curReportInfo,
      userInfo: state => state.userInfo,
      curWorkId: state => state.curWorkId,
      curFbillno: state => state.curFbillno
    }),
    forder: function () {
      let forder = null
      let Info = this.curReportInfo
      switch (Info.gxName) {
        case '切管':
          forder = Info.fqg
          break
        case 'CNC':
          forder = Info.fsk
          break
        case '激光':
          forder = Info.fjg
          break
        case '折弯':
          forder = Info.fzw
          break
        case '焊接':
          forder = Info.fhj
          break
        case '抛丸':
          forder = Info.fpw
          break
        case '喷涂':
          forder = Info.fpt
          break
        case '包装':
          forder = Info.fbz
          break
      }
      return forder
    }
  },
  watch: {
    dialogAppendAddVisible: function (newVal) {
      if (!newVal) {
        this.$refs['formAppendProduction'].resetFields()
      }
    },
    'form.ylbfnumber': function (newVal) {
      this.form.badnumber = Number(newVal) + Number(this.form.ygbfbumber)
    },
    'form.ygbfbumber': function (newVal) {
      this.form.badnumber = Number(this.form.ylbfnumber) + Number(newVal)
    }
  },
  created () {
    switch (this.curReportInfo.gxName) {
      case '切管':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.qg > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case 'CNC':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.sk > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case '激光':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.jg > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case '折弯':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.zw > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case '焊接':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.hj > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case '抛丸':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.pw > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case '喷涂':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.pt > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
      case '包装':
        if (this.curReportInfo.F0 === 1 || this.curReportInfo.bz > 0) {
          this.ifHasTwoTime = true
        } else {
          this.ifHasTwoTime = false
        }
        break
    }
    this.getHBList()
    this.getPeopleList()
  },
  methods: {
    ...mapActions([
      'updateTopLineInfo',
      'updateCurPage'
    ]),
    // 汇报列表的页面切换
    async handleCurrentChangePerson () {
      // this.getHBList()
      let temp = this.selectedAllPersonList[this.curPage - 1] ? this.selectedAllPersonList[this.curPage - 1] : []
      let defaultPersonList = await this.getHBList()
      this.selectedPersonList = temp
      if (this.selectedPersonList.length > 0) {
        this.selectedPersonList.map((itemS) => {
          defaultPersonList.map((item, idx) => {
            if (item.id === itemS.id) {
              this.$refs.selectedPersonList.toggleRowSelection(defaultPersonList[idx], true)
            }
          })
        })
      }
    },
    // 汇报列表人员的勾选切换
    handleSelectionPersonChange (curSelection) {
      this.personListAppend = []
      this.huibaoIdList = []
      this.selectedAllPersonList[this.curPage - 1] = curSelection
      this.selectedAllPersonList.map(itemOut => {
        itemOut.map(itemIner => {
          this.huibaoIdList.push({id: itemIner.id})
          this.personListAppend.push({fname: itemIner.username, userno: itemIner.userno})
        })
      })
      // this.huibaoIdList = []
      // curSelection.map(item => {
      //   this.huibaoIdList.push({id: item.id})
      // })
      // this.personListAppend = []
      // curSelection.map(item => {
      //   this.personListAppend.push({fname: item.username, userno: item.userno})
      // })
    },
    // 编辑按钮事件
    edit (idx, row) {
      this.ifAdd = false
      this.ifEdit = true
      this.ifHZ = false
      this.dialogAddFormVisible = true
      this.form = row
    },
    // 删除按钮事件
    dele (idx, row) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sureDele(row)
      }).catch(() => {
      })
    },
    // 确认删除
    sureDele (row) {
      this.Http.get('delhuibao', {huibaoid: row.id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '删除成功!',
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
    // 获取附加产品物料选项列表
    getMaterielList (query) {
      if (query !== '') {
        this.selectLoading = true
        this.Http.get('serwuliao', {fname: query}
        ).then(res => {
          this.selectLoading = false
          this.materielList = res.data.list
        }).catch((error) => {
          console.log(error)
          this.selectLoading = false
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      } else {
        this.materielList = []
      }
    },
    // 删除物料记录
    removeAP (row) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Http.get('delfujia', {id: row.id}
        ).then(res => {
          switch (res.data.code) {
            case '1':
              this.$message({
                message: '删除成功!',
                type: 'success'
              })
              this.getAppendProduction()
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
      }).catch(() => {
      })
    },
    // 查看附加产品记录人员
    seePersonAP (row) {
      this.curAPRecordId = row.id
      this.dialogAPPersonVisible = true
      this.getAPPersonList()
    },
    // 附加物料查看人员详情
    getAPPersonList () {
      this.Http.get('serfujiawuliaodetail', {id: this.curAPRecordId}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.personListDetailAP = res.data.list
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
    // 删除附加产品人员
    removeAPPerson (row) {
      this.$confirm('此操作将移除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Http.get('delfujiary', {id: row.id}
        ).then(res => {
          switch (res.data.code) {
            case '1':
              this.$message({
                message: '人员删除成功!',
                type: 'success'
              })
              this.getAPPersonList()
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
      }).catch(() => {
      })
    },
    // 附加产品列表
    getAppendProduction () {
      this.appendProductionList = []
      this.dialogAppendListVisible = true
      this.Http.get('serfujiawuliao', {number: this.pageSizeAP, page_num: this.curPageAP, workid: this.curWorkId, fbillno: this.curFbillno}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.appendProductionList = res.data.list
            this.sumAP = res.data.count
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
    addLine () {
      this.formAppendProduction.list.push({
        fname: '',
        fnumber: '',
        materie: ''
      })
    },
    removeLine (idx) {
      this.formAppendProduction.list.splice(idx, 1)
    },
    // 新增附加产品
    addAppendProduction () {
      if (this.huibaoIdList.length === 0) {
        this.$message({
          message: '请先勾选需要的记录!',
          type: 'warning'
        })
        return false
      }
      this.dialogAppendAddVisible = true
      this.formAppendProduction.list = [{fname: '', fnumber: '', materie: ''}]
    },
    // 提交附加产品
    submitAppendProduction (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btLoading = true
          let Data = {
            workid: this.curWorkId,
            fbillno: this.curFbillno,
            peoplelist: this.personListAppend,
            wuliaolist: this.formAppendProduction.list.map(item => {
              item.fname = item.materie.split('|')[0]
              item.fnumber = item.materie.split('|')[1]
              item.number = item.amount
              return item
            })
          }
          this.Http.post('addfujia', Data
          ).then(res => {
            switch (res.data.code) {
              case '1':
                this.$message({
                  message: '附加产品新增成功!',
                  type: 'success'
                })
                this.btLoading = false
                this.dialogAppendAddVisible = false
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
        } else {
          this.$message({
            message: '请将信息填写完整!',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 汇报按钮事件
    async huizong () {
      let ifCanHB = await this.ifCanHB()
      if (ifCanHB === '0') {
        this.$message({
          message: '已汇报，不可以多次汇报!',
          type: 'warning'
        })
        return false
      }
      if (this.huibaoIdList.length === 0) {
        this.$message({
          message: '请先勾选需要汇总的记录!',
          type: 'warning'
        })
        return false
      }
      this.ifAdd = false
      this.ifHZ = true
      this.ifEdit = false
      this.dialogAddFormVisible = true
      // 初始化数据
      this.form = {
        username: '',
        starttime: '',
        endtime: '',
        fnumber: '',
        ylbfnumber: '',
        ylbffreason: '',
        ygbfbumber: '',
        ygbfreason: '',
        badnumber: '',
        kcnumber: '',
        worktime: '',
        isback: '',
        fnote: '',
        ischeck: '',
        waittime: '',
        tuntime: '',
        freason: ''
      }
    },
    // 接口确认是否可以进行汇报
    ifCanHB () {
      return new Promise((resolve, reject) => {
        this.Http.get('checkhuibao', {zhubiaoid: this.zhubiaoid}
        ).then(res => {
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
    // addRecord () {
    //   this.ifAdd = true
    //   this.ifHZ = false
    //   this.ifEdit = false
    //   this.dialogAddFormVisible = true
    //   // 初始化数据
    //   this.form = {
    //     username: '',
    //     starttime: '',
    //     endtime: '',
    //     fnumber: '',
    //     badnumber: '',
    //     kcnumber: '',
    //     worktime: '',
    //     isback: '',
    //     fnote: '',
    //     ischeck: '',
    //     waittime: '',
    //     tuntime: '',
    //     freason: ''
    //   }
    // },
    addNoteByTag (tag) {
      if (!this.ifEdit) {
        this.form.fnote = tag
      }
    },
    // 新增/编辑的保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ifEdit) {
            this.sureEdit()
          } else if (this.ifAdd) {
            this.sureAdd()
          } else {
            // 有等待时间 必填停机原因
            if (this.form.waittime && !this.form.freason) {
              this.$message({
                message: '由于存在等待时间，故请选择停机原因!',
                type: 'warning'
              })
              return false
            }
            // 停机原因为其他的备注必填
            if (this.form.freason === '其他' && !this.form.fnote) {
              this.$message({
                message: '由于停机原因为其他，故请填写备注!',
                type: 'warning'
              })
              return false
            }
            // 库存数和完工产量都没有填的情况下,必填停机原因
            if (!this.form.kcnumber && !this.form.fnumber && !this.form.freason) {
              this.$message({
                message: '由于"库存数"和"完工产量"没有数据输入，故请选择停机原因!',
                type: 'warning'
              })
            } else if (this.form.kcnumber && this.form.fnumber) {
              if (this.form.isback === '不是返工') {
                if (Number(this.form.kcnumber) + Number(this.form.fnumber) > this.topLineInfo.synumber && this.userInfo.gongxu !== '激光' && this.userInfo.gongxu !== 'CNC') {
                  this.$message({
                    message: '"库存数"和"完工产量"之和超过了剩余数!',
                    type: 'warning'
                  })
                } else {
                  this.addHz()
                }
              } else {
                this.addHz()
              }
            } else if (this.form.kcnumber || this.form.fnumber) {
              if (this.form.isback === '不是返工') {
                if ((this.form.kcnumber > this.topLineInfo.synumber || this.form.fnumber > this.topLineInfo.synumber) && this.userInfo.gongxu !== '激光' && this.userInfo.gongxu !== 'CNC') {
                  this.$message({
                    message: '"库存数"和"完工产量"之和超过了剩余数!',
                    type: 'warning'
                  })
                } else {
                  this.addHz()
                }
              } else {
                this.addHz()
              }
            } else {
              this.addHz()
            }
          }
        } else {
          this.$message({
            message: '请将信息填写完整!',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 编辑提交
    sureEdit () {
      if (this.form.waittime && !this.form.freason) {
        this.$message({
          message: '由于存在等待时间，故请选择停机原因!',
          type: 'warning'
        })
        return false
      }
      this.btLoading = true
      this.form.fidz = this.curReportInfo.fidz
      this.form.fidc = this.curReportInfo.fidc
      this.form.gongxu = this.curReportInfo.gxName
      this.Http.post('updatehuibao', this.form
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.getHBList()
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
        this.btLoading = false
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 新增提交
    sureAdd () {
      this.btLoading = true
      this.form.zhubiaoid = this.zhubiaoid
      this.form.fidz = this.curReportInfo.fidz
      this.form.fidc = this.curReportInfo.fidc
      this.form.gongxu = this.curReportInfo.gxName
      this.form.jhnumber = this.topLineInfo.synumber
      this.form.fnumber = this.form.fnumber ? this.form.fnumber : 0
      this.form.ylbfnumber = this.form.ylbfnumber ? this.form.ylbfnumber : 0
      this.form.ygbfbumber = this.form.ygbfbumber ? this.form.ygbfbumber : 0
      this.form.badnumber = this.form.badnumber ? this.form.badnumber : 0
      this.form.kcnumber = this.form.kcnumber ? this.form.kcnumber : 0
      this.Http.post('addhuibao', this.form
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '新增成功!',
              type: 'success'
            })
            this.getHBList()
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
    // 汇报提交
    addHz () {
      if (this.ifHasTwoTime && this.isshow !== '1') {
        this.addHzHasTime()
      } else {
        this.addHzNoTime()
      }
    },
    // 有时间时的汇报
    addHzHasTime () {
      this.btLoading = true
      this.form.zhubiaoid = this.zhubiaoid
      this.form.fidz = this.curReportInfo.fidz
      this.form.fidc = this.curReportInfo.fidc
      this.form.gongxu = this.curReportInfo.gxName
      this.form.jhnumber = this.topLineInfo.synumber
      this.form.department = this.curModuleInfo.departid
      this.form.huibaoid = this.huibaoIdList
      this.form.fnumber = this.form.fnumber ? this.form.fnumber : 0
      this.form.ylbfnumber = this.form.ylbfnumber ? this.form.ylbfnumber : 0
      this.form.ygbfbumber = this.form.ygbfbumber ? this.form.ygbfbumber : 0
      this.form.badnumber = this.form.badnumber ? this.form.badnumber : 0
      this.form.kcnumber = this.form.kcnumber ? this.form.kcnumber : 0
      this.Http.post('pilianghuibao', {huibaolist: this.form}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '汇总成功!',
              type: 'success'
            })
            this.getHBList()
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
    // 没有时间时的汇报
    addHzNoTime () {
      this.btLoading = true
      this.form.zhubiaoid = this.zhubiaoid
      this.form.fidz = this.curReportInfo.fidz
      this.form.fidc = this.curReportInfo.fidc
      this.form.gongxu = this.curReportInfo.gxName
      this.form.jhnumber = this.topLineInfo.synumber
      this.form.department = this.curModuleInfo.departid
      this.form.huibaoid = this.huibaoIdList
      this.form.fnumber = this.form.fnumber ? this.form.fnumber : 0
      this.form.ylbfnumber = this.form.ylbfnumber ? this.form.ylbfnumber : 0
      this.form.ygbfbumber = this.form.ygbfbumber ? this.form.ygbfbumber : 0
      this.form.badnumber = this.form.badnumber ? this.form.badnumber : 0
      this.form.kcnumber = this.form.kcnumber ? this.form.kcnumber : 0
      this.Http.post('plhuibaonumber', {huibaolist: this.form}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '汇总成功!',
              type: 'success'
            })
            this.getHBList()
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
    // getHBHistory () {
    //   this.Http.get('oldhuibao', {number: this.pageSizeHB, page_num: this.curPageHB, fidz: this.curReportInfo.fidz, fidc: this.curReportInfo.fidc, gongxu: this.curReportInfo.gxName, forder: this.forder}
    //   ).then(res => {
    //     switch (res.data.code) {
    //       case '1':
    //         this.hbHistory = res.data.list
    //         this.sumHB = res.data.oldhuibaocount
    //         this.dialogHBHistoryVisible = true
    //         break
    //       default:
    //         this.$message({
    //           message: res.data.message + '!',
    //           type: 'error'
    //         })
    //     }
    //   }).catch((error) => {
    //     console.log(error)
    //     this.$message({
    //       message: '服务器繁忙!',
    //       type: 'error'
    //     })
    //   })
    // },
    // 跳转汇报详情
    historyDetail (row) {
      this.updateTopLineInfo(this.topLineInfo)
      this.updateCurPage('History')
      this.$router.push({name: 'History'})
    },
    // 获取页面汇报列表(人员列表)
    getHBList () {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.Http.get('huibaolist2', {number: this.pageSize, page_num: this.curPage, fidz: this.curReportInfo.fidz, fidc: this.curReportInfo.fidc, gongxu: this.curReportInfo.gxName, department: this.curModuleInfo.departid, forder: this.forder, jhsnumber: this.curReportInfo.jhsnumber, workid: this.curWorkId, fbillno: this.curFbillno}
        ).then(res => {
          switch (res.data.code) {
            case 0:
              this.ifCanAdd = false
              this.$message({
                message: res.data.message + '!',
                type: 'warning'
              })
              this.listLoading = false
              break
            case 1:
              this.zhubiaoid = res.data.zhubiaoid
              this.isshow = res.data.isshow
              this.topLineInfo = {
                badnumber: res.data.badnumber,
                fnumber: res.data.fnumber,
                isback: res.data.isback,
                // ischeck: res.data.ischeck,
                jhnumber: res.data.jhnumber,
                jhsnumber: res.data.jhsnumber,
                kcnumber: res.data.kcnumber,
                synumber: res.data.synumber,
                fnote: res.data.fnote,
                wcnumber: res.data.wcnumber,
                bfnumber: res.data.bfnumber,
                syjsnumber: res.data.syjsnumber,
                ljfgnumber: res.data.ljfgnumber,
                ljfgbfnumber: res.data.ljfgbfnumber,
                fgnumber: res.data.fgnumber,
                fgbfnumber: res.data.fgbfnumber,
                wckcnumber: res.data.wckcnumber
              }
              this.reportList = res.data.list
              // res.data.list.map(item => {
              //   item.starttimeTxt = item.starttime ? (item.starttime).replace('-', '点') + '分' : ''
              //   item.endtimeTxt = item.endtime ? (item.endtime).replace('-', '点') + '分' : ''
              //   return item
              // })
              this.sum = res.data.orderCount
              this.listLoading = false
              resolve(res.data.list)
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
    },
    // 选择操作人员的select选项
    getPeopleList () {
      this.Http.get('departpeople', {department: this.curModuleInfo.departid}
      ).then(res => {
        this.peopleList = res.data.list
      }).catch((error) => {
        console.log(error)
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
.TopBarBlock{
  width: calc(100% - .4rem);
  margin: 0 auto;
  font-size: .2rem;
  // height: 1rem;
}
</style>
