import request from '@/request'

/**
 * 风险--> 管控措施
 */

// 列表
export function list(params) {
  return request({
    url: '/admin/risk/measures/list',
    method: 'get',
    params
  })
}

// 枚举
export function enumList(params) {
  return request({
    url: '/admin/risk/measures/enumList',
    method: 'get',
    params
  })
}

// 新增
export function add(data) {
  return request({
    url: '/admin/risk/measures/add',
    method: 'post',
    data
  })
}

// 删除管控措施
export function remove(data) {
  return request({
    url: '/admin/risk/measures/delete',
    method: 'post',
    data
  })
}

// 删除事故
export function deleteMajor(data) {
  return request({
    url: '/admin/risk/measures/deleteMajor',
    method: 'post',
    data
  })
}

// 管控措施类型
export function measureType(params) {
  return request({
    url: '/admin/risk/measures/measureType',
    method: 'get',
    params
  })
}

// 管控台账
export function measuresList(params) {
  return request({
    url: '/admin/risk/measures/measuresList',
    method: 'get',
    params
  })
}

// 管控台账
export function ledger(params) {
  return request({
    url: '/admin/risk/measures/ledger',
    method: 'get',
    params
  })
}

// 管控措施列表
export function standardList(params) {
  return request({
    url: '/admin/risk/measures/standardList',
    method: 'get',
    params
  })
}

// 安全检查清单
export function safetyChecklist(params) {
  return request({
    url: '/admin/risk/measures/safetyChecklist',
    method: 'get',
    params
  })
}
export function classificationListByType(params) {
  return request({
    url: '/admin/risk/measures/classificationListByType',
    method: 'get',
    params
  })
}

