<template>
  <div class="table-classic-wrapper">
    菜单权限管理
  </div>
</template>

<script>

import { Message } from "element-ui";

export default {
  name: "Table",

  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
     
    };
  },
  methods: {
    
  },
};
</script>

<style lang="less" scoped>
* {
  visibility: visible;
}
</style>
