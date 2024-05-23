import request from '@/request'

/**
 * 风险--> 巡检台账 
 */

// 列表
export function list(params) {
    return request({
        url: '/admin/risk/inspection/list',
        method: 'get',
        params
    })
}