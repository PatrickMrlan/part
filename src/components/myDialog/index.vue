<template>
  <div class="mydialog">
    <el-dialog
      :title="title"
      :width="width"
      :visible.sync="visible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      :destroy-on-close="false"
      v-loading="loading"
      append-to-body
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :top="top"
      :show-close="showClose"
      :custom-class="customClass"
    >
      <template slot="title" v-if="title">
        <slot name="title" />
      </template>
      <slot />
      <template slot="footer" v-if="footer">
        <myTip v-if="footerTip" :title="footerTip"></myTip>
        <div>
          <slot name="footer" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "myDialog",
  props: {
    // 弹窗标题
    title: {
      type: String,
      required: false,
      default() {
        return "提示";
      },
    },
    // top
    top: {
      type: String,
      required: false,
      default() {
        return "10vh";
      },
    },
    // 宽度
    width: {
      required: false,
      default() {
        return "600px";
      },
    },
    // 是否显示 Dialog
    visible: {
      type: Boolean,
      required: true,
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
    // 取消的方法函数
    cancel: {
      type: Function,
      required: false,
      default() {
        return null;
      },
    },
    // loading加载动画
    loading: {
      default() {
        return false;
      },
    },
    // 是否显示取消按钮
    showClose: {
      default() {
        return true;
      },
    },
    //
    customClass: {
      default() {
        return "myDialogCusomClass";
      },
    },
    footerTip: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {};
  },
  watch: {
    loading() {
      this.isLoading = this.loading;
    },
  },
  mounted() {},
  methods: {
    handleCancel() {
      this.cancel();
    },
  },
};
</script> 

<style lang="less" scoped>
.mydialog {
  .el-dialog__wrapper {
    display: flex;
    align-items: center;
  }
  .el-dialog {
    margin: 0 auto !important;
    position: relative;
  }
  .el-dialog__body {
    max-height: 80vh !important;
    min-height: 150px !important;
    padding-bottom: 68px !important;
    overflow: auto;
  }

  .mydialog-footer {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
}

/deep/.myDialogCusomClass {
  .el-dialog__footer {
    display: flex;
    align-items: center;
    justify-content: end;
    .tip {
      margin: 0 auto 0 0;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
    }
  }
}
</style>