
import request from '@/request'

/**
 * 工作台
 */

// 我的代办
export function waitList(params) {
  return request({
    url: '/admin/project/task/waitList',
    method: 'get',
    params
  })
}

// 我的代理
export function agentList(params) {
  return request({
    url: '/admin/project/task/agentList',
    method: 'get',
    params
  })
}

