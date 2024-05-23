<template>
    <div class="box">
      <div class="btn" v-if="activeTab == '工作台'">
        <!-- <a href="/#/statisticalchart" class="linkBigScreen" target="_blank">
          <myButton>数据大屏</myButton>
        </a> -->
        <i class="el-icon-setting" />
      </div>
      <el-tabs v-model="activeTab" class="tabs">
        <el-tab-pane name="工作台" label="工作台" class="tabpane">
          <workbenches ref="workbenches" v-if="activeTab == '工作台'" />
        </el-tab-pane>
        <el-tab-pane name="信息公开" label="信息公开" class="tabpane">
          <information ref="information" v-if="activeTab == '信息公开'" />
        </el-tab-pane>
        <el-tab-pane name="统计分析" label="统计分析" class="tabpane">
          <statistic ref="statistic" v-if="activeTab == '统计分析'" />
        </el-tab-pane>
        <el-tab-pane name="GIS地图" label="GIS地图" class="tabpane">
          
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
<script>
import workbenches from "./workbenches.vue";
import information from "./information.vue";
import statistic from "./statistic.vue";
export default {
    components: {
        workbenches,
        information,
        statistic
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
    display: flex;
    align-items: center;
    z-index: 200;
    i {
      font-size: 24px;
    }
    .linkBigScreen{
      margin-right: 10px;
    }
  }
}
</style>