<template>
  <el-dialog class="disabledWhite"
    title="采购详情"
    :visible.sync="innerCgDetailVisible"
    :close-on-click-modal="false"
    width="90%"
    append-to-body>
    <el-table
      :data="CgDetailListData"
      :height="450"
      ref="selectList"
      @select="selectSingle"
      @select-all="selectAll"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
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
        label="实际应出库物料代码"
        width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.isck != 0">{{scope.row.wlnumber2}}</span>
          <el-select v-else v-model="scope.row.wlnumber2" placeholder="请输入关键字" filterable remote :filter-method="(value) => filterMethodWLCode(value, scope.$index)" @change="(value) => changeWLCode(value, scope.$index)">
            <el-option
              v-for="(item, idx) in scope.row.CkwuliaoOptions"
              :key="idx"
              :label="item.fnumber"
              :value="item.fnumber">
              <span style="float: left">{{ item.fnumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fmodel }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        property="wlname2"
        label="实际应出库物料名称"
        width="200">
      </el-table-column>
      <el-table-column
        property="cknumber"
        label="出库数量"
        width="90">
      </el-table-column>
      <el-table-column
        property="cktime"
        label="出库日期"
        width="90">
      </el-table-column>
      <el-table-column
        property="ckr"
        label="出库人"
        width="90">
      </el-table-column>
      <el-table-column
        property="danwei"
        label="出库单位"
        width="90">
      </el-table-column>
      <el-table-column
        property="jsdanwei"
        label="结算单位"
        width="100">
      </el-table-column>
      <el-table-column
        property="gx"
        label="工序"
        width="100">
      </el-table-column>
      <el-table-column
        property="sqnumber"
        label="申请数量"
        width="100">
      </el-table-column>
      <el-table-column
        property="jgnumber"
        label="加工数量"
        width="100">
      </el-table-column>
      <el-table-column
        property="price"
        label="加工不含税单价">
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
    <!-- 内层 全部出库 -->
    <el-dialog class="disabledWhite"
      title="确认出库"
      :visible.sync="innerCgCkVisible"
      :close-on-click-modal="false"
      width="250"
      append-to-body>
      <el-form :inline="false" class="demo-form-inline" label-width="100px" label-position="left">
        <el-form-item label="出库人">
          <span>{{userInfo.fname}}</span>
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker
            v-model="ckrq"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" :loading="btLoading" @click="sureCk">确 定</el-button>
        <el-button @click="innerCgCkVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="fckAll">反出库</el-button>
      <el-button type="danger" @click="ckAll">全部出库</el-button>
      <el-button @click="innerCgDetailVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { Message } from 'element-ui'
import {dateToFormat} from '../../util/utils'
export default {
  name: 'CgDetail',
  data () {
    return {
      btLoading: false,
      innerCgDetailVisible: false,
      innerCgCkVisible: false,
      cgcode: '',
      CgDetailListData: [],
      selectList: [],
      ckrq: dateToFormat(new Date())
    }
  },
  watch: {
    innerCgDetailVisible: function (newVal) {
      if (!newVal) {
        this.$emit('CloseCgDetail')
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    showDetail () {
      this.innerCgDetailVisible = true
    },
    // 单独勾选
    selectSingle (selection, row) {
      if (!row.checked && row.isck !== '1') {
        row.checked = true
        this.selectList.push(row)
      } else {
        if (row.isck === '1') {
          Message.closeAll()
          Message.warning({
            message: '该单已出库，不可勾选!'
          })
        }
        this.$refs.selectList.toggleRowSelection(row, false)
        this.selectList.map((item, idx) => {
          if (item.id === row.id) {
            row.checked = false
            // this.CgDetailListData[row.idx].checked = false
            this.selectList.splice(idx, 1)
          }
        })
      }
    },
    // 全选
    selectAll (selection) {
      if (selection.length === 0) { // 本页全部取消勾选
        this.CgDetailListData.map(order => {
          this.selectSingle([], order)
        })
      } else { // 本页全部加入勾选
        this.CgDetailListData.map(order => {
          if (!order.checked) {
            this.selectSingle([], order)
          }
        })
      }
    },
    ckAll () {
      if (this.selectList.length === 0) {
        this.$message({
          message: '请先勾选需要出库的单子!',
          type: 'warning'
        })
      } else {
        this.innerCgCkVisible = true
      }
    },
    sureCk () {
      let Data = {
        'cgcode': this.cgcode,
        'entrylist': this.selectList.map(item => {
          item.cknumber = item.jgnumber
          item.ckr = this.userInfo.fname
          item.cktime = this.ckrq
          return item
        })
      }
      this.btLoading = true
      this.Http.post('updatewxcg', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '出库成功!',
              type: 'success'
            })
            this.selectList = []
            this.innerCgCkVisible = false
            this.innerCgDetailVisible = false
            this.btLoading = false
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
    },
    // 反出库
    fckAll () {
      if (this.selectList.length === 0) {
        this.$message({
          message: '请先勾选需要反出库的单子!',
          type: 'warning'
        })
      } else {
        // 反出库需判断是否有不可勾选的
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].isck === '0') {
            this.$message({
              message: '零件管制表中的物料代码为' + "'" + this.selectList[i].wlnumber1 + "'" + '的记录不能进行反出库操作!',
              type: 'warning'
            })
            return false
          }
        }
      }
    },
    getCgDetailList (cgId) {
      this.Http.get('wxcgdetaillist', {id: cgId}
      ).then(res => {
        this.cgcode = res.data.list.cgcode
        this.CgDetailListData = res.data.entrylist.map(item => {
          item.CkwuliaoOptions = []
          item.checked = false
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
    // 修改物料代码
    filterMethodWLCode (val, idx) {
      if (val) {
        this.Http.get('ckwuliao', {fnumber: val}
        ).then(res => {
          this.CgDetailListData[idx].CkwuliaoOptions = res.data.list
        }).catch((error) => {
          // this.toggleLoadingBt(false)
          console.log(error)
        })
      }
    },
    changeWLCode (val, idx) {
      let options = this.CgDetailListData[idx].CkwuliaoOptions
      let resultItem = (options.filter((item) => { return val === item.fnumber }))[0]
      this.CgDetailListData[idx].wlname2 = resultItem.fname
      this.updateWLCode()
    },
    updateWLCode () {
      this.Http.post('updatewuliao', {'entrylist': this.CgDetailListData}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '保存成功!',
              type: 'success'
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
