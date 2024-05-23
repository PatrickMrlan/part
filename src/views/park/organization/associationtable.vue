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
      ref="fileTable"
      :show-index="true"
      @change="multiple"
      :selection="true"
      :checked="checked"
      :loading.sync="loading"
      :table-data="tableData"
      :row-key="rowKey"
      :onResizeHeight="325"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <!-- <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="选择机构" @click="associa(scope.data.row)">
            选择机构
          </span>
        </myHandle>
      </template> -->
    </myTable>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="associa"
      >
        提 交
      </myButton>
    </template>
  </myDialog>
</template>

<script>
import { associationEnt } from "@/api/system/enterprise";
import { detail, enumList, editEnt } from "@/api/park/institution";
export default {
  props: {
    id: {
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      loading: false,
      listQuery: {
        id: null,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      checked: [
        { key: "企业名称", val: "entName" },
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
  created() {},
  mounted() {
    this.listQuery.id = this.id;
    this.getMainData();
  },
  methods: {
    multiple(e) {
      this.multipleSelection = e;
    },
    cancel(done) {
      this.$emit("close", {});
    },
    rowKey(row) {
      return row.entId;
    },
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then(res => {
          that.loading = false;
          that.dialogForm = res;
          that.multipleSelection = res.enterpriseList;
          that.$refs.fileTable.RowSelection(that.multipleSelection);
        })
        .catch(() => {
          that.loading = false;
        });
    },
    findIndex(arr, key, value) {
      return arr.findIndex(obj => obj[key] === value);
    },
    getMainData() {
      const that = this;
      this.loading = true;
      enumList(that.listQuery)
        .then(res => {
          that.loading = false;
          that.tableData = res.enterpriseList.records;
          that.listQuery.pageSize = res.enterpriseList.size;
          that.listQuery.pageIndex = res.enterpriseList.current;
          that.total = res.enterpriseList.total;
          that.loadData();
        })
        .catch(() => {
          that.loading = false;
        });
    },
    associa(data) {
      const that = this;
      that.dialogForm.enterpriseList = this.multipleSelection;
      that.loading = true;
      editEnt(this.dialogForm).then(res => {
        that.loading = false;
        that.$message({
          message: "关联成功",
          type: "success"
        });
        that.$emit("close", {});
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
