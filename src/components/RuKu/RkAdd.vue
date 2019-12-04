<template>
  <!-- <div class="CgAdd"> -->
    <!-- <el-dialog class="el-dialog__body_NoPadding" :visible.sync="innerRkAddVisible" :close-on-click-modal="false" width="90%"> -->
    <el-dialog class="disabledWhite"
      title="入库单新增"
      :visible.sync="innerRkAddVisible"
      :close-on-click-modal="false"
      width="90%"
      append-to-body>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="入库日期">
          <el-date-picker size="mini"
            v-model="form.rkrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="供应商代码">
          <el-input v-model="form.supplyCode" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="form.supplyName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="danger" icon="el-icon-plus" size="mini" @click="chooseRkd">选择</el-button>
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
          label="零件管制表中的物料代码"
          width="200">
        </el-table-column>
        <el-table-column
          property="wlname1"
          label="零件管制表中的物料名称"
          width="200">
        </el-table-column>
        <el-table-column
          property="wlnumber2"
          label="实际应出库物料代码"
          width="200">
        </el-table-column>
        <el-table-column
          property="danwei"
          label="出库单位"
          width="90">
        </el-table-column>
        <el-table-column
          property="jsdanwei"
          label="结算单位"
          width="120">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.jsdanwei" size="mini" clearable placeholder="请输入结算单位"></el-input>
          </template> -->
        </el-table-column>
        <el-table-column
          property="gx"
          label="工序"
          width="100">
        </el-table-column>
        <el-table-column
          property="price"
          label="加工不含税单价"
          width="140">
        </el-table-column>
        <el-table-column
          property="number"
          label="应收数量"
          width="140">
        </el-table-column>
        <el-table-column
          label="入库合格数量"
          width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.hegenum" size="mini" clearable @change="((val)=>{changeHgNumber(val, scope.row, scope.$index)})" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="入库不合格数量"
          width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.buhegenum" size="mini" clearable @change="((val)=>{changeBhgNumber(val, scope.row, scope.$index)})" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          property="rknumber"
          label="入库数量"
          width="140">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.rknumber" size="mini" clearable placeholder=""></el-input>
          </template> -->
        </el-table-column>
        <el-table-column
          label="入库合格重量"
          width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.hegeweight" size="mini" clearable @change="((val)=>{changeWeight(val, scope.row, scope.$index)})"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="入库不合格重量"
          width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.buhegeweight" size="mini" clearable @change="((val)=>{changeWeight(val, scope.row, scope.$index)})"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="不合格原因"
          width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.freason" placeholder="请选择" @change="(value) => changeReason(value, scope.$index, scope.row)">
              <el-option
                v-for="item in reasonOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.fnote" size="mini" clearable placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="计费数量">
          <template slot-scope="scope">
            <span>{{scope.row.jfnumber}}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="jfprice"
          label="计费金额"
          width="140">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.jfprice" size="mini" clearable placeholder=""></el-input>
          </template> -->
        </el-table-column>
      </el-table>
      <!-- 内层 -->
      <!-- 采购单列表 -->
      <el-dialog :close-on-click-modal="false" class="el-dialog__body_NoPadding"
        width="90%"
        title="采购单列表"
        :visible.sync="dialogChooseRkdVisible"
        append-to-body>
        <div class="CgdList">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="采购单号">
              <el-input v-model="filterCgdCgcode" size="mini" clearable placeholder="请输入申请编号"></el-input>
            </el-form-item>
            <el-form-item label="采购日期">
              <el-date-picker size="mini"
                v-model="filterCgdtime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="searchCgd">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="choosedSqdData"
            :data="RkdListData"
            style="width: 100%">
            <el-table-column
              label=""
              width="40">
              <template slot-scope="scope">
                <el-radio class="radioLabelNone" v-model="curChoosedCgdId" :label="scope.row.id" @change="(value) => changeCurChoosedRkd(scope.$index, scope.row)"></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="60">
            </el-table-column>
            <el-table-column
              property="cgcode"
              label="采购编号">
            </el-table-column>
            <el-table-column
              property="cgr"
              label="采购人">
            </el-table-column>
            <el-table-column
              property="cgtimeTxt"
              label="采购日期">
            </el-table-column>
            <el-table-column
              property="gyscode"
              label="供应商代码">
            </el-table-column>
            <el-table-column
              property="gysname"
              label="供应商名称">
            </el-table-column>
          </el-table>
          <div style="text-align:center;">
            <el-pagination v-if="RkdListData.length > 0" style="margin-top: 20px"
              @current-change="getCGDList"
              :current-page.sync="curPageCgd"
              :page-size="pageSizeCgd"
              layout="total, prev, pager, next, jumper"
              :total="sumCgd">
            </el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="sureChoose">确 定</el-button>
          <el-button @click="dialogChooseRkdVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" :loading="btLoading" @click="submitCg">提 交</el-button>
        <el-button @click="innerRkAddVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  <!-- </div> -->
</template>

<script>
import { mapState } from 'vuex'
import {secondToFormat} from '../../util/utils'
export default {
  name: 'CgAdd',
  data () {
    return {
      btLoading: false,
      innerRkAddVisible: false,
      dialogChooseRkdVisible: false,
      form: {
        rkrq: '',
        supplyCode: '',
        supplyName: ''
      },
      supplyCodeOptions: [],
      CgAddListData: [],
      RkdListData: [],
      pageSizeCgd: 5,
      curPageCgd: 1,
      sumCgd: 0,
      filterCgdCgcode: '',
      filterCgdtime: '',
      curChoosedCgdId: '',
      curChoosedCgdCode: '',
      selectedAllList: [],
      selectedUniqueSignList: [],
      backDetailList: [],
      reasonOptions: [
        {label: '我司问题', value: '我司问题'},
        {label: '对方问题', value: '对方问题'}
      ]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  watch: {
    innerRkAddVisible: function (newVal) {
      if (!newVal) {
        this.$emit('CloseRkAdd')
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
    changeHgNumber (val, row, index) {
      let sumNumber = Number(val) + Number(row.buhegenum)
      if (row.buhegenum > 0) { // 已输入不合格数
        if (sumNumber > row.number) {
          this.CgAddListData[index].hegenum = ''
          this.CgAddListData[index].rknumber = 0 + Number(row.buhegenum)
          this.updateJFNumber(index, row.price, row.freason, 0, row.buhegenum)
          this.$message({
            message: '应收数量不能超过入库数量!',
            type: 'warning'
          })
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, val, row.buhegenum)
        }
      } else { // 未输入不合格数 只需判断是否超出
        if (val > row.number) { // 超出
          this.$message({
            message: '应收数量超出了入库数量!',
            type: 'warning'
          })
          this.CgAddListData[index].hegenum = ''
          this.CgAddListData[index].rknumber = 0 + Number(row.buhegenum)
          this.updateJFNumber(index, row.price, row.freason, 0, row.buhegenum)
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, val, row.buhegenum)
        }
      }
    },
    changeBhgNumber (val, row, index) {
      let sumNumber = Number(row.hegenum) + Number(val)
      if (row.hegenum > 0) { // 已输入合格数
        if (sumNumber > row.number) {
          this.CgAddListData[index].buhegenum = ''
          this.CgAddListData[index].rknumber = Number(row.hegenum) + 0
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, 0)
          this.$message({
            message: '应收数量不能超出入库数量!',
            type: 'warning'
          })
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, val)
        }
      } else { // 未输入合格数 只需判断是否超出
        if (val > row.number) { // 超出
          this.$message({
            message: '应收数量超出了入库数量!',
            type: 'warning'
          })
          this.CgAddListData[index].buhegenum = ''
          this.CgAddListData[index].rknumber = Number(row.hegenum) + 0
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, 0)
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, val)
        }
      }
    },
    changeHgNumber0 (val, row, index) {
      let sumNumber = Number(val) + Number(row.buhegenum)
      if (row.buhegenum > 0) { // 已输入不合格数
        if (sumNumber !== row.number) {
          this.CgAddListData[index].hegenum = ''
          this.CgAddListData[index].rknumber = 0 + Number(row.buhegenum)
          this.updateJFNumber(index, row.price, row.freason, 0, row.buhegenum)
          this.$message({
            message: '入库数量应该等于应收数量!',
            type: 'warning'
          })
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, val, row.buhegenum)
        }
      } else { // 未输入不合格数 只需判断是否超出
        if (val > row.number) { // 超出
          this.$message({
            message: '入库数量超出了应收数量!',
            type: 'warning'
          })
          this.CgAddListData[index].hegenum = ''
          this.CgAddListData[index].rknumber = 0 + Number(row.buhegenum)
          this.updateJFNumber(index, row.price, row.freason, 0, row.buhegenum)
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, val, row.buhegenum)
        }
      }
    },
    changeBhgNumber0 (val, row, index) {
      let sumNumber = Number(row.hegenum) + Number(val)
      if (row.hegenum > 0) { // 已输入合格数
        if (sumNumber !== row.number) {
          this.CgAddListData[index].buhegenum = ''
          this.CgAddListData[index].rknumber = Number(row.hegenum) + 0
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, 0)
          this.$message({
            message: '入库数量应该等于应收数量!',
            type: 'warning'
          })
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, val)
        }
      } else { // 未输入合格数 只需判断是否超出
        if (val > row.number) { // 超出
          this.$message({
            message: '入库数量超出了应收数量!',
            type: 'warning'
          })
          this.CgAddListData[index].buhegenum = ''
          this.CgAddListData[index].rknumber = Number(row.hegenum) + 0
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, 0)
        } else {
          this.CgAddListData[index].rknumber = sumNumber
          this.updateJFNumber(index, row.price, row.freason, row.hegenum, val)
        }
      }
    },
    changeWeight (val, row, index) {
      this.updateJFNumber(index, row.price, row.freason, row.hegeweight, row.buhegeweight)
    },
    updateJFNumber (index, price, reason, hegeweight, buhegeweight) {
      if (reason === '对方问题') {
        this.CgAddListData[index].jfnumber = (Number(hegeweight) + Number(buhegeweight))
        this.CgAddListData[index].jfprice = Number(price) * (Number(hegeweight) + Number(buhegeweight))
      } else {
        this.CgAddListData[index].jfnumber = Number(hegeweight)
        this.CgAddListData[index].jfprice = Number(price) * Number(hegeweight)
      }
    },
    updateJFNumber2 (index, price, reason, hegeweight, buhegeweight) {
      if (reason === '对方问题') {
        this.CgAddListData[index].jfnumber = (Number(hegeweight) + Number(buhegeweight))
        this.CgAddListData[index].jfprice = Number(price) * (Number(hegeweight) + Number(buhegeweight))
      } else {
        this.CgAddListData[index].jfnumber = Number(hegeweight)
        this.CgAddListData[index].jfprice = Number(price) * Number(hegeweight)
      }
    },
    // 切换原因
    changeReason (reason, index, row) {
      if (reason === '对方问题') {
        this.CgAddListData[index].jfnumber = ((row.hegeweight >= 0 ? Number(row.hegeweight) : 0) + (row.buhegeweight >= 0 ? Number(row.buhegeweight) : 0))
        this.CgAddListData[index].jfprice = Number(row.price) * ((row.hegeweight >= 0 ? Number(row.hegeweight) : 0) + (row.buhegeweight >= 0 ? Number(row.buhegeweight) : 0))
      } else {
        this.CgAddListData[index].jfnumber = (row.hegeweight >= 0 ? Number(row.hegeweight) : 0)
        this.CgAddListData[index].jfprice = Number(row.price) * (row.hegeweight >= 0 ? Number(row.hegeweight) : 0)
      }
    },
    showAdd () {
      this.CgAddListData = []
      this.filterCgdCgcode = ''
      this.filterCgdtime = ''
      this.curChoosedCgdId = ''
      this.curChoosedCgdCode = ''
      this.form.rkrq = ''
      this.form.supplyCode = ''
      this.form.supplyName = ''
      this.innerRkAddVisible = true
    },
    // 单选申请单
    changeCurChoosedRkd (idx, row) {
      this.RkdListData.map(item => {
        if (item.id === row.id) {
          this.curChoosedCgdId = row.id
          item.checked = true
        }
      })
    },
    chooseRkd () {
      this.dialogChooseRkdVisible = true
      this.getCGDList()
    },
    searchCgd () {
      this.curPageCgd = 1
      this.getCGDList()
    },
    // 获取采购单列表
    getCGDList () {
      return new Promise((resolve, reject) => {
        let query = {
          number: this.pageSizeCgd,
          page_num: this.curPageCgd,
          ftype: 1
        }
        if (this.filterCgdCgcode) {
          query.cgcode = this.filterCgdCgcode
        }
        if (this.filterCgdtime) {
          query.cgtime = this.filterCgdtime
        }
        this.Http.get('wxcglist', query
        ).then(res => {
          this.RkdListData = res.data.list.map((item, idx) => {
            item.idx = idx
            item.checked = false
            item.cgtimeTxt = secondToFormat(item.cgtime.time)
            return item
          })
          this.sumCgd = res.data.count
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
    sureChoose () {
      if (this.curChoosedCgdId) {
        this.getCgdDetail(this.curChoosedCgdId)
      } else {
        this.dialogChooseRkdVisible = false
      }
    },
    getCgdDetail (Id) {
      this.CgAddListData = []
      this.Http.get('wxcgdetaillist', {id: Id, ftype: 1}
      ).then(res => {
        this.curChoosedCgdCode = res.data.list.cgcode
        this.form.supplyName = res.data.list.gysname
        this.form.supplyCode = res.data.list.gyscode
        this.CgAddListData = res.data.entrylist.map(item => {
          item.number = item.hxrknumber
          item.rknumber = ''
          item.hegenum = ''
          item.buhegenum = ''
          item.hegeweight = ''
          item.buhegeweight = ''
          item.freason = ''
          item.fnote = ''
          item.jfnumber = ''
          item.jfprice = ''
          return item
        })
        this.dialogChooseRkdVisible = false
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
          message: '请先选择采购单!',
          type: 'warning'
        })
        return false
      }
      if (!this.form.rkrq) {
        this.$message({
          message: '请选择入库时间!',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.CgAddListData.length; i++) {
        if (Number(this.CgAddListData[i].hegenum) + Number(this.CgAddListData[i].buhegenum) > this.CgAddListData[i].number) {
          this.$message({
            message: "请将'入库合格数量'或'入库不合格数量'填写完整!",
            type: 'warning'
          })
          return false
        }
        if (this.CgAddListData[i].hegeweight === '' || !this.CgAddListData[i].hegeweight) {
          this.$message({
            message: "请将'入库合格重量'填写完整!",
            type: 'warning'
          })
          return false
        }
        if (this.CgAddListData[i].jfprice === '' || !this.CgAddListData[i].jfprice) {
          this.$message({
            message: "请将'计费金额'填写完整!",
            type: 'warning'
          })
          return false
        }
        if (!this.CgAddListData[i].freason && (this.CgAddListData[i].buhegenum || this.CgAddListData[i].buhegeweight)) {
          this.$message({
            message: "请将选择'不合格原因'!",
            type: 'warning'
          })
          return false
        }
      }
      let Data = {
        rkr: this.userInfo.fname,
        rktime: this.form.rkrq,
        gyscode: this.form.supplyCode,
        gysname: this.form.supplyName,
        userno: this.userInfo.id,
        cgcode: this.curChoosedCgdCode,
        entrylist: this.CgAddListData.map(item => {
          item.hegenum = item.hegenum > 0 ? item.hegenum : 0
          item.buhegenum = item.buhegenum > 0 ? item.buhegenum : 0
          item.hegeweight = item.hegeweight > 0 ? item.hegeweight : 0
          item.buhegeweight = item.buhegeweight > 0 ? item.buhegeweight : 0
          return item
        })
      }
      console.log(Data)
      this.btLoading = true
      this.Http.post('addwxrk', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '提交成功!',
              type: 'success'
            })
            this.innerRkAddVisible = false
            this.CgAddListData = []
            this.curChoosedCgdId = ''
            this.curChoosedCgdCode = ''
            this.form.rkrq = ''
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
