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
          placeholder="风险源（点）名称"
          @keyup.native.enter="search"
        />
        <el-select
          v-model="listQuery.riskCategory"
          placeholder="请选择"
          class="input-normal"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in riskCategoryList"
            :key="index"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
        <myButton
          icon="el-icon-search"
          style="margin-right: 0 !important"
          @click.native="search"
          >搜索</myButton
        >
        <myButton
          icon="el-icon-plus"
          @click.native="addFn"
          style="margin-right: 0 !important"
          >添加风险源（点）</myButton
        >
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

    <addRiskSource
      v-if="addRiskSourceShow"
      :title="titleName"
      :id="addId"
      @close="addClose"
    />
  </myDialog>
</template>

<script>
import { list as riskSourceList } from "@/api/risk/riskSource";
import { enumList } from "@/api/risk/riskSource";
import addRiskSource from "./addRiskSource.vue";

export default {
  components: { addRiskSource },

  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    tags: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      loading: false,
      listQuery: {
        riskPointId: null,
        keyword: null,
        riskCategory: null,
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
      customLabel: "操作",

      // 多选数据暂存数组
      multipleSelection: [],
      checked: [
        { key: "风险源（点）名称", val: "riskName" },
        { key: "风险源（点）类别", val: "riskCategory" },
        { key: "风险分析", val: "riskAnalysis" },
        { key: "风险等级", val: "riskLevel" },
      ],
      riskCategoryList: [],

      addRiskSourceShow: false,
    };
  },
  created() {
    this.listQuery.riskPointId = this.id;
    if (this.multiple) {
      this.customLabel = null;
    }
    this.getEnumList();
    this.getMainData();
  },
  mounted() {
    if (this.tags.length) {
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          this.$refs.fileTable.$refs.multipleTable.toggleRowSelection(item);
        });
      });
    }
  },
  methods: {
    rowKey(row) {
      return row.riskSourceId;
    },

    handleMultiple(e) {
      this.multipleSelection = e;
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
     * 获取枚举
     */
    getEnumList() {
      enumList().then((res) => {
        this.riskCategoryList = res.riskCategoryList;
      });
    },

    getMainData() {
      const that = this;
      this.loading = true;
      riskSourceList(that.listQuery)
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

    check(index) {
      if (index != null && index >= 0) {
        this.multipleSelection = [];
        this.multipleSelection.push(this.tableData[index]);
      }
      this.$emit("close", this.multipleSelection, true);
    },

    /**
     * 点击添加
     */
    addFn() {
      this.titleName = "新增风险源（点）";
      this.addId = this.id;
      this.addRiskSourceShow = true;
    },

    /**
     * 关闭编辑页面
     */
    addClose(data) {
      if (data.reload) {
        this.getMainData();
      }
      this.addRiskSourceShow = false;
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