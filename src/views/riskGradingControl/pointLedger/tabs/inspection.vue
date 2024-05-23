<template>
  <div class="box" ref="box">
    <!-- 操作栏 -->
    <div class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          class="input-long"
          clearable
          placeholder="检查人"
          @keyup.native.enter="search"
        />

        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeTime"
        >
        </el-date-picker>

        <myButton type="search" icon="el-icon-search" @click.native="search"
          >搜索</myButton
        >
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格栏 -->
    <myTable
      ref="fileTable"
      :show-index="false"
      :selection="false"
      :checked="checked"
      :loading.sync="loading"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      custom1-label="检查时间"
      custom-label-width="80px"
      :onResizeHeight="height"
      :showToolsRight="false"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
    >
      <template slot="custom1" slot-scope="scope">
        <div>{{ scope.data.row.startTime }} ~ {{ cope.data.row.endTime }}</div>
      </template>

      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="查看" @click="check(scope.data.row)">查看</span>
        </myHandle>
      </template>
    </myTable>
  </div>
</template>

<script>
import { list } from "@/api/risk/inspection";

export default {
  data() {
    return {
      loading: false,

      listQuery: {
        keyword: null,
        startTime: null,
        endTime: null,
        isHidden: null,
        riskPointId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      time: [],
      height: null,
      // 筛选列
      checked: [
        { key: "检查人", val: "inspectedBy" },
        {
          key: "涉及的管控措施",
          val: "measureNumber",
          align: "center",
          minWidth: "120",
        },
        {
          key: "检查标准数",
          val: "standardNumber",
          align: "center",
        },
        { key: "合格项", val: "qualified", align: "center" },
        {
          key: "隐患项",
          val: "hiddenDangerNumber",
          align: "center",
        },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],

      isHidden: [
        {
          label: "否",
          value: 0,
        },
        {
          label: "是",
          value: 1,
        },
      ],
    };
  },
  created() {
    this.getMainData();
  },

  mounted() {
    this.$nextTick(() => {
      this.onResize();
    });
    window.addEventListener("resize", this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    changeTime(e) {
      if (e && e.length) {
        this.listQuery.startTime = e[0] + " 00:00:00";
        this.listQuery.endTime = e[1] + " 23:59:59";
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
    },

    onResize() {
      let winHeight = window.innerHeight;
      this.height = winHeight - this.$refs.box.offsetHeight + 120;
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
      that.listQuery.riskPointId = this.$route.query.id;
      list(that.listQuery)
        .then((res) => {
          that.loading = false;
          that.tableData = JSON.parse(JSON.stringify(res.records));
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
  },
};
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  padding: 15px;

  /deep/.my_table {
    box-shadow: none;
  }
}
</style>
