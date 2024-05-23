<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div class="app-list-control app-row" ref="appRowHeight">
      <div class="flex">
        <el-input
          v-model="listQuery.roleName"
          placeholder="角色名称"
          clearable
          class="input-normal"
          @keyup.native.enter="search"
        />
        <el-button type="primary" plain icon="el-icon-search" @click="search"
          >搜索</el-button
        >
      </div>
      <div class="right">
        <el-button
          v-if="pageOper.TJ"
          type="primary"
          icon="el-icon-plus"
          @click="edit(null)"
          >添加</el-button
        >
        <el-button
          v-if="pageOper.SC"
          type="danger"
          icon="el-icon-delete"
          @click="remove(null)"
          >删除</el-button
        >
      </div>
    </div>
    <!-- 表格工具栏 -->
    <div class="toolsRight">
      <div v-show="menuShow" @click="screening" class="checkBox">
        <el-checkbox-group
          v-model="header"
          @change="handleCheck($event)"
          size="mini"
        >
          <el-checkbox
            v-for="(item, index) in checked"
            :key="index"
            :label="item.key"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button icon="el-icon-printer" @click="printTable">打印</el-button>
      <el-button
        icon="el-icon-download"
        style="margin-right: 4px"
        @click="exportTable"
        >导出</el-button
      >
      <el-button icon="el-icon-menu" @click="screening">筛选列</el-button>
    </div>
    <!-- 表格栏 -->
    <div id="print">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        border
        @selection-change="handleSelectionChange"
        @row-click="handleClick($event)"
        :height="screenHeight"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column
          type="index"
          :index="indexMethod"
          align="center"
          width="50"
          label="序号"
        ></el-table-column>
        <!-- 渲染数据 -->
        <el-table-column
          v-for="(item, index) in key"
          :key="index"
          :prop="item.val"
          :align="item.align || 'left'"
          :min-width="item.minWidth || ''"
          :width="item.width || ''"
          :show-overflow-tooltip="true"
          :label="item.key"
          sortable
        />
        <!-- <el-table-column prop="roleName" label="角色名称" sortable />
      <el-table-column prop="description" label="角色说明" sortable />
      <el-table-column type="datetime" prop="addTime" label="添加时间" /> -->
        <el-table-column
          label="操作"
          align="center"
          width="120"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <el-button
              v-if="pageOper.XG"
              type="primary"
              size="mini"
              circle
              title="编辑"
              icon="el-icon-edit"
              @click="edit(scope.$index)"
            />
            <el-button
              v-if="pageOper.XG"
              type="warning"
              size="mini"
              circle
              title="授权"
              icon="el-icon-s-operation"
              @click="drawer(scope.row)"
            />
            <el-button
              v-if="pageOper.SC"
              type="danger"
              size="mini"
              circle
              title="删除"
              icon="el-icon-delete"
              @click="remove(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页栏 -->
    <div class="app-pager">
      <el-pagination
        background
        :current-page="listQuery.pageIndex"
        :page-sizes="[10, 20, 50, 100, 1000, 10000]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        :pager-count="5"
        @size-change="pagerSizeChange"
        @current-change="pagerCurrentChange"
      />
    </div>
    <edit v-if="editShow" :id="editId" :title="titleName" @close="editColse" />
    <drawer
      v-if="drawerShow"
      :id="drawerId"
      :title="titleName"
      @close="drawerColse"
    />
  </div>
</template>

<script>
import { list, remove } from "../../../api/role";
import edit from "./roleLeftEdit.vue";
import drawer from "./roleLeftDrawer.vue";
import { Message } from "element-ui";
// 导出
import excel from "@/utils/excel";
//打印
import printJS from "print-js";
// import { Message } from 'element-ui'
// import excel from '../../../utils/excel'
// import Pagination from '../../../components/Pagination'
// import Upload from '../../../components/Upload'

export default {
  name: "Table",
  components: { edit, drawer },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      // 数据列表加载动画
      loading: true,
      editShow: false,
      editId: null,
      menuShow: false,
      drawerShow: false,
      drawerId: null,
      // 新增/修改 标题
      titleName: null,
      // 显示的列
      header: ["角色名称", "角色说明", "添加时间"],
      // 筛选列
      checked: [
        { key: "角色名称", val: "roleName" },
        { key: "角色说明", val: "description" },
        { key: "添加时间", val: "addTime", align: "center" },
      ],
      // 展示列表
      key: [],
      // 查询列表参数对象
      listQuery: {
        roleName: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      screenHeight: null,
    };
  },
  mounted() {
    // 深拷贝
    this.key = JSON.parse(JSON.stringify(this.checked));
    this.getMainData();
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.screenHeight = window.innerHeight;
      const h = this.$refs.appRowHeight.offsetHeight;
      this.screenHeight = this.screenHeight - h - 208;
    },
    /**
     * 把选择展示数据的名称存入key
     */
    handleCheck(event) {
      this.key = [];
      this.checked.forEach((item) => {
        event.forEach((val) => {
          if (item.key === val) {
            this.key.push(item);
          }
        });
      });
    },
    /**
     * 打开和关闭筛选列
     */
    screening() {
      this.menuShow = !this.menuShow;
    },
    meneSelect() {
      this.menuShow = true;
    },
    /**
     * 导出数据--excle格式
     */
    exportTable() {
      let dataList = [];
      let listQuery = JSON.parse(JSON.stringify(this.listQuery));
      listQuery.pageSize = this.total;
      let key = [];
      this.key.forEach((item) => {
        key.push(item.val);
      });
      list(listQuery).then((res) => {
        dataList = res.records;
        console.log(dataList);
        if (this.tableData.length) {
          const name = "角色管理_" + new Date().getTime();
          const params = {
            header: this.header,
            key: key,
            data: dataList,
            autoWidth: true,
            fileName: name,
            bookType: "xlsx", // 支持  xlsx，csv，txt
          };
          excel.exportDataToExcel(params);
        } else {
          Message({
            type: "error",
            message: "没有可导出的数据",
          });
        }
      });
    },
    /**
     * 打印表格
     */
    printTable() {
      printJS({
        printable: "print", // DOM id
        type: "html",
        scanStyles: false,
        style: "table { border-collapse: collapse; }",
      });
    },
    /**
     * 表格多选回调事件
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      // that.listQuery.depId = that.depid
      console.log(that.listQuery);
      list(that.listQuery)
        .then((res) => {
          that.loading = false;
          that.tableData = res.records;
          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getMainData();
    },
    /**
     * 序号
     */
    indexMethod(index) {
      return (
        (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + index + 1
      );
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getMainData();
    },
    /**
     * 关闭编辑页面
     */
    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    drawerColse(data) {
      this.drawerShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    drawer(data) {
      console.log(data);
      this.drawerId = data.roleId;
      this.titleName = "授权";
      this.drawerShow = true;
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(index) {
      // index 为 null 时添加
      if (index == null) {
        this.editId = null;
        this.titleName = "新增角色信息";
      } else {
        this.editId = this.tableData[index].roleId;
        this.titleName = "修改角色信息";
      }
      this.editShow = true;
    },
    /**
     * 删除/批量删除事件
     */
    remove(index) {
      const that = this;
      let deleteData = [];
      if (index == null) {
        deleteData = that.multipleSelection;
      } else {
        deleteData = [that.tableData[index]];
      }
      if (deleteData.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          remove(deleteData)
            .then((res) => {
              that.loading = false;
              Message({
                type: "success",
                message: "操作成功",
              });
              that.search();
            })
            .catch(() => {
              that.loading = false;
            });
        })
        .catch(() => {
          // 取消删除
        });
    },
    /**
     * 单击表格某一行
     */
    handleClick(data) {
      console.log("========================");
      console.log(data);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
