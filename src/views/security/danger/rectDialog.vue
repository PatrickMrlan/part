<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="85%"
  >
    <el-col>
      <myTable
        ref="fileTable"
        :show-index="true"
        :selection="false"
        :checked="checked"
        :loading.sync="loading"
        :on-resize-height="false"
        :table-data="tableData"
        :total.sync="total"
        :show-tools-right="false"
        :page-index="listQuery.pageIndex"
        export-file-name="隐患列表"
        custom-label="操作"
        custom-label-width="120px"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span title="查看" @click="rect(scope.data.row, true)">查看</span>
            <span
              title="整改"
              v-if="scope.data.row.rectState == '待整改'"
              @click="rect(scope.data.row, false)"
              >整改</span
            >
          </myHandle>
        </template>
      </myTable>
    </el-col>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
    </template>

    <rectContent
      v-if="rectContentShow"
      :id="resultId"
      :check="check"
      :title="titleName"
      @close="close"
    />
  </myDialog>
</template>

<script>
import { rectList } from "@/api/security/danger";
import rectContent from "./rectContent.vue";

export default {
  components: { rectContent },
  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: true,
      default() {
        return "";
      },
    },
  },

  data() {
    return {
      loading: false,

      // 查询列表参数对象
      listQuery: {
        entId: null,
        hazardId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      check: false,
      checked: [
        { key: "隐患名称", val: "mainRisk" },
        { key: "隐患类型", val: "hazardType", width: 120, align: "center" },
        { key: "整改类型", val: "rectType", width: 120, align: "center" },
        { key: "状态", val: "rectState", width: 120, align: "center" },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
      loginUser: {},

      resultId: null,
      rectContentShow: false,
      titleName: null,
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysEnterprise) {
      this.listQuery.entId = this.loginUser.sysEnterprise.entId;
    }
    this.listQuery.hazardId = this.id;
    this.getMainData();
  },
  methods: {
    /**
     * 整改
     */
    rect(data, flag) {
      this.resultId = data.resultId;
      this.check = flag;
      this.rectContentShow = true;
      this.titleName = "整改";
    },

    getMainData() {
      const that = this;
      this.loading = true;
      rectList(that.listQuery)
        .then((res) => {
          that.tableData = JSON.parse(JSON.stringify(res.records));

          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
        })
        .finally(() => {
          this.loading = false;
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
    close(data) {
      if (data.reload) {
        this.getMainData();
      }
      this.rectContentShow = false;
    },

    // 取消
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
</style>