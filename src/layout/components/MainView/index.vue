<template>
  <div id="main-view" class="main-view">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive :include="cachedViews"> -->
      <router-view :key="key" />
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  data() {
    return {
      pageOperList: []
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.main-view {
  box-sizing: border-box;
  // height: calc(100vh - 96px);
  height: calc(100vh - 134px);
  overflow: auto;
}

.fade-enter-active{
  transition: opacity 0.5s ease;
}

//把离开时的开始状态设置为display:none

.fade-leave-from{
  display: none;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
