<template>
  <div class="Report">
    <div class="TopBarBlock">
      <el-row style="margin-top:.3rem;">
        <el-col :span="6" class="TextAlignL">零件号: {{curReportInfo.fnumber}}</el-col>
        <el-col :span="6" class="TextAlignL">零件名称: {{curReportInfo.fname}}</el-col>
        <el-col :span="3" class="TextAlignL">当前工序: {{curReportInfo.gxName}}</el-col>
        <el-col :span="3" class="TextAlignL">零件计划数: {{topLineInfoHistory.jhsnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">接收数: {{topLineInfoHistory.jhnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">剩余接收数: {{topLineInfoHistory.synumber}}</el-col>
      </el-row>
      <el-row style="height:1rem;line-height:1rem;">
        <el-col :span="6" class="TextAlignL">完工产量: {{topLineInfoHistory.fnumber}}</el-col>
        <el-col :span="6" class="TextAlignL">报废数: {{topLineInfoHistory.badnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">库存数: {{topLineInfoHistory.kcnumber}}</el-col>
        <el-col :span="3" class="TextAlignL">是否返工: {{topLineInfoHistory.isback}}</el-col>
        <el-col :span="3" class="TextAlignL">备注: {{topLineInfoHistory.fnote}}</el-col>
        <el-col :span="3" class="TextAlignL">是否首检: {{topLineInfoHistory.ischeck}}</el-col>
      </el-row>
    </div>
    <el-table
      :data="reportList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        fixed
        type="selection"
        width="55">
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
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="endtimeTxt"
        label="停机时间"
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="worktime"
        label="工作时间"
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="waittime"
        label="等待时间"
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="tuntime"
        label="调机时间"
        width="110"
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
        width="110">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="color: #409EFF;"
            @click="edit(scope.$index, scope.row)">编辑</el-button>
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
    <!-- 新增 -->
    <el-dialog :title="ifEdit ? '编辑' : (ifHZ ? '汇报' : '新增')" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" width="500px">
      <el-form class="TextAlignL" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="操作工" prop="username" v-if="!ifHZ">
          <el-select v-model="form.username" placeholder="请选择操作工">
            <el-option v-for="(people, idx) in peopleList" :key="idx" :label="people.fname" :value="people.fname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开机时间" prop="starttime">
          <el-time-picker
            v-model="form.starttime"
            format="HH 点 mm 分"
            value-format="HH-mm"
            placeholder="请选择开机时间"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="停机时间" prop="endtime">
          <el-time-picker
            v-model="form.endtime"
            format="HH 点 mm 分"
            value-format="HH-mm"
            placeholder="请选择停机时间"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="完工产量" prop="fnumber" v-if="!ifEdit">
          <el-input v-model="form.fnumber"></el-input>
        </el-form-item>
        <el-form-item label="报废数" prop="badnumber" v-if="!ifEdit">
          <el-input v-model="form.badnumber" prop="badnumber"></el-input>
        </el-form-item>
        <el-form-item label="库存数" prop="kcnumber" v-if="!ifEdit">
          <el-input v-model="form.kcnumber" prop="kcnumber"></el-input>
        </el-form-item>
        <el-form-item label="工作时间">
          <el-input v-model="form.worktime" prop="worktime" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否返工" prop="isback">
          <el-select v-model="form.isback" placeholder="请选择是否返工">
            <el-option label="Y" value="Y"></el-option>
            <el-option label="N" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="fnote">
          <el-input type="textarea" v-model="form.fnote" placeholder="请输入备注..."></el-input>
        </el-form-item>
        <el-form-item label="是否首检" prop="ischeck">
          <el-select v-model="form.ischeck" placeholder="请选择是否返工">
            <el-option label="Y" value="Y"></el-option>
            <el-option label="N" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等待时间" prop="waittime">
          <el-input v-model="form.waittime"></el-input>
        </el-form-item>
        <el-form-item label="调机时间" prop="tuntime">
          <el-input v-model="form.tuntime"></el-input>
        </el-form-item>
        <el-form-item label="停机原因" prop="freason">
          <el-input type="textarea" v-model="form.freason" placeholder="请输入停机原因..."></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="save('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Report',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      dialogAddFormVisible: false,
      // dialogHBHistoryVisible: false,
      // dialogHBDetailVisible: false,
      // ifCanAdd: true,
      // plantNumber: '',
      curPage: 1,
      pageSize: 10,
      sum: 0,
      // hbHistory: [],
      // curPageHB: 1,
      // pageSizeHB: 10,
      // sumHB: 0,
      ifEdit: false,
      ifHZ: false,
      // zhubiaoid: null,
      reportList: [],
      // huibaoIdList: [],
      peopleList: [],
      form: {
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
      },
      rules: {
        username: [
          { required: true, message: '请选择操作工', trigger: 'change' }
        ]
        // starttime: [
        //   { required: true, message: '请选择操开机时间', trigger: 'change' }
        // ],
        // endtime: [
        //   { required: true, message: '请选择停机时间', trigger: 'change' }
        // ],
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
      curReportInfo: state => state.curReportInfo,
      topLineInfo: state => state.curReportInfo
    }),
    historyId: function () {
      return this.$route.params.id
    }
  },
  created () {
    this.topLineInfoHistory = this.topLineInfo
    this.getHBList()
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
  },
  methods: {
    handleCurrentChange () {
      this.getHBList()
    },
    edit (idx, row) {
      this.ifEdit = true
      this.ifHZ = false
      this.dialogAddFormVisible = true
      this.form = row
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sureEdit()
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
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    getHBList () {
      this.listLoading = true
      this.Http.get('oldhuibaodetails', {number: this.pageSize, page_num: this.curPage, pid: this.historyId}
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.topLineInfoHistory.badnumber = res.data.huibaolist.badnumber
            this.topLineInfoHistory.fnumber = res.data.huibaolist.fnumber
            this.topLineInfoHistory.isback = res.data.huibaolist.isback
            this.topLineInfoHistory.ischeck = res.data.huibaolist.ischeck
            this.topLineInfoHistory.kcnumber = res.data.huibaolist.kcnumber
            this.topLineInfoHistory.fnote = res.data.huibaolist.fnote

            this.reportList = res.data.entrylist.map(item => {
              item.starttimeTxt = item.starttime ? (item.starttime).replace('-', '点') + '分' : ''
              item.endtimeTxt = item.endtime ? (item.endtime).replace('-', '点') + '分' : ''
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
