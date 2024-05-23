import request from '../request'

export function detail(params) {
  return request({
    url: '/admin/system/configure/detail',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: '/admin/system/configure/edit',
    method: 'post',
    data
  })
}
