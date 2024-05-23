<template>
  <div class="handle">
    <slot></slot>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
export default {
  name: "myHandle",
  props: {
    click: {
      type: Function,
      required: false,
      default() {
        return null;
      },
    },
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
};
</script>
  
  <style lang="less" scoped>
.handle {
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  display: inline-block;
  box-sizing: border-box;
  color: #006eff;
  cursor: pointer;
  span {
    padding: 0 5px;
    box-sizing: border-box;
    &:hover {
      opacity: 0.8;
    }
  }
  span:not(:last-of-type) {
    border-right: 2px solid #e7eaef;
    box-sizing: border-box;
  }
}
</style>