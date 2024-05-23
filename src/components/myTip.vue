<template>
  <div
    :style="{
      color: themeColor,
      border: '1px solid ' + themeColor,
      background: themeColor + '22',
    }"
    class="tip"
  >
    <i style="font-size: 14px" class="el-icon-info"></i>
    {{ title }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "myTip",
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "";
      },
    },
  },
  computed: {
    ...mapGetters("app", ["themeColor"]),
  },
};
</script>

<style lang="less" scoped>
.tip {
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 2px;
  margin: 10px auto;
}
</style>