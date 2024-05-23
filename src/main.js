import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueTouch from 'vue-touch'
import ElementUI from 'element-ui'
import wlGantt from 'wl-gantt'
 
import "wl-gantt/lib/wl-gantt.css"


import './router/auth'

import './assets/icon-fonts/iconfont.css'
import './assets/icon-fonts/iconfont'
import './assets/font-awesome/css/font-awesome.min.css'
import 'vue-beauty/package/style/vue-beauty.min.css'
import './assets/less/app.less'
import 'element-ui/lib/theme-chalk/index.css'
import vuequilleditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import dataV from '@jiaminghi/data-view'

import * as echarts from 'echarts'
import 'echarts-liquidfill'
import * as echartsGL from 'echarts-gl'

import './views/smartForm/icons'
import Print from './utils/print'
import LemonIMUI from 'lemon-imui'
import 'lemon-imui/dist/index.css'
Vue.use(LemonIMUI)
Vue.use(Print)
import Tinymce from './views/smartForm/components/tinymce/index.vue'

Vue.component('tinymce', Tinymce)

Vue.prototype.$echarts = echarts
Vue.prototype.$echartsGL = echartsGL // 引入组件（将echarts注册为全局）
import vueBeauty from 'vue-beauty'
Vue.use(vueBeauty)

Vue.use(dataV)

VueTouch.config.swipe = {
  threshold: 10
}
Vue.use(vuequilleditor)
Vue.use(VueTouch, { name: 'v-touch' })
Vue.use(ElementUI, { size: 'small' })


Vue.use(wlGantt)


import myDialog from './components/myDialog/index.vue'
import myTree from './components/myTree/index.vue'
import myTable from './components/myTable/index.vue'
import myTip from './components/myTip.vue'
import myButton from './components/myButton.vue'
import myHandle from './components/myHandle.vue'
import myStatistics from './components/myStatistics/index.vue'
import myDrawer from './components/myDrawer/index.vue'
import myUpload from './components/myUpload/index.js'
import FormControls from './components/FlowFormControls/index.js'
import banner from './components/banner/index.vue'
Vue.use(FormControls)
Vue.component('myDialog', myDialog)
Vue.component('myTree', myTree)
Vue.component('myTable', myTable)
Vue.component('myTip', myTip)
Vue.component('myButton', myButton)
Vue.component('myHandle', myHandle)
Vue.component('myStatistics', myStatistics)
Vue.component('myDrawer', myDrawer)
Vue.component('myUpload', myUpload)
Vue.component('banner', banner)

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.seesionLoginUser = JSON.parse(sessionStorage.getItem('loginUser') || '{}')
// Vue.prototype.baseURL = "http://sqtyj.answer2u.com:2890"
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
/**
 * 根据后台返回的枚举name 获取对应的枚举值
 * @param {Array} list 枚举数组
 * @param {String} name 枚举名称
 */
Vue.prototype.getEnumValue = (list, name) => {
  const enumArr = list.filter(item => {
    return item.name === name
  })
  if (enumArr.length > 0) {
    return enumArr[0].value
  }
}

/**
 * 获取页面的权限数组
 * @param {String} pageMenu 页面信息
 * @returns 权限数组
 */
Vue.prototype.getPageOper = (pageMenu) => {
  if (!pageMenu.path && !pageMenu) {
    alert('权限验证错误，页面路径为空')
  }

  const pageOper = {
    CX: false, // 查询
    TJ: false, // 添加
    XG: false, // 修改
    SC: false, // 删除
    DC: false, // 导出
    DR: false, // 导入
    SH: false
  }

  const pageList = JSON.parse(sessionStorage.getItem('pageOperList') || '[]')
  if (pageList.length === 0) {
    return pageOper
  }
  const pageInfo = pageList.filter(item => (item.menuUrl === pageMenu.path && item.name === pageMenu.query.name) || item.menuUrl === pageMenu)
  if (pageInfo.length > 0 && pageInfo[0].data.sysPowerList.length > 0) {
    for (var key in pageOper) {
      var hasOper = pageInfo[0].data.sysPowerList.filter(item => item.operateValue === key)
      pageOper[key] = hasOper.length > 0
    }
  }
  // console.log(pageOper);
  return pageOper
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
