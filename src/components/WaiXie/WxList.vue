<template>
  <div class="WxList">
    <el-table
      :data="WXListData"
      height="450"
      style="width: 100%">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        property="ddfbillno"
        label="订单号"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="fbillno"
        label="工单号"
        width="130">
      </el-table-column>
      <el-table-column
        property="fnumber"
        label="零件号">
      </el-table-column>
      <el-table-column
        property="fname"
        label="零件名称">
      </el-table-column>
      <el-table-column
        property="clnumber"
        label="材料代码">
      </el-table-column>
      <el-table-column
        property="clname"
        label="材料名称">
      </el-table-column>
      <el-table-column
        property="jhsnumber"
        label="数量"
        width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="removeWXFromList(scope.$index, scope.row, 0)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 内层 -->
    <el-dialog :close-on-click-modal="false" class="disabledWhite"
      width="90%"
      title="外协"
      :visible.sync="innerWXVisible"
      append-to-body>
      <el-form :inline="true" :model="formWX" class="demo-form-inline">
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="formWX.sqrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="userInfo.fname" disabled></el-input>
        </el-form-item>
        <el-form-item label="要求交货日期">
          <el-date-picker
            v-model="formWX.jhrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-table
        :data="WXListData"
        height="400"
        style="width: 100%">
        <el-table-column
          fixed
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
          label="实际应出库物料代码"
          width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.wlnumber2" placeholder="请输入关键字" filterable remote :filter-method="(value) => filterMethodWLCode(value, scope.$index)" @change="(value) => changeWLCode(value, scope.$index)">
              <el-option
                v-for="(item, idx) in scope.row.CkwuliaoOptions"
                :key="idx"
                :label="item.fnumber"
                :value="item.fnumber">
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
          property="danwei"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          property="guige"
          label="规格"
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          property="jhsnumber"
          label="应出数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="sqnumber"
          label="申请数量"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sqnumber"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          property="gx"
          label="工序"
          width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.gx" placeholder="请选择">
              <el-option
                v-for="item in wxgxOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          property="fnote"
          label="备注"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.fnote"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitWX">确 认</el-button>
        <el-button @click="innerWXVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {dateToFormat} from '../../util/utils'
export default {
  name: 'WxList',
  data () {
    return {
      WXListData: [], // 外协列表
      innerWXVisible: false,
      formWX: {
        sqrq: dateToFormat(new Date()),
        jhrq: ''
      },
      wxgxOptions: ['镀白锌', '镀黑锌'],
      CkwuliaoOptions: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    sureOperate () {
      if (this.WXListData.length === 0) {
        this.$message({
          message: '请先添加外协工单!',
          type: 'warning'
        })
        return false
      } else {
        this.formWX.sqrq = dateToFormat(new Date())
        this.formWX.jhrq = ''
        this.innerWXVisible = true
      }
    },
    getWXList () {
      this.Http.get('wxlist', {userno: this.userInfo.userno}
      ).then(res => {
        this.WXListData = res.data.list.map(item => {
          item.CkwuliaoOptions = []
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
    removeWXFromList (idx, row) {
      this.Http.get('delwx', {id: row.id}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '移除成功!',
              type: 'success'
            })
            this.getWXList()
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
    filterMethodWLCode (val, idx) {
      if (val) {
        this.Http.get('ckwuliao', {fnumber: val}
        ).then(res => {
          this.WXListData[idx].CkwuliaoOptions = res.data.list
        }).catch((error) => {
          this.toggleLoadingBt(false)
          console.log(error)
        })
      }
    },
    changeWLCode (val, idx) {
      let options = this.WXListData[idx].CkwuliaoOptions
      let resultItem = (options.filter((item) => { return val === item.fnumber }))[0]
      this.WXListData[idx].wlname2 = resultItem.fname
    },
    submitWX () {
      if (!this.formWX.jhrq) {
        this.$message({
          message: '交货日期为必填项!',
          type: 'warning'
        })
        return false
      }
      let hasEmpty = false
      let Data = {
        sqr: this.userInfo.fname,
        sqtime: this.formWX.sqrq,
        jhtime: this.formWX.jhrq,
        userno: this.userInfo.id,
        entrylist: this.WXListData.map(item => {
          if (!item.sqnumber) {
            hasEmpty = true
          }
          item.number = item.jhsnumber
          return item
        })
      }
      if (hasEmpty) {
        this.$message({
          message: '申请数量为必填项!',
          type: 'warning'
        })
        return false
      }
      this.Http.post('addwxsq', Data
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
            this.innerWXVisible = false
            this.$emit('closeWXList')
            // this.getWXList()
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
