import request from '@/request'

/**
 * 企业信息
 */

// 企业信息新增
export function add(data) {
  return request({
    url: '/admin/sys/enterprise/add',
    method: 'post',
    data
  })
}

// 企业信息删除
export function remove(data) {
  return request({
    url: '/admin/sys/enterprise/delete',
    method: 'post',
    data
  })
}

// 企业信息修改
export function edit(data) {
  return request({
    url: '/admin/sys/enterprise/edit',
    method: 'post',
    data
  })
}
// 企业信息修改
export function openRegister(data) {
  return request({
    url: '/admin/sys/enterprise/openRegister',
    method: 'post',
    data
  })
}
// 企业审核
export function entReview(data) {
  return request({
    url: '/admin/sys/enterprise/entReview',
    method: 'post',
    data
  })
}

// 发起审核
export function toReview(data) {
  return request({
    url: '/admin/sys/enterprise/toReview',
    method: 'post',
    data
  })
}

// 企业信息详情
export function detail(params) {
  return request({
    url: '/admin/sys/enterprise/detail',
    method: 'get',
    params
  })
}

// 企业有关枚举、字典列表
export function enumList(params) {
  return request({
    url: '/admin/sys/enterprise/enumList',
    method: 'get',
    params
  })
}

// 企业信息列表
export function list(params) {
  return request({
    url: '/admin/sys/enterprise/list',
    method: 'get',
    params
  })
}
// 上级机构
export function parentEnt(params) {
  return request({
    url: '/admin/sys/enterprise/parentEnt',
    method: 'get',
    params
  })
}
// 下级机构
export function subEnt(params) {
  return request({
    url: '/admin/sys/enterprise/subEnt',
    method: 'get',
    params
  })
}
// 选择关联
export function associationEnt(params) {
  return request({
    url: '/admin/sys/enterprise/associationEnt',
    method: 'get',
    params
  })
}
// 所属企业列表
export function affiliationList(params) {
  return request({
    url: '/admin/sys/enterprise/affiliationList',
    method: 'get',
    params
  })
}
// 台账统计
export function ledger(params) {
  return request({
    url: '/admin/sys/enterprise/ledger',
    method: 'get',
    params
  })
}

// 园区新增企业
export function addEnt(data) {
  return request({
    url: '/admin/sys/park/addEnt',
    method: 'post',
    data
  })
}

// 发起审核
export function editEnt(data) {
  return request({
    url: '/admin/sys/park/editEnt',
    method: 'post',
    data
  })
}

// 解除关联/确认关联
export function associated(data) {
  return request({
    url: '/admin/sys/enterprise/associated',
    method: 'post',
    data
  })
}

//
export function getTreeParentName(params) {
  return request({
    url: '/admin/sys/enterprise/getTreeParentName',
    method: 'get',
    params
  })
}

export function nationalEconomyList(params) {
  return request({
    url: '/admin/sys/enterprise/nationalEconomyList',
    method: 'get',
    params
  })
}
export function nationalEconomyDetail(params) {
  return request({
    url: '/admin/sys/enterprise/nationalEconomyDetail',
    method: 'get',
    params
  })
}

// 图层列表
export function layerList(params) {
  return request({
    url: '/admin/sys/enterprise/layer/list',
    method: 'get',
    params
  })
}

// 保存图层
export function layerEdit(data) {
  return request({
    url: '/admin/sys/enterprise/layer/edit',
    method: 'post',
    data
  })
}

// 保存平面图
export function planViewEdit(data) {
  return request({
    url: '/admin/sys/enterprise/planViewEdit',
    method: 'post',
    data
  })
}

// 四色风险图
export function fourColor(params) {
  return request({
    url: '/admin/sys/enterprise/layer/fourColor',
    method: 'get',
    params
  })

}
