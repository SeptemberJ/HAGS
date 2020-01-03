<template>
  <div class="MaintenanceAdd">
    <el-form :inline="true" :rules="rules" ref="form" :model="form" label-position="left" label-width="80px" class="demo-form-inline disabledWhite">
      <el-row>
        <el-col :span="6">
          <el-form-item label="使用部门" prop="department">
            <el-select v-model="form.department" placeholder="请选择">
              <el-option v-for="item in departmentOptions" :key="item.id" :label="item.fname" :value="item.fname"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备编号" prop="fdeviceid">
            <el-input v-model="form.fdeviceid" disabled></el-input>
            <!-- <el-select v-model="fdeviceid" remote filterable :remote-method="remoteMethod" @change="(value) => changeEquipment(value)" placeholder="请选择">
              <el-option
                v-for="item in equipmentOptions"
                :key="item.id"
                :label="item.fdeviceid"
                :value="item.id">
                <span style="float: left">{{ item.fdeviceid }}</span>
                <span style="float: right; color: #8492a6; font-size: 12px;margin-left:10px;">{{ item.devicename }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格型号">
            <el-input v-model="form.fmodel" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日期" prop="ftime">
            <el-date-picker
              v-model="form.ftime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="班组长">
            <el-input v-model="userInfo.fname" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否保修" prop="isrepair">
            <el-select v-model="form.isrepair" placeholder="请选择">
              <el-option v-for="item in repairOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保修状态">
            <el-input v-model="form.bxfstatus" placeholder="保修状态"></el-input>
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
          <el-select v-model="scope.row.fstatus" placeholder="活动区域">
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="MarginT_20"  type="danger" :loading="btLoading" @click="submit('form')">保 存</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {dateToFormat} from '../../util/utils'
export default {
  name: 'MaintenanceAdd',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      fdeviceid: '', // 设备id
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
      departmentOptions: [],
      equipmentOptions: [],
      repairOptions: [{label: '是', value: 1}, {label: '否', value: 0}]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.form.ftime = dateToFormat(new Date())
    if (!this.$route.params.fdeviceid) {
      this.$router.push({name: 'MaintenanceIndex'})
    } else {
      this.form.fdeviceid = this.$route.params.fdeviceid
      this.form.devicename = this.$route.params.devicename
      this.form.fmodel = this.$route.params.fmodel
      this.getMRequirement(this.$route.params.id)
    }
    this.getOptions()
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.Http.get('serdevice', {userid: this.userInfo.id, fdeviceid: query}
        ).then(res => {
          this.equipmentOptions = res.data.list
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      } else {
        this.equipmentOptions = []
      }
    },
    changeEquipment (value, idx) {
      let choosedEq = this.equipmentOptions.filter(Eq => {
        return Eq.id === value
      })
      this.form.fdeviceid = choosedEq[0].fdeviceid
      this.form.devicename = choosedEq[0].devicename
      this.form.fmodel = choosedEq[0].fmodel
      this.getMRequirement(this.fdeviceid)
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.isrepair === 1 && this.form.bxfstatus === '') {
            this.$message({
              message: '请将填写保修状态!',
              type: 'warning'
            })
          } else {
            let Data = {
              userid: this.userInfo.id,
              zdr: this.userInfo.fname,
              ftime: this.form.ftime,
              department: this.form.department,
              fdeviceid: this.form.fdeviceid,
              devicename: this.form.devicename,
              fmodel: this.form.fmodel,
              isrepair: this.form.isrepair,
              bxfstatus: this.form.bxfstatus,
              entrylist: this.requirementList
            }
            this.btLoading = true
            this.Http.post('adddevicerecord', Data
            ).then(res => {
              switch (res.data.code) {
                case '1':
                  this.$message({
                    message: '录入成功!',
                    type: 'success'
                  })
                  this.$router.push({name: 'MaintenanceList'})
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
    getMRequirement (id) {
      this.Http.get('devicerequirements', {id: id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.requirementList = res.data.list.map(item => {
              item.fstatus = '0'
              return item
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
    // getEOptions () {
    //   this.Http.get('serdevice', {userid: this.userInfo.id, fdeviceid: query}
    //   ).then(res => {
    //     this.equipmentOptions = res.data.list
    //   }).catch((error) => {
    //     console.log(error)
    //     this.$message({
    //       message: '服务器繁忙!',
    //       type: 'error'
    //     })
    //   })
    // },
    getOptions () {
      this.Http.get('serbumen'
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.departmentOptions = res.data.list
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
.MaintenanceAdd{
  padding: 20px;
}
</style>
