<template>
  <div>
    <div class="box" v-if="userType === 1">
      <div class="btn" v-if="activeTab == '工作台'" @click="showModule">
        <!-- <myButton class="appdownload">APP下载</myButton> -->
        <i class="el-icon-setting" />
      </div>
      <el-tabs v-model="activeTab" class="tabs">
        <el-tab-pane name="工作台" label="工作台" class="tabpane">
          <workbenches ref="workbenches" v-if="activeTab == '工作台'" />
        </el-tab-pane>
        <el-tab-pane name="企业画像" label="企业画像" class="tabpane">
          <businessPortraits
            ref="businessPortraits"
            v-if="activeTab == '企业画像'"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <parkovweview v-if="userType === 0" />
    <thirdovweview v-if="userType === 2" />
  </div>
</template>

<script>
import workbenches from "./homeView/workbenches/index.vue";
import businessPortraits from "./homeView/businessPortraits/index.vue";
import riskLedger from "./homeView/riskLedger/index.vue";
import parkovweview from "../views/park/overview/index.vue";
import thirdovweview from "../views/thirdparty/overview/index.vue";

export default {
  name: "Home",
  components: {
    workbenches,
    businessPortraits,
    riskLedger,
    parkovweview,
    thirdovweview,
  },
  data() {
    return {
      activeTab: "工作台",
      baseURL: process.env.VUE_APP_BASE_API,
      loginUser: {},
      userType: null,
    };
  },
  mounted() {},
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (
      this.loginUser.userType == "平台" ||
      this.loginUser.userType == "园区"
    ) {
      this.userType = 0;
    } else if (this.loginUser.userType == "企业") {
      this.userType = 1;
    } else if (this.loginUser.userType == "第三方机构") {
      this.userType = 2;
    }

    console.log(this.userType);
  },
  methods: {
    showModule() {
      this.$refs.workbenches.moduleShow = true;
    },

    // toechart(){
    //   this.$router.push({
    //     path: "/statisticalchart/index",
    //   });
    // }
  },
};
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
    .appdownload {
      margin-right: 10px;
    }
  }
}
</style>
