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
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="1rem" class="InputBlock">
          <el-form-item label="用户名" prop="accountName">
            <el-select v-model="loginForm.accountName" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.fname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="accountPsd">
            <el-input v-model="loginForm.accountPsd" type="password" placeholder="密码" clearable @keyup.enter.native='enterEvent' style="width: 100%;"></el-input>
          </el-form-item>
          <el-button type="primary" size="small" :loading="btLoading" class="bt" @click="Login('loginForm')">登陆</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {setCookie} from '../util/utils'
import CryptoJS from 'crypto-js'
export default {
  name: 'Login',
  data () {
    return {
      btLoading: false,
      userList: [],
      loginForm: {
        accountName: '',
        accountPsd: ''
      },
      rules: {
        accountName: [
          { required: true, message: '请选择用户名', trigger: 'change' }
        ],
        accountPsd: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.updateCurPage('Login')
    this.getUserList()
  },
  methods: {
    ...mapActions([
      'unitUserInfo',
      'updateCurPage'
    ]),
    enterEvent () {
      let keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode
      if (keyCode === 13) {
        this.Login('loginForm')
      }
    },
    Login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btLoading = true
          this.Http.post('leaderLogin?username=' + this.loginForm.accountName + '&password=' + this.loginForm.accountPsd
          ).then(res => {
            switch (res.data.code) {
              case 1:
                let cookieStr = CryptoJS.HmacSHA256((this.loginForm.accountName + this.loginForm.accountPsd).toString(), '28a807940bba58c2c')
                setCookie('gs_28a807940bba58c2c', cookieStr, 6)
                this.$message({
                  message: '登陆成功!',
                  type: 'success'
                })
                this.btLoading = false
                this.updateCurPage('Home')
                this.$router.push({name: 'Home'})
                // 刷新信息
                this.unitUserInfo(res.data.memberInfo)
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
    getUserList () {
      this.Http.get('serleaderlist'
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
  height: 4rem;
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
