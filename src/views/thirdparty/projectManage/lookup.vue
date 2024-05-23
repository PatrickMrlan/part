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
          :placeholder="'请输入' + type + '名称'"
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
import { list as entList } from "@/api/system/entManagement";
import { list as parkList } from "@/api/park/information";
import { list as userList } from "@/api/thirdparty/institution";

export default {
  props: {
    title: {
      required: true,
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
    type: {
      type: String,
      required: true,
      default() {
        return "";
      },
    },
    tableDataCheck: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,

      listQuery: {
        keyword: null,

        industrySector: null, // 企业--行业领域
        nationalEconomy: null, // 企业--国民经济
        userState: null, // 第三方人员--状态
        thirdPartyId: null, // 第三方

        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
      customLabel: "操作",
      multipleSelection: [],
      loginUser: {},
      checked: [],
    };
  },
  async created() {
    if (this.multiple) {
      this.customLabel = null;
    }

    if (this.tableDataCheck && this.tableDataCheck.length > 0) {
      this.$nextTick(() => {
        this.tableDataCheck.forEach((item) => {
          this.$refs.fileTable.$refs.multipleTable.toggleRowSelection(item);
        });
      });
    }
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    await this.changeChecked();
    await this.getMainData();
  },
  methods: {
    rowKey(row) {
      if (this.type == "园区") return row.parkId;
      if (this.type == "企业") return row.entId;
      if (this.type == "人员") return row.userId;
    },

    changeChecked() {
      switch (this.type) {
        case "园区":
          this.checked = [
            { key: "园区名称", val: "parkName" },
            {
              key: "园区统一社会信用代码",
              val: "parkCode",
              width: "200px",
            },
            { key: "联系人", val: "contact", align: "center", width: "150px" },
            {
              key: "联系电话",
              val: "contactTel",
              align: "center",
              width: "120px",
            },
            {
              key: "成立日期",
              val: "establishDate",
              align: "center",
              width: "120px",
            },
            { key: "详细地址", val: "address" },
          ];
          break;
        case "企业":
          this.checked = [
            { key: "企业名称", val: "entName" },
            {
              key: "企业统一社会信用代码",
              val: "entCode",
              width: "200px",
            },
            { key: "联系人", val: "contact", align: "center", width: "150px" },
            {
              key: "联系电话",
              val: "contactTel",
              align: "center",
              width: "120px",
            },
            {
              key: "企业状态",
              val: "entState",
              align: "center",
              width: "120px",
            },
            { key: "详细地址", val: "address" },
          ];

          break;
        case "人员":
          this.listQuery.thirdPartyId =
            this.loginUser.sysThirdParty.thirdPartyId;
          this.checked = [
            {
              key: "账号",
              val: "loginCode",
            },
            { key: "人员名称", val: "userName" },
            {
              key: "联系电话",
              val: "userTel",
              align: "center",
              width: "120px",
            },
            {
              key: "人员类型",
              val: "userIdentity",
              align: "center",
              width: "120px",
            },
            {
              key: "账号状态",
              val: "userState",
              align: "center",
              width: "120px",
            },
          ];
          break;

        default:
          break;
      }
    },

    handleMultiple(e) {
      this.multipleSelection = e;
    },

    getMainData() {
      const that = this;
      that.loading = true;
      switch (this.type) {
        case "园区":
          parkList(that.listQuery)
            .then((res) => {
              that.tableData = res.records;
              that.listQuery.pageSize = res.size;
              that.listQuery.pageIndex = res.current;
              that.total = res.total;
            })
            .finally(() => {
              that.loading = false;
            });

          break;
        case "企业":
          entList(that.listQuery)
            .then((res) => {
              that.tableData = res.records;
              that.listQuery.pageSize = res.size;
              that.listQuery.pageIndex = res.current;
              that.total = res.total;
            })
            .finally(() => {
              that.loading = false;
            });
          break;
        case "人员":
          userList(that.listQuery)
            .then((res) => {
              that.tableData = res.records;
              that.listQuery.pageSize = res.size;
              that.listQuery.pageIndex = res.current;
              that.total = res.total;
            })
            .finally(() => {
              that.loading = false;
            });
          break;

        default:
          break;
      }
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
    },
  },
};
</script>

<style lang="less" scoped>
</style>