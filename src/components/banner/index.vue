<template>
  <el-carousel :height="height" :interval="interval" trigger="click">
    <el-carousel-item
      v-for="(item, index) in items"
      :key="index"
      class="imgbox"
    >
      <img class="img" :src="item.image" alt="" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "Carousel",
  props: {
    items: {
      type: Array,
      required: true
    },
    interval: {
      type: Number,
      default: 5000
    },
    height: {
      type: String,
      default: "200px"
    }
  }
};
</script>

<style lang="less" scoped>
.imgbox {
  height: 100%;
  width: 100%;
  .img {
    /*设置图片宽度和浏览器宽度一致*/
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
