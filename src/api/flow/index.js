import request from '@/request'

// 获取组织机构根节点
export function GET_DEPT_ROOT() {
  return request({
    url: '/admin/sys/department/flowDepList',
    method: 'get'
  })
}
// 获取组织机构子节点
export function GET_DEPT_TREE(params) {
  return request({
    url: '/admin/sys/department/flowDepList',
    method: 'get',
    params
  })
}
// 根据部门id获取分页人员信息
export function GET_PAGE_EMPLOYEE(params) {
  return request({
    url: '/admin/sys/user/spList',
    method: 'get',
    params
  })
}
// 获取组织机构下人员信息
export function GET_USER_BY_DEPT(params) {
  return request({
    url: '/admin/sys/user/list',
    method: 'get',
    params
  })
}
//获取职位
export function GET_POSITION_TREE(params) {
  return request({
    url: '/admin/sys/user/postList',
    method: 'get',
    params
  })
}

// 流程模板列表
export function templatePageList(params) {
  return request({
    url: '/admin/process/template/list',
    method: 'get',
    params
  })
}
// 流程模板详情
export function templateDetail(params) {
  return request({
    url: '/admin/process/template/detail',
    method: 'get',
    params
  })
}
// 流程模板类型列表
export function templateGetEnumList(params) {
  return request({
    url: '/admin/process/template/getEnumList',
    method: 'get',
    params
  })
}
// 流程模板添加
export function templateAdd(data) {
  return request({
    url: '/admin/process/template/add',
    method: 'post',
    data
  })
}
// 流程模板编辑
export function templateEdit(data) {
  return request({
    url: '/admin/process/template/edit',
    method: 'post',
    data
  })
}
// 流程模板删除
export function templateDelete(data) {
  return request({
    url: '/admin/process/template/delete',
    method: 'post',
    data
  })
}

// 流程模板内容列表
export function templateContentPageList(params) {
  return request({
    url: '/admin/process/templateContent/list',
    method: 'get',
    params
  })
}
// 流程模板内容详情
export function templateContentDetail(params) {
  return request({
    url: '/admin/process/templateContent/detail',
    method: 'get',
    params
  })
}
// 流程模板内容添加
export function templateContentAdd(data) {
  return request({
    url: '/admin/process/templateContent/add',
    method: 'post',
    data
  })
}
// 流程模板内容编辑
export function templateContentEdit(data) {
  return request({
    url: '/admin/process/templateContent/edit',
    method: 'post',
    data
  })
}

// 流程模板条件列表
export function conditionPageList(params) {
  return request({
    url: '/admin/process/condition/list',
    method: 'get',
    params
  })
}
// 流程模板条件详情
export function conditionDetail(params) {
  return request({
    url: '/admin/process/condition/detail',
    method: 'get',
    params
  })
}
// 流程模板添加
export function conditionAdd(data) {
  return request({
    url: '/admin/process/condition/add',
    method: 'post',
    data
  })
}
// 流程模板修改
export function conditionEdit(data) {
  return request({
    url: '/admin/process/condition/edit',
    method: 'post',
    data
  })
}
// 流程模板删除
export function conditionDelete(data) {
  return request({
    url: '/admin/process/condition/delete',
    method: 'post',
    data
  })
}
// 流程审核记录 detailId
export function processApproveDetail(data) {
  return request({
    url: '/admin/approve/info/list',
    method: 'get',
    data
  })
}
