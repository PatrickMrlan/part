<template>
  <div />
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { getToken } from "../utils/cookie";
import { setToken } from "../utils/cookie";
import { loading } from "@/api/login";

export default {
  name: "Layout",
  data() {
    return {
      loading: false,
      redirect: undefined,
      pageList: [],
    };
  },
  computed: {
    ...mapGetters("app", ["topActive", "leftActive", "topid"]),
    ...mapGetters(["visitedViews"]),
    ...mapState("app", {
      state: (state) => state,
    }),
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.openFullScreen();
    this.isLogin();
  },
  methods: {
    ...mapMutations("app", ["openSideMenu", "closeSideMenu"]),
    ...mapMutations(["delAllVisitedView"]),

    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },

    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    setPageList(menList) {
      for (let i = 0; i < menList.length; i++) {
        if (menList[i].children.length > 0) {
          this.setPageList(menList[i].children);
        } else {
          this.pageList.push(menList[i]);
          // 移除掉非菜单数据
          if (menList[i].isMenu === "NO") {
            menList.splice(i, 1);
            i--;
          }
        }
      }
    },

    isLogin() {
      var appId = this.$route.query.appId || this.GetQueryString("appId");
      var account = this.$route.query.account || this.GetQueryString("account");
      if (appId && account) {
        loading({
          appId: appId,
          account: account,
        })
          .then((res) => {
            // 缓存登录用户信息
            sessionStorage.setItem("loginUser", JSON.stringify(res.cloudUser));
            // 设置所有权限页面信息
            this.setPageList(res.menuList);
            sessionStorage.setItem(
              "pageOperList",
              JSON.stringify(this.pageList)
            );
            // 缓存菜单信息
            sessionStorage.setItem("menuList", JSON.stringify(res.menuList));
            setToken(res.cloudUser.token);
            this.$router.push({ path: this.redirect || "/" });
          })
          .catch((error) => {
            console.log(error);
            this.$router.push({ path: "/login" });
          });
        let url = window.location.href; //获取当前页面的url
        if (url.indexOf("account") != -1) {
          //判断是否存在参数
          url = url.replace(/(\?|#)[^'"]*/, ""); //去除参数
          window.history.pushState({}, 0, url);
        }
      } else {
        this.$router.push({ path: "/login" });
      }
      this.loading.close();
    },
  },
};
</script>

<style lang="less" scoped></style>
