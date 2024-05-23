import request from '../request'

export function list(params) {
  return request({
    url: '/admin/system/help/info',
    method: 'get',
    params
  })
}
