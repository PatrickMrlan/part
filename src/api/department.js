import request from '../request'

export function list(params) {
  return request({
    url: '/admin/sys/department/list',
    method: 'get',
    params
  })
}
export function treeList(params) {
  return request({
    url: '/admin/sys/department/treeList',
    method: 'get',
    params
  })
}
export function detail(params) {
  return request({
    url: '/admin/sys/department/detail',
    method: 'get',
    params
  })
}
export function edit(data) {
  return request({
    url: '/admin/sys/department/edit',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/admin/sys/department/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/admin/sys/department/delete',
    method: 'post',
    data
  })
}
export function enumList(params) {
  return request({
    url: '/admin/sys/department/enumList',
    method: 'get',
    params
  })
}
