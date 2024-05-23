
import request from '@/request'

/**
 * 首页接口
 */

// 首页桌面
export function homeList(params) {
  return request({
    url: '/admin/index/index',
    method: 'get',
    params
  })
}

export function eCommerceToken(params) {
  return request({
    url: '/admin/index/eCommerceToken',
    method: 'get',
    params
  })
}

// 桌面个性化设置
export function desktopSetUp(data) {
  return request({
    url: '/admin/index/desktopSetUp',
    method: 'post',
    data
  })
}

// 部门培训情况统计
export function depTrainData(params) {
  return request({
    url: '/admin/index/depTrainData',
    method: 'get',
    params
  })
}

// 各部门人员统计
export function depUserData(params) {
  return request({
    url: '/admin/index/depUserData',
    method: 'get',
    params
  })
}

// 档案情况统计
export function personnelFilesData(params) {
  return request({
    url: '/admin/index/personnelFilesData',
    method: 'get',
    params
  })
}

// 预警列表
export function reminderList(params) {
  return request({
    url: '/admin/index/reminderList',
    method: 'get',
    params
  })
}

// 企业工作台
export function entStaging(params) {
  return request({
    url: '/admin/index/entStaging',
    method: 'get',
    params
  })
}
