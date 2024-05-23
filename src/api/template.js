import request from '../request'

// 用户列表
export function templateList(params) {
  return request({
    url: '/admin/process/template/templateList',
    method: 'get',
    params
  })
}
