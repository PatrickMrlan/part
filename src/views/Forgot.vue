<template>
  <div class="login">
    <!-- 页眉 -->
    <div
      class="login-header"
      :style="{
        background:
          loginType.backgroundColor &&
          loginType.backgroundColor[0].configureValue
            ? loginType.backgroundColor[0].configureValue
            : '#fff',
      }"
    >
      <div class="container" style="justify-content: space-between">
        <div class="logo">
          <div
            v-if="loginType.logo && loginType.logo.configureValue"
            class="pic"
          >
            <img
              :src="
                serverUrl + loginType.logo.configureValue ||
                required('../assets/img/homeIcon/logo-w.png')
              "
              alt="logo图片"
            />
          </div>
          <div
            v-if="loginType.loginTitle && loginType.loginTitle.configureValue"
            class="name"
          >
            {{ loginType.loginTitle.configureValue }}
          </div>
        </div>
        <div class="download">
          <div class="download_div"></div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="login-main">
        <div class="left-img">
          <!--  <div
            class="swiper-container"
            style="overflow: hidden; text-align: center"
          >
            <div class="swiper-wrapper">
              <div
                v-for="(item, index) in leftImg"
                :key="index"
                class="swiper-slide"
              >
                <img :src="serverUrl + item.configureValue" alt="image">
              </div>
            </div>
            <div class="swiper-pagination" />

          </div>-->
        </div>
        <!-- 编辑框 -->
        <div class="form-box" style="width: 600px">
          <el-steps :active="activeValue" simple>
            <el-step title="确认账号" icon="el-icon-s-check"></el-step>
            <el-step title="更新密码" icon="el-icon-edit"></el-step>
            <el-step title="处理结果" icon="el-icon-circle-check"></el-step>
          </el-steps>
          <div>
            <el-form
              ref="forgotForm"
              :model="forgotForm"
              :rules="forgotRules"
              label-width="0px"
            >
              <el-form-item class="tips">
                <span v-if="isTipsTwo">{{ tipsTowText }}</span>
                <span v-else>&nbsp;</span>
              </el-form-item>
              <el-form-item prop="userCode" v-if="activeValue == 1">
                <el-input
                  v-model="forgotForm.userCode"
                  type="text"
                  maxlength="25"
                  auto-complete="off"
                  placeholder="请输入账号"
                  clearable
                >
                  <i slot="prefix">
                    <img src="@/assets/img/loginIcon/user.png" />
                  </i>
                </el-input>
              </el-form-item>
              <el-form-item prop="userPhone" v-if="activeValue == 1">
                <el-input
                  v-model="forgotForm.userPhone"
                  type="text"
                  maxlength="11"
                  auto-complete="off"
                  placeholder="请输入手机号码"
                  clearable
                >
                  <i slot="prefix">
                    <img src="@/assets/img/loginIcon/phone.png" />
                  </i>
                </el-input>
              </el-form-item>

              <el-form-item style="position: relative" v-if="activeValue == 1">
                <el-input
                  v-model="phoneVerifyCode.verifyCode"
                  type="text"
                  maxlength="4"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  class="verifyCode"
                  :style="{
                    borderColor: isVerificationCodeTip ? '#F56C6C' : '#DCDFE6',
                    borderRadius: isVerificationCodeTip ? '4px' : '4px',
                  }"
                  @blur="verifyCodeBlur"
                >
                  <i slot="prefix">
                    <img src="@/assets/img/loginIcon/verificationCode.png" />
                  </i>
                  <i slot="suffix">
                    <img :src="imgUrl" @click="resetImg" />
                  </i>
                </el-input>
                <span
                  v-if="isVerificationCodeTip"
                  class="verificationCodeTip el-form-item__error"
                  >请输入验证码</span
                >
              </el-form-item>
              <el-form-item
                prop="verifyCode"
                class="el-form-item2"
                v-if="activeValue == 1"
              >
                <el-input
                  v-model="forgotForm.verifyCode"
                  type="text"
                  maxlength="10"
                  placeholder="请输入短信验证码"
                  :style="{
                    cursor: isCanSendCode ? 'pointer' : 'not-allowed',
                  }"
                  @keyup.enter.native="handleLogin"
                >
                  <i slot="prefix">
                    <img src="@/assets/img/loginIcon/pass.png" />
                  </i>
                  <span
                    slot="suffix"
                    :style="{
                      paddingRight: isCanSendCode ? '' : '20px',
                      fontSize: isCanSendCode ? '' : '18px',
                    }"
                    @click="sendCode"
                  >
                    {{ sendMsg }}
                  </span>
                </el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px" v-if="activeValue == 1">
                <el-button
                  :loading="loading"
                  :disabled="loading"
                  size="small"
                  type="primary"
                  @click.native.prevent="toVerify"
                >
                  <span v-if="!loading">身份认证</span>
                  <span v-else>认 证 中...</span>
                </el-button>
              </el-form-item>

              <el-form-item prop="userPass" v-if="activeValue == 2">
                <el-input
                  v-model="forgotForm.userPass"
                  type="password"
                  maxlength="20"
                  auto-complete="off"
                  show-password
                  placeholder="请输入密码"
                  clearable
                >
                  <i slot="prefix">
                    <img src="@/assets/img/loginIcon/pass.png" />
                  </i>
                </el-input>
              </el-form-item>
              <el-form-item prop="repeatPass" v-if="activeValue == 2">
                <el-input
                  v-model="forgotForm.repeatPass"
                  type="password"
                  maxlength="20"
                  auto-complete="off"
                  show-password
                  placeholder="请确认输入密码"
                  clearable
                >
                  <i slot="prefix">
                    <img src="@/assets/img/loginIcon/pass.png" />
                  </i>
                </el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px" v-if="activeValue == 2">
                <el-button
                  :loading="loading"
                  :disabled="loading"
                  size="small"
                  type="primary"
                  @click.native.prevent="toResetPass"
                >
                  <span v-if="!loading">重置密码</span>
                  <span v-else>重 置 中...</span>
                </el-button>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px" v-if="activeValue == 3">
                <span>重置密码成功，点击返回登录界面!</span>
                <el-button
                  :loading="loading"
                  :disabled="loading"
                  size="small"
                  type="primary"
                  @click.native.prevent="toLogin"
                >
                  返回登录界面
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <div class="login-bottom">
      <p>
        <span
          v-if="loginType.copyright && loginType.copyright.configureValue"
          >{{ loginType.copyright.configureValue }}</span
        >
        <span v-if="loginType.company && loginType.company.configureValue"
          >{{ loginType.company.configureValue }} 版权所有</span
        >

        <span v-if="loginType.tel && loginType.tel.configureValue">
          联系电话: {{ loginType.tel.configureValue }}
        </span>
      </p>
      <p>技术支持：{{ bottomText }}</p>
    </div>
  </div>
</template>

<script>
import {
  verifyIdentity,
  resetPass,
  sendSmsCode,
  verifyCode,
  loginType,
  phoneVerifyCode,
} from "../api/login";
import { setToken } from "../utils/cookie";
import { Message } from "element-ui";
import config from "../../package.json";
import loginLogo from "../assets/img/logo3.png";
import { validatePassword } from "@/utils/validate";

// import img1 from '../assets/img/login-img1.png'
// import img2 from '../assets/img/login-img2.png'
// import img3 from '../assets/img/login-img3.png'
import crypto from "crypto-js";
// import img2 from '../assets/img/error-images/401.png'

import Swiper from "swiper";
import "swiper/swiper.min.css";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      activeValue: 1,
      serverUrl: process.env.VUE_APP_BASE_API,
      name: config.description,
      bottomText: config.author,
      leftImg: [],
      sendMsg: "获取验证码",
      isCanSendCode: true,
      timer: null,
      loginLogo,
      errorMsg: "",
      forgotForm: {
        userCode: "",
        userPhone: "",
        pcVerifyCode: "",
        uuid: "",
        smsType: 3,
        userPass: "",
        repeatPass: "",
      },
      phoneVerifyCode: {
        uuid: "",
        verifyCode: "",
      },
      forgotRules: {
        userCode: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        pcVerifyCode: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
        ],
        verifyCode: [
          { required: true, trigger: "blur", message: "请输入短信验证码" },
        ],
        userPhone: [
          {
            required: true,
            trigger: "blur",
            message: "手机号不能为空",
          },
          {
            pattern:
              /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: "请填写正确的手机号",
            trigger: "blur",
          },
        ],
        userPass: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, [""]);
            },
            trigger: "change",
          },
        ],
        repeatPass: [
        {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, [""]);
            },
            trigger: "change",
          },
        ],
      },

      loginType: {},
      loading: false,
      redirect: undefined,
      pageList: [],
      pageUserList: [],
      imgUrl: "",
      editPassCode: "",
      isTipsTwo: false,
      isTips: false,
      isVerificationCodeTip: false,
      tipsText: null,
      tipsTowText: null,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.getLoginType();
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    toResetPass() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["forgotForm"].validate((valid) => {
        if (valid) {
          that.loading = true;
          resetPass(that.forgotForm)
            .then((res) => {
              that.loading = false;
              Message({
                type: "success",
                message: "重置成功",
              });
              that.activeValue = 3;
            })
            .catch((error) => {
              // Message({
              //   type: "warning",
              //   message: error.message
              // });
              that.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    toVerify() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["forgotForm"].validate((valid) => {
        if (valid) {
          that.loading = true;
          verifyIdentity(that.forgotForm)
            .then((res) => {
              that.loading = false;
              Message({
                type: "success",
                message: "确认成功",
              });
              that.activeValue = res;
            })
            .catch((error) => {
              // Message({
              //   type: "warning",
              //   message: error.message
              // });
              that.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleClick(tab, event) {},
    /**
     * 跳转到扫码登录页面
     */
    goToScanCodeLogin(type) {
      // this.$router.push({ name: "scanCodeLogin", params: { type: type } });
      this.$message("暂未开放！");
    },
    /**
     * 忘记密码
     */
    clickForgotPassword() {
      // this.$message('请联系管理员！')
      this.$router.push("/forgot");
    },
    // 获取登录方式
    getLoginType() {
      var that = this;
      that.loading = true;
      loginType().then((res) => {
        that.loading = false;
        that.loginType = res;
        that.leftImg = res.backgroundList;
        console.log(that.loginType);
        this.resetImg();
        this.$nextTick(function () {
          // l轮播图初始化函数carouselScroll一定要放在$nextTick回调中执行
          this.bannerOperation();
        });
      });
    },
    sendCode() {
      var that = this;
      // 发送验证码
      const reg = /^1\d{10}$/;
      if (!reg.test(that.forgotForm.userPhone)) {
        return false;
      } else if (!this.phoneVerifyCode.verifyCode) {
        this.isVerificationCodeTip = true;
        return false;
      } else if (!this.isCanSendCode) {
        return false;
      }

      phoneVerifyCode({
        uuid: this.phoneVerifyCode.uuid,
        verifyCode: this.phoneVerifyCode.verifyCode,
      })
        .then((res) => {
          /*
           * 发送验证码逻辑
           */
          sendSmsCode(that.forgotForm)
            .then(() => {
              Message({
                type: "success",
                message: "短信验证码发送成功",
              });
              that.isTipsTwo = false;
              that.setCodeInterval();
            })
            .catch((res) => {
              console.log(res);
              Message({
                type: "error",
                message: res.message,
              });
              this.tipsTowText = res.message;
              this.isTipsTwo = true;
              this.resetImg();
            });
        })
        .catch((error) => {
          console.log(error);
          this.phoneVerifyCode.verifyCode = null;
          this.tipsTowText = error.message;
          this.isTipsTwo = true;
          this.resetImg();
        });
    },
    setCodeInterval() {
      var that = this;
      // 设置验证码重新发送定时器
      let time = 60;
      console.log(time);
      that.sendMsg = time + "s";
      // clearInterval(that.timer);
      that.timer = setInterval(() => {
        time--;
        that.sendMsg = time + "s";
        that.isCanSendCode = false;
        if (time <= 0) {
          that.isCanSendCode = true;
          that.sendMsg = "重新获取";
          clearInterval(that.timer);
        }
      }, 1000);
    },
    // 点击图片更换验证码
    resetImg() {
      const that = this;
      const data = that.loginType.verificationMethod.configureKey;
      verifyCode({ type: data }).then((res) => {
        that.imgUrl = res.imgUrl;
        that.forgotForm.uuid = res.uuid;
        that.phoneVerifyCode.uuid = res.uuid;
      });
    },
    /**
     * 轮播图的操作
     */
    bannerOperation() {
      new Swiper(".swiper-container", {
        // direction: "vertical", // 垂直切换选项
        loop: true, // 循环模式选项
        autoplay: true,
        // autoplay: {
        //   disableOnInteraction: false // 手动滑动后继续自动播放
        // },

        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination",
          clickable: true, // 必须设置，不然鼠标悬浮不会切换
        },

        // 如果需要前进后退按钮

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },

        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
      });
    },

    /**
     * 验证码失去焦点的时候
     */
    verifyCodeBlur() {
      if (this.phoneVerifyCode.verifyCode) {
        this.isVerificationCodeTip = false;
      } else {
        this.isVerificationCodeTip = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.accountOperation {
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
}

.el-input {
  --el-input-focus-border: red;
  --el-input-focus-border-color: red;
}

.login {
  height: 100vh;
  width: 100%;
  background: url("../assets/img/loginBg.png") no-repeat;
  background-size: cover;

  // 页眉
  .login-header {
    // background: #fff;
    .container {
      height: 60px;
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;

        .pic {
          width: auto;
          height: 30px;
          margin-right: 5px;

          img {
            width: auto;
            height: 30px;
          }
        }

        .name {
          font-size: 22px;
          font-weight: bold;
          color: #2b2b2b;
        }
      }

      .download {
        display: flex;
        align-items: center;
        color: #2b2b2b;

        span {
          font-size: 16px;
          cursor: pointer;
        }

        i {
          margin: 0 5px;
        }
      }
    }

    .container:before {
      content: none;
    }

    .container:after {
      content: none;
    }
  }

  .container {
    // 中间部分
    .login-main {
      height: calc(100vh - 120px);
      display: flex;
      justify-content: space-between;
      align-items: center;

      // 轮播图
      .left-img {
        width: 50%;
        height: calc(100vh - 430px);
        min-height: 450px;
        max-height: 600px;
        overflow: hidden;

        .swiper-container {
          width: 100%;
          height: 100%;

          img {
            width: 100%;
            height: 100%;
          }

          .swiper-pagination {
            text-align: right;
          }
        }
      }

      // 登陆框
      .form-box {
        width: 400px;
        height: 508px;
        background: #fff;
        border-radius: 3px;
        padding: 42px 40px 0;
        box-sizing: border-box;
        box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
        position: relative;

        /deep/.el-form-item2 {
          margin-bottom: 12px;
        }

        /deep/.el-tabs__header {
          margin: 0;
        }

        /deep/.el-tabs__nav {
          width: 100%;
          display: flex;
          justify-content: center;

          .el-tabs__active-bar {
            background-color: #018a32;
            margin-left: 51px;
          }

          .el-tabs__item {
            color: #000;
          }

          .is-active {
            color: #018a32;
          }
        }

        /deep/.el-input__inner {
          height: 50px;
          padding-left: 40px;
          font-size: 14px;
        }

        /deep/.el-input__prefix {
          padding: 12px 12px 0 8px;
        }

        /deep/.el-input__suffix {
          cursor: pointer;
          line-height: 49px;
          font-size: 14px;
          font-weight: bold;
          color: #018a32;
          right: 1px;

          img {
            width: 100px;
            height: 48px;
            border-radius: 4px;
            margin-top: 1px;
          }
        }

        .option {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .el-checkbox {
            color: #9598a6;
          }

          .forgotPassword {
            cursor: pointer;

            span {
              font-size: 14px;
              font-weight: bold;
              color: #018a32;
            }
          }
        }

        /deep/.el-button {
          width: 100% !important;
          height: 50px;
          font-size: 16px;
        }

        /deep/.el-button--primary {
          background-color: #018a32;
          border-color: #018a32;
        }

        /deep/.el-button--primary:hover {
          opacity: 0.8;
        }

        /deep/.articleRules {
          .el-checkbox {
            color: #9598a6;

            i {
              color: #000;
              font-style: normal;
            }
          }

          .el-checkbox__input.is-checked + .el-checkbox__label i {
            color: #018a32;
          }
        }

        /deep/.tips {
          text-align: center;
          margin-bottom: 0;

          span {
            color: #fe0000;
          }
        }

        /deep/.verifyCode {
          border: 1px solid #dcdfe6;

          input {
            border: none;
          }

          .verificationCodeTip {
            position: absolute;
            font-size: 12px;
          }
        }
      }

      .otherMethods {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        border-top: 1px solid #efefef;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          display: flex;
          align-items: center;

          img {
            margin-right: 4px;
          }

          span {
            font-size: 14px;
            color: #9598a6;
          }
        }

        div:nth-of-type(2) {
          margin: 0 24px;
        }

        div:nth-child(n + 2) {
          cursor: pointer;

          span {
            color: #101010;
          }
        }
      }
    }
  }

  // 页脚
  .login-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: #fff;
    color: #333;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
      font-size: 14px;
      color: #9598a6;

      span {
        margin: 0 5px;
      }
    }
  }
}

@media screen and (min-width: 500px) and (max-width: 1100px) {
  .left-img {
    display: none;
  }
}

@media screen and (max-width: 499px) {
  .left-img {
    display: none;
  }

  .login-header {
    font-size: 22px !important;
    font-weight: normal !important;
  }
}

.vertify_img {
  width: 100px;
  height: 56px;
  border-radius: 4px;
}

.pcVerifyCodeDiv {
  display: flex;
  align-items: center;

  .el-input {
    .el-input__inner {
      width: 98% !important;
    }
  }
}

.download_div {
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    margin: 0 5px;
  }
}
</style>

