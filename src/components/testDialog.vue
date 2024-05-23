<!--搜索布局-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visibleSync"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :modal-append-to-body="false"
    :before-close="handleCancel"
    :show-close="showClose"
    :style="{ height: height }"
    :modal="modal"
    :fullscreen="fullscreen"
    :append-to-body="true"
    :top="top"
    :custom-class="customClass"
    lock-scroll
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
  >
    <template slot="title" class="title">
      <slot name="title" />
    </template>
    <slot />
    <template slot="footer">
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
  
  <script>
export default {
  name: "BasicDialog",
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: "",
    },
    /**
     * 是否可以通过点击 modal 关闭 Dialog 
     * 点击 dialog 之外的区域
     */
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    /**
     * 	是否可以通过按下 ESC 关闭 Dialog
     */
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示右上角的关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true,
    },
    /**
     * 宽度
     */
    width: {
      type: String,
      default: "70%",
    },
    /**
     * 是否为全屏 Dialog
     */
    fullscreen: {
      type: Boolean,
      default: false,
    },
    /**
     * margin-top 值
     */
    top: {
      type: String,
      default: "15vh",
    },
    /**
     * 是否显示 Dialog，支持 .sync 修饰符
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 高度
     */
    height: String,
    /**
     * 是否需要遮罩层
     */
    modal: {
      type: Boolean,
      default: true,
    },
    /**
     * Dialog 的自定义class名
     */
    customClass: {
      type: String,
      default: "",
    },
  },
  computed: {
    visibleSync: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  methods: {
    handleOpen() {
      // this.$emit('open')
    },
    handleCancel(done) {
      this.$emit('handleCancel', {})
    },
  },
};
</script>
  <style lang="less" scoped>
  /deep/.el-dialog__header{
    border-bottom: 1px solid #ccc;
  }
  /deep/.el-dialog__footer{
    border-top: 1px solid #ccc;
  }
</style>
  