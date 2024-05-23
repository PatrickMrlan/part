import request from '../request'

export function list(params) {
  return request({
    url: '/admin/sys/role/list',
    method: 'get',
    params
  })
}
export function detail(params) {
  return request({
    url: '/admin/sys/role/detail',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/admin/sys/role/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/admin/sys/role/edit',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/admin/sys/role/delete',
    method: 'post',
    data
  })
}
