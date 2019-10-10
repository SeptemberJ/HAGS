<template>
  <div class="SalesReport">
    <!-- 查询 -->
    <el-row style="margin-top:.3rem;">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="5" :offset="5">
          <el-form-item label="订单号">
            <el-input v-model="filterOrderNo" placeholder="请输入订单号" size="small" clearable style="width:100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="工单号">
            <el-input v-model="filterWorkNo" placeholder="请输入工单号" size="small" clearable style="width:100;"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="美国下单时间">
            <el-input v-model="filterUSATime" placeholder="请选择时间" size="small" clearable style="width:150px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="产品类别">
            <el-select v-model="filterProductionKind" size="small" placeholder="请选择产品类别">
              <el-option
                v-for="item in ProductionKindOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="5" style="text-align: left;">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table :cell-class-name="cellStyle"
      :data="reportList"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="fbillno"
        label="订单号"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ftime"
        label="美国下单时间"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fname"
        label="产品名称"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ftype"
        label="产品类别"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="date"
        label="颜色"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fnumber"
        label="数量"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fplanfinishdateTxt"
        label="交期"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="初始预计完成日期"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.csyjtimeTxt, scope.row, '初始预计完成日期')">{{scope.row.csyjtimeTxt}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.csyjtimeTxt, scope.row, '初始预计完成日期')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="修改预计完成日期"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.xgyjtimeTxt, scope.row, '修改预计完成日期')">{{scope.row.xgyjtimeTxt}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.xgyjtimeTxt, scope.row, '修改预计完成日期')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="gdfbillno"
        label="生产工单号"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="date"
        label="纸箱---托盘"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cknumber"
        label="出货数量"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="date"
        label="实际完成日期"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fnote"
        label="备注"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="焊接备料"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.hjbeiliao, scope.row, '焊接备料')">{{scope.row.hjbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.hjbeiliao, scope.row, '焊接备料')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="喷塑备料"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.psbeiliao, scope.row, '喷塑备料')">{{scope.row.psbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.psbeiliao, scope.row, '喷塑备料')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="包装备料"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.bzbeiliao, scope.row, '包装备料')">{{scope.row.bzbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.bzbeiliao, scope.row, '包装备料')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="外协"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.waixie, scope.row, '外协')">{{scope.row.waixie}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.waixie, scope.row, '外协')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="工程变更"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="date"
        label="质检"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="激光"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '激光')" class="templateSpan">{{scope.row.jgcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="折弯"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '折弯')" class="templateSpan">{{scope.row.zwcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="CNC"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, 'CNC')" class="templateSpan">{{scope.row.cnccolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="切管"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '切管')" class="templateSpan">{{scope.row.qgcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="焊接"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '焊接')" class="templateSpan">{{scope.row.hjcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="抛丸"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '抛丸')" class="templateSpan">{{scope.row.pwcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="喷涂"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '喷涂')" class="templateSpan">{{scope.row.ptcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="包装"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '包装')" class="templateSpan">{{scope.row.bzcolor}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="reportList.length > 0" style="margin: .2rem 0;"
      @current-change="getSalesReportList"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
    <!-- edit -->
    <el-dialog title="编辑" :visible.sync="dialogEditVisible" :close-on-click-modal="false" width="500px">
      <section v-if="editType == '初始预计完成日期'" class="TextAlignL">
        <span>初始预计完成日期：</span>
        <el-date-picker style="width: 200px;"
          v-model="editNewData"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择日期">
        </el-date-picker>
      </section>
      <section v-if="editType == '修改预计完成日期'" class="TextAlignL">
        <span>修改预计完成日期：</span>
        <el-date-picker style="width: 200px;"
          v-model="editNewData"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择日期">
        </el-date-picker>
      </section>
      <section v-if="editType == '焊接备料'" class="TextAlignL">
        <span class="inputPreSpan">焊接备料：</span>
        <el-input style="width: 300px;" placeholder="请输入焊接备料" v-model="editNewData"></el-input>
      </section>
      <section v-if="editType == '喷塑备料'" class="TextAlignL">
        <span class="inputPreSpan">喷塑备料：</span>
        <el-input style="width: 300px;" placeholder="请输入喷塑备料" v-model="editNewData"></el-input>
      </section>
      <section v-if="editType == '包装备料'" class="TextAlignL">
        <span class="inputPreSpan">包装备料：</span>
        <el-input style="width: 300px;" placeholder="请输入包装备料" v-model="editNewData"></el-input>
      </section>
      <section v-if="editType == '外协'" class="TextAlignL">
        <span class="inputPreSpan">外协：</span>
        <el-input style="width: 300px" placeholder="请输入外协" v-model="editNewData"></el-input>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="save('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {secondToFormat} from '../util/utils'
export default {
  name: 'SalesReport',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      dialogEditVisible: false,
      filterOrderNo: '',
      filterWorkNo: '',
      filterUSATime: '',
      filterProductionKind: '',
      reportList: [
        // {date: '-', jg: 1, zw: 3, cnc: 1, qg: 1, hj: 1, pw: 1, pt: 1, bz: 1},
        // {date: '-', jg: 2, zw: 1, cnc: 1, qg: 1, hj: 1, pw: 1, pt: 1, bz: 1}
      ],
      columnIndex: [{idx: 21, pro: 'jgcolor'}, {idx: 22, pro: 'zwcolor'}, {idx: 23, pro: 'cnccolor'}, {idx: 24, pro: 'qgcolor'}, {idx: 25, pro: 'hjcolor'}, {idx: 26, pro: 'pwcolor'}, {idx: 27, pro: 'ptcolor'}, {idx: 28, pro: 'bzcolor'}],
      curPage: 1,
      pageSize: 5,
      sum: 0,
      editType: '',
      editNewData: '',
      curgdfbillno: '',
      curentryid: '',
      ProductionKindOptions: [{label: '产品一', value: '产品一'}]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions([
      'updateLjgzOption',
      'updateCurPage',
      'updateBeforePage'
    ]),
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      let curColumn = (this.columnIndex.filter((item) => { return item.idx === columnIndex }))[0]
      if (curColumn) {
        // console.log('curColumn', curColumn)
        // console.log('row', row)
        // console.log('row[curColumn.pro]', row[curColumn.pro])
        switch (row[curColumn.pro]) {
          case 1:
            return 'bgGreen'
          case 2:
            return 'bgRed'
          case 3:
            return 'bgOrange'
          case 4:
            return 'bgRed'
          default:
            return 'bgWhite'
        }
      }
      // if (columnIndex === 21) {
      //   switch (row.jg) {
      //     case 1:
      //       return 'bgGreen'
      //     case 2:
      //       return 'bgRed'
      //     case 3:
      //       return 'bgOrange'
      //     case 4:
      //       return 'bgRed'
      //   }
      // }
      // if (columnIndex === 22) {
      //   switch (row.zw) {
      //     case 1:
      //       return 'bgGreen'
      //     case 2:
      //       return 'bgRed'
      //     case 3:
      //       return 'bgOrange'
      //     case 4:
      //       return 'bgRed'
      //   }
      // }
    },
    search () {
      this.curPage = 1
      this.getSalesReportList()
    },
    reset () {
      this.filterOrderNo = ''
      this.filterWorkNo = ''
      this.curPage = 1
      this.getSalesReportList()
    },
    getSalesReportList () {
      this.listLoading = true
      // let query = {number: this.pageSize, page_num: this.curPage}
      // if (this.filterOrderNo) {
      //   query.fbillno = this.filterOrderNo
      // }
      // if (this.filterWorkNo) {
      //   query.gdfbillno = this.filterWorkNo
      // }
      // console.log(query)
      this.Http.post('baobiaolist', {number: this.pageSize, page_num: this.curPage, fbillno: this.filterOrderNo, gdfbillno: this.filterWorkNo}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.reportList = res.data.list.map(item => {
              item.fplanfinishdateTxt = secondToFormat(item.fplanfinishdate.time)
              item.csyjtimeTxt = item.csyjtime ? secondToFormat(item.csyjtime.time) : ''
              item.xgyjtimeTxt = item.xgyjtime ? secondToFormat(item.xgyjtime.time) : ''
              item.hjbeiliao = item.hjbeiliao
              item.psbeiliao = item.psbeiliao ? item.psbeiliao : ''
              item.bzbeiliao = item.bzbeiliao ? item.bzbeiliao : ''
              item.waixie = item.waixie ? item.waixie : ''
              return item
            })
            this.sum = res.data.count
            this.listLoading = false
            break
          default:
            this.$message({
              message: 'Interface error !',
              type: 'warning'
            })
            this.reportList = []
            this.sum = 0
            this.listLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    edit (oldData, row, type) {
      this.editType = type
      this.editNewData = oldData === '--' ? '' : oldData
      this.curgdfbillno = row.gdfbillno
      this.curentryid = row.entryid
      this.dialogEditVisible = true
    },
    save () {
      if (!this.editNewData) {
        this.$message({
          message: (this.editType === '初始预计完成日期' || this.editType === '修改预计完成日期') ? '请选择' + this.editType : this.editType + '内容不能为空',
          type: 'warning'
        })
        return false
      }
      let query = {gdfbillno: this.curgdfbillno, entryid: this.curentryid}
      switch (this.editType) {
        case '初始预计完成日期':
          query.csyjtime = this.editNewData
          break
        case '修改预计完成日期':
          query.xgyjtime = this.editNewData
          break
        case '焊接备料':
          query.hjbeiliao = this.editNewData
          break
        case '喷塑备料':
          query.psbeiliao = this.editNewData
          break
        case '包装备料':
          query.bzbeiliao = this.editNewData
          break
        case '外协':
          query.waixie = this.editNewData
          break
      }
      this.btLoading = true
      this.Http.get('updatebaobiao', query
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.dialogEditVisible = false
            this.btLoading = false
            this.getSalesReportList()
            break
          default:
            this.$message({
              message: 'Interface error !',
              type: 'warning'
            })
            this.btLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 跳转零件管制
    goLjgz (row, type) {
      if (type !== this.userInfo.gongxu) {
        this.$message({
          message: '对不起，您没有操作此道工序的权限!',
          type: 'warning'
        })
        return false
      }
      this.updateLjgzOption({fshortnumber: row.fshortnumber, fqty: row.fnumber, fbillno: row.gdfbillno})
      this.updateBeforePage('SalesReport')
      this.updateCurPage('Ljgz')
      this.$router.push({name: 'Ljgz'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.inputPreSpan{
  width: 100px;
  text-align: right;
  display: inline-block;
}
.templateSpan{
  width:100%;
  height:100%;
  display:block;
  cursor: pointer;
}
</style>
