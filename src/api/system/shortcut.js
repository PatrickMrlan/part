import request from '../../request'

// 快捷方式管理

// 列表
export function list(params) {
  return request({
    url: '/admin/sys/shortcut/list',
    method: 'get',
    params
  })
}
// 详情
export function detail(params) {
  return request({
    url: '/admin/sys/shortcut/detail',
    method: 'get',
    params
  })
}
// 删除
export function remove(data) {
  return request({
    url: '/admin/sys/shortcut/delete',
    method: 'post',
    data
  })
}
// 新增
export function add(data) {
  return request({
    url: '/admin/sys/shortcut/add',
    method: 'post',
    data
  })
}
// 修改
export function edit(data) {
  return request({
    url: '/admin/sys/shortcut/edit',
    method: 'post',
    data
  })
}

export function myShortcut(params) {
  return request({
    url: '/admin/sys/shortcut/myShortcut',
    method: 'get',
    params
  })
}

export function saveShortcut(data) {
  return request({
    url: '/admin/sys/shortcut/saveShortcut',
    method: 'post',
    data
  })
}
