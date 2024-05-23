import request from '@/request'

/**
 * 风险--> 风险单元（场所、区域）
 */

// 列表
export function list(params) {
  return request({
    url: '/admin/risk/points/list',
    method: 'get',
    params
  })
}

// 详情
export function detail(params) {
  return request({
    url: '/admin/risk/points/detail',
    method: 'get',
    params
  })
}

// 风险单元（场所、区域）台账
export function ledger(params) {
  return request({
    url: '/admin/risk/points/ledger',
    method: 'get',
    params
  })
}

// 枚举
export function enumList(params) {
  return request({
    url: '/admin/risk/points/enumList',
    method: 'get',
    params
  })
}

// 编辑
export function edit(data) {
  return request({
    url: '/admin/risk/points/edit',
    method: 'post',
    data
  })
}

// 新增
export function add(data) {
  return request({
    url: '/admin/risk/points/add',
    method: 'post',
    data
  })
}

// 删除
export function remove(data) {
  return request({
    url: '/admin/risk/points/delete',
    method: 'post',
    data
  })
}

// 自动生成
export function auto(data) {
  return request({
    url: '/admin/risk/points/auto',
    method: 'post',
    data
  })
}
export function copyPoint(data) {
  return request({
    url: '/admin/risk/points/copyPoint',
    method: 'post',
    data
  })
}
