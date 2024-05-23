<template>
  <div>
    <Danger />
  </div>
</template>

<script>
import Danger from "@/views/security/danger/index.vue";
export default {
  components: { Danger },
  data() {
    return {
      loading: false,
      pageOper: this.getPageOper(this.$route),
    };
  },
};
</script>

<style lang="less" scoped>
</style>