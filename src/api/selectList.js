import request from '../request'


// 用户列表
export function userList(params) {
  return request({
    url: '/admin/sys/user/list',
    method: 'get',
    params
  })
}

// 部门列表
export function depList() {
  return request({
    url: '/admin/sys/department/list',
    method: 'get'
  })
}

// 企业列表
export function enterpriseList(params) {
  return request({
    url: '/admin/sys/enterprise/list',
    method: 'get',
    params
  })
}

// 分组列表
export function groupList() {
  return request({
    url: '/admin/sys/group/powerGroup',
    method: 'get'
  })
}
