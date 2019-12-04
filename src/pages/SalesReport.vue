<template>
  <div class="SalesReport">
    <!-- 查询 -->
    <section id="searchBlock" style="height: 110px;background: #fff;z-index: 999;">
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
            <el-form-item label="状态" size="small">
              <el-select v-model="filterStatus" size="small" placeholder="请选择状态" style="width: 100px;">
                <el-option
                  v-for="item in statusOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="焊接/喷塑/包装备料" size="small">
              <el-select v-model="filterbl" size="small" placeholder="请选择" style="width: 100px;">
                <el-option label="Yes" value="Yes"></el-option>
                <el-option label="No" value="No"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="焊接/喷塑/包装内容" size="small">
              <el-input v-model="filterblnote" placeholder="请输入" size="small" clearable style="width:90%;"></el-input>
            </el-form-item>
            <el-form-item label="" size="small">
              <el-checkbox v-model="filterisopen">是否展开</el-checkbox>
            </el-form-item>
            <!-- <el-form-item label="喷塑备料">
              <el-select v-model="filterpsbl" size="small" placeholder="请选择" style="width: 100px;">
                <el-option label="Yes" value="Yes"></el-option>
                <el-option label="No" value="No"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="包装备料">
              <el-select v-model="filterbzbl" size="small" placeholder="请选择" style="width: 100px;">
                <el-option label="Yes" value="Yes"></el-option>
                <el-option label="No" value="No"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item style="margin-top: -4px;">
              <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
              <el-button icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
            </el-form-item>
              <el-button type="warning" size="small" @click="getHistorySales">历史纪录</el-button>
            <el-form-item>
            </el-form-item>
        </el-form>
      </el-row>
    </section>
    <!-- 无颜色 -->
    <el-table class="salesReportTable" v-show="!backisopen" id="salesReportTable"
      :data="reportList"
      :height="tableHieght"
      border
      v-loading="listLoading"
      style="width: 100%;">
      <!-- <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column> -->
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
        prop="fbillno"
        label="订单号"
        width="120">
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
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="fmodel"
        label="颜色"
        width="110">
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
        width="140">
      </el-table-column>
      <el-table-column
        prop="fstatus"
        label="状态"
        width="80">
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
    <el-table :cell-class-name="cellStyle" class="salesReportTable" v-show="backisopen"
      :data="reportList"
      :height="tableHieght"
      border
      v-loading="listLoading"
      style="width: 100%;">
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
        prop="fbillno"
        label="订单号1"
        width="120">
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
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="fmodel"
        label="颜色"
        width="110">
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
        width="140">
      </el-table-column>
      <el-table-column
        prop="fstatus"
        label="状态"
        width="80">
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
        label="激光"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '激光')" class="templateSpan">{{scope.row.jgcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="折弯"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '折弯')" class="templateSpan">{{scope.row.zwcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="CNC"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, 'CNC')" class="templateSpan">{{scope.row.cnccolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="切管"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '切管')" class="templateSpan">{{scope.row.qgcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="焊接"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '焊接')" class="templateSpan">{{scope.row.hjcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="抛丸"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '抛丸')" class="templateSpan">{{scope.row.pwcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="喷涂"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="goLjgz(scope.row, '喷涂')" class="templateSpan">{{scope.row.ptcolor}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="包装"
        width="60"
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
import {secondToFormat} from '../util/utils'
export default {
  name: 'SalesReport',
  data () {
    return {
      listLoading: false,
      btLoading: false,
      dialogEditVisible: false,
      dialogHistoryVisible: false,
      backisopen: false,
      tableHieght: 300,
      // filterpsbl: '',
      // filterbzbl: '',
      reportList: [],
      columnIndex: [{idx: 27, pro: 'jgcolor'}, {idx: 28, pro: 'zwcolor'}, {idx: 29, pro: 'cnccolor'}, {idx: 30, pro: 'qgcolor'}, {idx: 31, pro: 'hjcolor'}, {idx: 32, pro: 'pwcolor'}, {idx: 33, pro: 'ptcolor'}, {idx: 34, pro: 'bzcolor'}],
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
    filterisopen: {
      get: function () {
        return this.$store.state.SR_filterisopen
      },
      set: function (newValue) {
        this.$store.state.SR_filterisopen = newValue
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
  methods: {
    ...mapActions([
      'updateCurSalesGX',
      'updateCurFbillno',
      'updateLjgzOption',
      'updateCurPage',
      'updateBeforePage'
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
    search () {
      this.curPage = 1
      this.getSalesReportList()
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
      this.getSalesReportList()
    },
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
    getSalesReportList () {
      this.listLoading = true
      this.Http.post('baobiaolist', {isopen: this.filterisopen ? 1 : 0, number: this.pageSize, page_num: this.curPage, fbillno: this.filterOrderNo, ftime: this.filterUSATime, ftype: this.filterProductionKind, fname: this.filterProductionName, fstatus: this.filterStatus, beiliao: this.filterbl, beiliaonote: this.filterblnote}
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
              item.hjbeiliao = item.hjbeiliao
              item.psbeiliao = item.psbeiliao ? item.psbeiliao : ''
              item.bzbeiliao = item.bzbeiliao ? item.bzbeiliao : ''
              item.waixie = item.waixie ? item.waixie : ''
              item.zhijian = item.zhijian ? item.zhijian : ''
              item.tuopan = item.tuopan ? item.tuopan : ''
              item.gcbiangeng = item.gcbiangeng ? item.gcbiangeng : ''
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
.el-table__fixed-right{}
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
