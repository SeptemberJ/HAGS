<template>
  <div class="LoginWrap">
    <div class="Login">
      <div class="LeftColor">
        <div class="TopBlock">
          <span>Welcome</span>
        </div>
        <div class="BotBlock">
          <span>欢迎登陆</span>
          <span>汉特工时系统</span>
        </div>
      </div>
      <div class="RightMain">
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-position="left" label-width="1.2rem" class="InputBlock">
          <el-form-item label="部门" prop="accountDepartment" class="TextAlignL">
            {{userInfo.gongxu}}
            <!-- <el-select v-model="modifyForm.accountDepartment" disabled style="width: 100%;" @change="changeDepartment">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.ftype"
                :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="用户名" prop="accountName"  class="TextAlignL">
            {{userInfo.fname}}
            <!-- <el-select v-model="modifyForm.accountName" disabled style="width: 100%;">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.fname"
                :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
          <!-- <el-form-item label="旧密码" prop="accountPsd">
            <el-input v-model="modifyForm.accountPsd" type="password" placeholder="密码" clearable style="width: 100%;"></el-input>
          </el-form-item> -->
          <el-form-item label="新密码" prop="accountPsdNew">
            <el-input v-model="modifyForm.accountPsdNew" type="password" placeholder="密码" clearable style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="accountPsdNewAgain">
            <el-input v-model="modifyForm.accountPsdNewAgain" type="password" placeholder="密码" clearable style="width: 100%;"></el-input>
          </el-form-item>
          <el-button type="primary" size="small" :loading="btLoading" class="bt" @click="Modify('modifyForm')">确认修改</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {clearCookie} from '../util/utils'
// import CryptoJS from 'crypto-js'
export default {
  name: 'Modify',
  data () {
    return {
      btLoading: false,
      departmentList: [],
      userList: [],
      modifyForm: {
        accountDepartment: '',
        accountName: '',
        accountPsd: '',
        accountPsdNew: '',
        accountPsdNewAgain: ''
      },
      rules: {
        accountDepartment: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请选择用户名', trigger: 'change' }
        ],
        accountPsd: [
          { required: true, message: '请输入旧密码', trigger: 'change' }
        ],
        accountPsdNew: [
          { required: true, message: '请输入新密码', trigger: 'change' }
        ],
        accountPsdNewAgain: [
          { required: true, message: '请确认新密码', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.updateCurPage('Modify')
    this.getDepartmentList()
    this.modifyForm.accountDepartment = this.userInfo.id
    this.changeDepartment()
  },
  methods: {
    ...mapActions([
      'unitUserInfo',
      'updateCurPage'
    ]),
    // 提交修改密码
    Modify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.modifyForm.accountPsdNew !== this.modifyForm.accountPsdNewAgain) {
            this.$message({
              message: '两次输入的新密码不一致!',
              type: 'warning'
            })
            return false
          }
          this.btLoading = true
          this.Http.post('updatepassword?userid=' + this.userInfo.id + '&password=' + this.modifyForm.accountPsdNew
          ).then(res => {
            switch (res.data.code) {
              case 1:
                this.btLoading = false
                this.updateCurPage('Login')
                this.$router.push({name: 'Login'})
                localStorage.clear('vuex-along')
                clearCookie('gs_28a807940bba58c2c')
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
    changeDepartment () {
      this.getUserList()
    },
    getDepartmentList () {
      this.Http.get('serdlbmlist'
      ).then(res => {
        this.departmentList = res.data.list
      }).catch((error) => {
        this.toggleLoadingBt(false)
        console.log(error)
      })
    },
    getUserList () {
      this.Http.get('serleaderlist', {ftypeid: this.modifyForm.accountDepartment}
      ).then(res => {
        this.userList = res.data.list
      }).catch((error) => {
        this.toggleLoadingBt(false)
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.LoginWrap{
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
  position: absolute;
}
.Login{
  width: 8rem;
  height: 4.6rem;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  .LeftColor{
    width: 3rem;
    height: 100%;
    float: left;
    background: #4A5F7A;
    .TopBlock{
      width: 100%;
      height: 70%;
      float: left;
      span{
        display: block;
        padding-left: 15px;
        padding-top: 15px;
        text-align: left;
        font-size: .5rem;
        color: white;
      }
    }
    .BotBlock{
      width: 100%;
      height: 25%;
      span{
        display: block;
        padding-left: 15px;
        padding-bottom: 10px;
        font-size: 0.2rem;
        text-align: left;
        color: white;
      }
    }
  }
  .RightMain{
    width: 5rem;
    height: 100%;
    float: left;
    background: white;
    .InputBlock{
      width: 300px;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .bt{
      margin-top: 20px;
      background: #4A5F7A;
      border: 1px solid #4A5F7A;
      font-weight: 400;
      letter-spacing: .34em;
    }
  }
}
</style>
