<template>
    <div class="box">
      <div class="btn" v-if="activeTab == '工作台'">
        <a href="/#/statisticalchart" class="linkBigScreen" target="_blank">
          <myButton>数据大屏</myButton>
        </a>
        <i class="el-icon-setting" />
      </div>
      <el-tabs v-model="activeTab" class="tabs">
        <el-tab-pane name="工作台" label="工作台" class="tabpane">
          <workbenches ref="workbenches" v-if="activeTab == '工作台'" />
        </el-tab-pane>

      </el-tabs>
    </div>
  </template>
<script>
import workbenches from "./workbenches.vue";
export default {
    components: {
        workbenches
    },
    data() {
        return {
            activeTab: "工作台",
        }
    },
}
</script>
<style lang="less" scoped>
.tabs {
  width: 100%;
  height: 100%;
  .tabpane {
    background-color: rgb(245, 245, 245);
    height: calc(100vh - 184px);
    padding: 24px !important;
    box-sizing: border-box;
    overflow: auto;
  }
}

/deep/.el-tabs__nav-scroll {
  height: 50px;
  line-height: 50px;
  padding: 0 20px !important;
}
/deep/.el-tabs__item {
  font-size: 14px !important;
  font-weight: bold;
}
/deep/.el-tabs__header {
  margin: 0;
}

.box {
  position: relative;
  height: 100%;
  .btn {
    position: absolute;
    right: 20px;
    transform: translateY(27%);
    cursor: pointer;
    z-index: 200;
    display: flex;
    align-items: center;
    i {
      font-size: 24px;
    }
    .linkBigScreen{
      margin-right: 10px;
    }
  }
}
</style>