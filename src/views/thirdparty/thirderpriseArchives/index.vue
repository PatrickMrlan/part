<template>
  <div class="table-classic-wrapper">
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <div class="right">
          <myButton @click.native="register()">员工注册</myButton>
          <myButton
            icon="el-icon-edit"
            v-if="pageOper.XG"
            @click.native="edit(null)"
            >完善档案</myButton
          >
        </div>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <el-card class="box-card info">
        <h3>
          <img src="@/assets/img/enterprise/enterprise-logo.png" />
          <span class="hiddenText">{{ detailInfo.thirdPartyName }}</span>
        </h3>
        <div class="basic">
          <div class="basic_left">
            <div class="contactsInfo">
              <div class="riskIcon">
                <img :src="detailInfo.businessLicense" />
              </div>
              <div class="detail">
                <div class="user">
                  <img src="@/assets/img/homeIcon/risk-user.png" />
                  <span>联系人：</span>
                  <strong>{{ detailInfo.contact }}</strong>
                </div>
                <div class="tel">
                  <img src="@/assets/img/homeIcon/risk-tel.png" />
                  <span>联系人电话：</span>
                  <strong>{{ detailInfo.contactTel }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="basic_right">
            <ul>
              <li>
                <img src="@/assets/img/enterprise/enterprise-menu-icon.png" />
                <span class="label">信用代码：</span>
                <span class="text">{{ detailInfo.parkCode }}</span>
              </li>
              <!-- <li>
                  <img src="@/assets/img/enterprise/enterprise-menu-icon.png" />
                  <span class="label">联系人：</span>
                  <span class="text">{{ detailInfo.contact }}</span>
                </li>
                <li>
                  <img src="@/assets/img/enterprise/enterprise-date-icon.png" />
                  <span class="label">联系电话：</span>
                  <span class="text">{{ detailInfo.contactTel }}</span>
                </li> -->

              <li>
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png" />
                <span class="label">统一社会信用代码：</span>
                <span class="text">{{ detailInfo.thirdPartyCode }}</span>
              </li>
              <li>
                <img src="@/assets/img/enterprise/enterprise-menu-icon.png" />
                <span class="label">成立日期：</span>
                <span class="text">{{ detailInfo.establishDate }}</span>
              </li>
              <!-- <li>
                  <img src="@/assets/img/enterprise/enterprise-date-icon.png" />
                  <span class="label">国民经济分类：</span>
                  <span class="text">
                    {{ detailInfo.nationalEconomyKey }}
                  </span>
                </li> -->
              <li>
                <img src="@/assets/img/enterprise/enterprise-plan-icon.png" />
                <span class="label">企业地址：</span>
                <span class="text">{{ detailInfo.address }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="state_icon">
          <img
            src="@/assets/img/enterprise/state-normal.png"
            v-if="detailInfo.entState == '正常'"
          />
          <img
            src="@/assets/img/enterprise/state-not.png"
            v-if="detailInfo.entState == '审核不通过'"
          />
          <img
            src="@/assets/img/enterprise/state-register.png"
            v-if="detailInfo.entState == '新注册'"
          />
          <img
            src="@/assets/img/enterprise/state-review.png"
            v-if="detailInfo.entState == '待审核'"
          />
        </div>
      </el-card>
      <el-tabs type="border-card" class="other">
        <el-tab-pane label="基本信息">
          <div class="supplement_info"></div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <register
      v-if="registerShow"
      :id="editId"
      :visible="registerShow"
      @close="registerClose"
    />
  </div>
</template>

<script>
import { detail } from "@/api/thirdparty/information";
import register from "./register.vue";
export default {
  components: { register },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      loginUser: {},
      detailInfo: {},
      editId: null,
      registerShow: false
    };
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysThirdParty) {
      this.getMainData();
    } else {
      this.$message({
        type: "warning",
        message: "当前用户暂无第三方!"
      });
    }
  },
  methods: {
    getMainData() {
      detail({ id: this.loginUser.sysThirdParty.thirdPartyId })
        .then(res => {
          console.log(res);
          this.detailInfo = res;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //注册
    register() {
      this.editId = this.loginUser.sysThirdParty.thirdPartyId;
      this.registerShow = true;
    },
    /**
     * 关闭侧边框
     */
    editClose(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    registerClose(data) {
      this.registerShow = false;
      if (data.reload) {
        this.getMainData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.hiddenText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

ul {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  grid-gap: 20px;
  padding: 10px 0;
  li {
    min-width: calc(100% / 3 - 20px);
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
      font-size: 14px;
      color: #000000;
    }
    .label {
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      img {
        margin-right: 5px;
      }
    }
  }
  .imgs {
    width: 100%;
    align-items: flex-start;
    .pic {
      display: flex;
      flex-wrap: wrap;
      grid-gap: 10px;
      img {
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
    }
  }
}

.table-classic-wrapper {
  background-color: #f0f2f5;
  height: 100%;
}

.flex {
  justify-content: flex-end;
  .right {
    margin: 0 !important;
  }
}

/deep/.content {
  height: calc(100% - 42px);
  .el-card {
    margin-bottom: 10px;
  }
  .el-card__body {
    height: 100%;
  }

  .info {
    height: 30%;
    min-height: 220px;
    position: relative;

    h3 {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
        font-weight: bold;
        font-size: 22px;
        width: 100%;
      }
    }
    .basic {
      display: flex;
      height: calc(100% - 35px);
      .basic_left {
        min-width: 350px;
        width: 30%;
        .contactsInfo {
          display: flex;
          align-items: center;
          .riskIcon {
            padding: 20px;
            width: 118px;
            height: 118px;
            box-sizing: border-box;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .detail {
            width: calc(100% - 118px);
            & > div {
              display: flex;
              align-items: center;
              height: 40px;
              background: rgba(0, 0, 0, 0.03);
              border-radius: 5px;
              padding: 8px;
              font-size: 14px;
              margin: 4px 0;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              span {
                color: #262626;
                margin-left: 8px;
                min-width: 90px;
              }
              strong {
                color: #006eff;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }

      .basic_right {
        width: 70%;
        margin-left: 30px;
        height: 100%;
        overflow: auto;
      }
    }
    .state_icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  .other {
    height: calc(70% - 10px);
    border-radius: 4px;
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
}

/deep/.el-tabs__header {
  height: 40px;
}
/deep/.el-tab-pane {
  height: 100%;
  overflow: auto;
}

/deep/.el-tabs__content {
  height: calc(100% - 40px);
  .el-tab-pane {
    height: 100%;
  }
}

.basic_info {
  height: 100%;

  .label {
    min-width: 130px;
    text-align: right;
  }
}

.supplement_info {
  height: 100%;

  .label {
    min-width: 170px;
    text-align: right;
  }
}

// 滚动条整体部分
&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
// 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
&::-webkit-scrollbar-button {
  display: none;
}
// 滚动条的轨道（里面装有Thumb）
&::-webkit-scrollbar-track {
  background: transparent;
}
// 滚动条的轨道（里面装有Thumb）
&::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
// 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
&::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  cursor: pointer;
  border-radius: 4px;
}
/deep/.my_table {
  margin-bottom: 20px;
}
</style>
