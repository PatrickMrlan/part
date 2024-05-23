<template>
  <div class="table-classic-wrapper">
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
      custom-label="操作"
      custom-label-width="100px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="整改确认" @click="confirm(scope.data.row)"
            >整改确认</span
          >
        </myHandle>
      </template>
    </myTable>

    <confirm
      v-if="confirmShow"
      :id="resultId"
      :title="titleName"
      @close="close"
    />
  </div>
</template>

<script>
import { confirmList } from "@/api/security/danger";
import confirm from "./confirm.vue";

export default {
  components: { confirm },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),

      loginUser: {},

      confirmShow: false,
      resultId: null,
      titleName: null,
      checked: [
        { key: "隐患名称", val: "mainRisk" },
        { key: "整改说明", val: "rectContent" },
        { key: "隐患类型", val: "hazardType", width: 120, align: "center" },
        { key: "整改类型", val: "rectType", width: 120, align: "center" },
        { key: "状态", val: "rectState", width: 120, align: "center" },
      ],

      listQuery: {
        parkId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    this.listQuery.parkId = this.loginUser.entId;
    this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.resultId;
    },

    /**
     * 整改确认
     */
    confirm(data) {
      this.resultId = data.resultId;
      this.confirmShow = true;
      this.titleName = "整改确认";
    },

    close(data) {
      if (data.reload) {
        this.getMainData();
      }
      this.confirmShow = false;
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      confirmList(that.listQuery)
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
      confirmList({
        parkId: this.loginUser.entId,
        pageIndex: 1,
        pageSize: total,
      })
        .then((res) => {
          console.log(res.records);
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
</style>