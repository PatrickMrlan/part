import request from '../../request'

export function listByUser(data) {
  return request({
    url: '/admin/sys/message/listByUser',
    method: 'post',
    data
  })
}
