import Vue from "vue";
import Router from "vue-router";
import Layout from "../layout";
import { asyncRoutes } from "./routes";

Vue.use(Router);

const VueRouterPush = Router.prototype.push;

Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const constantRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login"),
    hidden: true,
    meta: {
      title: "登录"
    }
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: () => import("../views/Forgot"),
    hidden: true,
    meta: {
      title: "找回密码"
    }
  },
  {
    path: "/entRegister",
    name: "entRegister",
    component: () => import("../views/register/ent"),
    hidden: true,
    meta: {
      title: "企业注册"
    }
  },
  {
    path: "/entUserRegister",
    name: "entUserRegister",
    component: () => import("../views/register/user"),
    hidden: true,
    meta: {
      title: "企业用户注册"
    }
  },
  {
    path: "/parkuserRegister",
    name: "parkuserRegister",
    component: () => import("../views/register/parkuser"),
    hidden: true,
    meta: {
      title: "园区用户注册"
    }
  },
  {
    path: "/thirdpartyuser",
    name: "thirdpartyuser",
    component: () => import("../views/register/thirdpartyuser"),
    hidden: true,
    meta: {
      title: "第三方用户注册"
    }
  },

  {
    path: "/loading",
    name: "loading",
    component: () => import("../views/loading"),
    hidden: true,
    meta: {
      title: "预加载"
    }
  },

  {
    path: "401",
    name: "401",
    component: () => import("../views/error-page/401"),
    hidden: true,
    meta: {
      title: "401"
    }
  },
  {
    path: "404",
    name: "404",
    component: () => import("../views/error-page/404"),
    hidden: true,
    meta: {
      title: "404"
    }
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../views/Home"),
        meta: {
          title: "总览",
          icon: "vue-dsn-icon-index",
          fixed: true
        }
      },
      // {
      //   path: 'smartForm',
      //   name: 'SmartForm',
      //   component: () => import('../views/smartForm/index/index'),
      //   hidden: true,
      //   meta: { title: '智慧表单' }
      // },
      {
        path: "shortcutCenter",
        name: "shortcutCenter",
        component: () => import("../views/system/shortcutCenter/index"),
        meta: {
          title: "快捷方式中心"
        }
      }
    ]
  },
  {
    path: "https://github.com/baimingxuan/vue-admin-design.git",
    name: "doc",
    component: Layout,
    meta: {
      title: "文档",
      icon: "vue-dsn-icon-wendang"
    }
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/user-center",
    hidden: true,
    children: [
      {
        path: "user-center",
        name: "UserCenter",
        component: () => import("../views/UserCenter"),
        meta: {
          title: "个人中心"
        }
      }
    ]
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/editPass",
    hidden: true,
    children: [
      {
        path: "editPass",
        name: "EditPass",
        component: () => import("../views/EditPass"),
        meta: {
          title: "密码修改"
        }
      }
    ]
  },
  {
    path: "/refresh",
    component: Layout,
    component: () => import("../views/refresh")
  },

  {
    path: '/dataVisualization',
    name: 'dataVisualization',
    component: () => import('../views/dataVisualization/index'),
    hidden: true
  },
  {
    path: "/statisticalchart",
    name: "statisticalchart",
    hidden: true,
    component: () => import("../views/statisticalchart/index.vue")
  }
];

const routes = [...constantRoutes, ...asyncRoutes];

export default new Router({
  routes
});
