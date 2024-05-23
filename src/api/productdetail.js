import request from '../request'

export function qrcode(params) {
  return request({
    url: '/admin/produce/massif/qrcode',
    method: 'get',
    params
  })
}

export function CodeToUserInfo(params) {
  return request({
    url: '/admin/produce/massif/qrcode',
    method: 'get',
    params
  })
}