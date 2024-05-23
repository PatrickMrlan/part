<template>
  <div id="app" @click="isTimeOut">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload,
      lastTime: null,
      // 10分钟未检测到鼠标点击就退出登录，后台正常校验20h
      timeOut: 10 * 10
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  created() {
    this.lastTime = new Date().getTime()
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 全局监听得点击事件
    isTimeOut() {
      var currentTime = new Date().getTime()

      // 判断上次最后一次点击的时间和这次点击的时间间隔
      if (currentTime - this.lastTime > this.timeOut) {
        // 这个是判断 当前用户是否登录，根据自己的情况写
        // if (null != sessionStorage.getItem('token')) {

        this.$alert('身份验证已过期，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            // 这里写路由（跳转到登录页）
            this.$router.replace('/login')
          }
        })
        // }
      } else {
        // 如果在期限内点击，则把这次点击的时间覆盖掉之前存的最后一次点击的时间
        this.lastTime = new Date().getTime()
      }
    }

  }
}
</script>

<style lang="less" scoped>
@import "assets/less/index.less";
@import "assets/less/reset";

/deep/.el-main {
  padding: 0;
}

</style>
