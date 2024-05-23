<template>
  <myDialog
    :title="'选择应用'"
    :width="1000"
    class="dialog-form"
    :visible="show"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <div class="table-classic-wrapper">
      <!-- 操作栏 -->
      <div class="app-list-control app-row" ref="appRowHeight">
        <div class="flex">
          <!-- <el-input
            v-model="listQuery.carNo"
            class="input-long"
            placeholder="应用名称"
            clearable
          />
          <myButton :type="'search'" plain icon="el-icon-search" @click.native="search"
            >搜索</myButton
          > -->
        </div>
        <div v-if="multiple" class="right">
          <el-button type="danger" icon="el-icon-refresh" @click="reset()"
            >重置</el-button
          >
          <el-button type="primary" icon="el-icon-check" @click="check(null)"
            >选择</el-button
          >
        </div>
      </div>
      <myTable
        :showIndex="multiple"
        :selection="multiple"
        :checked="checked"
        :loading.sync="loading"
        :tableData="tableData"
        :total.sync="total"
        :showToolsRight="false"
        :pageIndex="listQuery.pageIndex"
        :customLabel="customLabel"
        customLabelWidth="60px"
        @change="multiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        :row-key="rowKey"
        :onResizeHeight="false"
        @row-click="handleClickTableRow"
        @selection-change="handleSelectionChange"
      >
        <template slot="custom" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            circle
            icon="el-icon-check"
            @click="check(scope.data.$index)"
          />
        </template>
      </myTable>
    </div>
  </myDialog>
</template>

<script>
import { list } from "@/api/system/applicationManagement";

export default {
  name: "Table",
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    show: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      // 数据列表加载动画
      loading: true,
      // 查询列表参数对象
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      customLabel: '操作',
      checked: [
        { key: "应用名称", val: "appName", align: "center", sortable: true },
        { key: "跳转链接", val: "appUrl", align: "center", sortable: true },
        { key: "跳转类型", val: "jumpType", align: "center", sortable: true },
        { key: "跳转方式", val: "jumpMode", align: "center", sortable: true },
        {
          key: "是否控制使用时间",
          val: "isUseTime",
          align: "center",
        },
        {
          key: "是否禁止使用",
          val: "isDisable",
          align: "center",
          sortable: true,
        },
        {
          key: "排序",
          val: "sort",
          align: "center",
          width: "50px",
        },
      ],
    };
  },
  created() {
    this.getMainData();
    if(this.multiple){
      this.customLabel = null;
    }
  },
  methods: {
    rowKey(row) {
      return row.carId;
    },
    handleClickTableRow(row, event, column) {
      this.$refs.fileTable.toggleRowSelection(row);
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
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
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      console.log(this.multipleSelection);
      this.listQuery.pageIndex = pageIndex;
      this.getMainData();
    },
    cancel(done) {
      this.$emit("close", null);
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
    check(index) {
      if (index != null && index >= 0) {
        this.multipleSelection = [];
        this.multipleSelection.push(this.tableData[index]);
      }

      this.$emit("close", this.multipleSelection);
    },
  },
};
</script>

<style lang="less" scoped></style>
