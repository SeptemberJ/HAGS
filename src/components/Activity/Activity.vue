<template>
  <div class="Activity">
    <!-- 活动列表 -->
    <!-- <el-dialog title="活动列表" :visible.sync="dialogHBHistoryVisible" :close-on-click-modal="false" width="90%"> -->
      <el-row class="TextAlignR">
        <el-button type="danger" icon="el-icon-plus" size="mini" @click="addHD">新增</el-button>
      </el-row>
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
      <el-table
        :data="hdList"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          type="index"
          width="42">
        </el-table-column>
        <el-table-column
          property="workno"
          label="汇报单号"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="activityname"
          label="活动名称"
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
            <el-button type='text' @click="seeWorkOrderPerson(scope.row)">人 员</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="hdList.length > 0" style="margin: .2rem 0;"
        @current-change="getHDList"
        :current-page.sync="curPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="sum">
      </el-pagination>
      <!-- 录入 -->
      <el-dialog title="录入" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="600px" append-to-body>
        <el-form :rules="rules" ref="form" :model="form" label-width="80px" label-position="left" >
          <el-form-item label="数量" prop="fnumber">
            <el-input v-model="form.fnumber" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="activityid">
            <el-select v-model="form.activityid" placeholder="请选择活动名称" style="width: 200px;" @change="changeActivity">
              <el-option v-for="Activity in activityNameList" :key="Activity.id" :label="Activity.fname" :value="Activity.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- person list -->
        <el-button type="danger" icon="el-icon-plus" size="small" @click="addPerson" style="float:right;margin-bottom:20px;">添加人员</el-button>
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
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="danger" @click="submit('form')">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 查看人员列表 -->
      <el-dialog title="工单人员" :visible.sync="dialogGDPersonVisible" :close-on-click-modal="false" width="750px" append-to-body>
        <!-- <div style="text-align: right;diplay: block;">
          <el-button type="danger" icon="el-icon-plus" size="small" @click="appendPerson">新增</el-button>
        </div> -->
        <el-table
          :data="activityPersonList"
          max-height="250"
          style="width: 100%;margin-top: .2rem;">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            property="fname"
            label="人员"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            property="starttime"
            label="开机时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            property="endtime"
            label="关机时间"
            show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="delPersonActivity(scope.$index, scope.row)">移除</el-button>
            </template>
          </el-table-column> -->
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
      </el-dialog>
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
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {dateToFormatAll, secondToFormatAll} from '../../util/utils'
export default {
  name: 'HelloWorld',
  data () {
    return {
      huibaiWorkNo: '',
      listLoading: false,
      btLoading: false,
      dialogAddVisible: false,
      dialogTimeVisible: false,
      dialogGDPersonVisible: false,
      hdList: [],
      curPage: 1,
      pageSize: 5,
      sum: 0,
      activityNameList: [],
      curWorkId: null,
      time: '',
      openOrClose: 1, // 0 关机 1 开机
      workIdGDPerson: null,
      form: {
        fnumber: 1,
        activityid: '',
        activityname: ''
      },
      rules: {
        fnumber: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ],
        activityid: [
          { required: true, message: '请选择活动名称', trigger: 'change' }
        ]

      },
      curPersonId: null,
      personList: [],
      selectChoosePeopleList: [], // select可选择的person的list
      dialogAddPersonGDVisible: false,
      activityPersonList: [],
      addGDPerson: {id: '', fname: '', userno: '', options: {}} // 工单新增的人员
    }
  },
  computed: {
    ...mapState({
      curModuleInfo: state => state.curModuleInfo,
      userInfo: state => state.userInfo
    })
  },
  methods: {
    searchHuibao () {
      this.curPage = 1
      this.getHDList()
    },
    async showTimeDialog (idx, row, type) {
      this.openOrClose = type
      if (type === 0 && !row.starttime) { // 关机
        this.$message({
          message: '还未开机，不能关机!',
          type: 'warning'
        })
        return false
      } else {
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
    // 开关机保存时间
    submitTime () {
      if (this.openOrClose === 0) {
        this.shutDown()
      } else {
        this.bootUp()
      }
    },
    // 提交关机时间
    shutDown () {
      let DateStart = this.$moment(this.curStartTmie)
      let DateEnd = this.$moment(dateToFormatAll(this.time))
      let worktime = DateEnd.diff(DateStart, 'minute')
      this.btLoading = true
      this.Http.post('activityguanji?endtime=' + dateToFormatAll(this.time) + '&workid=' + this.curWorkId + '&worktime=' + worktime
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '关机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeVisible = false
            this.getHDList()
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
    // 提交开机时间
    bootUp () {
      this.btLoading = true
      this.Http.post('activitykaiji?starttime=' + dateToFormatAll(this.time) + '&workid=' + this.curWorkId
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '开机成功!',
              type: 'success'
            })
            this.btLoading = false
            this.dialogTimeVisible = false
            this.getHDList()
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
    seeWorkOrderPerson (row) {
      this.dialogGDPersonVisible = true
      this.workIdGDPerson = row.id
      this.getActivityPersonList(row.id)
    },
    async getActivityPersonList (id) {
      let OptionList = await this.getDefaultPeopleList()
      this.Http.get('activityrylist', {workid: id}
      ).then(res => {
        this.activityPersonList = res.data.list.map(item => {
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
    changePersonGD (val) {
      // 校验重复
      this.curPersonId = val
      if (this.activityPersonList.filter(this.checkId).length >= 1) {
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
    saveGDPerson () {
      if (!this.addGDPerson.id) {
        this.$message({
          message: '请选择人员!',
          type: 'warning'
        })
        return false
      }
      this.btLoading = true
      this.Http.post('addactivityry?workid=' + this.workIdGDPerson + '&gongxu=' + this.userInfo.gongxu + '&userno=' + this.addGDPerson.id + '&fname=' + this.addGDPerson.fname
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '人员保存成功!',
              type: 'success'
            })
            this.getActivityPersonList(this.workIdGDPerson)
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
    changeActivity (id) {
      this.form.activityname = this.activityNameList.filter(this.checkActivityId)[0].fname
    },
    checkActivityId (Activity) {
      return Activity.id === this.form.activityid
    },
    addHD () {
      this.dialogAddVisible = true
      this.getActivityNameList()
      this.getPeopleList()
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
    // 移除人员记录
    delPerson (idx, row) {
      this.personList.splice(idx, 1)
    },
    delPersonActivity (idx, row) {
      this.Http.get('delactivityry', {workid: this.workIdGDPerson, userno: row.id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '人员删除成功!',
              type: 'success'
            })
            this.getActivityPersonList(this.workIdGDPerson)
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
          type: 'warning'
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
    // 列表新增人员
    appendPerson () {
      this.dialogAddPersonGDVisible = true
      this.addGDPerson = {id: '', fname: '', userno: '', options: this.selectChoosePeopleList}
    },
    // 添加人员
    addPerson (type) {
      this.personList.push({id: '', fname: '', userno: '', options: this.selectChoosePeopleList})
    },
    // 提交新增
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.personList.length === 0) {
            this.$message({
              message: '请至少选择一个人员!',
              type: 'warning'
            })
          } else {
            this.sureSubmit()
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
    sureSubmit () {
      let Data = {
        jlruserno: this.userInfo.userno,
        gongxu: this.userInfo.gongxu,
        fbiller: this.userInfo.fname,
        activityid: this.form.activityid,
        activityname: this.form.activityname,
        fnumber: this.form.fnumber,
        peoplelist: this.personList.map(item => {
          item.userno = item.id
          return item
        })
      }
      this.Http.post('addactivity', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '录入成功!',
              type: 'success'
            })
            this.dialogAddVisible = false
            this.getHDList()
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
    getActivityNameList () {
      this.Http.get('seractivitylist'
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.activityNameList = res.data.list
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
    getHDList () {
      let Data = {}
      if (this.huibaiWorkNo) {
        Data = {number: this.pageSize, page_num: this.curPage, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu, workno: this.huibaiWorkNo}
      } else {
        Data = {number: this.pageSize, page_num: this.curPage, fbiller: this.userInfo.fname, gongxu: this.userInfo.gongxu}
      }
      this.Http.get('seractivitywork', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.hdList = res.data.list.map(item => {
              item.create_timeTxt = secondToFormatAll(item.create_time.time)
              item.ifCanOpen = !item.starttime
              item.ifCanClose = !item.endtime
              return item
            })
            this.sum = res.data.count
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
