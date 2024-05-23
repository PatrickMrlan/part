import request from '../../request'

// 列表
export function list(params) {
  return request({
    url: '/admin/sys/enterprise/list',
    method: 'get',
    params
  })
}
export function enumList(params) {
  return request({
    url: '/admin/sys/enterprise/enumList',
    method: 'get',
    params
  })
}
export function treeList(params) {
  return request({
    url: '/admin/sys/enterprise/treeList',
    method: 'get',
    params
  })
}
// 详情
export function detail(params) {
  return request({
    url: '/admin/sys/enterprise/detail',
    method: 'get',
    params
  })
}
// 详情
// export function detail(params) {
//   return request({
//     url: '/admin/sys/app/authorizeInfo',
//     method: 'get',
//     params
//   })
// }

// 新增
export function add(data) {
  return request({
    url: '/admin/sys/enterprise/add',
    method: 'post',
    data
  })
}

// 编辑/修改
export function edit(data) {
  return request({
    url: '/admin/sys/enterprise/edit',
    method: 'post',
    data
  })
}

// 删除
export function remove(data) {
  return request({
    url: '/admin/sys/enterprise/delete',
    method: 'post',
    data
  })
}

// 批量授权应用企业
export function addList(data) {
  return request({
    url: '/admin/sys/app/authorizeAddListEnt',
    method: 'post',
    data
  })
}

// 企业授权页面加载
export function authorizeDetailEnt(params) {
  return request({
    url: '/admin/sys/app/authorizeDetailEnt',
    method: 'get',
    params
  })
}

// 企业扩展信息
export function extendList(params) {
  return request({
    url: '/admin/sys/enterprise/extendList',
    method: 'get',
    params
  })
}
