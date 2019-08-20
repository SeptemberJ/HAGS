<template>
  <div class="Report">
    <div class="TopBarBlock">
      <el-row style="height:1rem;line-height:1rem;">
        <el-col :span="7">零件号: {{curReportInfo.fnumber}}</el-col>
        <el-col :span="7">零件名称: {{curReportInfo.fname}}</el-col>
        <el-col :span="7">当前工序: {{curReportInfo.gxName}}</el-col>
        <el-col :span="3" class="TextAlignR" v-if="ifCanAdd"><el-button size="medium" type="success" icon="el-icon-plus" @click="addRecord">新增</el-button></el-col>
      </el-row>
    </div>
    <el-table
      :data="reportList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="username"
        label="操作工"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="starttimeTxt"
        label="开机时间"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="endtimeTxt"
        label="停机时间"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="fnumber"
        label="完工产量"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="badnumber"
        label="报废数"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="worktime"
        label="工作时间"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="isback"
        label="是否返工"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="fnote"
        label="备注"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="ischeck"
        label="是否首检"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="waittime"
        label="等待时间"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="tuntime"
        label="调机时间"
        width="100"
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
            size="mini"
            type="text"
            style="color: #409EFF;"
            @click="edit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
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
    <!-- 新增 -->
    <el-dialog :title="ifEdit ? '编辑' : '新增'" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" width="500px">
      <el-form class="TextAlignL" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="操作工" prop="username">
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
        <el-form-item label="完工产量" prop="fnumber">
          <el-input v-model="form.fnumber"></el-input>
        </el-form-item>
        <el-form-item label="报废数">
          <el-input v-model="form.badnumber" prop="badnumber"></el-input>
        </el-form-item>
        <el-form-item label="工作时间">
          <el-input v-model="form.worktime" prop="worktime"></el-input>
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
// import { setTimeout } from 'timers';
export default {
  name: 'Report',
  props: ['curReportInfo', 'timestamp'],
  data () {
    return {
      listLoading: false,
      btLoading: false,
      dialogAddFormVisible: false,
      ifCanAdd: true,
      curPage: 1,
      pageSize: 15,
      sum: 0,
      ifEdit: false,
      reportList: [],
      peopleList: [],
      form: {
        username: '',
        starttime: '',
        endtime: '',
        fnumber: '',
        badnumber: '',
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
        ],
        starttime: [
          { required: true, message: '请选择操开机时间', trigger: 'change' }
        ],
        endtime: [
          { required: true, message: '请选择停机时间', trigger: 'change' }
        ],
        fnumber: [
          { required: true, message: '请输入完工产量', trigger: 'change' }
        ],
        badnumber: [
          { required: true, message: '请输入报废数', trigger: 'change' }
        ],
        worktime: [
          { required: true, message: '请输入工作时间', trigger: 'change' }
        ],
        isback: [
          { required: true, message: '请选择是否返工', trigger: 'change' }
        ],
        ischeck: [
          { required: true, message: '请选择是否首检', trigger: 'change' }
        ],
        waittime: [
          { required: true, message: '请输入等待时间', trigger: 'change' }
        ],
        tuntime: [
          { required: true, message: '请输入调机时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo
    })
  },
  watch: {
    dialogAddFormVisible: function (val) {
      if (val && !this.ifEdit) {
        this.$refs['form'].resetFields()
      }
    },
    ifEdit: function (val) {
      if (!this.ifEdit) {
        this.$refs['form'].resetFields()
      }
    }
  },
  created () {
    // console.log(this.curReportInfo)
    this.getHBList()
    this.getPeopleList()
  },
  methods: {
    handleCurrentChange () {
      this.getHBList()
    },
    edit (idx, row) {
      this.ifEdit = true
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
      })
    },
    addRecord () {
      this.ifEdit = false
      this.dialogAddFormVisible = true
      // 初始化数据
      this.form = {
        username: '',
        starttime: '',
        endtime: '',
        fnumber: '',
        badnumber: '',
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
          } else {
            this.sureAdd()
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
      })
    },
    sureAdd () {
      this.btLoading = true
      this.form.fidz = this.curReportInfo.fidz
      this.form.fidc = this.curReportInfo.fidc
      this.form.gongxu = this.curReportInfo.gxName
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
      })
    },
    getHBList () {
      this.listLoading = true
      this.Http.get('huibaolist', {number: this.pageSize, page_num: this.curPage, fidz: this.curReportInfo.fidz, fidc: this.curReportInfo.fidc, gongxu: this.curReportInfo.gxName}
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
            this.reportList = res.data.list.map(item => {
              item.starttimeTxt = (item.starttime).replace('-', '点') + '分'
              item.endtimeTxt = (item.endtime).replace('-', '点') + '分'
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
      })
    },
    getPeopleList () {
      this.Http.get('departpeople', {department: this.curModuleInfo.departid}
      ).then(res => {
        this.peopleList = res.data.list
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.TopBarBlock{
  width: calc(100% - .4rem);
  margin: 0 auto;
  font-size: .25rem;
  height: 1rem;
}
</style>
