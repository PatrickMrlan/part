import request from '../request'

export function groupList(params) {
  return request({
    url: '/admin/sys/group/powerGroup',
    method: 'get',
    params
  })
}
export function listByEntId(params) {
  return request({
    url: '/admin/sys/user/listByEntId',
    method: 'get',
    params
  })
}
export function detailGroup(params) {
  return request({
    url: '/admin/sys/group/detailGroup',
    method: 'get',
    params
  })
}
export function addGroup(data) {
  return request({
    url: '/admin/sys/group/addGroup',
    method: 'post',
    data
  })
}
export function editGroup(data) {
  return request({
    url: '/admin/sys/group/editGroup',
    method: 'post',
    data
  })
}
export function removeGroup(data) {
  return request({
    url: '/admin/sys/group/deleteGroup',
    method: 'post',
    data
  })
}

export function groupUserList(params) {
  return request({
    url: '/admin/sys/group/groupUserList',
    method: 'get',
    params
  })
}
export function enumList(params) {
  return request({
    url: '/admin/sys/user/enumList',
    method: 'get',
    params
  })
}
export function groupPowerInfo(params) {
  return request({
    url: '/admin/sys/group/groupPowerInfo',
    method: 'get',
    params
  })
}
export function addGroupPower(data) {
  return request({
    url: '/admin/sys/group/addGroupPower',
    method: 'post',
    data
  })
}
export function userList(params) {
  return request({
    url: '/admin/sys/group/userList',
    method: 'get',
    params
  })
}
export function deleteGroupUser(data) {
  return request({
    url: '/admin/sys/group/deleteGroupUser',
    method: 'post',
    data
  })
}
export function addGroupUser(data) {
  return request({
    url: '/admin/sys/group/addGroupUser',
    method: 'post',
    data
  })
}

// 用户管理

export function list(params) {
  return request({
    url: '/admin/sys/user/list',
    method: 'get',
    params
  })
}
export function detail(params) {
  return request({
    url: '/admin/sys/user/detail',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/admin/sys/user/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/admin/sys/user/edit',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/admin/sys/user/delete',
    method: 'post',
    data
  })
}
export function disable(data) {
  return request({
    url: '/admin/sys/user/disable',
    method: 'post',
    data
  })
}
export function selectDepList(params) {
  return request({
    url: '/admin/sys/user/selectDepList',
    method: 'get',
    params
  })
}

// 获取提示用户名
export function likeUserNames(params) {
  return request({
    url: '/admin/sys/user/likeUserNames',
    method: 'get',
    params
  })
}

// 用户权限查询
export function userRole(params) {
  return request({
    url: '/admin/sys/userPower/userRole',
    method: 'get',
    params
  })
}
// 添加用户权限
export function addUserRole(data) {
  return request({
    url: '/admin/sys/userPower/addUserRole',
    method: 'post',
    data
  })
}


export function spList(params) {
  return request({
    url: '/admin/sys/user/spList',
    method: 'get',
    params
  })
}
