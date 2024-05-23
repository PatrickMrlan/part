
<template>
  <div class="workbenches">
    <draggable
      v-model="moduleList"
      chosen-class="chosen"
      force-fallback="true"
      group="people"
      animation="500"
      @end="onEnd"
    >
      <transition-group class="draggableArea">
        <div
          v-for="element in moduleList"
          :key="element.moduleCode"
          :class="element.moduleCode"
        >
          <component
            :is="element.moduleCode"
            :data="data"
            :key="timeKey"
          />
        </div>
      </transition-group>
    </draggable>

    <module v-if="moduleShow" @close="moduleClose" />
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";
import draggable from "vuedraggable";
import { moduleList, moduleEdit } from "@/api/system/module.js";
import { entStaging } from "@/api/system/home.js";

import module from "./module.vue";

import statistics from "@/components/HomeCompontents/enterprise/statistics.vue";
import risk_warning from "@/components/HomeCompontents/enterprise/risk_warning.vue";
import quick_navigation from "@/components/HomeCompontents/enterprise/quick_navigation.vue";
import investigation_report from "@/components/HomeCompontents/enterprise/investigation_report.vue";
import disaster_warning from "@/components/HomeCompontents/enterprise/disaster_warning.vue";
import approval_task from "@/components/HomeCompontents/enterprise/approval_task.vue";

export default {
  components: {
    draggable,
    module,
    statistics,
    risk_warning,
    quick_navigation,
    investigation_report,
    disaster_warning,
    approval_task,
  },
  data() {
    return {
      activeName: "first",
      moduleShow: false,

      moduleList: [],
      data: {},

      loading: false,

      timeKey: null,
    };
  },
  mounted() {
    this.getModuleList();
  },

  methods: {
    // 拖拽结束事件
    onEnd() {
      this.loading = true;
      this.moduleList.forEach((item, index) => {
        item.sort = index + 1;
      });
      moduleEdit(this.moduleList)
        .then((res) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    getModuleList() {
      moduleList().then((res) => {
        this.moduleList = res;

        this.getStaging();
      });
    },
    getStaging() {
      entStaging().then((res) => {
        this.data = res;
        this.timeKey = new Date().getTime();
      });
    },
    moduleClose(data) {
      if (data.reload) {
        this.getModuleList();
      }
      this.moduleShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.workbenches {
  display: flex;
  flex-wrap: wrap;
  grid-gap: 24px;
  .draggableArea {
    display: flex;
    flex-wrap: wrap;
    grid-gap: 24px;
  }
  .statistics {
    width: 100%;
  }
  .approval_task {
    width: calc(67% - 24px);
  }
  .disaster_warning {
    width: calc(33% - 16px);
  }

  .investigation_report,
  .quick_navigation,
  .risk_warning {
    width: calc(33% - 16px);
    height: 300px;
    & > div {
      width: 100%;
      height: 100%;
    }
  }
}

/deep/ * {
  &::-webkit-scrollbar {
    width: 5px !important; /*对垂直流动条有效*/
    height: 10px !important;
  }

  //   /*定义滚动条的轨道颜色、内阴影及圆角*/
  //   &::-webkit-scrollbar-track {
  //   }

  /*定义滑块颜色、内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.45);
  }

  /*定义两端按钮的样式*/
  &::-webkit-scrollbar-button {
    /* background-color:#00b1fc;
    border-radius: 4px; */
    display: none;
  }

  /*定义右下角汇合处的样式*/
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
</style>
