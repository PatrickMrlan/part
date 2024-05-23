import request from '../request'


export function treeList(params) {
  return request({
    url: '/admin/sys/menu/treeList',
    method: 'get',
    params
  })
}
export function menuDetail(params) {
  return request({
    url: '/admin/sys/menu/detail',
    method: 'get',
    params
  })
}
export function menuAdd(data) {
  return request({
    url: '/admin/sys/menu/add',
    method: 'post',
    data
  })
}
export function menuEdit(data) {
  return request({
    url: '/admin/sys/menu/edit',
    method: 'post',
    data
  })
}
export function menuRemove(data) {
  return request({
    url: '/admin/sys/menu/delete',
    method: 'post',
    data
  })
}

export function operateList(params) {
  return request({
    url: '/admin/sys/menu/operateList',
    method: 'get',
    params
  })
}
export function operateDetail(params) {
  return request({
    url: '/admin/sys/menu/operateDetail',
    method: 'get',
    params
  })
}
export function operateAdd(data) {
  return request({
    url: '/admin/sys/menu/operateAdd',
    method: 'post',
    data
  })
}
export function operateEdit(data) {
  return request({
    url: '/admin/sys/menu/operateEdit',
    method: 'post',
    data
  })
}
export function operateRemove(data) {
  return request({
    url: '/admin/sys/menu/operateDelete',
    method: 'post',
    data
  })
}

// 批量配置操作权限
export function operateAddList(data) {
  return request({
    url: '/admin/sys/operate/operateAddList',
    method: 'post',
    data
  })
}
