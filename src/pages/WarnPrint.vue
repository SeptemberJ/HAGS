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
                    <img class="MarginR_10" v-for="(img, idx) in item.imgList" :key="idx" :src="imgPreUrl + img" style="margin-top: 10px;display:block;"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <section class="Bts">
      <el-button type="" size="mini" @click="back">返 回</el-button>
      <el-button type="primary" size="mini" @click="print">打 印</el-button>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'WarnPrint',
  data () {
    return {
      yjList: []
    }
  },
  computed: {
    ...mapState({
      imgPreUrl: state => state.imgPreUrl,
      curFShortNumber: state => state.workOrderFshortnumber
    })
  },
  created () {
    this.getWarnList()
  },
  watch: {
    timestamp: function () {
      this.getWarnList()
    }
  },
  methods: {
    ...mapActions([
      'updateCurPage'
    ]),
    // 获取预警数据
    getWarnList () {
      this.Http.get('yujingList', {fshortnumber: this.curFShortNumber}
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.yjList = res.data.yujinglist.map(item => {
              if (item.imgList) {
                item.imgList = item.newpic.split(',')
              } else {
                item.imgList = []
              }
              return item
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
    },
    // 返回工单列表
    back () {
      this.updateCurPage('WorkOrder')
      this.$router.push({name: 'WorkOrder'})
    },
    // 打印
    print () {
      var tableToPrint = document.getElementById('table')
      var newWin = window.open('')
      newWin.document.write(tableToPrint.outerHTML)
      newWin.document.close()
      newWin.focus()
      newWin.print()
      newWin.close()
    }
  }
}
</script>

<style lang="less" scoped>
.WarnPrint{
  margin-top: .3rem;
  margin-bottom: .3rem;
}
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
.Bts{
  margin-top: .3rem;
}
</style>
