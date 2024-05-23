import request from '@/request'

/**
 * 隐患排查治理
 */

// 隐患排查列表
export function list(params) {
  return request({
    url: '/admin/hazard/investigation/list',
    method: 'get',
    params
  })
}

// 隐患排查枚举
export function enumList(params) {
  return request({
    url: '/admin/hazard/investigation/enumList',
    method: 'get',
    params
  })
}

// 隐患排查详情
export function detail(params) {
  return request({
    url: '/admin/hazard/investigation/detail',
    method: 'get',
    params
  })
}

// 隐患排查新增
export function add(data) {
  return request({
    url: '/admin/hazard/investigation/add',
    method: 'post',
    data
  })
}

// 隐患排查修改
export function edit(data) {
  return request({
    url: '/admin/hazard/investigation/edit',
    method: 'post',
    data
  })
}

// 隐患排查删除
export function remove(data) {
  return request({
    url: '/admin/hazard/investigation/delete',
    method: 'post',
    data
  })
}

// 新增临时风险单元（场所、区域）
export function addRiskPoint(data) {
  return request({
    url: '/admin/hazard/investigation/addRiskPoint',
    method: 'post',
    data
  })
}

// 新增临时风险源（点）
export function addRiskSource(data) {
  return request({
    url: '/admin/hazard/investigation/addRiskSource',
    method: 'post',
    data
  })
}

// 提交整改
export function submitRect(data) {
  return request({
    url: '/admin/hazard/investigation/submitRect',
    method: 'post',
    data
  })
}

// 领导确认
export function leaderConfirm(data) {
  return request({
    url: '/admin/hazard/investigation/leaderConfirm',
    method: 'post',
    data
  })
}

// 待整改列表
export function rectList(params) {
  return request({
    url: '/admin/hazard/investigation/rectList',
    method: 'get',
    params
  })
}

// 结果详情
export function resultDetail(params) {
  return request({
    url: '/admin/hazard/investigation/resultDetail',
    method: 'get',
    params
  })
}

// 根据计划查询企业
export function listByTask(params) {
  return request({
    url: '/admin/hazard/investigation/listByTask',
    method: 'get',
    params
  })
}

// 管控台账
export function ledger(params) {
  return request({
    url: '/admin/hazard/investigation/ledger',
    method: 'get',
    params
  })
}

// 待确认列表
export function confirmList(params) {
  return request({
    url: '/admin/hazard/investigation/confirmList',
    method: 'get',
    params
  })
}

// 导出
export function exportData(data) {
  return request({
    url: '/admin/hazard/investigation/export',
    method: 'post',
    data
  })
}

export function selfLedger(params) {
  return request({
    url: '/admin/hazard/investigation/selfLedger',
    method: 'get',
    params
  })
}

export function resultListByRisk(params) {
  return request({
    url: '/admin/hazard/investigation/resultListByRisk',
    method: 'get',
    params
  })
}
