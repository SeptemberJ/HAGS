<template>
  <div class="Report">
    <div class="TopBarBlock">
      <el-row style="margin-top:.3rem;">
        <el-col :span="6" class="TextAlignL">零件号: {{curReportInfo.fnumber}}</el-col>
        <el-col :span="6" class="TextAlignL">零件名称: {{curReportInfo.fname}}</el-col>
        <el-col :span="3" class="TextAlignL">当前工序: {{curReportInfo.gxName}}</el-col>
        <el-col :span="3" class="TextAlignL">零件计划数: {{topLineInfo.jhsnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">接收数: {{topLineInfo.jhnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">剩余接收数: {{topLineInfo.synumber}}</el-col>
      </el-row>
      <el-row style="height:.5rem;line-height:.5rem;">
        <el-col :span="6" class="TextAlignL">完工产量: {{topLineInfo.fnumber}}</el-col>
        <el-col :span="6" class="TextAlignL">报废数: {{topLineInfo.badnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">库存数: {{topLineInfo.kcnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">是否返工: {{topLineInfo.isback}}</el-col>
        <el-col :span="3" class="TextAlignL">备注: {{topLineInfo.fnote}}</el-col>
        <!-- <el-col :span="3" class="TextAlignL">是否首检: {{topLineInfo.ischeck}}</el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24" class="TextAlignR" v-if="ifCanAdd">
          <el-button size="small" type="warning" @click="huizong">汇报</el-button>
          <!-- <el-button size="small" type="primary" @click="tuzhi">图纸</el-button>
          <el-button size="small" type="info" @click="getHBHistory">历史汇报</el-button>
          <el-button size="small" type="success" @click="addRecord">新增</el-button> -->
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="reportList"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
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
        property="starttimeTxt"
        label="开机时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="endtimeTxt"
        label="停机时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="worktime"
        label="工作时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="waittime"
        label="等待时间"
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
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
    <!-- 新增 编辑 -->
    <el-dialog :title="ifEdit ? '编辑' : (ifHZ ? '汇报' : '新增')" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" width="500px">
      <el-form class="TextAlignL" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="操作工" prop="username" v-if="!ifHZ">
          <el-select v-model="form.username" placeholder="请选择操作工" :disabled="ifEdit">
            <el-option v-for="(people, idx) in peopleList" :key="idx" :label="people.fname" :value="people.fname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开机时间" prop="starttime" v-if="(ifHZ && ifHasTwoTime && isshow != 1) || ifEdit">
          <el-time-picker :disabled="ifEdit"
            v-model="form.starttime"
            format="HH 点 mm 分"
            value-format="HH-mm"
            placeholder="请选择开机时间"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="停机时间" prop="endtime" v-if="(ifHZ && ifHasTwoTime && isshow != 1) || ifEdit">
          <el-time-picker :disabled="ifEdit"
            v-model="form.endtime"
            format="HH 点 mm 分"
            value-format="HH-mm"
            placeholder="请选择停机时间"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="完工产量" prop="fnumber" v-if="ifHZ">
          <el-input v-model="form.fnumber"></el-input>
        </el-form-item>
        <el-form-item label="报废数" prop="badnumber" v-if="ifHZ">
          <el-input v-model="form.badnumber" prop="badnumber"></el-input>
        </el-form-item>
        <el-form-item label="库存数" prop="kcnumber" v-if="ifHZ">
          <el-input v-model="form.kcnumber" prop="kcnumber"></el-input>
        </el-form-item>
        <!-- <el-form-item label="工作时间" v-if="!ifAdd">
          <el-input v-model="form.worktime" prop="worktime" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="是否返工" prop="isback" v-if="!ifAdd">
          <el-select v-model="form.isback" placeholder="请选择是否返工" :disabled="ifEdit">
            <el-option label="Y" value="Y"></el-option>
            <el-option label="N" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="fnote" v-if="!ifAdd">
          <el-input type="textarea" v-model="form.fnote" :disabled="ifEdit" placeholder="请输入备注..."></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否首检" prop="ischeck" v-if="!ifAdd">
          <el-select v-model="form.ischeck" placeholder="请选择是否返工">
            <el-option label="Y" value="Y"></el-option>
            <el-option label="N" value="N"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="等待时间" prop="waittime" v-if="!ifAdd">
          <el-input v-model="form.waittime"></el-input>
        </el-form-item>
        <!-- <el-form-item label="调机时间" prop="tuntime" v-if="!ifAdd">
          <el-input v-model="form.tuntime"></el-input>
        </el-form-item> -->
        <el-form-item label="停机原因" prop="freason" v-if="!ifAdd">
          <el-select v-model="form.freason" placeholder="请选择停机原因">
            <el-option label="首检" value="首检"></el-option>
            <el-option label="停机" value="停机"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
          <!-- <el-input type="textarea" v-model="form.freason" placeholder="请输入停机原因..."></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="save('form')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 汇报历史 -->
    <!-- <el-dialog title="汇报历史" :visible.sync="dialogHBHistoryVisible" :close-on-click-modal="false">
      <el-table @row-dblclick="historyDetail"
        :data="hbHistory"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="createtime"
          label="汇报日期"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="danhao"
          label="单号"
          show-overflow-tooltip>
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
    </el-dialog> -->
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
      dialogAddFormVisible: false,
      dialogHBHistoryVisible: false,
      dialogHBDetailVisible: false,
      ifCanAdd: true,
      ifHasTwoTime: true,
      // plantNumber: '',
      curPage: 1,
      pageSize: 10,
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
      reportList: [],
      huibaoIdList: [],
      peopleList: [],
      topLineInfo: {
        badnumber: '',
        fnumber: '',
        isback: '',
        // ischeck: '',
        jhnumber: '',
        jhsnumber: '',
        kcnumber: '',
        synumber: '',
        fnote: ''
      },
      form: {
        username: '',
        starttime: '',
        endtime: '',
        fnumber: '',
        badnumber: '',
        kcnumber: '',
        worktime: '',
        // isback: '',
        fnote: '',
        ischeck: '',
        waittime: '',
        // tuntime: '',
        freason: ''
      },
      rules: {
        username: [
          { required: true, message: '请选择操作工', trigger: 'change' }
        ],
        starttime: [
          { required: true, message: '请选择操开机时间', trigger: 'change' }
        ],
        endtime: [
          { required: true, message: '请选择停机时间', trigger: 'change' }
        ]
        // fnumber: [
        //   { required: true, message: '请输入完工产量', trigger: 'change' }
        // ],
        // badnumber: [
        //   { required: true, message: '请输入报废数', trigger: 'change' }
        // ],
        // worktime: [
        //   { required: true, message: '请输入工作时间', trigger: 'change' }
        // ],
        // isback: [
        //   { required: true, message: '请选择是否返工', trigger: 'change' }
        // ],
        // ischeck: [
        //   { required: true, message: '请选择是否首检', trigger: 'change' }
        // ],
        // waittime: [
        //   { required: true, message: '请输入等待时间', trigger: 'change' }
        // ],
        // tuntime: [
        //   { required: true, message: '请输入调机时间', trigger: 'change' }
        // ]
      }
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      curReportInfo: state => state.curReportInfo,
      curWorkId: state => state.curWorkId
    }),
    forder: function () {
      let forder = null
      let Info = this.curReportInfo
      switch (Info.gxName) {
        case '切管':
          forder = Info.fqg
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
    'form.starttime': function (newVal, oldVal) {
      if (newVal && this.form.endtime) {
        let afterSplitS = newVal.split('-')
        let afterSplitE = this.form.endtime.split('-')
        let minS = Number(afterSplitS[0]) * 60 + Number(afterSplitS[1])
        let minE = Number(afterSplitE[0]) * 60 + Number(afterSplitE[1])
        this.form.worktime = parseInt((minE - minS) / 60) + ' 时' + ((minE - minS) % 60) + ' 分'
      }
    },
    'form.endtime': function (newVal, oldVal) {
      if (this.form.starttime && newVal) {
        let afterSplitS = this.form.starttime.split('-')
        let afterSplitE = newVal.split('-')
        let minS = Number(afterSplitS[0]) * 60 + Number(afterSplitS[1])
        let minE = Number(afterSplitE[0]) * 60 + Number(afterSplitE[1])
        this.form.worktime = parseInt((minE - minS) / 60) + '时' + ((minE - minS) % 60) + '分'
      }
    }
    // dialogAddFormVisible: function (val) {
    //   if (val && !this.ifEdit) {
    //     this.$refs['form'].resetFields()
    //   }
    // },
    // ifEdit: function (val) {
    //   if (!this.ifEdit) {
    //     this.$refs['form'].resetFields()
    //   }
    // }
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
    handleCurrentChange () {
      this.getHBList()
    },
    handleSelectionChange (val) {
      this.huibaoIdList = []
      val.map(item => {
        this.huibaoIdList.push({id: item.id})
      })
    },
    edit (idx, row) {
      this.ifAdd = false
      this.ifEdit = true
      this.ifHZ = false
      this.dialogAddFormVisible = true
      this.form = row
    },
    dele (idx, row) {
      this.$confirm('此操作将删除该调记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sureDele(row)
      }).catch(() => {
      })
    },
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
    addRecord () {
      this.ifAdd = true
      this.ifHZ = false
      this.ifEdit = false
      this.dialogAddFormVisible = true
      // 初始化数据
      this.form = {
        username: '',
        starttime: '',
        endtime: '',
        fnumber: '',
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
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ifEdit) {
            this.sureEdit()
          } else if (this.ifAdd) {
            this.sureAdd()
          } else {
            // 库存数和完工产量都没有填的情况下,必填停机原因
            if (!this.form.kcnumber && !this.form.fnumber && !this.form.freason) {
              this.$message({
                message: '由于"库存数"和"完工产量"没有数据输入，故请输入停机原因!',
                type: 'warning'
              })
            } else if (this.form.kcnumber && this.form.fnumber) {
              if (Number(this.form.kcnumber) + Number(this.form.fnumber) > this.topLineInfo.synumber) {
                this.$message({
                  message: '"库存数"和"完工产量"之和超过了剩余数!',
                  type: 'warning'
                })
              } else {
                this.addHz()
              }
            } else if (this.form.kcnumber || this.form.fnumber) {
              if (this.form.kcnumber > this.topLineInfo.synumber || this.form.fnumber > this.topLineInfo.synumber) {
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
    sureEdit () {
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
    sureAdd () {
      this.btLoading = true
      this.form.zhubiaoid = this.zhubiaoid
      this.form.fidz = this.curReportInfo.fidz
      this.form.fidc = this.curReportInfo.fidc
      this.form.gongxu = this.curReportInfo.gxName
      this.form.jhnumber = this.topLineInfo.synumber
      this.form.fnumber = this.form.fnumber ? this.form.fnumber : 0
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
    addHz () {
      if (this.ifHasTwoTime && this.isshow !== '1') {
        this.addHzHasTime()
      } else {
        this.addHzNoTime()
      }
    },
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
      this.form.badnumber = this.form.badnumber ? this.form.badnumber : 0
      this.form.kcnumber = this.form.kcnumber ? this.form.kcnumber : 0
      // console.log(this.form)
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
      this.form.badnumber = this.form.badnumber ? this.form.badnumber : 0
      this.form.kcnumber = this.form.kcnumber ? this.form.kcnumber : 0
      // console.log(this.form)
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
    tuzhi () {
      this.Http.get('sertuzhi', {fidz: this.curReportInfo.fidz, fidc: this.curReportInfo.fidc}
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
    getHBHistory () {
      this.Http.get('oldhuibao', {number: this.pageSizeHB, page_num: this.curPageHB, fidz: this.curReportInfo.fidz, fidc: this.curReportInfo.fidc, gongxu: this.curReportInfo.gxName, forder: this.forder}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.hbHistory = res.data.list
            this.sumHB = res.data.oldhuibaocount
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
    historyDetail (row) {
      this.updateTopLineInfo(this.topLineInfo)
      this.updateCurPage('History')
      this.$router.push({name: 'History'})
    },
    getHBList () {
      this.listLoading = true
      this.Http.get('huibaolist2', {number: this.pageSize, page_num: this.curPage, fidz: this.curReportInfo.fidz, fidc: this.curReportInfo.fidc, gongxu: this.curReportInfo.gxName, department: this.curModuleInfo.departid, forder: this.forder, jhsnumber: this.curReportInfo.jhsnumber, workid: this.curWorkId}
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
              fnote: res.data.fnote
            }
            this.reportList = res.data.list.map(item => {
              item.starttimeTxt = item.starttime ? (item.starttime).replace('-', '点') + '分' : ''
              item.endtimeTxt = item.endtime ? (item.endtime).replace('-', '点') + '分' : ''
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
  height: 1rem;
}
</style>
