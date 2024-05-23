import request from '../../request'

// 表格列表
export function list(params) {
  return request({
    url: '/admin/sys/configure/list',
    method: 'get',
    params
  })
}

// 表格修改/编辑
export function edit(data) {
  return request({
    url: '/admin/sys/configure/edit',
    method: 'post',
    data
  })
}

// 表格详情
export function detail(params) {
  return request({
    url: '/admin/sys/configure/detail',
    method: 'get',
    params
  })
}

// 表格新增
export function add(data) {
  return request({
    url: '/admin/sys/configure/add',
    method: 'post',
    data
  })
}

// 表格删除
export function remove(data) {
  return request({
    url: '/admin/sys/configure/delete',
    method: 'post',
    data
  })
}

// tree详情
export function treeDetail(params) {
  return request({
    url: '/admin/sys/configureType/detail',
    method: 'get',
    params
  })
}

// tree列表
export function treeList(params) {
  return request({
    url: '/admin/sys/configureType/list',
    method: 'get',
    params
  })
}

// tree列表
export function themeColor(params) {
  return request({
    url: '/admin/sys/configure/themeColor',
    method: 'get',
    params
  })
}

// tree修改/编辑
export function treeEdit(data) {
  return request({
    url: '/admin/sys/configureType/edit',
    method: 'post',
    data
  })
}

// tree新增
export function treeAdd(data) {
  return request({
    url: '/admin/sys/configureType/add',
    method: 'post',
    data
  })
}

// tree删除
export function treeRemove(data) {
  return request({
    url: '/admin/sys/configureType/delete',
    method: 'post',
    data
  })
}

export function saveUser(data) {
  return request({
    url: '/admin/sys/configure/saveUser',
    method: 'post',
    data
  })
}
export function menuListMethod(params) {
  return request({
    url: '/admin/getUserByToken',
    method: 'get',
    params
  })
}



