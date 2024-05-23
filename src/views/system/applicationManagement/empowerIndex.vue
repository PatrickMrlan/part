<template>
  <myDialog
    :title="title"
    class="dialog-form dialogOne"
    ref="dialogHeight"
    width="1200px"
    :visible="true"
    :loading="loading"
    :top="'10vh'"
    :cancel="cancel"
  >
    <div class="table-classic-wrapper">
      <myTable
        :showIndex="true"
        :selection="false"
        :checked="checked"
        :loading.sync="loading"
        :tableData.sync="tableData"
        :DCAuthority="true"
        :isPrintTable="false"
        :onResizeHeight="false"
        :total.sync="total"
        exportFileName="应用授权列表"
        customLabel="期限限制"
        customLabelWidth="255px"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        :rowKey="rowKey"
      >
        <template slot="custom" slot-scope="scope">
          <div>
            <span v-if="scope.data.row.isUseTime == '无限制'">{{
              scope.data.row.isUseTime
            }}</span>
            <span v-else>
              {{ scope.data.row.startUseTime }} ~
              {{ scope.data.row.endUseTime }}
            </span>
          </div>
        </template>
      </myTable>
    </div>
  </myDialog>
</template>

<script>
import { list } from "@/api/system/businessManagement";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "授权";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      listQuery: {
        id: null,
        pageIndex: 1,
        pageSize: 10,
      },
      // 新增/修改 标题
      titleName: null,
      // 筛选列
      checked: [
        { key: "企业名称", val: "entName",},
        { key: "授权Id", val: "secretId",sortable:"true"},
        { key: "授权Key", val: "secretKey" },
        { key: "是否禁用", val: "isDisable",width:"90px",align:"center" },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
    };
  },
  created() {
    this.listQuery.id = this.id;
    this.getMainData();
  },

  methods: {
    rowKey(row) {
      return row.id;
    },
    /**
     * 搜索
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
      list(that.listQuery)
        .then((res) => {
          console.log(res);
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
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.dialogOne {
  height: 80vh;
}
</style>
