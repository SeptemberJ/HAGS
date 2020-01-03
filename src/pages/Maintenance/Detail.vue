<template>
  <div class="MaintenanceDetail">
    <el-form :inline="true" :rules="rules" ref="form" :model="form" label-position="left" label-width="80px" class="demo-form-inline disabledWhite">
      <el-row>
        <el-col :span="6">
          <el-form-item label="使用部门" prop="department">
            <el-input v-model="form.department" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备编号" prop="fdeviceid">
            <el-input v-model="form.fdeviceid" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格型号">
            <el-input v-model="form.fmodel" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日期" prop="ftime">
            <el-input v-model="form.ftime" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="班组长">
            <el-input v-model="form.zdr" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否保修" prop="isrepair">
            <el-input v-model="form.isrepair" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保修状态">
            <el-input v-model="form.bxfstatus" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table border
      :data="requirementList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        property="requirements"
        label="每日保养项目及要求">
      </el-table-column>
      <el-table-column
        label="状态"
        width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.fstatus === '0' ? '正常' : '异常'}}</span>
          <!-- <el-select v-model="scope.row.fstatus" placeholder="活动区域">
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MaintenanceDetail',
  data () {
    return {
      listLoading: false,
      // btLoading: false,
      // fdeviceid: '', // 设备id
      form: {
        department: '',
        fdeviceid: '',
        devicename: '',
        fmodel: '',
        ftime: '',
        zdr: '',
        isrepair: '',
        bxfstatus: ''
      },
      rules: {
        department: [
          { required: true, message: '请选择使用部门', trigger: 'change' }
        ],
        fdeviceid: [
          { required: true, message: '请选择使用部门', trigger: 'change' }
        ],
        ftime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        isrepair: [
          { required: true, message: '请选择是否保修', trigger: 'change' }
        ]
      },
      requirementList: [],
      // departmentOptions: [],
      // equipmentOptions: [],
      repairOptions: [{label: '是', value: 1}, {label: '否', value: 0}]
    }
  },
  computed: {
    ...mapState({
      maintenanceId: state => state.maintenanceId
    })
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.Http.get('serbyrecorddetail', {id: this.maintenanceId}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.form = {
              department: res.data.list.department,
              fdeviceid: res.data.list.fdeviceid,
              devicename: res.data.list.devicename,
              fmodel: res.data.list.fmodel,
              ftime: res.data.list.ftime,
              zdr: res.data.list.zdr,
              isrepair: res.data.list.isrepair === '1' ? '是' : '否',
              bxfstatus: res.data.list.bxfstatus
            }
            this.requirementList = res.data.detaillist
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
