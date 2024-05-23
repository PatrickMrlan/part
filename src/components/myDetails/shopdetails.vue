<template>
    <div class="Mask"  v-show="visible">
        <div class="container">
        <div class="title"><span>{{ title }}</span><i class="iconfont icon-quxiao ali-icon" @click="close"></i></div>
        <div><slot></slot></div>
    </div>
    </div>
</template>

<script>
export default {
    name: "shopdetails",
    props: {
        title:String,
        emptyArray:Function
    },
    data() {
        return {
            // 商品详情
            shopDetails: {},
            visible:false,
        }
    },
    methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.emptyArray()
    },
  },

}
</script>

<style scoped lang="less">
@import "../../assets/icon-fonts/aliicon.css";

.Mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
}

.container {
    width: 1000px;
    height: 700px;
    background-color: #FFF;
    border-radius: 5px;
    position: fixed;
    top: calc(50% - 350px);
    left: calc(50% - 400px);
    box-sizing: border-box;
    z-index: 999;
    box-sizing: border-box;
    overflow: auto;
}

.title {
    width: 100%;
    height: 70px;
    background-color: #eee;
    border-radius: 5px 5px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    padding: 0px 20px 0px 20px;
    i{
        font-size: 22px;
    }
}
</style>