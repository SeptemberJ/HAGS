<template>
  <div class="WarnPrint">
    <table id="table" border="0" width="100%">
      <thead>
        <tr>
          <th class="tableColumn" style="width: 5%;text-align: left;">序号</th>
          <th class="tableColumn" style="width: 12%;text-align: left;">零件号</th>
          <th class="tableColumn" style="width: 12%;text-align: left;">零件号名称</th>
          <th class="tableColumn" style="width: 21%;text-align: left;">材料代码</th>
          <th class="tableColumn" style="width: 12%;text-align: left;">材料名称</th>
          <th class="tableColumn" style="width: 11%;text-align: left;">质量原因</th>
          <th class="tableColumn" style="width: 11%;text-align: left;">解决方案</th>
          <th class="tableColumn" style="width: 8%;text-align: left;">解决人</th>
          <th class="tableColumn" style="width: 8%;text-align: left;">解决时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in yjList" :key="idx">
          <td colspan="9">
            <table border="0" width="100%">
              <tbody>
                <tr height="30px">
                  <td class="tableTd" style="width: 5%;">{{idx + 1}}</td>
                  <td class="tableTd" style="width: 12%;">{{item.fnumber}}</td>
                  <td class="tableTd" style="width: 12%;">{{item.fname}}</td>
                  <td class="tableTd" style="width: 21%;">{{item.clnumber}}</td>
                  <td class="tableTd" style="width: 12%;">{{item.clname}}</td>
                  <td class="tableTd" style="width: 11%;">{{item.reason}}</td>
                  <td class="tableTd" style="width: 11%;">{{item.fanfa}}</td>
                  <td class="tableTd" style="width: 8%;">{{item.fpeople}}</td>
                  <td class="tableTd" style="width: 8%;">{{item.ftime}}</td>
                </tr>
                <tr>
                  <td colspan="9">
                    <img class="MarginR_10" v-for="(img, idx) in item.newpic" :key="idx" :src="imgPreUrl + img" style="margin-top: 10px;display:block;"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <section class="MarginT_20">
      <el-button type="primary" size="mini" @click="backShowTimeBox">已阅读</el-button>
      <!-- <el-button type="primary" size="mini" @click="print">打 印</el-button> -->
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'WarnPrint',
  props: ['warnsInfo'],
  data () {
    return {
      yjList: []
    }
  },
  computed: {
    ...mapState({
      imgPreUrl: state => state.imgPreUrl
    })
  },
  created () {
    this.yjList = this.warnsInfo.map(item => {
      if (item.newpic) {
        item.newpic = item.newpic.split(',')
      } else {
        item.newpic = []
      }
      return item
    })
  },
  watch: {
  },
  methods: {
    backShowTimeBox () {
      this.$emit('showTimeBox')
    },
    print () {
      var tableToPrint = document.getElementById('table') // 要打印的表格
      var newWin = window.open('') // 打开新的窗口
      newWin.document.write(tableToPrint.outerHTML) // 将表格添加进新的窗口
      newWin.document.close() // 在IE浏览器中必须加这一句
      newWin.focus() // 在IE浏览器中必须加这一句
      newWin.print() // 打印
      newWin.close() // 关闭窗口
    }
  }
}
</script>

<style lang="less" scoped>
.tableColumn{
  padding-bottom: 15px;
  line-height:23px;
  color:#909399;
  font-size:14px;
  border-bottom:1px solid #EBEEF5;
}
.tableTd{
  text-align: left;
}
</style>
