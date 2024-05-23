<template>
  <div class="my-drawer" v-loading="loading">
    <el-drawer
      v-loading="loading"
      ref="drawer"
      :title="title"
      :visible="show"
      :direction="direction"
      :size="size"
      :custom-class="customClass"
      :modal="true"
      :close-on-press-escape="true"
      :show-close="true"
      :before-close="handleClose"
      :append-to-body="true"
      :wrapperClosable="false"
    >
      <slot />

      <div class="demo-drawer__footer" v-if="footer">
        <slot name="footer" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "myDrawer",
  props: {
    // 抽屉标题
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },

    // 控制显示
    visible: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },

    // 打开方向
    direction: {
      type: String,
      required: false,
      default() {
        return "rtl";
      },
    },

    /**
     * 抽屉大小
     * 30% || 500px
     */
    size: {
      type: String,
      required: false,
      default() {
        return "50%";
      },
    },

    // 自定义类型
    customClass: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },

    // 取消的方法函数
    cancel: {
      type: Function,
      required: false,
      default() {
        return null;
      },
    },

    // 加载中…
    loading: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },

    // 是否显示 底部
    footer: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
  },

  data() {
    return {
      show: false,
    };
  },

  created() {
    setTimeout(() => {
      this.show = this.visible;
    }, 50);
  },

  methods: {
    handleClose() {
      this.cancel();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-drawer__header {
  position: relative;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 4px 4px 0 0;
  color: #000000d9;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
  height: 55px;
  box-sizing: border-box;
}

/deep/.el-drawer__body {
  height: calc(100vh - 110px);
  padding: 24px;
  font-size: 14px;
  flex: none;
  box-sizing: border-box;
}

/deep/.demo-drawer__footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  background-color: #fff;
  text-align: right;
  z-index: 1;
  padding: 10px 16px;
  height: 55px;
  box-sizing: border-box;
}
</style>