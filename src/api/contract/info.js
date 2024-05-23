import request from '@/request'

/*
 * 合同管理 --> 合同列表
 */

// 列表
export function list(params) {
  return request({
    url: '/admin/contract/info/list',
    method: 'get',
    params
  })
}

export function processTemplateList(params) {
  return request({
    url: '/admin/contract/info/processTemplateList',
    method: 'get',
    params
  })
}

// 详情
export function detail(params) {
  return request({
    url: '/admin/contract/info/detail',
    method: 'get',
    params
  })
}

// 删除
export function remove(data) {
  return request({
    url: '/admin/contract/info/delete',
    method: 'post',
    data
  })
}

// 新增
export function add(data) {
  return request({
    url: '/admin/contract/info/add',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/admin/contract/info/edit',
    method: 'post',
    data
  })
}

// 枚举
export function infoEnum(params) {
  return request({
    url: '/admin/contract/info/getInfoEnum',
    method: 'get',
    params
  })
}

// 默认编号
export function defaultNo(params) {
  return request({
    url: '/admin/contract/info/getDefaultNo',
    method: 'get',
    params
  })
}

// tree
export function treeList(params) {
  return request({
    url: '/admin/view/propertyInfo/treeList',
    method: 'get',
    params
  })
}

// 电子合同
export function electronicContract(params) {
  return request({
    url: '/admin/contract/info/getElectronicContract',
    method: 'get',
    params
  })
}

// 生成租金明细
export function generate(data) {
  return request({
    url: '/admin/contract/rentdetails/generate',
    method: 'post',
    data
  })
}

// 提交审批请求
export function approveContract(data) {
  return request({
    url: '/admin/contract/info/approveContract',
    method: 'post',
    data
  })
}

// 待审批合同
export function approveList(params) {
  return request({
    url: '/admin/contract/info/approveList',
    method: 'get',
    params
  })
}

// 获取合同结束时间
export function getEndDate(params) {
  return request({
    url: '/admin/contract/info/getEndDate',
    method: 'get',
    params
  })
}

