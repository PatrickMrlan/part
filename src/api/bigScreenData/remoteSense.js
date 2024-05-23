import request from '@/request'

// 大屏-遥感监测-地块列表
export function massifList(params) {
  return request({
    url: '/dp/remoteSense/massifList',
    method: 'get',
    params
  })
}
