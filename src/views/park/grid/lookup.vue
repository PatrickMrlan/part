<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="85%"
  >
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          class="input-long"
          clearable
          placeholder="请输入网格员名称"
          @keyup.native.enter="search"
        />

        <myButton icon="el-icon-search" @click.native="search">搜索</myButton>
      </div>
      <div v-if="multiple" class="right">
        <myButton
          v-if="multipleSelection.length"
          icon="el-icon-refresh"
          @click.native="reset"
          >重置已选中（{{ multipleSelection.length }}）个</myButton
        >
        <myButton icon="el-icon-check" @click.native="check(null)"
          >选择</myButton
        >
      </div>
    </div>

    <myTable
      ref="fileTable"
      :show-index="multiple"
      :selection="multiple"
      :on-resize-height="false"
      :checked="checked"
      :loading.sync="loading"
      :table-data="tableData"
      :total.sync="total"
      :show-tools-right="false"
      :page-index="listQuery.pageIndex"
      :custom-label="customLabel"
      custom-label-width="60px"
      :row-key="rowKey"
      @change="handleMultiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
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

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
    </template>
  </myDialog>
</template>

<script>
import { detail } from "@/api/park/grid";
export default {
  props: {
    title: {
      required: true,
      default() {
        return "";
      }
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    tableDataCheck: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      loading: false,

      listQuery: {
        parkId:null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      customLabel: "操作",
      multipleSelection: [],
      loginUser: {},
      checked: [
        { key: "人员名称", val: "userName" },
        { key: "人员类别", val: "userIdentity", align: "center" },
        {
          key: "联系电话",
          val: "userTel",
          align: "center",
        },
        {
          key: "人员状态",
          val: "userState",
          align: "center",
          width: "120px"
        },
      ]
    };
  },
  async created() {
    if (this.multiple) {
      this.customLabel = null;
    }

    if (this.tableDataCheck && this.tableDataCheck.length > 0) {
      this.$nextTick(() => {
        this.tableDataCheck.forEach(item => {
          this.$refs.fileTable.$refs.multipleTable.toggleRowSelection(item);
        });
      });
    }
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    this.listQuery.parkId = this.loginUser.sysPark.parkId;
    await this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.userId;
    },
    handleMultiple(e) {
      this.multipleSelection = e;
    },

    getMainData() {
      const that = this;
      that.loading = true;

      detail(that.listQuery)
        .then(res => {
          that.tableData = res.userList.records;
          that.listQuery.pageSize = res.userList.size;
          that.listQuery.pageIndex = res.userList.current;
          that.total = res.userList.total;
        })
        .finally(() => {
          that.loading = false;
        });
    },

    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },

    check(index) {
      if (index != null && index >= 0) {
        this.multipleSelection = [];
        this.multipleSelection.push(this.tableData[index]);
      }
      this.$emit("close", this.multipleSelection, true);
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

    // 重置
    reset() {
      // 清空所有选中的行
      this.$refs.fileTable.$refs.multipleTable.clearSelection();
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },

    cancel(done) {
      this.$emit("close", {}, false);
    }
  }
};
</script>

<style lang="less" scoped></style>
