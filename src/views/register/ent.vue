<template>
  <div class="help_bg">
    <div class="register">
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
            <div class="download_div">
              <span @click="goLogin()">登录</span>
              <!-- <el-popover placement="bottom" trigger="hover">
          <div><img src="@/assets/img/app_download.png"></div>
          <div slot="reference" class="download_div">
            <img
              style="width: 20px; height: 20px"
              src="@/assets/img/phone.png"
            ><span>APP端下载</span>
          </div>
        </el-popover> -->
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="margin-top: 10px">
        <div class="form_title">{{ parkName }}企业注册</div>
        <div class="form-box">
          <el-form
            ref="registerForm"
            :model="registerForm"
            :rules="rules"
            label-width="150px"
          >
            <el-col :span="24">
              <el-form-item label="单位全称：" prop="entName">
                <el-input
                  v-model="registerForm.entName"
                  type="text"
                  maxlength="25"
                  placeholder="请输入单位全称"
                  clearable
                />
                <!-- <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="primary"
                  @click.native.prevent="handleLogin"
                >
                  <span>获取信息</span>

                </el-button> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="统一社会信用代码：" prop="entCode">
                <el-input
                  v-model="registerForm.entCode"
                  type="text"
                  maxlength="100"
                  placeholder="请输入统一社会信用代码"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="注册地址：" prop="address">
                <el-input
                  v-model="registerForm.address"
                  type="text"
                  maxlength="200"
                  placeholder="请输入注册地址"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="企业位置：" prop="entLocation">
                <el-radio
                  v-model="registerForm.entLocation"
                  :disabled="parkbol"
                  label="1"
                  >园内企业</el-radio
                >
                <el-radio
                  v-model="registerForm.entLocation"
                  :disabled="parkbol"
                  label="2"
                  >园外企业</el-radio
                >
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="所在园区：" prop="parkId">
                <el-select
                  v-model="registerForm.parkId"
                  filterable
                  style="width: 100%"
                  placeholder="请选择"
                  @change="changePark"
                >
                  <el-option
                    v-for="item in parkList"
                    :key="item.parkId"
                    :label="item.parkName"
                    :value="item.parkId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="联系人：" prop="contact">
                <el-input
                  v-model="registerForm.contact"
                  type="text"
                  maxlength="20"
                  placeholder="请输入联系人"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机号码：" prop="contactTel">
                <el-input
                  v-model="registerForm.contactTel"
                  type="text"
                  maxlength="11"
                  placeholder="请输入手机号码"
                  @change="changeTel($event)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="管理账号：" prop="loginCode">
                <el-input
                  v-model="registerForm.loginCode"
                  type="text"
                  maxlength="20"
                  auto-complete="off"
                  placeholder="请输入管理账号"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="登录密码：" prop="loginPass">
                <el-input
                  v-model="registerForm.loginPass"
                  show-password
                  type="password"
                  maxlength="20"
                  auto-complete="new-password"
                  placeholder="至少包含大小字母、数字、特殊符号(#?!@$%^*-)，最小8位，最大20位"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="重复密码：" prop="repeatPassword">
                <el-input
                  v-model="registerForm.repeatPassword"
                  show-password
                  type="password"
                  maxlength="20"
                  auto-complete="new-password"
                  placeholder="至少包含大小字母、数字、特殊符号(#?!@$%^*-)，最小8位，最大20位"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="验证码：" prop="code">
                <el-input
                  v-model="registerForm.code"
                  type="text"
                  maxlength="4"
                  placeholder="请输入验证码"
                >
                  <i slot="suffix">
                    <img style="height: 32px" :src="imgUrl" @click="resetImg" />
                  </i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <!-- <el-form-item label="短信验证码：" prop="telCode"> -->
              <el-form-item label="短信验证码：">
                <el-input
                  v-model="registerForm.telCode"
                  type="text"
                  maxlength="6"
                  placeholder="请输入验证码"
                  class="verifyCode"
                  :style="{
                    cursor: isCanSendCode ? 'pointer' : 'not-allowed',
                  }"
                  @keyup.enter.native="submit"
                >
                  <span
                    slot="suffix"
                    :style="{
                      paddingRight: isCanSendCode ? '10px' : '20px',
                      fontSize: isCanSendCode ? '' : '18px',
                    }"
                    @click="sendCode"
                  >
                    {{ sendMsg }}
                  </span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <el-col :span="24">
          <div class="btm" style="text-align: center">
            <el-button
              :loading="loading"
              :disabled="loading"
              size="small"
              type="primary"
              @click.native.prevent="submit"
            >
              <span v-if="!loading">立即注册</span>
              <span v-else>注册中...</span>
            </el-button>
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import {
  verifyCode,
  loginType,
  phoneVerifyCode,
  sendSmsCode,
} from "@/api/login";
import { parkList, entRegister, parkDetail } from "@/api/register";
import { Message } from "element-ui";
import { validatePassword } from "@/utils/validate";

import "swiper/swiper.min.css";

export default {
  name: "EntRegister",
  components: {},
  data() {
    const validateCofirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.loginPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      serverUrl: process.env.VUE_APP_BASE_API,
      registerForm: {
        entLocation: "1",
      },
      sendMsg: "获取验证码",
      isCanSendCode: true,
      loading: false,
      loginType: {},

      rules: {
        entName: [
          { required: true, message: "请输入企业全称！", trigger: "change" },
        ],
        entCode: [
          {
            required: true,
            message: "请输入企业统一社会信用代码！",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入企业注册地址！",
            trigger: "change",
          },
        ],
        contact: [
          { required: true, message: "请输入联系人！", trigger: "change" },
        ],
        parkId: [
          { required: true, message: "请选择园区！", trigger: "change" },
        ],
        contactTel: [
          { required: true, message: "请输入手机号码！", trigger: "change" },
          {
            pattern: /^(1\d{10})$/,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],
        loginCode: [
          { required: true, message: "请输入管理账号！", trigger: "change" },
        ],
        repeatPassword: [
          { required: true, message: "请输入重复密码！", trigger: "change" },
          { required: true, validator: validateCofirmPass, trigger: "change" },
        ],
        loginPass: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, [""]);
            },
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "请输入验证码！", trigger: "change" },
        ],
        telCode: [
          { required: true, message: "请输入短信验证码！", trigger: "change" },
        ],
      },
      parkList: [],
      imgUrl: null,
      parkName: null,
      parkbol: false,
    };
  },
  watch: {},
  created() {
    this.getPark();
    this.getLoginType();
    this.resetImg();
    var parkId = this.getparam("parkId");
    if (parkId) {
      this.registerForm.parkId = parkId;
      this.parkDetail();
      this.parkbol = true;
    }
  },
  mounted() {},
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    changeTel(e) {
      const reg = /^(1\d{10})$/;
      if (reg.test(e) && !this.registerForm.loginCode) {
        this.$set(this.registerForm, "loginCode", e);
      }
      this.$forceUpdate();
    },

    changePark() {
      if (!this.registerForm.parkId || this.registerForm.parkId == " ") {
        this.registerForm.entLocation = 2;
        return;
      }

      if (this.registerForm.parkId) {
        this.registerForm.entLocation = 1;
      }
    },
    goLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    getPark() {
      var that = this;
      parkList().then((res) => {
        that.parkList = res;
        that.parkList.unshift({
          parkName: "非园区企业",
          parkId: " ",
        });
      });
    },
    sendCode() {
      var that = this;
      // 发送验证码
      const reg = /^1\d{10}$/;

      if (!that.registerForm.code) {
        Message({
          type: "error",
          message: "请输入验证码",
        });
        return false;
      }
      if (!reg.test(that.registerForm.contactTel)) {
        Message({
          type: "error",
          message: "手机号码不合法",
        });
        return false;
      } else if (!this.isCanSendCode) {
        return false;
      }

      phoneVerifyCode({
        uuid: that.registerForm.uuid,
        verifyCode: this.registerForm.code,
      })
        .then((res) => {
          /*
           * 发送验证码逻辑
           */
          sendSmsCode({
            userPhone: that.registerForm.contactTel,
            smsType: 1,
          }).then(() => {
            Message({
              type: "success",
              message: "短信验证码发送成功",
            });
            that.setCodeInterval();
          });
        })
        .catch((error) => {
          console.log(error);
          this.registerForm.verifyCode = null;
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
    getLoginType() {
      var that = this;
      that.loading = true;
      loginType().then((res) => {
        that.loading = false;
        that.loginType = res;
      });
    },
    // 点击图片更换验证码
    resetImg() {
      const that = this;
      verifyCode({ type: "VerificationMethod_RandomNumber" }).then((res) => {
        that.imgUrl = res.imgUrl;
        that.registerForm.uuid = res.uuid;
      });
    },
    getparam(parameterName) {
      // 获取当前页面的完整 URL
      const currentURL = window.location.href;

      // 使用正则表达式匹配 URL 中的查询参数部分
      const parameterMatch = currentURL.match(/\?(.*)/);

      if (parameterMatch) {
        // 如果有匹配到参数部分
        const queryString = parameterMatch[1];

        // 将查询参数字符串解析为对象
        const params = {};
        queryString.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          params[key] = decodeURIComponent(value);
        });
        // 使用 params 获取特定参数的值
        const parameterValue = params[parameterName];
        return parameterValue;
      }
    },
    // 园区企业
    parkDetail() {
      var that = this;
      that.loading = true;
      parkDetail({ parkId: this.registerForm.parkId }).then((res) => {
        this.parkName = res.parkName;
      });
    },

    submit() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["registerForm"].validate((valid) => {
        if (valid) {
          that.loading = true;

          entRegister(that.registerForm)
            .then((res) => {
              that.loading = false;
              Message({
                type: "success",
                message: "注册成功",
              });
              that.$emit("close", { reload: true });
              that.$router.push({
                path: "/login",
              });
            })
            .catch((error) => {
              // Message({
              //   type: "warning",
              //   message: error.message
              // });
              that.resetImg();
              that.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.help_bg {
  background: url("../../assets/img/loginBg.png") no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
  overflow: auto;
}
.container {
  background: #fff;
  width: 50%;
  min-width: 350px;
  max-width: 600px;
}

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
.form-box {
  background: #fff;
  margin-right: 30px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.form_title {
  padding: 20px 0;
  box-sizing: border-box;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
}
.btm {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/.el-button {
    width: 80%;
    height: 70%;
  }
}
/deep/.el-input__suffix {
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #018a32;
  right: 1px;
}
</style>
