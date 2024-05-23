import request from '@/request'

// 大屏车辆资产接口-资产统计
export function assetStatistics(params) {
  return request({
    url: '/dp/car/assetStatistics',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-资产现状
export function assetStatus(params) {
  return request({
    url: '/dp/car/assetStatus',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-车辆类别
export function carClass(params) {
  return request({
    url: '/dp/car/carClass',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-车辆分类
export function carClassification(params) {
  return request({
    url: '/dp/car/carClassification',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-合同到期分布
export function contractBecomeDue(params) {
  return request({
    url: '/dp/car/contractBecomeDue',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-近6月合同成交走势
export function contractDeal(params) {
  return request({
    url: '/dp/car/contractDeal',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-收入情况
export function incomeSituation(params) {
  return request({
    url: '/dp/car/incomeSituation',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-车辆出租率
export function rentalRate(params) {
  return request({
    url: '/dp/car/rentalRate',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-收益分析
export function revenueByMonth(params) {
  return request({
    url: '/dp/car/revenueByMonth',
    method: 'get',
    params
  })
}

// 大屏车辆资产接口-脱保情况
export function delistingSituation(params) {
  return request({
    url: '/dp/car/delistingSituation',
    method: 'get',
    params
  })
}
