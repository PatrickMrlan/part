import request from '@/request'

/**
 * 隐患计划详情
 */

// 新增隐患计划详情
export function add(data) {
  return request({
    url: '/admin/hazard/task/detail/add',
    method: 'post',
    data
  })
}

// 删除隐患计划详情
export function remove(data) {
  return request({
    url: '/admin/hazard/task/detail/delete',
    method: 'post',
    data
  })
}

// 隐患计划详情详情
export function detail(params) {
  return request({
    url: '/admin/hazard/task/detail/detail',
    method: 'get',
    params
  })
}

// 修改隐患计划详情
export function edit(data) {
  return request({
    url: '/admin/hazard/task/detail/edit',
    method: 'post',
    data
  })
}

// 枚举列表
export function enumList(params) {
  return request({
    url: '/admin/hazard/task/detail/enumList',
    method: 'get',
    params
  })
}

// 隐患计划详情列表
export function list(params) {
  return request({
    url: '/admin/hazard/task/detail/list',
    method: 'get',
    params
  })
}

