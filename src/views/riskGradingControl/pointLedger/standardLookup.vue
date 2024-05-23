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
        <el-select
          v-model="listQuery.riskLevel"
          placeholder="风险类型"
          class="input-normal"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in riskLevelList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="listQuery.accidentType"
          placeholder="事故类型"
          class="input-normal"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in riskAccidentTypeList"
            :key="index"
            :label="item.dictName"
            :value="item.dictCode"
          />
        </el-select>
        <el-input
          v-model="listQuery.keyword"
          style="width: 300px"
          clearable
          placeholder="辨识标准"
          @keyup.native.enter="search"
        />

        <myButton
          icon="el-icon-search"
          style="margin-right: 0 !important"
          @click.native="search"
          >搜索</myButton
        >
      </div>
      <div v-if="multiple" class="right">
        <myButton
          v-if="multipleSelection.length"
          icon="el-icon-refresh"
          @click.native="reset"
          >重置已选中（{{ multipleSelection.length }}）个</myButton
        >
        <myButton
          v-if="multipleSelection.length"
          icon="el-icon-check"
          @click.native="check(null)"
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
import { list } from "@/api/hazard/identificationCheck";
import { enumList } from "@/api/risk/riskSource";
export default {
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
        accidentType: null,
        riskLevel: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
      customLabel: "操作",
      riskAccidentTypeList: [],
      // 多选数据暂存数组
      multipleSelection: [],
      checked: [
        {
          key: "风险类型",
          val: "riskLevel",
          width: "120px",
          align: "center",
        },
        { key: "事故类型", val: "accidentTypeNames" },
        { key: "辨识标准", val: "identificationStandards" },
      ],

      riskLevelList: [
        {
          label: "重大风险",
          value: 3,
        },
        {
          label: "较大风险",
          value: 2,
        },
      ],
    };
  },
  created() {
    if (this.multiple) {
      this.customLabel = null;
    }
    this.getEnumList();
    this.getMainData();
  },
  methods: {
    /**
     * 获取枚举
     */
    getEnumList() {
      enumList().then((res) => {
        this.riskAccidentTypeList = res.riskAccidentTypeList;
      });
    },

    rowKey(row) {
      return row.id;
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

    check(index) {
      if (index != null && index >= 0) {
        this.multipleSelection = [];
        this.multipleSelection.push(this.tableData[index]);
      }
      this.$emit("close", this.multipleSelection, true);
    },

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