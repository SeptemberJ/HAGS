<template>
  <el-dialog class="disabledWhite"
    title="库单详情"
    :visible.sync="innerRkDetaiklVisible"
    :close-on-click-modal="false"
    width="90%"
    append-to-body>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="入库日期">
        <el-date-picker size="mini"
          disabled
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
    </el-form>
    <el-table
      :data="RkDetailListData"
      :height="450"
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
        property="hegenum"
        label="入库合格数量"
        width="140">
      </el-table-column>
      <el-table-column
        property="buhegenum"
        label="入库不合格数量"
        width="140">
      </el-table-column>
      <el-table-column
        property="rknumber"
        label="入库数量"
        width="140">
      </el-table-column>
      <el-table-column
        property="hegeweight"
        label="入库合格重量"
        width="140">
      </el-table-column>
      <el-table-column
        property="buhegeweight"
        label="入库不合格重量"
         width="140">
      </el-table-column>
      <el-table-column
        property="freason"
        label="不合格原因"
        width="140">
      </el-table-column>
      <el-table-column
        property="fnote"
        label="备注"
        width="150">
      </el-table-column>
      <el-table-column
        property="jfnumber"
        label="计费数量"
        width="140">
      </el-table-column>
      <el-table-column
        property="jfprice"
        label="计费金额"
        width="140">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeRkDetail">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
// import { Message } from 'element-ui'
import {secondToFormat} from '../../util/utils'
export default {
  name: 'RkDetail',
  data () {
    return {
      innerRkDetaiklVisible: false,
      form: {
        rkrq: '',
        supplyCode: '',
        supplyName: ''
      },
      RkDetailListData: []
    }
  },
  watch: {
    innerRkDetaiklVisible: function (newVal) {
      if (!newVal) {
        this.$emit('CloseRkDetail')
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
      this.innerRkDetaiklVisible = true
    },
    closeRkDetail () {
      this.innerRkDetaiklVisible = false
      this.$emit('CloseRkDetail')
    },
    getRkDetailList (rkId) {
      this.Http.get('wxrkdetaillist', {id: rkId}
      ).then(res => {
        this.form.rkrq = secondToFormat(res.data.list.rktime.time)
        this.form.supplyCode = res.data.list.gyscode
        this.form.supplyName = res.data.list.gysname
        this.RkDetailListData = res.data.entrylist
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
