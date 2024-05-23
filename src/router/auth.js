import router from './index'
import { getToken } from '../utils/cookie'

// 白名单列表
const whiteList = ['/login', '/forgot', '/loading', '/entRegister', '/entUserRegister', '/parkuserRegister' , '/thirdpartyuser' ,'/picture/index', '/refresh', '/dataVisualization','/statisticalchart']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    // 已登录且要跳转的是登录页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 否则重定向到登录页
      next(`/loading?redirect=${to.fullPath}`)
    } 
  }
})
