import request from '@/request'

/**
 * 隐患计划
 */

// 新增隐患计划
export function add(data) {
  return request({
    url: '/admin/hazard/task/add',
    method: 'post',
    data
  })
}

// 删除隐患计划
export function remove(data) {
  return request({
    url: '/admin/hazard/task/delete',
    method: 'post',
    data
  })
}

// 隐患计划详情
export function detail(params) {
  return request({
    url: '/admin/hazard/task/detail',
    method: 'get',
    params
  })
}

// 修改隐患计划
export function edit(data) {
  return request({
    url: '/admin/hazard/task/edit',
    method: 'post',
    data
  })
}

// 枚举列表
export function enumList(params) {
  return request({
    url: '/admin/hazard/task/enumList',
    method: 'get',
    params
  })
}

// 隐患计划列表
export function list(params) {
  return request({
    url: '/admin/hazard/task/list',
    method: 'get',
    params
  })
}

// 隐患计划列表
export function userListByTaskId(params) {
  return request({
    url: '/admin/hazard/task/userListByTaskId',
    method: 'get',
    params
  })
}

// 隐患计划列表
export function entListByTaskId(params) {
  return request({
    url: '/admin/hazard/task/entListByTaskId',
    method: 'get',
    params
  })
}
export function userList(params) {
  return request({
    url: '/admin/hazard/task/userList',
    method: 'get',
    params
  })
}

// 隐患计划列表
export function entList(params) {
  return request({
    url: '/admin/hazard/task/entList',
    method: 'get',
    params
  })
}
export function addEnt(data) {
  return request({
    url: '/admin/hazard/task/addEnt',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/admin/hazard/task/addUser',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/admin/hazard/task/deleteUser',
    method: 'post',
    data
  })
}
export function deleteEnt(data) {
  return request({
    url: '/admin/hazard/task/deleteEnt',
    method: 'post',
    data
  })
}


