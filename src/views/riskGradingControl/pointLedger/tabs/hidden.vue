<template>
  <div class="box" ref="box">
    <!-- 操作栏 -->
    <div class="app-list-control app-row">
      <div class="flex"></div>
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
      :onResizeHeight="height"
      :showToolsRight="false"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
    >
    </myTable>
  </div>
</template>
  
  <script>
import { resultListByRisk } from "@/api/security/danger";

export default {
  data() {
    return {
      loading: false,

      listQuery: {
        riskPointId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      time: [],
      height: null,
      // 筛选列
      checked: [
        { key: "隐患类型", val: "hazardType" },
        {
          key: "整改类型",
          val: "rectType",
        },
        {
          key: "整改期限",
          val: "rectDate",
        },
        { key: "主要事故隐患或问题", val: "mainRisk" },
        {
          key: "整改措施或建议",
          val: "measure",
        },
        {
          key: "整改措施或建议",
          val: "measure",
        },
        {
          key: "不合规的名称、条款和内容",
          val: "accordance",
        },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
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
    onResize() {
      let winHeight = window.innerHeight;
      this.height = winHeight - this.$refs.box.offsetHeight + 80;
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      that.listQuery.riskPointId = this.$route.query.id;
      resultListByRisk(that.listQuery)
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
  