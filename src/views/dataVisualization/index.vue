<template>
  <div class="bigScreen" id="bigScreen" ref="cells">
    <!-- <dv-full-screen-container> -->
      <!-- <el-scrollbar
        :style="{ height: clientHeight + 'px' }"
      > -->
      <Header />
      <Content />
      <Footer />
      <!-- </el-scrollbar> -->
    <!-- </dv-full-screen-container> -->
  </div>
</template>

 
<script>
import Header from "./header/index.vue";
import Content from "./content/index.vue";
import Footer from "./footer/index.vue";
export default {
  components: { Header, Content, Footer },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>


<style lang="less" scoped>
.bigScreen {
  width: 100%;
  height: 100vh;
  background: url(../../assets/img/bigScreen/background.png) no-repeat center
    center;
  background-size: cover;
  z-index: -1;
}
</style>