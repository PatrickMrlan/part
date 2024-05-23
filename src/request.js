import axois from 'axios'
import { Message, Loading } from 'element-ui'
import { getToken } from './utils/cookie'
import uuid from 'node-uuid'
import crypto from 'crypto-js'
import md5 from 'md5-node'
import { removeToken } from './utils/cookie'
import { mapState } from 'vuex'

// 创建axios实例
const service = axois.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  // baseURL: '', // 设置代理时此字段需要设置为空
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  timeout: 120000 // 请求超时时间
})

let loading // 定义loading变量

function startLoading() {
  // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  // 使用Element loading-close 方法
  loading.close()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

const unverification = [
  '/admin/loginType',
  '/admin/loading',
  '/admin/phoneVerifyCode',
  '/admin/login',
  '/admin/singleLogin',
  '/admin/system/homePageConfig/loginData',
  '/admin/system/configure/passWordDetail',
  '/admin/sendSmsCode',
  '/admin/verifyCode',
  '/admin/editDefaultPass',
  '/admin/produce/massif/qrcode',
  '/register/parkList',
  '/register/entRegister',
  '/register/workPersonnelType',
  '/register/entDetail',
  '/register/userRegister',
  '/register/enumList',
  '/register/parkUserRegister',
  '/register/parkDetail',
  '/register/thirdPartyUserRegister',
  '/register/thirdPartyDetail',
  '/admin/verifyIdentity',
  '/admin/resetPass',
  '/admin/getUserByToken'
]
// request拦截器设置
service.interceptors.request.use(
  config => {
    // 显示加载层
    // if (loading) {
    //   loading.style.display = "block"
    //   console.log(loading)
    // }

    var token = getToken()

    if (token) {
      config.headers['Authorization'] = token // 请求头设置自带 token
    }
    config.headers['Content-Type'] = 'application/json' // 请求的数据格式为 json
    // config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
    if (unverification.indexOf(config.url) >= 0) {
      return config
    }
    // 随机生成guid
    const guid = uuid.v1().replace(/-/g, '')
    // 获取时间戳
    const time = new Date().getTime()
    // 获取密钥
    const user = JSON.parse(sessionStorage.getItem('loginUser')) || {}
    const secret = user.token
    // 生成身份认证数据
    let data = null
    let obj = ''
    // if (config.method.toUpperCase() === 'GET') {
    //   // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    //   config.paramsSerializer = function(params) {
    //     return qs.stringify(params, { arrayFormat: 'repeat' })
    //   }
    // }
    if (config.method.toUpperCase() === 'GET') {
      data = config.params || {}
      // get请求剔除空数据，拼装参数
      for (var key in data) {
        if (
          data[key] == null ||
          data[key] === undefined ||
          data[key] === 'undefined'
        ) {
          continue
        }
        if (obj) {
          if (Array.isArray(data[key])) {
            data[key].forEach(item => {
              obj = obj + '&' + key + '[]=' + item
            })
          } else {
            obj = obj + '&' + key + '=' + data[key]
          }
        } else {
          if (Array.isArray(data[key])) {
            data[key].forEach(item => {
              obj = key + '[]=' + item
            })
          } else {
            obj = key + '=' + data[key]
          }
        }
      }
      data = obj
    } else {
      data = JSON.stringify(config.data || '{}')
    }
    // return config
    // DES加密
    const desData = crypto.DES.encrypt(
      time + guid + token,
      crypto.enc.Utf8.parse(token),
      {
        iv: crypto.enc.Utf8.parse(secret.substring(0, 8)),
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      }
    ).toString()
    // AES加密
    const ascData = crypto.AES.encrypt(
      data + desData,
      crypto.enc.Utf8.parse(secret),
      {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      }
    ).toString()
    const md5Data = md5(ascData).toUpperCase()
    config.headers['APP-GUID'] = guid
    config.headers['APP-TIME'] = time
    config.headers['APP-DATA'] = md5Data
    // showFullScreenLoading()
    return config
  },
  error => {
    // // 显示加载层
    // if (loading) {
    //   loading.style.display = 'none'
    //   console.log(loading)
    // }
    tryHideFullScreenLoading()
    console.log(error)
    Promise.reject(error)
  }
)
let messageShow = false
// response 拦截器设置
service.interceptors.response.use(
  response => {
    // 若是开发环境，打印出来返回的数据
    if (process.env.NODE_ENV === 'development') {
      // console.log(response)
    }
    const data = response.data
    const code = data.code
    let message = data.message
    // 接口返回200 表示成功
    if (code === 200) {
      tryHideFullScreenLoading()
      return data.data
    } else {
      tryHideFullScreenLoading()
      if (code === undefined && message === undefined) {
        message = '数据处理出现异常！'
      }
      if (window.location.hash != '#/login') {
        if (!messageShow) {
          Message({
            type: 'error',
            message: message,
            onClose: () => {
              messageShow = false
            }
          })
        }
      }

      messageShow = true
      if (code === 501) {
        removeToken()
        sessionStorage.clear()
        var href = window.location.href.substring(
          0,
          window.location.href.indexOf('/')
        )
        window.location.href = href
      }
      tryHideFullScreenLoading()
      return Promise.reject(data)
    }
  },
  error => {
    let errCode = null
    let errMsg = '接口请求失败'
    if (!error.isAxiosError && error.response.data) {
      errCode = error.response.data.code
      errMsg = error.response.data.message
    }
    if (!errCode || error.isAxiosError) {
      if (!messageShow) {
        Message({
          type: 'error',
          message: errMsg,
          onClose: () => {
            messageShow = false
          }
        })
      }
      messageShow = true
    }
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  params = params || {}
  return new Promise((resolve, reject) => {
    axois
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export default service
