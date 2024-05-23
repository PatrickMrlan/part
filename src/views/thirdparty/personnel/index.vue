<template>
  <div class="table-classic-wrapper">

    
  </div>
</template>
  <script>
export default {
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      // 查询列表参数对象
      listQuery: {
        startTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10,
        keyword: null,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
    };
  },
  created() {},
  methods: {},
};
</script>


<style lang="less" scoped>
</style>
  