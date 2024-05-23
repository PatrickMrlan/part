import request from '../request'

// 应用菜单树

//园区列表
export function parkList(params) {
  return request({
    url: '/register/parkList',
    method: 'get',
    params
  })
}

//园区人员注册
export function parkUserRegister(data) {
  return request({
    url: '/register/parkUserRegister',
    method: 'post',
    data
  })
}
//第三方人员注册 
export function thirdPartyUserRegister(data) {
  return request({
    url: '/register/thirdPartyUserRegister',
    method: 'post',
    data
  })
}


export function entRegister(data) {
  return request({
    url: '/register/entRegister',
    method: 'post',
    data
  })
}
export function userRegister(data) {
  return request({
    url: '/register/userRegister',
    method: 'post',
    data
  })
}
export function entDetail(params) {
  return request({
    url: '/register/entDetail',
    method: 'get',
    params
  })
}
export function workPersonnelType(params) {
  return request({
    url: '/register/workPersonnelType',
    method: 'get',
    params
  })
}
export function parkDetail(params) {
  return request({
    url: '/register/parkDetail',
    method: 'get',
    params
  })
}

export function thirdPartyDetail(params) {
  return request({
    url: '/register/thirdPartyDetail',
    method: 'get',
    params
  })
}

export function enumList(params) {
  return request({
    url: '/register/enumList',
    method: 'get',
    params
  })
}

