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
            </div>
          </div>
        </div>
      </div>

      <div class="container userfrombox" style="margin-top: 10px">
        <div class="form_title">{{ sysEnterprise.thirdPartyName }}用户注册</div>
        <div class="form-box">
          <el-form
            ref="registerForm"
            :model="registerForm"
            :rules="rules"
            label-width="150px"
          >
            <el-form-item class="tips">
              <span v-if="isTips">{{ tipsText }}</span>
              <span v-else> &nbsp; </span>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="姓名：" prop="userName">
                  <el-input
                    v-model="registerForm.userName"
                    type="text"
                    maxlength="50"
                    placeholder="请输入姓名"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="手机号码：" prop="userTel">
                  <el-input
                    v-model="registerForm.userTel"
                    type="text"
                    maxlength="11"
                    placeholder="请输入手机号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="人员身份：" prop="userIdentity">
                  <el-radio
                    v-model="registerForm.userIdentity"
                    v-for="(item, idx) in userIdentityList"
                    :label="item.value"
                    :key="idx"
                    >{{ item.key }}</el-radio
                  >
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="登录账号：" prop="loginCode">
                  <el-input
                    v-model="registerForm.loginCode"
                    type="text"
                    auto-complete="new-password"
                    maxlength="20"
                    placeholder="请输入登录账号"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="登录密码：" prop="loginPass">
                  <el-input
                    v-model="registerForm.loginPass"
                    type="password"
                    :show-password="true"
                    maxlength="20"
                    auto-complete="new-password"
                    placeholder="请输入登录密码"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="重复密码：" prop="repeatPassword">
                  <el-input
                    v-model="registerForm.repeatPassword"
                    type="password"
                    :show-password="true"
                    maxlength="20"
                    auto-complete="new-password"
                    placeholder="请输入重复密码"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="验证码：" prop="code">
                  <el-input
                    v-model="registerForm.code"
                    type="text"
                    maxlength="8"
                    placeholder="请输入验证码"
                    class="code"
                  >
                    <i slot="suffix">
                      <img
                        style="height: 38px"
                        :src="imgUrl"
                        @click="resetImg"
                      />
                    </i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="btmbox">
          <el-button
            class="submit"
            :loading="loading"
            :disabled="loading"
            size="small"
            type="primary"
            @click="submit('registerForm')"
          >
            {{ loading ? "注册中..." : "立即注册" }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyCode, loginType } from "@/api/login";
import { Message } from "element-ui";
import { validatePassword } from "@/utils/validate";

import {
  thirdPartyUserRegister,
  enumList,
  thirdPartyDetail,
} from "@/api/register";
import "swiper/swiper.min.css";
export default {
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
      registerForm: {},
      sysEnterprise: {},
      loading: false,
      loginType: {},
      isTips: false,
      rules: {
        userName: [
          { required: true, message: "请输入用户姓名！", trigger: "blur" },
        ],
        userTel: [
          { required: true, message: "请输入手机号码！", trigger: "blur" },
          {
            pattern: /^(1\d{10})$/,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],
        userIdentity: [
          { required: true, message: "请选择用户身份！", trigger: "change" },
        ],
        loginCode: [
          { required: true, message: "请输入登录账号！", trigger: "blur" },
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
        repeatPassword: [
          { required: true, message: "请输入重复密码！", trigger: "blur" },
          { required: true, validator: validateCofirmPass, trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入验证码！", trigger: "blur" }],
      },
      userIdentityList: [],
      imgUrl: null,
    };
  },
  created() {
    var thirdPartyId = this.getparam("thirdPartyId");
    console.log(thirdPartyId);
    this.registerForm.thirdPartyId = thirdPartyId;
    this.thirdPartyDetail();
    this.getEnumList();
    this.resetImg();
    this.getLoginType();
  },
  methods: {
    getLoginType() {
      var that = this;
      that.loading = true;
      loginType().then((res) => {
        that.loading = false;
        that.loginType = res;
      });
    },
    goLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    getEnumList() {
      enumList().then((res) => {
        this.userIdentityList = res.userIdentityList;
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
    thirdPartyDetail() {
      var that = this;
      that.loading = true;
      thirdPartyDetail({ thirdPartId: this.registerForm.thirdPartyId }).then(
        (res) => {
          console.log(res);
          this.sysEnterprise = res;
          if (res.isOpenRegister == "否") {
            this.$message({
              type: "error",
              message: "当前企业未开放注册，请联系管理员",
            });
            return;
          }
        }
      );
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
    submit(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      if (this.sysEnterprise.isOpenRegister == "否") {
        Message({
          type: "error",
          message: "当前企业未开放注册，请联系管理员",
        });
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          thirdPartyUserRegister(that.registerForm)
            .then((res) => {
              that.loading = false;
              that.$message({
                type: "success",
                message: "注册成功",
              });
              that.$emit("close", { reload: true });
              that.$router.push({
                path: "/login",
              });
            })
            .catch((error) => {
              that.loading = false;
              this.isTips = true;
              that.tipsText = error.message;
              if (
                error.message === "验证码错误" ||
                error.message === "验证码不正确，请重新输入"
              ) {
                that.resetImg();
              }
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
}
.userfrombox {
  width: 40%;
  min-width: 400px;
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
  padding: 0 50px 0 0;
}
.form_title {
  padding: 30px 0 0px 0;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
}
/deep/.el-input__suffix {
  cursor: pointer;
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
.btmbox {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.submit {
  width: 80%;
  height: 80%;
  border-radius: 8px;
  font-size: 16px;
  margin: 30px auto 40px auto;
}
.code {
  height: 40px;
  /deep/.el-input__inner {
    height: 100%;
  }
}
/deep/.tips {
  text-align: center;
  margin-bottom: 0;
  span {
    color: #fe0000;
  }
}
</style>
