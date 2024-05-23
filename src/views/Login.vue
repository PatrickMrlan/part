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
            >
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
            <span @click="entRegister()">企业注册</span>
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
        <!-- 登陆框 -->
        <div class="form-box">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-if="loginType.loginTypeValue != 2"
              label="账号密码登录"
              name="account"
            >
              <el-form
                ref="loginForm1"
                :model="loginForm1"
                :rules="loginRules1"
                label-width="0px"
              >
                <el-form-item class="tips">
                  <span v-if="isTips">{{ tipsText }}</span>
                  <span v-else> &nbsp; </span>
                </el-form-item>
                <el-form-item prop="userCode">
                  <el-input
                    v-model="loginForm1.userCode"
                    type="text"
                    maxlength="25"
                    auto-complete="off"
                    placeholder="请输入账号"
                    clearable
                  >
                    <i slot="prefix">
                      <img src="@/assets/img/loginIcon/user.png">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="userPass">
                  <el-input
                    v-model="loginForm1.userPass"
                    type="password"
                    maxlength="20"
                    auto-complete="off"
                    show-password
                    placeholder="请输入密码"
                    clearable
                  >
                    <i slot="prefix">
                      <img src="@/assets/img/loginIcon/pass.png">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="pcVerifyCode" class="el-form-item2">
                  <el-input
                    v-model="loginForm1.pcVerifyCode"
                    type="text"
                    maxlength="4"
                    auto-complete="off"
                    placeholder="请输入验证码"
                    @keyup.enter.native="handleLogin"
                  >
                    <i slot="prefix">
                      <img src="@/assets/img/loginIcon/verificationCode.png">
                    </i>
                    <i slot="suffix">
                      <img :src="imgUrl" @click="resetImg">
                    </i>
                  </el-input>
                </el-form-item>
                <el-form-item class="el-form-item2">
                  <div class="option">
                    <div class="automaticLogin">
                      <!-- <el-checkbox v-model="loginForm1.checked"
                            >5天内自动登录</el-checkbox
                          > -->
                    </div>
                    <div class="forgotPassword" @click="clickForgotPassword">
                        <span>忘记密码</span>
                      </div>
                  </div>
                </el-form-item>
                <el-form-item style="margin-bottom: 10px">
                  <el-button
                    :loading="loading"
                    :disabled="loading"
                    size="small"
                    type="primary"
                    @click.native.prevent="handleLogin"
                  >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                </el-form-item>
                <el-form-item class="articleRules">
                  <!-- <el-checkbox v-model="loginForm1.checked2"
                        >我已阅读并同意 <i>服务条款</i> 和
                        <i>个人信息处理规则</i></el-checkbox
                      > -->
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane
              v-if="loginType.loginTypeValue != 1"
              label="手机号登录"
              name="phone"
            >
              <el-form
                ref="loginForm2"
                :model="loginForm2"
                :rules="loginRules2"
                label-width="0px"
              >
                <el-form-item class="tips">
                  <span v-if="isTipsTwo">{{ tipsTowText }}</span>
                  <span v-else>&nbsp;</span>
                </el-form-item>
                <el-form-item prop="userPhone">
                  <el-input
                    v-model="loginForm2.userPhone"
                    type="text"
                    maxlength="11"
                    auto-complete="off"
                    placeholder="请输入手机号码"
                    clearable
                  >
                    <i slot="prefix">
                      <img src="@/assets/img/loginIcon/phone.png">
                    </i>
                  </el-input>
                </el-form-item>

                <el-form-item style="position: relative">
                  <el-input
                    v-model="phoneVerifyCode.verifyCode"
                    type="text"
                    maxlength="4"
                    auto-complete="off"
                    placeholder="请输入验证码"
                    class="verifyCode"
                    :style="{
                      borderColor: isVerificationCodeTip
                        ? '#F56C6C'
                        : '#DCDFE6',
                      borderRadius: isVerificationCodeTip ? '4px' : '4px',
                    }"
                    @blur="verifyCodeBlur"
                  >
                    <i slot="prefix">
                      <img src="@/assets/img/loginIcon/verificationCode.png">
                    </i>
                    <i slot="suffix">
                      <img :src="imgUrl" @click="resetImg">
                    </i>
                  </el-input>
                  <span
                    v-if="isVerificationCodeTip"
                    class="verificationCodeTip el-form-item__error"
                  >请输入验证码</span>
                </el-form-item>
                <el-form-item prop="verifyCode" class="el-form-item2">
                  <el-input
                    v-model="loginForm2.verifyCode"
                    type="text"
                    maxlength="10"
                    placeholder="请输入短信验证码"
                    :style="{
                      cursor: isCanSendCode ? 'pointer' : 'not-allowed',
                    }"
                    @keyup.enter.native="handleLogin"
                  >
                    <i slot="prefix">
                      <img src="@/assets/img/loginIcon/pass.png">
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
                <el-form-item class="el-form-item2">
                  <div class="option">
                    <div class="automaticLogin">
                      <!-- <el-checkbox v-model="loginForm1.checked"
                            >5天内自动登录</el-checkbox
                          > -->
                      <span>&nbsp;</span>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item style="margin-bottom: 10px">
                  <el-button
                    :loading="loading"
                    :disabled="loading"
                    size="small"
                    type="primary"
                    @keyup.enter.native="handleLogin"
                    @click.native.prevent="handleLogin"
                  >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                </el-form-item>
                <el-form-item class="articleRules">
                  <!-- <el-checkbox v-model="loginForm1.checked2"
                        >我已阅读并同意 <i>服务条款</i> 和
                        <i>个人信息处理规则</i></el-checkbox
                      > -->
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <div class="login-bottom">
      <p>
        <span
          v-if="loginType.copyright && loginType.copyright.configureValue"
        >{{ loginType.copyright.configureValue }}</span>
        <span
          v-if="loginType.company && loginType.company.configureValue"
        >{{ loginType.company.configureValue }} 版权所有</span>

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
  login,
  sendSmsCode,
  verifyCode,
  loginType,
  phoneVerifyCode
} from '../api/login'
import { setToken } from '../utils/cookie'
import { Message } from 'element-ui'
import config from '../../package.json'
import loginLogo from '../assets/img/logo3.png'

// import img1 from '../assets/img/login-img1.png'
// import img2 from '../assets/img/login-img2.png'
// import img3 from '../assets/img/login-img3.png'
import crypto from 'crypto-js'
// import img2 from '../assets/img/error-images/401.png'

import Swiper from 'swiper'
import 'swiper/swiper.min.css'
import { validatePassword } from "@/utils/validate";

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      activeName: 'account', // 登陆框选项卡的name
      serverUrl: process.env.VUE_APP_BASE_API,
      name: config.description,
      bottomText: config.author,
      leftImg: [],
      sendMsg: '获取验证码',
      isCanSendCode: true,
      timer: null,
      loginLogo,
      errorMsg: '',
      loginForm1: {
        userCode: '',
        userPass: '',
        pcVerifyCode: '',
        loginType: '',
        uuid: ''
      },
      loginForm2: {
        userCode: '',
        userPhone: '',
        verifyCode: '',
        smsType: 3,
        loginType: '',
        pcVerifyCode: ''
      },
      phoneVerifyCode: {
        uuid: '',
        verifyCode: ''
      },
      loginRules1: {
        userCode: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
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
        pcVerifyCode: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ]
      },
      loginRules2: {
        userPhone: [
          {
            required: true,
            trigger: 'blur',
            message: '手机号不能为空'
          },
          {
            pattern:
              /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '请填写正确的手机号',
            trigger: 'blur'
          }
        ],
        pcVerifyCode: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ],
        verifyCode: [
          { required: true, trigger: 'blur', message: '请输入短信验证码' }
        ]
      },
      loginType: {},
      loading: false,
      redirect: undefined,
      pageList: [],
      pageUserList: [],
      imgUrl: '',
      editPassCode: '',
      isTipsTwo: false,
      isTips: false,
      isVerificationCodeTip: false,
      tipsText: null,
      tipsTowText: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.query.type) {
      this.activeName = this.$route.query.type
    }
  },
  mounted() {
    this.getLoginType()
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    handleClick(tab, event) {},
    /**
     * 跳转到扫码登录页面
     */
    goToScanCodeLogin(type) {
      // this.$router.push({ name: "scanCodeLogin", params: { type: type } });
      this.$message('暂未开放！')
    },
    /**
     * 忘记密码
     */
    clickForgotPassword() {
      // this.$message('请联系管理员！')
      this.$router.push('/forgot')
    },
    // 获取登录方式
    getLoginType() {
      var that = this
      that.loading = true
      loginType().then((res) => {
        that.loading = false
        that.loginType = res
        that.leftImg = res.backgroundList
        console.log(that.loginType)
        this.resetImg()
        this.$nextTick(function() {
          // l轮播图初始化函数carouselScroll一定要放在$nextTick回调中执行
          this.bannerOperation()
        })
      })
    },
    sendCode() {
      var that = this
      // 发送验证码
      const reg = /^1\d{10}$/
      if (!reg.test(that.loginForm2.userPhone)) {
        return false
      } else if (!this.phoneVerifyCode.verifyCode) {
        this.isVerificationCodeTip = true
        return false
      } else if (!this.isCanSendCode) {
        return false
      }

      phoneVerifyCode({
        uuid: this.phoneVerifyCode.uuid,
        verifyCode: this.phoneVerifyCode.verifyCode
      })
        .then((res) => {
          /*
           * 发送验证码逻辑
           */
          sendSmsCode(that.loginForm2).then(() => {
            Message({
              type: 'success',
              message: '短信验证码发送成功'
            })
            that.isTipsTwo = false
            that.setCodeInterval()
          }).catch((res) => {
            console.log(res)
            Message({
              type: 'error',
              message: res.message
            })
            this.tipsTowText = res.message
            this.isTipsTwo = true
            this.resetImg()
          })
        })
        .catch((error) => {
          console.log(error)
          this.phoneVerifyCode.verifyCode = null
          this.tipsTowText = error.message
          this.isTipsTwo = true
          this.resetImg()
        })
    },
    setCodeInterval() {
      var that = this
      // 设置验证码重新发送定时器
      let time = 60
      console.log(time)
      that.sendMsg = time + 's'
      // clearInterval(that.timer);
      that.timer = setInterval(() => {
        time--
        that.sendMsg = time + 's'
        that.isCanSendCode = false
        if (time <= 0) {
          that.isCanSendCode = true
          that.sendMsg = '重新获取'
          clearInterval(that.timer)
        }
      }, 1000)
    },
    // 点击图片更换验证码
    resetImg() {
      const that = this
      const data = that.loginType.verificationMethod.configureKey
      verifyCode({ type: data }).then((res) => {
        that.imgUrl = res.imgUrl
        that.loginForm1.uuid = res.uuid
        that.phoneVerifyCode.uuid = res.uuid
      })
    },
    /**
     * 轮播图的操作
     */
    bannerOperation() {
      new Swiper('.swiper-container', {
        // direction: "vertical", // 垂直切换选项
        loop: true, // 循环模式选项
        autoplay: true,
        // autoplay: {
        //   disableOnInteraction: false // 手动滑动后继续自动播放
        // },

        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          clickable: true // 必须设置，不然鼠标悬浮不会切换
        },

        // 如果需要前进后退按钮

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },

        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },

        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      })
    },
    handleLogin() {
      let loginForm = null
      const that = this
      if (that.activeName === 'account') {
        loginForm = that.$refs.loginForm1
      } else if (that.activeName === 'phone') {
        loginForm = that.$refs.loginForm2
      }
      if (that.phoneVerifyCode.verifyCode) {
        that.isVerificationCodeTip = false
      } else {
        that.isVerificationCodeTip = true
      }
      loginForm.validate((valid) => {
        if (valid) {
          that.loading = true
          if (that.activeName === 'phone') {
            that.loginForm2.userCode = that.loginForm2.userPhone
            that.loginForm2.loginType = that.loginType.loginType[1].id
          }
          let userCode = ''
          let userPass = ''
          if (that.activeName === 'account') {
            userCode = crypto.AES.encrypt(
              that.loginForm1.userCode,
              crypto.enc.Utf8.parse(that.loginType.key.configureValue),
              {
                mode: crypto.mode.ECB,
                padding: crypto.pad.Pkcs7
              }
            ).toString()
            userPass = crypto.AES.encrypt(
              that.loginForm1.userPass,
              crypto.enc.Utf8.parse(that.loginType.key.configureValue),
              {
                mode: crypto.mode.ECB,
                padding: crypto.pad.Pkcs7
              }
            ).toString()
          }
          // DES加密
          login(
            that.activeName === 'account'
              ? {
                appId: 1,
                userCode: userCode,
                userPass: userPass,
                pcVerifyCode: that.loginForm1.pcVerifyCode,
                loginType: that.loginType.loginType[0].id,
                uuid: that.loginForm1.uuid,
                verifyType: that.loginType.verificationMethod.configureKey
              }
              : that.loginForm2
          )
            .then((res) => {
              console.log(res)
              // 缓存登录用户信息
              sessionStorage.setItem('loginUser', JSON.stringify(res.sysUser))
              // 设置所有权限页面信息
              that.setPageList(res.menuList)
              sessionStorage.setItem(
                'pageOperList',
                JSON.stringify(that.pageList)
              )
              sessionStorage.setItem(
                'pageUserList',
                JSON.stringify(res.menuList)
              )
              // 缓存菜单信息
              sessionStorage.setItem('menuList', JSON.stringify(res.menuList))
              setToken(res.sysUser.token)
              that.$router.push({ path: that.redirect || '/' })

              that.$store.commit('setShowToast', true)
              that.loading = false
            })
            .catch((error) => {
              console.log(error)
              that.loading = false
              that.tipsText = error.message
              that.tipsTowText = error.message
              that.isTips = true
              if (error.message === '验证码错误') {
                that.loginForm1.pcVerifyCode = null
                that.isTips = true
              } else if (error.message === '账号或密码不正确') {
                that.loginForm1.userCode = null
                that.loginForm1.userPass = null
                that.loginForm1.pcVerifyCode = null
                that.isTips = true
              } else if (error.message === '验证码不正确，请重新输入') {
                that.loginForm2.verifyCode = null
                that.isTipsTwo = true
              }
              that.resetImg()
            })
        }
      })
    },
    entRegister() {
      var that = this
        this.$router.push({
        path: '/entRegister'
      })
    },

    setPageList(menList) {
      for (let i = 0; i < menList.length; i++) {
        if (menList[i].children.length > 0) {
          this.setPageList(menList[i].children)
        } else {
          this.pageList.push(menList[i])
          // 移除掉非菜单数据
          if (menList[i].isMenu === 'NO') {
            menList.splice(i, 1)
            i--
          }
        }
      }
    },
    /**
     * 验证码失去焦点的时候
     */
    verifyCodeBlur() {
      if (this.phoneVerifyCode.verifyCode) {
        this.isVerificationCodeTip = false
      } else {
        this.isVerificationCodeTip = true
      }
    }
  }
}
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

