<template>
  <!-- <div class="CgAdd"> -->
    <!-- <el-dialog class="el-dialog__body_NoPadding" :visible.sync="innerCgAddVisible" :close-on-click-modal="false" width="90%"> -->
    <el-dialog class="disabledWhite"
      title="采购单新增"
      :visible.sync="innerCgAddVisible"
      :close-on-click-modal="false"
      width="90%"
      append-to-body>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="采购日期">
          <el-date-picker size="mini"
            v-model="form.cgrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="供应商代码">
          <el-select v-model="form.supplyCode" size="mini" placeholder="请输入关键字" filterable remote :filter-method="(value) => filterMethodSupplyCode(value)" @change="(value) => changeSupplyCode(value)">
            <el-option
              v-for="item in supplyCodeOptions"
              :key="item.id"
              :label="item.gyscode"
              :value="item.gyscode">
              <span style="float: left">{{ item.gyscode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.gysname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="form.supplyName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="danger" icon="el-icon-plus" size="mini" @click="chooseSqd">选择</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="CgAddListData"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="wlnumber1"
          label="零件管制表中的物料代码">
        </el-table-column>
        <el-table-column
          property="wlname1"
          label="零件管制表中的物料名称">
        </el-table-column>
        <el-table-column
          property="wlnumber2"
          label="实际应出库物料代码">
        </el-table-column>
        <el-table-column
          property="danwei"
          label="出库单位"
          width="90">
        </el-table-column>
        <el-table-column
          label="结算单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jsdanwei" size="mini" clearable placeholder="请输入结算单位"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          property="gx"
          label="工序"
          width="100">
        </el-table-column>
        <el-table-column
          property="cgnumber"
          label="申请数量"
           width="100">
        </el-table-column>
        <el-table-column
          label="加工数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jgnumber" size="mini" @change="((val)=>{changeJGNumber(val, scope.row, scope.$index)})" clearable placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="加工不含税单价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" size="mini" clearable placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
          property="sqcode"
          label="申请单号">
        </el-table-column>
        <el-table-column
          property="fbillno"
          label="工单号">
        </el-table-column>
      </el-table>
      <!-- 内层 -->
      <!-- 申请单列表 -->
      <el-dialog :close-on-click-modal="false" class="el-dialog__body_NoPadding"
        width="90%"
        title="申请单列表"
        :visible.sync="dialogChoseSqdVisible"
        append-to-body>
        <div class="SqdList">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="申请编号">
              <el-input v-model="filterSqdSqcode" size="mini" clearable placeholder="请输入申请编号"></el-input>
            </el-form-item>
            <el-form-item label="申请日期">
              <el-date-picker size="mini"
                v-model="filterSqdSqtime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSqd">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="choosedSqdData"
            @select="selectSingle"
            @select-all="selectAll"
            :data="SqdListData"
            style="width: 100%">
            <!-- <el-table-column
              type="selection"
              width="55">
            </el-table-column> -->
            <el-table-column
              label=""
              width="40">
              <template slot-scope="scope">
                <el-radio class="radioLabelNone" v-model="curChoosedSqdId" :label="scope.row.id" @change="(value) => changeCurChoosedSqd(scope.$index, scope.row)"></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="60">
            </el-table-column>
            <el-table-column
              property="sqcode"
              label="申请编号">
            </el-table-column>
            <el-table-column
              property="sqr"
              label="申请人">
            </el-table-column>
            <el-table-column
              property="sqtimeTxt"
              label="申请日期">
            </el-table-column>
            <el-table-column
              property="jhtimeTxt"
              label="交货日期">
            </el-table-column>
          </el-table>
          <div style="text-align:center;">
            <el-pagination v-if="SqdListData.length > 0" style="margin-top: 20px"
              @current-change="getSQDList"
              :current-page.sync="curPageSqd"
              :page-size="pageSizeSqd"
              layout="total, prev, pager, next, jumper"
              :total="sumSqd">
            </el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="sureChoose">确 定</el-button>
          <el-button @click="dialogChoseSqdVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" :loading="btLoading" @click="submitCg">提 交</el-button>
        <el-button @click="innerCgAddVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  <!-- </div> -->
</template>

<script>
import { mapState } from 'vuex'
import {secondToFormat, objDeepCopy} from '../../util/utils'
export default {
  name: 'CgAdd',
  data () {
    return {
      btLoading: false,
      innerCgAddVisible: false,
      dialogChoseSqdVisible: false,
      form: {
        cgrq: '',
        supplyCode: '',
        supplyName: ''
      },
      supplyCodeOptions: [],
      CgAddListData: [],
      SqdListData: [],
      pageSizeSqd: 5,
      curPageSqd: 1,
      sumSqd: 0,
      filterSqdSqcode: '',
      filterSqdSqtime: '',
      curChoosedSqdId: '',
      curChoosedSqdCode: '',
      selectedAllList: [],
      selectedUniqueSignList: [],
      backDetailList: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  watch: {
    innerCgAddVisible: function (newVal) {
      if (!newVal) {
        this.$emit('CloseCgAdd')
      }
    }
  },
  methods: {
    filterMethodSupplyCode (val) {
      if (val) {
        this.Http.get('sergys', {gyscode: val}
        ).then(res => {
          this.supplyCodeOptions = res.data.list
        }).catch((error) => {
          this.toggleLoadingBt(false)
          console.log(error)
        })
      }
    },
    changeSupplyCode (val) {
      let options = this.supplyCodeOptions
      let resultItem = (options.filter((item) => { return val === item.gyscode }))[0]
      this.form.supplyName = resultItem.gysname
    },
    showAdd () {
      this.CgAddListData = []
      this.filterSqdSqcode = ''
      this.filterSqdSqtime = ''
      this.curChoosedSqdId = ''
      this.curChoosedSqdCode = ''
      this.cgrq = ''
      this.supplyCode = ''
      this.supplyName = ''
      this.innerCgAddVisible = true
    },
    // 单选申请单
    changeCurChoosedSqd (idx, row) {
      this.SqdListData.map(item => {
        if (item.id === row.id) {
          this.curChoosedSqdId = row.id
          item.checked = true
        }
      })
    },
    chooseSqd () {
      this.dialogChoseSqdVisible = true
      this.getSQDList()
      // this.handleCurrentChange()
    },
    searchSqd () {
      this.curPageSqd = 1
      this.getSQDList()
      // this.handleCurrentChange()
    },
    // 获取申请单列表
    getSQDList () {
      return new Promise((resolve, reject) => {
        let query = {
          number: this.pageSizeSqd,
          page_num: this.curPageSqd,
          ftype: 1
        }
        if (this.filterSqdSqcode) {
          query.sqcode = this.filterSqdSqcode
        }
        if (this.filterSqdSqtime) {
          query.sqtime = this.filterSqdSqtime
        }
        this.Http.get('wxsqlist', query
        ).then(res => {
          this.SqdListData = res.data.list.map((item, idx) => {
            item.idx = idx
            item.checked = false
            item.jhtimeTxt = secondToFormat(item.jhtime.time)
            item.sqtimeTxt = secondToFormat(item.sqtime.time)
            return item
          })
          this.sumSqd = res.data.count
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
    // 单独勾选切换
    selectSingle (selection, row) {
      if (row.checked) { // 取消勾选
        let temp = objDeepCopy(this.selectedAllList)
        temp.map((item, idx) => {
          if (item.id === row.id) {
            this.SqdListData[row.idx].checked = false
            this.selectedAllList.splice(idx, 1)
            let index = this.selectedUniqueSignList.indexOf(row.id)
            if (index > -1) {
              this.selectedUniqueSignList.splice(index, 1)
            }
            this.$refs.choosedSqdData.toggleRowSelection(row, false)
          }
        })
      } else { // 加入勾选
        // 再次检查重复
        let index = this.selectedUniqueSignList.indexOf(row.id)
        if (index === -1) {
          row.checked = true
          this.selectedUniqueSignList.push(row.id)
          this.selectedAllList.push(row)
          this.$refs.choosedSqdData.toggleRowSelection(row, true)
        }
      }
    },
    // 全部切换
    selectAll (selection) {
      if (selection.length === 0) { // 本页全部取消勾选
        this.SqdListData.map(order => {
          this.selectSingle([], order)
        })
      } else { // 本页全部加入勾选
        this.SqdListData.map(order => {
          if (!order.checked) {
            this.selectSingle([], order)
          }
        })
      }
    },
    async handleCurrentChange () {
      let curList = await this.getSQDList()
      if (this.selectedAllList.length > 0) {
        this.selectedAllList.map((itemS) => {
          curList.map((item, idx) => {
            if (item.id === itemS.id) {
              this.$refs.choosedSqdData.toggleRowSelection(curList[idx], true)
              this.SqdListData[idx].checked = true
            }
          })
        })
      }
    },
    sureChoose () {
      if (this.curChoosedSqdId) {
        this.getSqdDetail(this.curChoosedSqdId)
      } else {
        this.dialogChoseSqdVisible = false
      }
      // if (this.selectedAllList.length > 0) {
      //   this.backDetailList = []
      //   this.selectedAllList.map((item, idx) => {
      //     this.getSqdDetail(item)
      //     if (idx === this.selectedAllList.length - 1) {
      //       this.CgAddListData = this.backDetailList
      //       this.dialogChoseSqdVisible = false
      //     }
      //   })
      // } else {
      //   this.backDetailList = []
      //   this.CgAddListData = []
      //   this.dialogChoseSqdVisible = false
      // }
    },
    getSqdDetail (Id) {
      this.CgAddListData = []
      this.Http.get('wxsqdetaillist', {id: Id, ftype: 1}
      ).then(res => {
        this.curChoosedSqdCode = res.data.list.sqcode
        this.CgAddListData = res.data.entrylist.map(item => {
          item.jsdanwei = 'KG'
          item.jgnumber = ''
          item.price = ''
          return item
        })
        this.dialogChoseSqdVisible = false
        // res.data.entrylist.map(item => {
        //   item.jsdanwei = 'KG'
        //   item.jgnumber = ''
        //   item.price = ''
        //   this.backDetailList.push(item)
        // })
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    changeJGNumber (val, row, index) {
      if (val > row.cgnumber) {
        this.$message({
          message: '加工数量不能大于申请数量!',
          type: 'warning'
        })
        this.CgAddListData[index].jgnumber = ''
      }
    },
    submitCg () {
      if (this.CgAddListData.length === 0) {
        this.$message({
          message: '请先选择申请单!',
          type: 'warning'
        })
        return false
      }
      if (!this.form.cgrq || !this.form.supplyCode) {
        this.$message({
          message: '请将信息填写完整!',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.CgAddListData.length; i++) {
        if (!this.CgAddListData[i].jgnumber || !this.CgAddListData[i].price) {
          this.$message({
            message: "请将'加工数量'或'加工不含税单价'填写完整!",
            type: 'warning'
          })
          return false
        }
      }
      let Data = {
        cgr: this.userInfo.fname,
        cgtime: this.form.cgrq,
        gyscode: this.form.supplyCode,
        gysname: this.form.supplyName,
        userno: this.userInfo.id,
        sqcode: this.curChoosedSqdCode,
        entrylist: this.CgAddListData
      }
      console.log(Data)
      this.btLoading = true
      this.Http.post('addwxcg', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '提交成功!',
              type: 'success'
            })
            this.innerCgAddVisible = false
            this.CgAddListData = []
            this.curChoosedSqdId = ''
            this.curChoosedSqdCode = ''
            this.form.cgrq = ''
            this.form.supplyName = ''
            this.form.supplyCode = ''
            this.btLoading = false
            this.$emit('refresh')
            break
          default:
            this.$message({
              message: res.data.message + '!',
              type: 'error'
            })
            this.btLoading = false
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
