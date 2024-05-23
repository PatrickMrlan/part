<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="请输入关键字"
          clearable
          class="input-short"
          @keyup.native.enter="search"
        />
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDataRange($event)"
        />
        <myButton type="search" icon="el-icon-search" @click.native="search"
          >搜索</myButton
        >
      </div>
      <!-- <div class="right">
        <el-button v-if="pageOper.TJ" type="primary" icon="el-icon-plus" @click="edit(null)">添加</el-button>
        <el-button v-if="pageOper.SC" type="danger" icon="el-icon-delete" @click="remove(null)">删除</el-button>
      </div> -->
    </div>
    <myTable
      ref="fileTable"
      :show-index="true"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      :row-key="rowKey"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    />
  </div>
</template>

<script>
import { loginLogPage } from "@/api/log";

export default {
  name: "Log",
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
      // 筛选列
      checked: [
        { key: "登录账号", val: "memberAccess", align: "center", minWidth: 90 },
        { key: "浏览器", val: "browserVersion", minWidth: 90 },
        {
          key: "登录IP地址",
          val: "memberIpAddress",
          align: "center",
          minWidth: 90,
        },
        { key: "MAC地址", val: "macAddress", align: "center", minWidth: 90 },
        {
          key: "登录时间",
          val: "addTime",
          align: "center",
          minWidth: 90,
          sortable: true,
        },
      ],
      dateRange: null,
      // 查询列表参数对象
      listQuery: {
        startTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10,
        keyword: null,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
    };
  },
  mounted() {
    this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    changeDataRange(e) {
      console.log(e);
      if (e) {
        this.listQuery.startTime = e[0];
        this.listQuery.endTime = e[1];
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
      this.search();
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
      loginLogPage(that.listQuery)
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
      this.listQuery.pageIndex = pageIndex;
      this.getMainData();
    },

    /**
     * 1. 获取导出表格的数据
     * 2. 调用子组件的方法实现导出
     */
    getExportTableData(total) {
      const that = this;
      that.loading = true;
      that.listQuery.pageIndex = 1;
      that.listQuery.pageSize = total;
      loginLogPage(that.listQuery)
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.input {
  width: 150px;
  margin-right: 8px;
}
</style>
