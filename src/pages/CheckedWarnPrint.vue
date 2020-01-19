<template>
  <div class="WarnPrint">
    <!--  style="page-break-before:always;display:block;" -->
    <table id="table" border="0" width="100%">
      <tbody>
        <tr v-for="(itemYJ, idxYj) in yjList" :key="idxYj">
          <td colspan="9">
            <table border="0" width="100%">
              <tbody>
                <tr height="30px" style="background:#ccc;">
                  <td class="tableTd" style="width: 10%;text-align: left;">订单号</td>
                  <td class="tableTd" style="width: 15%;text-align: left;">生产工单</td>
                  <td colspan="7" class="tableTd" style="text-align: left;">产品名称</td>
                </tr>
                <tr height="30px">
                  <td class="tableTd" style="width: 10%;text-align: left;">{{itemYJ.fbillno}}</td>
                  <td class="tableTd" style="width: 15%;text-align: left;">{{itemYJ.gdfbillno}}</td>
                  <td colspan="7" class="tableTd" style="text-align: left;">{{itemYJ.fname}}</td>
                </tr>
                <tr v-for="(item, idx) in itemYJ.yujinglist" :key="idx">
                  <td colspan="9">
                    <table border="0" width="100%">
                      <tbody>
                        <tr height="30px">
                          <td class="tableTd" style="width: 5%;text-align: left;">序号</td>
                          <td class="tableTd" style="width: 5%;text-align: left;">工序</td>
                          <td class="tableTd" style="width: 11%;text-align: left;">零件号</td>
                          <td class="tableTd" style="width: 11%;text-align: left;">零件号名称</td>
                          <td class="tableTd" style="width: 20%;text-align: left;">材料代码</td>
                          <td class="tableTd" style="width: 11%;text-align: left;">材料名称</td>
                          <td class="tableTd" style="width: 10%;text-align: left;">质量原因</td>
                          <td class="tableTd" style="width: 11%;text-align: left;">解决方案</td>
                          <td class="tableTd" style="width: 8%;text-align: left;">解决人</td>
                          <td class="tableTd" style="width: 8%;text-align: left;">解决时间</td>
                        </tr>
                        <tr height="30px">
                          <td class="tableTd" style="width: 5%;">{{idx + 1}}</td>
                          <td class="tableTd" style="width: 5%;">{{item.gongxu}}</td>
                          <td class="tableTd" style="width: 11%;">{{item.fnumber}}</td>
                          <td class="tableTd" style="width: 11%;">{{item.fname}}</td>
                          <td class="tableTd" style="width: 20%;">{{item.clnumber}}</td>
                          <td class="tableTd" style="width: 11%;">{{item.clname}}</td>
                          <td class="tableTd" style="width: 10%;">{{item.reason}}</td>
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
                <!-- <tr style="width:100%;height:2px;background:#ccc;margin-top: 20px;">
                  <td colspan="9"></td>
                </tr> -->
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
      userInfo: state => state.userInfo,
      checkedWarnPrint: state => state.checkedWarnPrint
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
      this.Http.post('yujingList3', {entrylist: this.checkedWarnPrint}
      ).then(res => {
        switch (res.data.code) {
          case 1:
            this.yjList = res.data.list.map(item => {
              item.yujinglist.map((itemInner, idxInner) => {
                if (itemInner.newpic) {
                  itemInner.imgList = itemInner.newpic.split(',')
                } else {
                  itemInner.imgList = []
                }
                return itemInner
              })
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
      this.updateCurPage('SalesReport')
      this.$router.push({name: 'SalesReport'})
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
