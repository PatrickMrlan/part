<template>
  <div
    v-if="menuList"
    v-loading="loading"
    class="app-wrapper"
    element-loading-text="正在拼命初始化..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-container>
      <el-header :class="isLight ? 'light' : 'black'" style="height: 50px">
        <div class="header">
          <div class="flex-center" @click="goToHome">
            <!-- <img
              style="margin-right: 12px; cursor: pointer"
              height="24"
              src="../../public/logo-s.png"
            /> -->
            产业功能区园区安全监管平台
          </div>
          <div class="flex-ai-center" style="height: 100%">
            <a
              href="#/dataVisualization"
              class="linkBigScreen"
              target="_blank"
            >
              <myButton icon="el-icon-s-opportunity">
                <span>数据可视化</span>
              </myButton>
            </a>

            <div class="linkBigScreen" target="_blank" @click="goDp">
              <!-- <myButton icon="el-icon-s-opportunity">
                <span>数据可视化</span>
              </myButton> -->
            </div>
            <!--
            <div
              class="flex-center toprightIcon"
              :class="isLight ? 'lightTRI' : 'blackTRI'"
              title="消息中心"
              @click="gotoMessage"
            >
              <el-badge :is-dot="isRead">
                <img height="20" src="../assets/img/homeIcon/msg.png">
              </el-badge>
            </div> -->
            <div
              class="flex-center toprightIcon"
              :class="isLight ? 'lightTRI' : 'blackTRI'"
              @click="goUserCenter"
            >
              <img
                v-if="loginUser.picture"
                height="28"
                style="border-radius: 50%"
                :src="serverUrl + loginUser.picture"
              >
              <div v-else class="avatar" :style="{ background: themeColor }">
                {{ loginUser.account.substring(0, 3) }}
              </div>
              <!-- <img
                  height="24"
                  v-else
                  src="../assets/img/homeIcon/userPhoto.png"
                /> -->
            </div>
            <div
              class="flex-center toprightIcon dropdown"
              :class="isLight ? 'lightTRI' : 'blackTRI'"
              style="width: 36px"
              @mouseenter="showDropdowmMenu = true"
              @mouseleave="showDropdowmMenu = false"
            >
              <!--  -->
              <img height="24" src="../assets/img/homeIcon/dropdown.png">
              <div
                class="dropdowmMenu"
                :class="isLight ? 'dropdowmMenu_l' : ''"
                :style="{
                  height: showDropdowmMenu ? 'auto' : '0',
                }"
              >
                <div class="box b1">
                  <div style="padding-left: 20px">
                    <p>{{ loginUser.userName }}</p>
                    <p style="font-size: 12px; color: #7c878e">
                      {{ loginUser.roleNameStr }}
                    </p>
                  </div>
                </div>
                <div class="box b2">
                  <div
                    class="flex-ai-center pointer"
                    @click="openOperationManual"
                  >
                    <div class="flex-ai-center">
                      <img height="16" src="../assets/img/homeIcon/help.png">
                      操作手册
                    </div>
                  </div>
                  <div class="flex-ai-center pointer" @click="goUserCenter">
                    <div class="flex-ai-center">
                      <img height="16" src="../assets/img/homeIcon/user.png">
                      账号信息
                    </div>
                  </div>
                  <div class="flex-ai-center">
                    <div class="flex-ai-center">
                      <img
                        height="16"
                        src="../assets/img/homeIcon/theme_nav.png"
                      >
                      导航偏好设置
                    </div>
                    <div class="theme_nav_check">
                      <span
                        v-for="(item, i) in navigationList"
                        :key="i"
                        :class="item.id == navigationUser ? 'activeTheme' : ''"
                        :style="{
                          background:
                            item.id == navigationUser ? themeColor : '',
                          border:
                            item.id == navigationUser
                              ? '1px solid ' + themeColor
                              : '',
                        }"
                        @click="clicknavigation(item.id)"
                      >{{ item.configureDetail }}</span>
                    </div>
                  </div>
                  <div class="flex-ai-center">
                    <div class="flex-ai-center">
                      <img
                        height="16"
                        src="../assets/img/homeIcon/themeColor.png"
                      >
                      主题色
                    </div>
                    <div class="themeColorCheck flex-ai-center">
                      <div
                        v-for="(item, i) in themeColorList"
                        :key="i"
                        :style="{
                          border:
                            themeColorUser == item.id
                              ? '1px solid ' + item.configureValue
                              : '',
                        }"
                        style="padding: 4px"
                        @click="clickTheme(item.id)"
                      >
                        <div
                          style="height: 100%"
                          :style="{ background: item.configureValue }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="box b2">
                  <div class="flex-ai-center pointer" @click="editPwd">
                    <div class="flex-ai-center">
                      <img
                        height="16"
                        src="../assets/img/homeIcon/editpwd.png"
                      >
                      修改密码
                    </div>
                  </div>
                  <div class="flex-ai-center pointer" @click="loginOut">
                    <div class="flex-ai-center">
                      <img
                        height="16"
                        src="../assets/img/homeIcon/logout.png"
                      >
                      退出
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-header>

      <el-container>
        <el-aside
          :class="collapsed ? 'wider' : 'normal'"
          :style="{ width: collapsed ? '64px' : '230px' }"
        >
          <!-- 左侧导航 -->
          <div class="leftMenu">
            <div
              :style="{ background: isLight ? '#fff' : '#1E222D' }"
              class="menuBox"
            >
              <div v-for="(item, i) in menuList" :key="i">
                <el-menu
                  :default-active="leftActive"
                  class="my-el-menu"
                  :collapse-transition="false"
                  :background-color="isLight ? '#fff' : '#1E222D'"
                  :text-color="isLight ? '#303030' : '#fafafa'"
                  active-text-color="#ffffff"
                  :collapse="collapsed"
                  :unique-opened="true"
                >
                  <el-menu-item
                    v-if="item.menuUrl && !item.children.length"
                    :index="i.toString()"
                    :style="styleVar"
                    @click="sideItemClick(item, i + '')"
                  >
                    <i
                      class="menuItemIcon"
                      :class="item.icon || 'el-icon-menu'"
                    />
                    <a
                      v-if="item.menuUrl && item.menuUrl.indexOf('http:') > -1"
                      :href="item.menuUrl"
                      target="_blank"
                    >{{ item.name }}</a>
                    <span v-else slot="title"> {{ item.name }}</span>
                  </el-menu-item>

                  <el-submenu v-else :index="i.toString()">
                    <template slot="title">
                      <i :class="item.icon || 'el-icon-menu'" />
                      <span v-if="!collapsed">{{ item.name }}</span>
                    </template>

                    <div v-for="(child, j) in item.children" :key="j">
                      <el-menu-item
                        v-if="child.menuUrl && !child.children.length"
                        :index="i + '-' + j"
                        :style="styleVar"
                        @click="sideItemClick(child, i + '-' + j)"
                      >
                        <i
                          class="menuItemIcon"
                          :class="child.icon || 'el-icon-menu'"
                        />
                        <a
                          v-if="
                            child.menuUrl && child.menuUrl.indexOf('http:') > -1
                          "
                          :href="child.menuUrl"
                          target="_blank"
                        >{{ child.name }}</a>
                        <span v-else slot="title"> {{ child.name }} </span>
                      </el-menu-item>

                      <el-submenu v-else :index="i + '-' + j">
                        <template slot="title">
                          <i :class="child.icon || 'el-icon-position'" />
                          <span>{{ child.name }}</span>
                        </template>
                        <el-menu-item
                          v-for="(leaf, k) in child.children"
                          :key="k"
                          :style="styleVar"
                          :index="i + '-' + j + '-' + k"
                          @click="sideItemClick(leaf, i + '-' + j + '-' + k)"
                        ><i
                           class="menuItemIcon"
                           :class="leaf.icon || 'el-icon-location'"
                         />
                          <a
                            v-if="
                              leaf.menuUrl && leaf.menuUrl.indexOf('http:') > -1
                            "
                            :href="leaf.menuUrl"
                            target="_blank"
                          >{{ leaf.name }}</a>
                          <span v-else slot="title"> {{ leaf.name }}</span>
                        </el-menu-item>
                      </el-submenu>
                    </div>
                  </el-submenu>
                </el-menu>
              </div>
            </div>
            <div
              class="collapsBox"
              :class="isLight ? 'lightcollapsBox' : 'blackcollapsBox'"
              :style="{
                width: collapsed ? '63px' : isLight ? '230px' : '229px',
              }"
            >
              <div
                class="collapsIcon"
                :class="
                  (isLight ? 'lightIcon' : 'blackIcon') +
                    ' ' +
                    (collapsed ? 'collapsed_zk' : 'collapsed_sq')
                "
                @click="collapsed = !collapsed"
              />
            </div>
          </div>
        </el-aside>
        <el-main>
          <TagsNav />

          <div v-if="currentName" class="mainTitle">
            <div>{{ currentName }}</div>
          </div>
          <MainView />
        </el-main>
      </el-container>
    </el-container>

    <myDialog
      v-if="showEditPwd"
      :title="'修改密码'"
      :cancel="cancelEditPwd"
      :loading="loading"
      :visible="true"
      width="450px"
      :show-close="showClose"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="formRules"
        label-width="100px"
        style="width: 400px; margin: 20px 0"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="旧密码：" prop="oldPassWord">
              <el-input
                v-model="dialogForm.oldPassWord"
                type="password"
                max="20"
                show-password
                class="input-default"
                placeholder="旧密码"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item
              style="margin-top: 30px"
              label="新密码："
              prop="newPassWord"
            >
              <el-input
                v-model.trim="dialogForm.newPassWord"
                type="password"
                show-password
                max="20"
                class="input-default"
                placeholder="新密码"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item
              style="margin-top: 40px"
              label="重复密码："
              prop="cofirmPassWord"
            >
              <el-input
                v-model="dialogForm.cofirmPassWord"
                type="password"
                max="20"
                show-password
                class="input-default"
                placeholder="重复密码"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <myButton
          v-if="showClose"
          :type="'cancel'"
          @click.native="cancelEditPwd"
        >取 消</myButton>
        <myButton
          :type="'confirm'"
          icon="el-icon-loading"
          :loading="loading"
          @click.native="submitEditPwd('dialogForm')"
        >
          提 交
        </myButton>
      </template>
    </myDialog>

    <messageDrawer />
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'
import MainView from './components/MainView/index'
import TagsNav from './components/TagsView/index'

import Avatar from '../assets/img/avatar.png'
import { editPass } from '../api/login'
import {
  themeColor,
  saveUser,
  menuListMethod
} from '../api/system/theSystemConfiguration'
import { Message } from 'element-ui'
import { removeToken, getToken } from '../utils/cookie'
// import { list } from '@/api/message'
const RESIZE_WIDTH = 1440

import messageDrawer from './messageDrawer.vue'
import { validatePassword } from '@/utils/validate'

export default {
  id: 0,
  inject: ['reload'],
  name: 'Layout',
  components: {
    MainView,
    TagsNav,
    vueSeamlessScroll,
    messageDrawer
  },

  data() {
    const checkPassWord = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error('请确认密码不能为空'))
      } else if (value != this.dialogForm.newPassWord) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      showClose: true,
      isShowToast: true, // 是否显示提醒用户框
      serverUrl: process.env.VUE_APP_BASE_API,
      isRead: false,
      token: '',
      menuList: null,
      // topid: "",
      collapsed: false,
      showDropdowmMenu: false,
      backgroundColor: '#263238',
      activeColor: '#409eff',
      isRouterAlive: true,
      themeColorUser: null,
      navigationUser: null,
      isLight: false,
      navigationList: [],
      themeColorList: [],
      openeds: [],
      loginUser: null,
      color: 0,
      leftActive: '',
      showEditPwd: false,
      dialogForm: {},
      formRules: {
        oldPassWord: [
          {
            required: true,
            message: '请输入旧密码！',
            trigger: ['blur', 'change']
          }
        ],
        newPassWord: [
          {
            required: true,
            validator: (rule, value, callback) => {
              validatePassword(rule, value, callback, true, ['新密码'])
            },
            trigger: 'change'
          }
        ],
        cofirmPassWord: [
          {
            required: true,
            message: '请再次输入密码！',
            trigger: ['blur', 'change']
          },
          {
            trigger: ['change', 'blur'],
            validator: checkPassWord
          }
        ]
      },
      currentName: '',
      pageList: []
    }
  },
  computed: {
    ...mapGetters('app', ['themeColor']),
    ...mapState('app', ['messageData']),
    ...mapGetters(['visitedViews']),
    styleVar() {
      return {
        '--activeColor': this.themeColor
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.getTitle()
      },
      immediate: true
    }
  },
  mounted() {
    this.getTitle()
  },
  async created() {
    this.token = getToken()

    this.menuList = JSON.parse(sessionStorage.getItem('menuList'))
    console.log(this.token, this.menuList)
    if (this.token && (this.menuList == null || this.menuList.length === 0)) {
      const that = this
      await menuListMethod({ token: this.token })
        .then((res) => {
          console.log(res)
          that.setPageList(res.menuList)
          sessionStorage.setItem('loginUser', JSON.stringify(res.sysUser))
          sessionStorage.setItem('pageUserList', JSON.stringify(res.menuList))
          sessionStorage.setItem('menuList', JSON.stringify(res.menuList))
          sessionStorage.setItem('pageOperList', JSON.stringify(that.pageList))
          that.menuList = JSON.parse(sessionStorage.getItem('menuList'))

          if (that.menuList === null) {
            removeToken()
            that.$router.push({
              path: '/login'
            })
          }
        })
        .catch(() => {})
    }

    // 当前登录用户信息
    this.loginUser = JSON.parse(sessionStorage.getItem('loginUser'))
    if (this.loginUser) {
      this.themeColorUser = this.loginUser.themeColor || 42
      this.navigationUser = this.loginUser.navigationPreferenc || 46
    }
    this.navigationUser === 46 ? (this.isLight = false) : (this.isLight = true)
    this.getNavigationList()

    // 获取当前用户的未读消息
    // this.getMessage()
    // 加载菜单

    if (this.menuList) {
      this.openeds = []
      this.menuList.forEach((item, i) => {
        this.openeds.push('' + i)
        if (this.$route.path === item.menuUrl) {
          this.leftActive = i + ''
        }
        item.children.forEach((child, j) => {
          child.children.forEach((leaf, k) => {
            if (this.$route.path === leaf.menuUrl) {
              this.leftActive = i + '-' + j + '-' + k
            }
          })
          if (this.$route.path === child.menuUrl) {
            this.leftActive = i + '-' + j
          }
        })
      })
    }
    if (this.loginUser && this.loginUser.sysEnterprise) {
      if (
        this.loginUser.sysEnterprise.entState === '新注册' ||
        this.loginUser.sysEnterprise.entState === '审核不通过'
      ) {
        const tips = '请完善企业档案信息!'

        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          showCancelButton: false, // 是否显示取消按钮
          closeOnClickModal: false, // 是否点击遮罩（点击空白处）关闭
          showClose: false, // 是否显示右上角的x
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/secureManagement/enterpriseArchives/index',
            query: {
              name: '企业档案',
              newEnt: 1
            }
          })
        })
      } else {
        if (this.loginUser.isDefaultPass != '0') {
          let tips = ''
          if (this.loginUser.isDefaultPass == '1') {
            tips = '因长时间未修改密码，需修改密码后进行登录！'
          } else if (this.loginUser.isDefaultPass == '2') {
            tips = '因长时间未登录账户，需修改密码后进行登录！'
          }
          this.$confirm(tips, '提示', {
            confirmButtonText: '去修改',
            showCancelButton: false, // 是否显示取消按钮
            closeOnClickModal: false, // 是否点击遮罩（点击空白处）关闭
            showClose: false, // 是否显示右上角的x
            type: 'warning'
          }).then(() => {
            this.showClose = false
            this.showEditPwd = true
          })
        }
      }
    }
    if (this.menuList.length === 0) {
      this.loginOut()
      return
    }
    this.handleResize()
  },
  beforeDestroy() {
    window.localStorage.removeItem('appThemeColor')
  },
  methods: {
    ...mapMutations('app', ['setThemeColor', 'setAgencyMessagelist']),
    ...mapActions('app', ['modifyAgencyMessagelist']),
    ...mapMutations(['delAllVisitedView']),
    goDp() {
      Message({
        message: '功能正在开发...'
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
     * 关闭用户提示框
     */
    showToastClose() {
      this.isShowToast = false
      this.$store.commit('setShowToast', false)
    },

    getTitle() {
      if (!this.menuList) {
        this.menuList = []
      }
      this.menuList.forEach((item, i) => {
        this.openeds.push('' + i)
        if (this.$route.path == item.menuUrl) {
          this.leftActive = i + ''
        }
        item.children.forEach((child, j) => {
          child.children.forEach((leaf, k) => {
            if (this.$route.path == leaf.menuUrl) {
              this.leftActive = i + '-' + j + '-' + k
            }
          })
          if (this.$route.path == child.menuUrl) {
            this.leftActive = i + '-' + j
          }
        })
      })
      if (this.$route.query.name) {
        this.currentName = this.$route.query.name
      } else {
        var indexArr = this.leftActive.split('-')
        if (indexArr.length == 1) {
          this.currentName = this.menuList[indexArr[0]].name
        }
        if (indexArr.length == 2) {
          this.currentName =
            this.menuList[indexArr[0]].children[indexArr[1]].name
        }
        if (indexArr.length == 3) {
          this.currentName =
            this.menuList[indexArr[0]].children[indexArr[1]].children[
              indexArr[2]
            ].name
        }
      }
    },

    goToHome() {
      this.$router.push({
        path: '/'
      })
    },

    handleResize() {
      const width = document.body.getBoundingClientRect().width
      if (width <= RESIZE_WIDTH) {
        this.collapsed = true
      } else {
        this.collapsed = false
      }
    },

    clickTheme(id) {
      this.themeColorUser = id
      this.saveUser()
      var color = this.themeColorList.filter((item) => item.id == id)[0]
        .configureValue
      this.setThemeColor(color)

      // var el = document.getElementsByClassName("active")[0];
      // console.log(el);
      // el.style.background = color;
    },

    clicknavigation(id) {
      this.navigationUser = id
      id === '46' ? (this.isLight = false) : (this.isLight = true)
      this.saveUser()
    },
    saveUser() {
      this.loginUser.themeColor = this.themeColorUser
      this.loginUser.navigationPreferenc = this.navigationUser
      var that = this
      sessionStorage.setItem('loginUser', JSON.stringify(this.loginUser))
      saveUser(that.loginUser).then((res) => {})
    },

    sideItemClick(menu, index) {
      // console.log(menu);
      this.leftActive = index
      if (menu.menuUrl) {
        if (menu.menuUrl.indexOf('http:') >= 0) {
          return
        }
        if (this.$route.path === menu.menuUrl) {
          // this.reload();
        }
        this.$router.push({ path: menu.menuUrl, query: { name: menu.name }})
      }
    },
    openOperationManual() {
      // window.open('/static/操作手册.docx')

      this.$message({
        type: 'info',
        message: '暂无操作手册'
      })
    },
    goUserCenter() {
      this.$router.push({
        path: '/user-center',
        query: { name: '账号信息' }
      })
    },
    editPwd() {
      this.showEditPwd = true
    },
    cancelEditPwd() {
      this.showEditPwd = false
    },
    submitEditPwd() {
      var that = this

      that.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定修改密码并重新登录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              that.loading = true
              editPass(that.dialogForm)
                .then((res) => {
                  Message({
                    type: 'success',
                    message: '操作成功,请重新登录'
                  })
                  removeToken()
                  sessionStorage.clear()
                  this.$router.push({
                    path: '/login'
                  })
                })
                .catch(() => {})
                .finally(() => {
                  that.loading = false
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消修改'
              })
            })
        } else {
          return false
        }
      })
    },
    getNavigationList() {
      themeColor().then((res) => {
        this.themeColorList = res.themeColorList
        var curColor = this.themeColorList.filter(
          (x) => x.id == this.themeColorUser
        )[0].configureValue

        this.setThemeColor(curColor)
        this.navigationList = res.navigationPreferencConfigureList
      })
    },
    // 获取当前用户的未读消息
    // getMessage() {
    //   list({ isRead: 0 }).then((res) => {
    //     if (res.total > 0) {
    //       this.isRead = true
    //     } else {
    //       this.isRead = false
    //     }
    //   })
    // },
    gotoMessage() {
      this.$router.push({
        path: '/message/index',
        query: { name: '信息管理' }
      })
      this.isRead = false
    },
    showLastView() {
      const lastView = this.visitedViews.slice(-1)[0]
      if (lastView) {
        this.$router.push(lastView.fullPath)
      }
    },
    loginOut() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delAllVisitedView()
        this.showLastView()
        removeToken()
        const arr = []
        this.modifyAgencyMessagelist(arr)
        sessionStorage.clear()
        this.$router.push({
          path: '/login'
        })
        // location.reload()
      })
    },

    dataVisualization() {
      this.$router.push({
        path: '/dataVisualization'
      })
      // if (process.env.NODE_ENV == "development") {
      //   window.open(window.location.host + "/#/dataVisualization/#");
      // } else {
      //   window.open(window.location.host + "/#/dataVisualization");
      // }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/less/scroll-bar";

@keyframes showMessageList {
  from {
    transform: translateY(293px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes hideMessageList {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(293px);
  }
}

.showMessageList {
  animation: showMessageList 1s linear forwards;
}
.hideMessageList {
  animation: hideMessageList 1s linear forwards;
}
.agencyMessage {
  position: fixed;
  bottom: 0;
  right: 0;
  height: 273px;
  width: 438px;
  padding: 0 6px 6px;
  // border: 1px solid #000;
  // background: #454545;
  box-sizing: border-box;
  z-index: 4;
  .title {
    display: flex;
    height: 42px;
    padding: 0 6px;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    .head {
      display: flex;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .name {
      font-size: 14px;
      font-weight: bold;
    }
    .icon {
      width: 26px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      cursor: pointer;
      background: #fff;
      font-weight: bold;
    }
  }
  .con {
    background: #fff;
    height: 225px;
    display: flex;
    .right {
      width: 100%;
      height: 100%;
      padding: 20px 0 0;
      overflow-y: auto;
      li {
        padding: 0 10px;
        font-size: 14px;
        color: #000;
        margin-bottom: 10px;
        word-wrap: break-word;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        &:hover {
          background: #ccc;
        }
        .text {
          margin-right: 20px;
        }
        .more {
          width: 105px;
          color: #006eff;
        }
      }
    }
  }
}
.light {
  background: #fff;
  color: #000;
  border-bottom: 1px solid #f3f4f7;
}
.black {
  background: #262f3e;
  color: #fff;
  border-bottom: 1px solid #344258;
}
.flex-ai-center {
  display: flex;
  align-items: center;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header {
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  img {
    display: block;
  }
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 12px;
  }
  .toprightIcon {
    width: 50px;
    height: 100%;
    cursor: pointer;
  }
  .lightTRI:hover {
    background-color: #e7eaef;
  }
  .blackTRI:hover {
    background-color: #344258;
  }
  .dropdowmMenu {
    position: absolute;
    top: 50px;
    right: 0;
    width: 270px;
    background: #151822;
    box-shadow: 0px 0px 16px 1px rgba(21, 24, 34, 0.16);
    height: 0;
    overflow: hidden;
    transition: all 0.5s;
    z-index: 999;
    cursor: default;
    .box {
      padding: 12px 0;
      border-bottom: 1px solid #262f3e;
      color: #c1c6c8;
      &:last-of-type {
        border: none;
      }
      img {
        margin-right: 8px;
      }
    }
    .b1 {
      font-size: 16px;
    }
    .b2 {
      font-size: 14px;
      & > div {
        padding: 0 20px;
        justify-content: space-between;
        line-height: 36px;
      }
      .pointer {
        cursor: pointer;
        &:hover {
          background: #344258;
        }
      }
    }
    .theme_nav_check {
      span {
        width: 48px;
        height: 22px;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        box-sizing: border-box;
        display: inline-block;
        border: 1px solid #262f3e;
        cursor: pointer;
      }
      .activeTheme {
        color: #fff;
        background: #006eff;
        border: 1px solid #006eff;
      }
    }
    .themeColorCheck {
      & > div {
        width: 24px;
        height: 24px;
        box-sizing: border-box;
        border: 1px solid #262f3e;
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }
  .dropdowmMenu_l {
    background: #fff;
    .box {
      border-bottom: 1px solid #e7eaef;
      color: #000;
    }
    .b2 {
      .pointer:hover {
        background: #e7eaef;
      }
    }
    .theme_nav_check {
      span {
        border: 1px solid #e7eaef;
      }
    }
    .themeColorCheck > div {
      border: 1px solid #e7eaef;
    }
  }
}
.leftMenu {
  height: calc(100vh - 50px);
  overflow: hidden;
  /deep/.el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
  /deep/.el-menu-item {
    display: flex;
    align-items: center;
    height: 50px !important;
    line-height: 50px !important;
  }
  .menuBox {
    height: calc(100vh - 104px);
    overflow-y: auto;
    overflow-x: hidden;
    border-right: solid 1px #e6e6e6;
    scrollbar-width: thin;
    scrollbar-color: #455b81 #262f3e; // 火狐浏览器滚动条样式
    -ms-overflow-style: none; // IE浏览器滚动条样式
    &::-webkit-scrollbar {
      width: 8px !important; /*对垂直流动条有效*/
    }

    /*定义滚动条的轨道颜色、内阴影及圆角*/
    &::-webkit-scrollbar-track {
      background-color: #262f3e;
    }

    /*定义滑块颜色、内阴影及圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 0px;
      background-color: #455b81;
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
  /deep/.menuItem {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    background: #1e222d;
    color: #fafafa;
    &:hover {
      background: #181b24;
    }
  }
  .menuItem_l {
    background: #fff;
    color: #303030;
    &:hover {
      background: #cccccc;
    }
  }
  .menuleaf {
    cursor: pointer;
  }
  /deep/.menuItemIcon {
    font-size: 18px;
    color: #909399;
    display: inline-block;
    margin: 0 5px 0 2px;
  }
  .collapsBox {
    height: 64px;
    box-sizing: border-box;
    // transition: all 0.5s;
    .collapsIcon {
      height: 63px;
      width: 63px;
      background-repeat: no-repeat;
      background-size: 16px 16px;
      background-position: center center;
      cursor: pointer;
    }
    .collapsed_zk {
      background-image: url(../assets/img/homeIcon/collapsed_zk.png);
    }
    .collapsed_sq {
      background-image: url(../assets/img/homeIcon/collapsed_sq.png);
    }
    .lightIcon {
      &:hover {
        background-color: #f3f4f7;
      }
    }
    .blackIcon {
      background-color: #262f3e;
      &:hover {
        background-color: #344258;
      }
    }
  }
  .blackcollapsBox {
    border-top: 1px solid #344258;
    background: #262f3e;
  }
  .lightcollapsBox {
    border-top: 1px solid #f3f4f7;
    border-right: 1px solid #f3f4f7;
    background: #fff;
  }
}

.mainTitle {
  padding: 10px 15px;
  font-size: 16px;
  color: #101010;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  .reminder {
    margin-left: 50px;
    padding: 5px 20px 5px 10px;
    border-radius: 2px;
    font-size: 14px;
    background: linear-gradient(90deg, salmon 50%, transparent 0) repeat-x,
      linear-gradient(90deg, salmon 50%, transparent 0) repeat-x,
      linear-gradient(0deg, salmon 50%, transparent 0) repeat-y,
      linear-gradient(0deg, salmon 50%, transparent 0) repeat-y;
    background-size: 4px 2px, 4px 2px, 2px 4px, 2px 4px;
    background-position: 0 0, 0 100%, 0 0, 100% 0;
    animation: linearGradientMove 0.5s infinite linear;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 30px;
    z-index: 3;
    color: red;
    overflow: hidden;
    .title {
      min-width: 70px;
    }
    .warp {
      width: 550px;
      overflow: hidden;
      ul {
        display: flex;
        li {
          font-size: 12px;
          padding: 0 550px 0 0;
        }
      }
    }
  }
}

@keyframes linearGradientMove {
  100% {
    background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
  }
}

@keyframes roll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.top-menu {
  height: 40px;
  display: flex;
  line-height: 40px;
  padding-bottom: 5px;
  .left {
    height: 100%;
    font-size: 22px;
    width: 22px;
    padding: 0 20px;
    text-align: center;
    background: #fff;
    .vertical {
      .icon {
        transform: rotate(90deg);
      }
    }
    .icon {
      font-size: 22px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .icon:hover {
      color: #409eff;
    }
    .roll {
      transform: rotate(90deg) !important;
    }
  }

  .center {
    flex: 1;
    padding: 0 20px;

    .top-el-menu {
      border-bottom: none !important;
      .el-menu-item {
        line-height: 40px;
        height: 100%;
      }
      .el-menu-item.is-active {
        color: #409eff !important;
      }
    }
  }

  .right {
    line-height: 40px;
    padding: 0 20px;
    cursor: pointer;
    background: #fff;
    background: #fff;
    .el-avatar--small {
      display: inline-block;
      vertical-align: middle;
      width: 32px;
      height: 32px;
      line-height: 32px;
    }
  }
}
.my-el-menu {
  border-right: none;
  .el-menu-item.is-active {
    background-color: var(--activeColor) !important;
  }
}
.side-content::-webkit-scrollbar {
  display: none;
}
.side-content {
  // height: calc(100% - 84px);
  overflow-y: auto;
  overflow-x: hidden;
  color: #ffffff;

  .my-el-menu {
    height: 90vh;
    overflow-y: auto;
    border-bottom: none !important;
    border-right: none !important;
    .fa {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
    }
  }
  .my-el-menu.el-menu--collapse {
    i {
      font-size: 22px;
    }
  }
}
.app-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  .side-container {
    height: 100vh;
    box-sizing: border-box;
    transition: width 0.5s;
    background-color: #263238;

    &.unfolded {
      width: 260px;

      .logo {
        padding: 10px 30px 10px 0;
        box-sizing: border-box;
        width: auto;
        height: 10vh;
        text-align: center;
        img {
          display: initial;
          height: auto;
          width: 70%;
        }
      }
    }

    &.folded {
      width: 64px;

      .logo {
        width: 46px;
        height: auto;
        padding: 10px;
        margin-left: 8px;
        box-sizing: border-box;
      }
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .main-container {
    float: left;
    height: 100vh;
    box-sizing: border-box;
    transition: width 0.5s;
    // overflow: hidden;

    &.normal {
      width: calc(100% - 200px);
    }

    &.wider {
      width: calc(100% - 56px);
    }

    .main-header {
      position: relative;
      top: 0;
    }

    .main-content {
      min-height: 750px;
      overflow: auto;
      .el-scrollbar {
        height: calc(100vh - 84px);
        .scrollbar {
          height: 100%;
          overflow-x: hidden;
        }
      }
    }
  }
}
.el-notification__group {
  cursor: pointer;
}
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
  z-index: 999;
  background: #26323833;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 50px;
  }
}
.el-dropdown-menu__item {
  text-align: center;
}
.colorOption {
  border-radius: 2px;
  padding: 10px;
  margin: 0 5px;
}
.colorOption-list {
  padding: 0 15px;
  display: flex;
}
.colorOption :hover {
  border: 1px solid #00bbff;
}
.colorActive {
  border: 1px solid #00bbff;
}
.menu-link {
  display: inline-block;
  height: 44px;
  line-height: 44px;
  color: #909399 !important;
}

.myChatIcon {
  position: fixed;
  bottom: 50px;
  right: 50px;
  padding: 8px;
  border-radius: 50%;
  background: #fff;
  z-index: 998;
  box-shadow: 0 0 10px rgba(21, 24, 34, 0.16);
  cursor: pointer;
  img {
    width: auto;
    height: 40px;
  }
}
.myChatWapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  .chatHeader {
    width: 80vw;
    max-width: 1080px;
    height: 40px;
    position: relative;
    background: #303841;
    .close {
      width: 40px;
      height: 40px;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: pointer;
      background: #303841;
      color: #fff;
      font-size: 24px;
      text-align: center;
      line-height: 40px;
      .closeIcon {
        transform: rotate(0deg);
        transition: all 0.5s;
      }
      &:hover {
        background: #363e47;
      }
      &:hover .closeIcon {
        color: #409eff;
        transform: rotate(180deg);
      }
    }
  }
  .chatIframe {
    display: block;
    width: 80vw;
    height: 80vh;
    max-width: 1080px;
    overflow: hidden;
  }
}

/deep/.linkBigScreen {
  text-decoration: none;
  color: #fff;
  .button {
    margin-left: 0;
  }
}
</style>
