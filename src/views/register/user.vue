<template>
  <div class="help_bg" :loading="loading">
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

      <div
        v-if="sysEnterprise.isOpenRegister"
        class="container"
        style="margin-top: 10%"
      >
        <div class="form-box">
          <el-form
            ref="registerForm"
            :model="registerForm"
            :rules="rules"
            label-width="150px"
          >
            <div class="form_title">
              {{ sysEnterprise.entName }}企业用户注册
            </div>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="name">
                <el-input
                  v-model="registerForm.name"
                  type="text"
                  maxlength="20"
                  placeholder="请输入姓名"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码：" prop="tel">
                <el-input
                  v-model="registerForm.tel"
                  type="text"
                  maxlength="11"
                  placeholder="请输入手机号码"
                  @change="changeTel($event)"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="性别：" prop="sex">
                <el-radio v-model="registerForm.sex" label="1">男</el-radio>
                <el-radio v-model="registerForm.sex" label="0">女</el-radio>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="生日：" prop="birthday">
                <el-date-picker
                  v-model="registerForm.birthday"
                  style="width: 100%"
                  type="date"
                  value-format:="yyyy-MM-dd"
                  placeholder="选择日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="
                registerForm.workType === 2 || registerForm.workType === 1
                  ? 24
                  : 12
              "
            >
              <el-form-item label="人员类型：" prop="workType">
                <el-select
                  v-model="registerForm.workType"
                  filterable
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in workTypeList"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="registerForm.workType === 2" :span="12">
              <el-form-item label="作业类型：" prop="jobType">
                <el-select
                  v-model="registerForm.jobType"
                  filterable
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in jobTypeList"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在部门：" prop="depId">
                <el-select
                  v-model="registerForm.depId"
                  filterable
                  clearable
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in depList"
                    :key="item.depId"
                    :label="item.depName"
                    :value="item.depId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="registerForm.workType === 1" :span="12">
              <el-form-item label="专职/兼职：" prop="jobNature">
                <el-select
                  v-model="registerForm.jobNature"
                  filterable
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in jobNatureList"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录账号：" prop="loginCode">
                <el-input
                  v-model="registerForm.loginCode"
                  type="text"
                  maxlength="20"
                  placeholder="请输入登录账号"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
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
            <el-col :span="12">
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
            <el-col :span="12">
              <el-form-item label="短信验证码：" prop="code">
                <el-input
                  v-model="registerForm.code"
                  type="text"
                  maxlength="6"
                  placeholder="请输入验证码"
                  class="verifyCode"
                  :style="{
                    cursor: isCanSendCode ? 'pointer' : 'not-allowed',
                  }"
                  @keyup.enter.native="handleLogin"
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
          <div style="text-align: center">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginType, sendSmsCode } from "@/api/login";
import { userRegister, entDetail, workPersonnelType } from "@/api/register";
import { validatePassword } from "@/utils/validate";

import { Message } from "element-ui";

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
        sex: "1",
      },
      sysEnterprise: {},
      loading: false,
      loginType: {},
      sendMsg: "获取验证码",
      isCanSendCode: true,
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名！",
            trigger: ["blur", "change"],
          },
        ],
        loginCode: [
          {
            required: true,
            message: "请输入登录账号！",
            trigger: ["blur", "change"],
          },
        ],
        loginPass: [
          {
            required: true,
            message: "请输入登录密码！",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          {
            required: true,
            message: "请输入短信验证码！",
            trigger: ["blur", "change"],
          },
        ],
        tel: [
          {
            required: true,
            message: "请输入手机号码！",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^(1\d{10})$/,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],

        repeatPassword: [
          {
            required: true,
            message: "请输入重复密码！",
            trigger: ["blur", "change"],
          },
          {
            required: true,
            validator: validateCofirmPass,
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, [""]);
            },
            trigger: "change",
          },
        ],
      },
      parkList: [],
      imgUrl: null,
      entId: null,
      workTypeList: [],
      jobTypeList: [],
      jobNatureList: [],
      depList: [],
      phoneVerifyCode: {
        uuid: "",
        verifyCode: "",
      },
      tipsText: null,
      tipsTowText: null,
    };
  },
  watch: {},
  created() {
    var entId = this.getparam("entId");
    this.registerForm.entId = entId;
    this.entDetail();
    this.workPersonnelType();
    this.getLoginType();
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

    workPersonnelType() {
      workPersonnelType({ entId: this.registerForm.entId }).then((res) => {
        this.workTypeList = res.workTypeList;
        this.jobTypeList = res.jobTypeList;
        this.jobNatureList = res.jobNatureList;

        this.depList = res.depList;
      });
    },
    sendCode() {
      var that = this;
      // 发送验证码
      const reg = /^1\d{10}$/;
      if (!reg.test(that.registerForm.tel)) {
        return false;
      } else if (!this.isCanSendCode) {
        return false;
      }

      /*
       * 发送验证码逻辑
       */
      sendSmsCode({ userPhone: that.registerForm.tel, smsType: 1 }).then(() => {
        Message({
          type: "success",
          message: "短信验证码发送成功",
        });
        that.isTipsTwo = false;
        that.setCodeInterval();
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
    goLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    entDetail() {
      var that = this;
      that.loading = true;
      entDetail({ entId: this.registerForm.entId }).then((res) => {
        this.sysEnterprise = res;
        if (!res.isOpenRegister) {
          Message({
            type: "error",
            message: "当前企业未开放注册，请联系管理员",
          });
          return;
        }
      });
    },

    getLoginType() {
      var that = this;
      that.loading = true;
      loginType().then((res) => {
        that.loading = false;
        that.loginType = res;
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
    submit() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["registerForm"].validate((valid) => {
        if (valid) {
          that.loading = true;

          userRegister(that.registerForm)
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
            .catch(() => {
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
}
.container {
  background: #fff;
}

.form-box {
  margin: 20px 0;
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
  margin-right: 40px;
  margin-top: 40px;
}
.form_title {
  padding-bottom: 20px;
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
</style>

