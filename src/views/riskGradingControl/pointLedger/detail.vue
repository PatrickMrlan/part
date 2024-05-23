<template>
  <div class="table-classic-wrapper">
    <div class="header" ref="header">
      <div class="title">
        <i class="el-icon-back" @click="back" />
        <span>{{ $route.query.name }}</span>
      </div>
    </div>

    <div class="info boxShadow" ref="info">
      <div class="title">
        <img src="@/assets/img/enterprise/title-icon.png" />
        <span>{{ dialogForm.riskPointName }}</span>
        <img src="@/assets/img/enterprise/position.png" />
      </div>
      <el-row :gutter="20">
        <div class="info_detail">
          <el-col :span="6">
            <div class="riskLevel">
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-menu-icon.png"
                />风险等级：
              </div>
              <span class="red" v-if="dialogForm.riskLevel == '重大风险'">{{
                dialogForm.riskLevel
              }}</span>
              <span class="orange" v-if="dialogForm.riskLevel == '较大风险'">{{
                dialogForm.riskLevel
              }}</span>
              <span class="yellow" v-if="dialogForm.riskLevel == '一般风险'">{{
                dialogForm.riskLevel
              }}</span>
              <span class="blue" v-if="dialogForm.riskLevel == '低风险'">{{
                dialogForm.riskLevel
              }}</span>
            </div>
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-plan-icon.png"
                />管控层级：
              </div>
              <span>{{ dialogForm.controlLevel }}</span>
            </div>
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-user-icon.png"
                />审核人：
              </div>
              <span>{{ dialogForm.reviewName }}</span>
            </div>
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-user-icon.png"
                />审核状态：
              </div>
              <span>{{ dialogForm.reviewStatus }}</span>
            </div>
          </el-col>

          <el-col :span="8">
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-thing-icon.png"
                />主要事故类型：
              </div>
              <span>{{ dialogForm.majorNames }}</span>
            </div>
            <div class="person">
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-user-icon.png"
                />责任人：
              </div>
              <ul>
                <li>
                  <span class="type">公司级</span>
                  <span>总经理</span>
                </li>
                <li>
                  <span class="type">部门/分厂级</span>
                  <span>生产部经理</span>
                </li>
                <li>
                  <span class="type">班组/工段级</span>
                  <span>车间主任</span>
                </li>
              </ul>
            </div>
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-date-icon.png"
                />审核时间：
              </div>
              <span>{{ dialogForm.reviewTime }}</span>
            </div>
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-date-icon.png"
                />最近评估时间：
              </div>
              <span>{{ dialogForm.updateTime }}</span>
            </div>
          </el-col>

          <el-col :span="10">
            <div>
              <div class="label">
                <img
                  src="@/assets/img/enterprise/enterprise-user-icon.png"
                />现场照片：
              </div>
              <div class="pic">
                <el-image
                  v-for="(item, index) in dialogForm.imgList"
                  :key="index"
                  style="width: 100px; height: 100px; margin-right: 10px"
                  :src="baseURL + item.fileUrl"
                  fit="contain"
                  :preview-src-list="srcList"
                />
              </div>
            </div>
          </el-col>
        </div>
      </el-row>
    </div>

    <div class="tabs">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="风险源（点）" name="风险源（点）" class="tabpane">
          <riskSource
            v-if="activeName == '风险源（点）'"
            ref="riskSource"
            :riskSoureData="riskCategoryList"
          />
        </el-tab-pane>
        <el-tab-pane label="管控措施" name="管控措施" class="tabpane">
          <measure v-if="activeName == '管控措施'" />
        </el-tab-pane>
        <el-tab-pane label="巡检台账" name="巡检台账" class="tabpane">
          <inspection v-if="activeName == '巡检台账'" />
        </el-tab-pane>
        <el-tab-pane label="隐患台账" name="隐患台账" class="tabpane">
          <hidden v-if="activeName == '隐患台账'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
  
  <script>
import riskSource from "./tabs/riskSource.vue";
import measure from "./tabs/measure.vue";
import inspection from "./tabs/inspection.vue";
import hidden from "./tabs/hidden.vue";

import { detail, enumList } from "@/api/risk/riskPoint";

export default {
  components: { riskSource, measure, inspection, hidden },

  props: {
    type: {
      require: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      activeName: "",

      dialogForm: {},
      riskCategoryList: null,
      srcList: [],
    };
  },
  async created() {
    await this.getEnumList();
    await this.loadData();
  },

  mounted() {},

  methods: {
    getEnumList() {
      enumList().then((res) => {
        console.log(res);
      });
    },

    loadData() {
      this.loading = true;
      detail({ id: this.$route.query.id })
        .then((res) => {
          this.dialogForm = res.riskPoints;
          this.riskCategoryList = res.riskCategoryList;

          if (this.dialogForm.imgList && this.dialogForm.imgList.length) {
            this.dialogForm.imgList.forEach((item) => {
              this.srcList.push(this.baseURL + item.fileUrl);
            });
          }

          this.$nextTick(() => {
            this.activeName = "风险源（点）";
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    back() {
      this.$router.go(-1);
    },
  },
};
</script>
  
  <style lang="less" scoped>
.table-classic-wrapper {
  height: 100%;
  background: #f0f2f5;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
}

.boxShadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.16);
}

.header {
  box-sizing: border-box;
  .title {
    height: 30px;
    font-size: 20px;
    font-family: "Microsoft YaHei, Microsoft YaHei";
    font-weight: bold;
    color: #006cfb;
    i {
      font-weight: bold;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}

.info {
  background: #fff;
  box-sizing: border-box;
  padding: 12px 32px;
  height: calc(35% - 25px);
  overflow: auto;
  .title {
    display: flex;
    align-items: center;
    span {
      font-size: 26px;
      font-weight: bold;
      color: #252525;
      margin: 0 12px;
    }
  }
  /deep/.info_detail {
    margin-top: 16px;
    overflow: hidden;
    .el-col {
      & > div:not(:last-child) {
        margin-bottom: 10px;
      }
      & > div {
        display: flex;
        .label {
          display: flex;
          font-size: 14px;
          color: #999999;
          margin-right: 5px;
          white-space: nowrap;
          img {
            margin: 3px 5px 0 0;
            width: 16px;
            height: 16px;
          }
        }
        span {
          font-size: 14px;
          color: #262626;
        }
        .pic {
          img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            margin-bottom: 10px;
          }
          img:not(:last-child) {
            margin-right: 10px;
          }
        }
      }
      .riskLevel {
        span {
          font-size: 12px;
          border-radius: 4px;
          padding: 0 5px;
        }
        .red {
          background: rgba(245, 34, 45, 0.1);
          border: 1px solid rgba(245, 34, 45, 0.15);
          color: rgba(245, 34, 45, 0.85);
        }
        .orange {
          background: rgba(249, 156, 55, 0.1);
          border: 1px solid rgba(249, 156, 55, 0.15);
          color: rgba(249, 156, 55, 0.85);
        }
        .yellow {
          background: rgba(249, 223, 54, 0.1);
          border: 1px solid rgba(249, 223, 54, 0.15);
          color: rgba(249, 223, 54, 0.85);
        }
        .blue {
          background: rgba(92, 181, 255, 0.1);
          border: 1px solid rgba(92, 181, 255, 0.15);
          color: rgba(92, 181, 255, 0.85);
        }
      }

      .person {
        margin-bottom: 6px;
        ul {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          li {
            margin-bottom: 8px;
            span {
              font-size: 12px;
              color: #000000;
              border-radius: 0px 0px 1px 1px;
              border: 1px solid rgba(0, 0, 0, 0.25);
              padding: 0 5px;
              white-space: nowrap;
            }
            .type {
              background: #f5f5f5;
              border-radius: 1px 0px 0px 1px;
              border: 1px solid rgba(0, 0, 0, 0.25);
              color: #999999;
            }
          }
        }
        li:not(:last-child) {
          margin-right: 8px;
        }
      }
    }
  }
}

/deep/.tabs {
  height: 60%;
  & > .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 39px);
    }
  }
  .el-tabs__header {
    border-radius: 4px 4px 0 0;
    .el-tabs__item.is-active {
      color: #000000;
    }
    .el-tabs__item:not(.is-disabled):hover {
      color: #000000;
    }
  }
}

/deep/.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

/deep/.tabpane {
  height: 100%;
}
</style>

