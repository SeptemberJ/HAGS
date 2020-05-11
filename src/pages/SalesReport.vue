<template>
  <div class="SalesReport">
    <!-- 查询 -->
    <section id="searchBlock" style="background: #fff;z-index: 999;">
    <!-- <section style="position: fixed;top:0.8rem;background: #fff;z-index: 999;"> -->
      <el-row style="margin-top:10px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="订单号" size="small">
            <el-input v-model="filterOrderNo" placeholder="请输入订单号" size="small" clearable style="width:90%;"></el-input>
          </el-form-item>
          <el-form-item label="美国下单时间" size="small">
            <el-date-picker clearable style="width: 120px;"
              v-model="filterUSATime"
              size="small"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="产品类别" size="small">
            <el-select v-model="filterProductionKind" size="small" placeholder="请选择产品类别">
              <el-option
                v-for="item in productionKindOptions"
                :key="item.ftype"
                :label="item.ftype"
                :value="item.ftype">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称" size="small">
            <el-input v-model="filterProductionName" placeholder="请输入产品名称" size="small" clearable style="width:90%;"></el-input>
          </el-form-item>
          <el-form-item label="焊接/喷塑/包装备料" size="small">
            <el-select v-model="filterbl" size="small" placeholder="请选择" style="width: 100px;">
              <el-option label="Yes" value="Yes"></el-option>
              <el-option label="No" value="No"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" size="small">
            <el-select v-model="filterStatus" size="small" placeholder="请选择状态" style="width: 80px;">
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="焊接/喷塑/包装内容" size="small">
            <el-input v-model="filterblnote" placeholder="请输入" size="small" clearable style="width:100px;"></el-input>
          </el-form-item>
          <el-form-item label="工单日期" size="small">
            <el-date-picker style="width: 230px;" @change="changeDate"
              v-model="filterfcheckdate"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" size="small">
            <el-checkbox v-model="filterisopen">是否展开</el-checkbox>
          </el-form-item>
          <el-form-item label="" size="small">
            <el-checkbox v-model="filterisrkwwc">入库未完成</el-checkbox>
          </el-form-item>
          <el-form-item label="" size="small">
            <el-checkbox v-model="filterisyj">质量预警</el-checkbox>
          </el-form-item>
          <el-form-item label="" size="small">
            <el-checkbox v-model="filterisdy">打印状态</el-checkbox>
          </el-form-item>
        </el-form>
        <div style="float:right;margin-top:-0.2rem;margin-bottom:0.1rem;">
          <el-button type="primary" size="small" @click="search">搜索</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button type="warning" size="small" @click="getHistorySales">历史纪录</el-button>
          <el-button type="success" size="small" @click="exportExcell">导出</el-button>
          <el-button type="danger" size="small" @click="checkedPrint">打印</el-button>
        </div>
      </el-row>
    </section>
    <!-- 无颜色 -->
    <el-table ref="configurationTable" class="salesReportTable" v-show="!backisopen" id="salesReportTable"
      :data="reportList"
      :height="tableHieght"
      border
      v-loading="listLoading"
      @select="selectSingle"
      @select-all="selectAll"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed
        label="#"
        width="70">
        <template slot-scope="scope">
          <el-radio v-model="filterGdfbillno" :label="scope.row.gdfbillno2" @change="changeRadio">{{scope.row.index + 1}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        prop="dynumber"
        label="打印次数"
        min-width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="gx"
        label="开机工序"
        min-width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="fbillno"
        label="订单号"
        width="110">
      </el-table-column>
      <el-table-column
        fixed
        prop="ftime"
        label="美国下单时间"
        width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="fname"
        label="产品名称"
        width="160">
      </el-table-column>
      <el-table-column
        fixed
        prop="ftype"
        label="产品类别"
        width="130">
      </el-table-column>
      <el-table-column
        fixed
        prop="fmodel"
        label="颜色"
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="fnumber"
        label="数量"
        width="70">
      </el-table-column>
      <el-table-column
        fixed
        prop="gdfbillno"
        label="生产工单号"
        width="130">
      </el-table-column>
      <el-table-column
        prop="fstatus"
        label="状态"
        width="80">
      </el-table-column>
      <el-table-column
        prop="FIN"
        label="入库状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fplanfinishdateTxt"
        label="交期"
        width="120">
      </el-table-column>
      <el-table-column
        label="初始预计完成日期"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.csyjtimeTxt, scope.row, '初始预计完成日期')">{{scope.row.csyjtimeTxt}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.csyjtimeTxt, scope.row, '初始预计完成日期')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="修改预计完成日期"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.xgyjtimeTxt, scope.row, '修改预计完成日期')">{{scope.row.xgyjtimeTxt}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.xgyjtimeTxt, scope.row, '修改预计完成日期')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="cknumber"
        label="出货数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cktime"
        label="实际完成日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fcheckdateTxt"
        label="工单日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fnote"
        label="备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="焊接备料"
        width="90">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.hjbeiliao, scope.row, '焊接备料', 'hjnote')">{{scope.row.hjbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.hjbeiliao, scope.row, '焊接备料', 'hjnote')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="hjnote"
        label="焊接备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="喷塑备料"
        width="90">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.psbeiliao, scope.row, '喷塑备料', 'psnote')">{{scope.row.psbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.psbeiliao, scope.row, '喷塑备料', 'psnote')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="psnote"
        label="喷塑备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="包装备料"
        width="90">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.bzbeiliao, scope.row, '包装备料', 'bznote')">{{scope.row.bzbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.bzbeiliao, scope.row, '包装备料', 'bznote')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="bznote"
        label="包装备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="外协"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.waixie, scope.row, '外协')">{{scope.row.waixie}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.waixie, scope.row, '外协')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="zhixiang"
        label="纸箱1"
        width="250">
      </el-table-column>
      <el-table-column
        prop="zhixiang2"
        label="纸箱2"
        width="250">
      </el-table-column>
      <el-table-column
        prop="tuopan"
        label="托盘"
        width="150">
      </el-table-column>
       <el-table-column
        label="工程变更"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.gcbiangeng, scope.row, '工程变更')">{{scope.row.gcbiangeng}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.gcbiangeng, scope.row, '工程变更')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="质检"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.zhijian, scope.row, '质检')">{{scope.row.zhijian}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.zhijian, scope.row, '质检')"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 有颜色 -->
    <el-table ref="configurationTable" :cell-class-name="cellStyle" class="salesReportTable" v-show="backisopen"
      :data="reportList"
      :height="tableHieght"
      border
      v-loading="listLoading"
      @select="selectSingle"
      @select-all="selectAll"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed
        label="#"
        width="70">
        <template slot-scope="scope">
          <el-radio v-model="filterGdfbillno" :label="scope.row.gdfbillno2" @change="changeRadio">{{scope.row.index + 1}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        prop="dynumber"
        label="打印次数"
        min-width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="gx"
        label="开机工序"
        min-width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="fbillno"
        label="订单号"
        width="110">
      </el-table-column>
      <el-table-column
        fixed
        prop="ftime"
        label="美国下单时间"
        width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="fname"
        label="产品名称"
        width="160">
      </el-table-column>
      <el-table-column
        fixed
        prop="ftype"
        label="产品类别"
        width="130">
      </el-table-column>
      <el-table-column
        fixed
        prop="fmodel"
        label="颜色"
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="fnumber"
        label="数量"
        width="70">
      </el-table-column>
      <el-table-column
        fixed
        prop="gdfbillno"
        label="生产工单号"
        width="130">
      </el-table-column>
      <el-table-column
        prop="fstatus"
        label="状态"
        width="80">
      </el-table-column>
      <el-table-column
        prop="FIN"
        label="入库状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fplanfinishdateTxt"
        label="交期"
        width="120">
      </el-table-column>
      <el-table-column
        label="初始预计完成日期"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.csyjtimeTxt, scope.row, '初始预计完成日期')">{{scope.row.csyjtimeTxt}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.csyjtimeTxt, scope.row, '初始预计完成日期')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="修改预计完成日期"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.xgyjtimeTxt, scope.row, '修改预计完成日期')">{{scope.row.xgyjtimeTxt}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.xgyjtimeTxt, scope.row, '修改预计完成日期')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="cknumber"
        label="出货数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cktime"
        label="实际完成日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fcheckdateTxt"
        label="工单日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fnote"
        label="备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="焊接备料"
        width="90">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.hjbeiliao, scope.row, '焊接备料', 'hjnote')">{{scope.row.hjbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.hjbeiliao, scope.row, '焊接备料', 'hjnote')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="hjnote"
        label="焊接备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="喷塑备料"
        width="90">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.psbeiliao, scope.row, '喷塑备料', 'psnote')">{{scope.row.psbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.psbeiliao, scope.row, '喷塑备料', 'psnote')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="psnote"
        label="喷塑备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="包装备料"
        width="90">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.bzbeiliao, scope.row, '包装备料', 'bznote')">{{scope.row.bzbeiliao}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.bzbeiliao, scope.row, '包装备料', 'bznote')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="bznote"
        label="包装备注"
        width="200">
      </el-table-column>
      <el-table-column
        label="外协"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.waixie, scope.row, '外协')">{{scope.row.waixie}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.waixie, scope.row, '外协')"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="zhixiang"
        label="纸箱1"
        width="250">
      </el-table-column>
      <el-table-column
        prop="zhixiang2"
        label="纸箱2"
        width="250">
      </el-table-column>
      <el-table-column
        prop="tuopan"
        label="托盘"
        width="150">
      </el-table-column>
       <el-table-column
        label="工程变更"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.gcbiangeng, scope.row, '工程变更')">{{scope.row.gcbiangeng}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.gcbiangeng, scope.row, '工程变更')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="质检"
        width="150">
        <template slot-scope="scope">
          <span class="CursorPointer" @click="edit(scope.row.zhijian, scope.row, '质检')">{{scope.row.zhijian}}</span>
          <i class="el-icon-edit CursorPointer" @click="edit(scope.row.zhijian, scope.row, '质检')"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="激光" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '激光')" class="templateSpan">{{scope.row.jgcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="折弯" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '折弯')" class="templateSpan">{{scope.row.zwcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="CNC" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, 'CNC')" class="templateSpan">{{scope.row.cnccolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="切管" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '切管')" class="templateSpan">{{scope.row.qgcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="焊接" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '焊接')" class="templateSpan">{{scope.row.hjcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="抛丸" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '抛丸')" class="templateSpan">{{scope.row.pwcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="喷涂" header-align="right"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '喷涂')" class="templateSpan">{{scope.row.ptcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="right"
        label="包装"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '包装')" class="templateSpan">{{scope.row.bzcolor}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="reportList.length > 0" style="margin: .2rem 0;"
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
    <!-- edit -->
    <el-dialog title="编辑" :visible.sync="dialogEditVisible" :close-on-click-modal="false" width="500px">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item v-if="editType == '初始预计完成日期'" label="初始预计完成日期" prop="editNewData" label-width="150px">
          <el-date-picker style="width: 200px;"
            v-model="editForm.editNewData"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="editType == '修改预计完成日期'" label="修改预计完成日期" prop="editNewData" label-width="150px">
          <el-date-picker style="width: 200px;"
            v-model="editForm.editNewData"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="editType == '焊接备料'" label="焊接备料" prop="editNewData">
          <el-select v-model="editForm.editNewData" size="small" placeholder="请选择" style="width: 300px;">
            <el-option label="Yes" value="Yes"></el-option>
            <el-option label="No" value="No"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="editType == '喷塑备料'" label="喷塑备料" prop="editNewData">
          <el-select v-model="editForm.editNewData" size="small" placeholder="请选择" style="width: 300px;">
            <el-option label="Yes" value="Yes"></el-option>
            <el-option label="No" value="No"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="editType == '包装备料'" label="包装备料" prop="editNewData">
          <el-select v-model="editForm.editNewData" size="small" placeholder="请选择" style="width: 300px;">
            <el-option label="Yes" value="Yes"></el-option>
            <el-option label="No" value="No"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="editType == '外协'" label="外协" prop="editNewData">
          <el-input style="width: 300px" placeholder="请输入" v-model="editForm.editNewData"></el-input>
        </el-form-item>
        <el-form-item v-if="editType == '纸箱'" label="纸箱">
          <el-input style="width: 300px" placeholder="请输入" v-model="editForm.editNewData"></el-input>
        </el-form-item>
        <el-form-item v-if="editType == '托盘'" label="托盘" prop="editNewData">
          <el-input style="width: 300px" placeholder="请输入" v-model="editForm.editNewData"></el-input>
        </el-form-item>
        <el-form-item v-if="editType == '工程变更'" label="工程变更" prop="editNewData">
          <el-input style="width: 300px" placeholder="请输入" v-model="editForm.editNewData"></el-input>
        </el-form-item>
        <el-form-item v-if="editType == '质检'" label="质检" prop="editNewData">
          <el-input style="width: 300px" placeholder="请输入" v-model="editForm.editNewData"></el-input>
        </el-form-item>
        <el-form-item v-if="editType == '焊接备料' || editType == '喷塑备料' || editType == '包装备料'" label="备注" prop="editNewData">
          <el-input v-if="editForm.editNewData == 'No'" type="textarea" :rows="5" style="width: 300px" placeholder="请输入备注" v-model="editForm.editNote"></el-input>
          <el-select v-if="editForm.editNewData == 'Yes'" v-model="editForm.editNote" size="small" placeholder="请选择" style="width: 300px;">
            <el-option label="配齐已发" value="配齐已发"></el-option>
            <el-option label="配齐未发" value="配齐未发"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btLoading" @click="save('editForm')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 历史纪录 -->
    <el-dialog title="历史纪录" :visible.sync="dialogHistoryVisible" :close-on-click-modal="true" width="90%">
      <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="工单号" size="small">
              <el-input v-model="filterGdfbillno" placeholder="请输入订单号" size="small" clearable style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px;">
              <el-button type="primary" icon="el-icon-search" size="small" @click="searchHistory">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
          height="400"
          :data="historyList"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="gdfbillno"
            label="工单号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="csyjtimeTxt"
            label="初始预计完成日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="xgyjtimeTxt"
            label="修改预计完成日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="hjbeiliao"
            label="焊接备料"
            width="100">
          </el-table-column>
          <el-table-column
            prop="hjnote"
            label="焊接备注"
            width="200">
          </el-table-column>
          <el-table-column
            prop="psbeiliao"
            label="喷塑备料"
            width="100">
          </el-table-column>
          <el-table-column
            prop="psnote"
            label="喷塑备注"
            width="200">
          </el-table-column>
          <el-table-column
            prop="bzbeiliao"
            label="包装备料"
            width="100">
          </el-table-column>
          <el-table-column
            prop="bznote"
            label="包装备注"
            width="200">
          </el-table-column>
          <el-table-column
            prop="waixie"
            label="外协"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zhijian"
            label="质检"
            width="100">
          </el-table-column>
          <el-table-column
            prop="gcbiangeng"
            label="工程变更"
            width="100">
          </el-table-column>
        </el-table>
        <el-pagination v-if="historyList.length > 0" style="margin: .2rem 0;"
          @current-change="getHistorySales"
          :current-page.sync="curPageH"
          :page-size="pageSizeH"
          layout="total, prev, pager, next, jumper"
          :total="sumH">
        </el-pagination>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHistoryVisible = false">关 闭</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {secondToFormat, objDeepCopy} from '../util/utils'
export default {
  name: 'SalesReport',
  data () {
    return {
      timer: '',
      value1: '',
      listLoading: false,
      btLoading: false,
      dialogEditVisible: false,
      dialogHistoryVisible: false,
      backisopen: false,
      tableHieght: 300,
      // filterpsbl: '',
      // filterbzbl: '',
      reportList: [],
      columnIndex: [{idx: 31, pro: 'jgcolor'}, {idx: 32, pro: 'zwcolor'}, {idx: 33, pro: 'cnccolor'}, {idx: 34, pro: 'qgcolor'}, {idx: 35, pro: 'hjcolor'}, {idx: 36, pro: 'pwcolor'}, {idx: 37, pro: 'ptcolor'}, {idx: 38, pro: 'bzcolor'}],
      curPage: 1,
      pageSize: 10,
      sum: 0,
      editType: '',
      editForm: {
        editNewData: '',
        editNote: ''
      },
      rules: {
        editNewData: [
          { required: true, message: '请将信息填写完整', trigger: 'blur' }
        ],
        editNote: [
          { required: true, message: '请将信息填写完整', trigger: 'blur' }
        ]
      },
      curgdfbillno: '',
      curentryid: '',
      selectedAllList: [],
      selectedUniqueSignList: [],
      productionKindOptions: [],
      statusOptions: ['结案', '确认', '下达', '计划'],
      filterGdfbillno: '',
      historyList: [],
      curPageH: 1,
      pageSizeH: 10,
      sumH: 0
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    filterOrderNo: {
      get: function () {
        return this.$store.state.SR_filterOrderNo
      },
      set: function (newValue) {
        this.$store.state.SR_filterOrderNo = newValue
      }
    },
    filterUSATime: {
      get: function () {
        return this.$store.state.SR_filterUSATime
      },
      set: function (newValue) {
        this.$store.state.SR_filterUSATime = newValue
      }
    },
    filterProductionKind: {
      get: function () {
        return this.$store.state.SR_filterProductionKind
      },
      set: function (newValue) {
        this.$store.state.SR_filterProductionKind = newValue
      }
    },
    filterProductionName: {
      get: function () {
        return this.$store.state.SR_filterProductionName
      },
      set: function (newValue) {
        this.$store.state.SR_filterProductionName = newValue
      }
    },
    filterStatus: {
      get: function () {
        return this.$store.state.SR_filterStatus
      },
      set: function (newValue) {
        this.$store.state.SR_filterStatus = newValue
      }
    },
    filterbl: {
      get: function () {
        return this.$store.state.SR_filterbl
      },
      set: function (newValue) {
        this.$store.state.SR_filterbl = newValue
      }
    },
    filterblnote: {
      get: function () {
        return this.$store.state.SR_filterblnote
      },
      set: function (newValue) {
        this.$store.state.SR_filterblnote = newValue
      }
    },
    filterfcheckdate: {
      get: function () {
        return this.$store.state.SR_fcheckdate
      },
      set: function (newValue) {
        this.$store.state.SR_fcheckdate = newValue
      }
    },
    filterisopen: {
      get: function () {
        return this.$store.state.SR_filterisopen
      },
      set: function (newValue) {
        this.$store.state.SR_filterisopen = newValue
      }
    },
    filterisrkwwc: {
      get: function () {
        return this.$store.state.SR_filterisrkwwc
      },
      set: function (newValue) {
        this.$store.state.SR_filterisrkwwc = newValue
      }
    },
    filterisyj: {
      get: function () {
        return this.$store.state.SR_filterisyj
      },
      set: function (newValue) {
        this.$store.state.SR_filterisyj = newValue
      }
    },
    filterisdy: {
      get: function () {
        return this.$store.state.SR_filterisdy
      },
      set: function (newValue) {
        this.$store.state.SR_filterisdy = newValue
      }
    }
  },
  created () {
    setTimeout(() => {
      let height = document.documentElement.clientHeight
      let tableHeight = height - 80 - document.getElementById('searchBlock').offsetHeight - 50
      this.tableHieght = tableHeight
    }, 0)
    this.search()
    this.getKindOptions()
  },
  mounted () {
    // 创建并执行定时器
    this.timer = setInterval(() => {
      this.handleCurrentChange()
    }, 5 * 60 * 1000)
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
  },
  methods: {
    ...mapActions([
      'updateCurSalesGX',
      'updateCurFbillno',
      'updateLjgzOption',
      'updateCurPage',
      'updateBeforePage',
      'updateCheckedWarnPrint'
    ]),
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      let curColumn = (this.columnIndex.filter((item) => { return item.idx === columnIndex }))[0]
      if (curColumn) {
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
    },
    changeDate (value) {
      if (!value) {
        this.filterfcheckdate = ['', '']
      }
    },
    search () {
      this.curPage = 1
      this.handleCurrentChange()
      // this.getSalesReportList()
    },
    reset () {
      this.filterOrderNo = ''
      this.filterUSATime = ''
      this.filterProductionKind = ''
      this.filterProductionName = ''
      this.filterStatus = ''
      this.filterbl = ''
      this.filterblnote = ''
      this.curPage = 1
      this.filterfcheckdate = ['', '']
      this.selectedAllList = []
      this.selectedUniqueSignList = []
      this.handleCurrentChange()
      // this.getSalesReportList()
    },
    // 复选
    selectAll (selection) {
      if (selection.length === 0) { // 本页全部取消勾选
        this.reportList.map(order => {
          this.selectSingle([], order)
        })
      } else { // 本页全部加入勾选
        this.reportList.map(order => {
          if (!order.checked) {
            this.selectSingle([], order)
          }
        })
      }
    },
    // 单独勾选切换
    selectSingle (selection, row) {
      // console.log('selectSingle', row)
      if (row.checked) { // 取消勾选
        let temp = objDeepCopy(this.selectedAllList)
        temp.map((item, idx) => {
          if (item.gdfbillno === row.gdfbillno) {
            this.reportList[row.idx].checked = false
            this.selectedAllList.splice(idx, 1)
            let index = this.selectedUniqueSignList.indexOf(row.gdfbillno)
            if (index > -1) {
              this.selectedUniqueSignList.splice(index, 1)
            }
          }
        })
      } else { // 加入勾选
        // 再次检查重复
        let index = this.selectedUniqueSignList.indexOf(row.gdfbillno)
        if (index === -1) {
          row.checked = true
          this.selectedUniqueSignList.push(row.gdfbillno)
          this.selectedAllList.push(row)
        }
      }
    },
    async handleCurrentChange () {
      let curList = await this.getSalesReportList()
      if (this.selectedAllList.length > 0) {
        this.selectedAllList.map((itemS) => {
          curList.map((item, idx) => {
            if (item.gdfbillno === itemS.gdfbillno) {
              this.$refs.configurationTable.toggleRowSelection(curList[idx], true)
              this.reportList[idx].checked = true
            }
          })
        })
      }
    },
    checkedPrint () {
      // console.log(this.selectedAllList)
      if (this.selectedAllList.length === 0) {
        this.$message({
          message: '请先选择需要打印的订单!',
          type: 'warning'
        })
        return false
      }
      this.updateCheckedWarnPrint(this.selectedAllList)
      this.updateCurPage('CheckedWarnPrint')
      this.$router.push({name: 'CheckedWarnPrint'})
    },
    // 单选
    changeRadio (gdh) {
      this.filterGdfbillno = gdh
    },
    searchHistory () {
      this.curPageH = 1
      this.getHistorySales()
    },
    // 历史纪录
    getHistorySales () {
      this.dialogHistoryVisible = true
      this.Http.get('oldlist', {number: this.pageSizeH, page_num: this.curPageH, gdfbillno: this.filterGdfbillno}
      ).then(res => {
        switch (res.data.code) {
          case '1':
            this.historyList = res.data.list.map(item => {
              item.csyjtimeTxt = item.csyjtime ? secondToFormat(item.csyjtime.time) : ''
              item.xgyjtimeTxt = item.xgyjtime ? secondToFormat(item.xgyjtime.time) : ''
              // item.hjbeiliao = item.hjbeiliao ? item.hjbeiliao : ''
              // item.psbeiliao = item.psbeiliao ? item.psbeiliao : ''
              // item.bzbeiliao = item.bzbeiliao ? item.bzbeiliao : ''
              // item.waixie = item.waixie ? item.waixie : ''
              // item.zhijian = item.zhijian ? item.zhijian : ''
              // item.gcbiangeng = item.gcbiangeng ? item.gcbiangeng : ''
              return item
            })
            this.sumH = res.data.count
            break
          default:
            this.$message({
              message: 'Interface error !',
              type: 'warning'
            })
            this.reportList = []
            this.sum = 0
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '服务器繁忙!',
          type: 'error'
        })
      })
    },
    // 导出
    async exportExcell () {
      let exportData = await this.getExportData()
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../vendor/Export2Excel.js')
        const tHeader = ['打印次数', '订单号', '美国下单时间', '产品名称', '产品类别', '颜色', '数量', '生产工单号', '状态', '入库状态', '交期', '初始预计完成日期', '修改预计完成日期', '工单日期', '出货数量', '实际完成日期', '备注', '焊接备料', '焊接备注', '喷塑备料', '喷塑备注', '包装备料', '包装备注', '外协', '纸箱1', '纸箱2', '托盘', '工程变更', '质检', '激光', '折弯', 'CNC', '切管', '焊接', '抛丸', '喷涂', '包装']
        const filterVal = ['dynumber', 'fbillno', 'ftime', 'fname', 'ftype', 'fmodel', 'fnumber', 'gdfbillno', 'fstatus', 'FIN', 'fplanfinishdateTxt', 'csyjtimeTxt', 'xgyjtimeTxt', 'fcheckdateTxt', 'cknumber', 'cktime', 'fnote', 'hjbeiliao', 'hjnote', 'psbeiliao', 'psnote', 'bzbeiliao', 'bznote', 'waixie', 'zhixiang', 'zhixiang2', 'tuopan', 'gcbiangeng', 'zhijian', 'jgcolorTxt', 'zwcolorTxt', 'cnccolorTxt', 'qgcolorTxt', 'hjcolorTxt', 'pwcolorTxt', 'ptcolorTxt', 'bzcolorTxt']
        const data = this.formatJson(filterVal, exportData)
        exportJsonToExcel(tHeader, data, '订单看板导出')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 获取导出数据
    getExportData () {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.Http.post('exportbaobiaolist', {isdy: this.filterisdy ? 1 : 0, isyj: this.filterisyj, isopen: this.filterisopen ? 1 : 0, isrkwwc: this.filterisrkwwc ? 1 : 0, fbillno: this.filterOrderNo, ftime: this.filterUSATime, ftype: this.filterProductionKind, fname: this.filterProductionName, fstatus: this.filterStatus, beiliao: this.filterbl, beiliaonote: this.filterblnote, fcheckdate1: this.filterfcheckdate[0], fcheckdate2: this.filterfcheckdate[1]}
        ).then(res => {
          switch (res.data.code) {
            case '1':
              // 1显示√  2显示○ 3显示×
              let tmp = res.data.list.map(item => {
                item.fplanfinishdateTxt = secondToFormat(item.fplanfinishdate.time)
                item.csyjtimeTxt = item.csyjtime ? secondToFormat(item.csyjtime.time) : ''
                item.xgyjtimeTxt = item.xgyjtime ? secondToFormat(item.xgyjtime.time) : ''
                item.fcheckdateTxt = item.fcheckdate ? secondToFormat(item.fcheckdate.time) : ''
                item.jgcolorTxt = item.jgcolor === 1 ? '√' : (item.jgcolor === 2 ? '○' : (item.jgcolor === 3 ? '×' : ''))
                item.zwcolorTxt = item.zwcolor === 1 ? '√' : (item.zwcolor === 2 ? '○' : (item.zwcolor === 3 ? '×' : ''))
                item.cnccolorTxt = item.cnccolor === 1 ? '√' : (item.cnccolor === 2 ? '○' : (item.cnccolor === 3 ? '×' : ''))
                item.qgcolorTxt = item.qgcolor === 1 ? '√' : (item.qgcolor === 2 ? '○' : (item.qgcolor === 3 ? '×' : ''))
                item.hjcolorTxt = item.hjcolor === 1 ? '√' : (item.hjcolor === 2 ? '○' : (item.hjcolor === 3 ? '×' : ''))
                item.pwcolorTxt = item.pwcolor === 1 ? '√' : (item.pwcolor === 2 ? '○' : (item.pwcolor === 3 ? '×' : ''))
                item.ptcolorTxt = item.ptcolor === 1 ? '√' : (item.ptcolor === 2 ? '○' : (item.ptcolor === 3 ? '×' : ''))
                item.bzcolorTxt = item.bzcolor === 1 ? '√' : (item.bzcolor === 2 ? '○' : (item.bzcolor === 3 ? '×' : ''))
                return item
              })
              resolve(tmp)
              this.listLoading = false
              break
            default:
              this.$message({
                message: 'Interface error !',
                type: 'warning'
              })
              resolve([])
              this.listLoading = false
          }
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '服务器繁忙!',
            type: 'error'
          })
        })
      })
    },
    getSalesReportList () {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.Http.post('baobiaolist', {isdy: this.filterisdy ? 1 : 0, isyj: this.filterisyj ? 1 : 0, isopen: this.filterisopen ? 1 : 0, isrkwwc: this.filterisrkwwc ? 1 : 0, number: this.pageSize, page_num: this.curPage, fbillno: this.filterOrderNo, ftime: this.filterUSATime, ftype: this.filterProductionKind, fname: this.filterProductionName, fstatus: this.filterStatus, beiliao: this.filterbl, beiliaonote: this.filterblnote, fcheckdate1: this.filterfcheckdate[0], fcheckdate2: this.filterfcheckdate[1]}
        ).then(res => {
          switch (res.data.code) {
            case '1':
              this.backisopen = (res.data.isopen === '1')
              document.getElementsByClassName('el-table__fixed')[0].style.setProperty('height', this.tableHieght - 20 + 'px', 'important')
              this.reportList = res.data.list.map((item, idx) => {
                item.index = idx
                item.fplanfinishdateTxt = secondToFormat(item.fplanfinishdate.time)
                item.csyjtimeTxt = item.csyjtime ? secondToFormat(item.csyjtime.time) : ''
                item.xgyjtimeTxt = item.xgyjtime ? secondToFormat(item.xgyjtime.time) : ''
                item.fcheckdateTxt = item.fcheckdate ? secondToFormat(item.fcheckdate.time) : ''
                item.hjbeiliao = item.hjbeiliao
                item.psbeiliao = item.psbeiliao ? item.psbeiliao : ''
                item.bzbeiliao = item.bzbeiliao ? item.bzbeiliao : ''
                item.waixie = item.waixie ? item.waixie : ''
                item.zhijian = item.zhijian ? item.zhijian : ''
                item.tuopan = item.tuopan ? item.tuopan : ''
                item.gcbiangeng = item.gcbiangeng ? item.gcbiangeng : ''
                item.idx = idx
                item.checked = false
                return item
              })
              resolve(res.data.list)
              this.sum = res.data.count
              this.listLoading = false
              this.$refs.configurationTable.$el.style.width = '102%'
              break
            default:
              this.$message({
                message: 'Interface error !',
                type: 'warning'
              })
              this.reportList = []
              resolve([])
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
      })
    },
    edit (oldData, row, type, notePro) {
      switch (this.userInfo.gongxu) {
        case '仓库':
          if (type === '焊接备料' || type === '喷塑备料' || type === '包装备料') {
            this.editType = type
            this.editForm.editNewData = oldData
            this.editForm.editNote = notePro ? row[notePro] : ''
            this.curgdfbillno = row.gdfbillno
            this.curentryid = row.entryid
            this.dialogEditVisible = true
          } else {
            this.$message({
              message: '对不起，您没有修改的权限!',
              type: 'warning'
            })
          }
          break
        case '计划':
          if (type === '初始预计完成日期' || type === '修改预计完成日期') {
            this.editType = type
            this.editForm.editNewData = oldData
            this.editForm.editNote = notePro ? row[notePro] : ''
            this.curgdfbillno = row.gdfbillno
            this.curentryid = row.entryid
            this.dialogEditVisible = true
          } else {
            this.$message({
              message: '对不起，您没有修改的权限!',
              type: 'warning'
            })
          }
          break
        default:
          this.$message({
            message: '对不起，您没有修改的权限!',
            type: 'warning'
          })
      }
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let query = {gdfbillno: this.curgdfbillno, entryid: this.curentryid}
          switch (this.editType) {
            case '初始预计完成日期':
              query.csyjtime = this.editForm.editNewData
              break
            case '修改预计完成日期':
              query.xgyjtime = this.editForm.editNewData
              break
            case '焊接备料':
              query.hjbeiliao = this.editForm.editNewData
              query.hjnote = this.editForm.editNote
              break
            case '喷塑备料':
              query.psbeiliao = this.editForm.editNewData
              query.psnote = this.editForm.editNote
              break
            case '包装备料':
              query.bzbeiliao = this.editForm.editNewData
              query.bznote = this.editForm.editNote
              break
            case '外协':
              query.waixie = this.editForm.editNewData
              break
            case '纸箱':
              query.zhixiang = this.editForm.editNewData
              break
            case '托盘':
              query.tuopan = this.editForm.editNewData
              break
            case '工程变更':
              query.gcbiangeng = this.editForm.editNewData
              break
            case '质检':
              query.zhijian = this.editForm.editNewData
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
                this.handleCurrentChange()
                // this.getSalesReportList()
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
            this.btLoading = false
            this.$message({
              message: '服务器繁忙!',
              type: 'error'
            })
          })
        } else {
          this.$message({
            message: '请将信息填写完整!',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 跳转零件管制
    goLjgz (row, type) {
      // if (type !== this.userInfo.gongxu) {
      //   this.$message({
      //     message: '对不起，您没有操作此道工序的权限!',
      //     type: 'warning'
      //   })
      //   return false
      // }
      this.updateCurSalesGX(type)
      this.updateCurFbillno(row.gdfbillno2)
      this.updateLjgzOption({fshortnumber: row.fshortnumber, fqty: row.fnumber, fbillno: row.gdfbillno2})
      this.updateBeforePage('SalesReport')
      this.updateCurPage('Ljgz')
      this.$router.push({name: 'Ljgz'})
    },
    getKindOptions () {
      this.Http.get('sertype'
      ).then(res => {
        this.productionKindOptions = res.data.list
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
<style lang="less">
.salesReportTable thead th{
  background: #ddd;
}
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
