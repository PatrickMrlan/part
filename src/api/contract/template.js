import request from '@/request'

/*
 * 合同管理 --> 合同模板管理
 */


// 列表
export function list(params) {
  return request({
    url: '/admin/contract/template/list',
    method: 'get',
    params
  })
}

// 详情
export function detail(params) {
  return request({
    url: '/admin/contract/template/detail',
    method: 'get',
    params
  })
}

// 删除
export function remove(data) {
  return request({
    url: '/admin/contract/template/delete',
    method: 'post',
    data
  })
}

// 新增
export function add(data) {
  return request({
    url: '/admin/contract/template/add',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/admin/contract/template/edit',
    method: 'post',
    data
  })
}

// 枚举
export function tempEnum(params) {
  return request({
    url: '/admin/contract/template/getTempEnum',
    method: 'get',
    params
  })
}
