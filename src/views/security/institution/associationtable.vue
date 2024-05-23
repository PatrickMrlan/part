<template>
  <myDialog
    title="选择关联机构"
    width="900px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    top="10vh"
  >
    <myTable
      ref="fileTable1"
      :show-index="true"
      :checked="checked"
      :loading.sync="loading"
      :table-data="tableData"
      custom-label="操作"
      custom-label-width="120px"
      :row-key="rowKey"
      :onResizeHeight="325"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="选择机构" @click="associa(scope.data.row)">
            选择机构
          </span>
        </myHandle>
      </template>
    </myTable>
  </myDialog>
</template>

<script>
import { associationEnt } from "@/api/system/enterprise";
export default {
  data() {
    return {
      loading: false,
      listQuery: {
        entId: JSON.parse(sessionStorage.getItem("loginUser") || "{}").entId,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      checked: [
        { key: "机构名称", val: "entName" },
        { key: "机构代码", val: "entCode" },
        {
          key: "统一社会信用代码",
          val: "entCode",
          align: "center",
          width: "150px"
        },
        { key: "行政区划", val: "district", align: "center" },
        { key: "法人", val: "legalPersonName", align: "center" },
        { key: "联系电话", val: "legalPersonPhone", align: "center" },
        { key: "关联状态", val: "associationStatus", align: "center" }
      ]
    };
  },
  async created() {
    await this.getMainData();
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },
    rowKey(row) {
      return row.entId;
    },
    getMainData() {
      const that = this;
      this.loading = true;
      associationEnt(that.listQuery)
        .then(res => {
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
    associa(data){
      this.$emit("pushtable", data);
      this.cancel()
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
      list(that.listQuery)
        .then(res => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    }
  }
};
</script>
