import request from '@/request'

// 大屏-产业总览
export function industryOverview(params) {
  return request({
    url: '/dp/industryOverview',
    method: 'get',
    params
  })
}

// 大屏-智能监控
export function intelligentMonitoring(params) {
  return request({
    url: '/dp/intelligentMonitoring',
    method: 'get',
    params
  })
}

// 大屏-农机统计
export function machineryStatistics(params) {
  return request({
    url: '/dp/machineryStatistics',
    method: 'get',
    params
  })
}

// 大屏-地图数据
export function mapData(params) {
  return request({
    url: '/dp/mapData',
    method: 'get',
    params
  })
}

// 大屏-农资统计
export function materialsStatistics(params) {
  return request({
    url: '/dp/materialsStatistics',
    method: 'get',
    params
  })
}

// 大屏-全县遥感监测
export function remoteSense(params) {
  return request({
    url: '/dp/remoteSense',
    method: 'get',
    params
  })
}

// 大屏-产销统计
export function sale(params) {
  return request({
    url: '/dp/sale',
    method: 'get',
    params
  })
}

// 大屏-产业总览列表
export function industryOverviewList(params) {
  return request({
    url: '/dp/industryOverviewList',
    method: 'get',
    params
  })
}

// 大屏-智能监控列表
export function intelligentMonitoringList(params) {
  return request({
    url: '/dp/intelligentMonitoringList',
    method: 'get',
    params
  })
}

// 大屏-地图地块详情
export function massifDetails(params) {
  return request({
    url: '/dp/massifDetails',
    method: 'get',
    params
  })
}

// 大屏-视频播放
export function seeVideo(params) {
  return request({
    url: '/dp/seeVideo',
    method: 'get',
    params
  })
}
