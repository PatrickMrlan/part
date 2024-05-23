import request from '../../request'

// 列表
export function list(params) {
  return request({
    url: '/admin/sys/notice/list',
    method: 'get',
    params
  })
}
// 详情
export function detail(params) {
  return request({
    url: '/admin/sys/notice/detail',
    method: 'get',
    params
  })
}
// 删除
export function remove(data) {
  return request({
    url: '/admin/sys/notice/delete',
    method: 'post',
    data
  })
}
// 新增
export function add(data) {
  return request({
    url: '/admin/sys/notice/add',
    method: 'post',
    data
  })
}
// 修改
export function edit(data) {
  return request({
    url: '/admin/sys/notice/edit',
    method: 'post',
    data
  })
}
export function enumList(params) {
  return request({
    url: '/admin/sys/notice/enumList',
    method: 'get',
    params
  })
}
