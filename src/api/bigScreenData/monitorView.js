import request from '@/request'

// 大屏--智能监控-因子下拉框
export function getFactor(params) {
  return request({
    url: '/dp/getFactor',
    method: 'get',
    params
  })
}

// 大屏--智能监控-气象站数据
export function getQxzDeviceData(params) {
  return request({
    url: '/dp/getQxzDeviceData',
    method: 'get',
    params
  })
}

// 大屏--智能监控-气象走势
export function getQxzTrend(params) {
  return request({
    url: '/dp/getQxzTrend',
    method: 'get',
    params
  })
}

// 大屏--智能监控-土壤墒情数据
export function getTrDeviceData(params) {
  return request({
    url: '/dp/getTrDeviceData',
    method: 'get',
    params
  })
}

// 大屏--智能监控-土壤走势
export function getTrTrend(params) {
  return request({
    url: '/dp/getTrTrend',
    method: 'get',
    params
  })
}

// 大屏--智能监控-视频监控设备Id
export function getVideoDeviceId(params) {
  return request({
    url: '/dp/getVideoDeviceId',
    method: 'get',
    params
  })
}

// 大屏--智能监控-基地详情
export function intelligentBaseDetails(params) {
  return request({
    url: '/dp/intelligentBaseDetails',
    method: 'get',
    params
  })
}

// 大屏--智能监控-基地下拉框
export function intelligentBaseList(params) {
  return request({
    url: '/dp/intelligentBaseList',
    method: 'get',
    params
  })
}

// 大屏--智能监控-虫情诱杀统计
export function insectKill(params) {
  return request({
    url: '/dp/insectKill',
    method: 'get',
    params
  })
}
