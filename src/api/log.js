import request from '../request'

export function list(params) {
  return request({
    url: 'admin/system/log/list',
    method: 'get',
    params
  })
}

export function errorLogPage(params) {
  return request({
    url: '/admin/sys/log/errorLogPage',
    method: 'get',
    params
  })
}
export function loginLogPage(params) {
  return request({
    url: '/admin/sys/log/loginLogPage',
    method: 'get',
    params
  })
}
export function operationLogPage(params) {
  return request({
    url: '/admin/sys/log/operationLogPage',
    method: 'get',
    params
  })
}