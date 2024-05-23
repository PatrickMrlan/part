<template>
  <div class="pagination-wrapper">
    <el-pagination
      :background="background"
      :current-page="listQuery.pageIndex"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      @size-change="pagerSizeChange"
      @current-change="pagerCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Pagination",
  props: {
    page: {
      type: Number,
      default: 1,
      required: true,
    },
    limit: {
      type: Number,
      default: 10,
      required: true,
    },
    background: {
      type: Boolean,
      default: true,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 1000, 10000],
    },
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    layout: {
      type: String,
      default: "total, prev, pager, next, sizes, jumper",
    },
  },
  data() {
    return {
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.changeButtonColor();
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
  methods: {
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.$emit("pageSizeChange", pageSize);
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.$emit("pageCurrentChange", pageIndex);
      this.changeButtonColor();
    },
    /**
     * 改变按钮颜色
     */
    changeButtonColor() {
      var number = document.querySelectorAll(
        ".pagination-wrapper .el-pagination .el-pager .number"
      );
      var active = document.querySelectorAll(
        ".pagination-wrapper .el-pagination .el-pager .active"
      );
      console.log(number);
      console.log(active);
      number.forEach((item) => {
        item.style.background = "#f4f4f5";
      });
      active.forEach((item) => {
        item.style.background = this.themeColor;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pagination-wrapper {
  // margin: 20px 0;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
