import request from '../../request'

// 字典接口
export function list(params) {
  return request({
    url: '/admin/sys/dictionary/list',
    method: 'get',
    params
  })
}
export function detail(params) {
  return request({
    url: '/admin/sys/dictionary/detail',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/admin/sys/dictionary/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/admin/sys/dictionary/edit',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/admin/sys/dictionary/delete',
    method: 'post',
    data
  })
}

