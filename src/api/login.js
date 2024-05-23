import request from '../request'

export function login(data) {
  return request({
    url: '/admin/singleLogin',
    method: 'post',
    data
  })
}
// export function login(data) {
//   return request({
//     url: '/admin/login',
//     method: 'post',
//     data
//   })
// }

export function getUserInfo(params) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params
  })
}

export function editPass(data) {
  return request({
    url: '/admin/editPass',
    method: 'post',
    data
  })
}
export function editDefaultPass(data) {
  return request({
    url: '/admin/editDefaultPass',
    method: 'post',
    data
  })
}

export function sendSmsCode(data) {
  return request({
    url: '/admin/sendSmsCode',
    method: 'post',
    data
  })
}

export function verifyCode(params) {
  return request({
    url: '/admin/verifyCode',
    method: 'get',
    params
  })
}

export function loginType(params) {
  return request({
    url: '/admin/loginType',
    method: 'get',
    params
  })
}

// 手机方式登录的验证码验证
export function phoneVerifyCode(params) {
  return request({
    url: '/admin/phoneVerifyCode',
    method: 'get',
    params
  })
}
// loading
export function loading(data) {
  return request({
    url: '/admin/loading',
    method: 'post',
    data
  })
}


// 应用菜单树
export function treeList(params) {
  return request({
    url: '/admin/sys/menu/treeList',
    method: 'get',
    params
  })
}

export function verifyIdentity(data) {
  return request({
    url: '/admin/verifyIdentity',
    method: 'post',
    data
  })
}

export function resetPass(data) {
  return request({
    url: '/admin/resetPass',
    method: 'post',
    data
  })
}
