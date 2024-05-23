import request from '@/request'


/**
 * 辨识标准
 */


export function edit(data) {
    return request({
        url: '/admin/hazard/identificationCheck/edit',
        method: 'post',
        data
    })
}


export function list(params) {
    return request({
        url: '/admin/hazard/identificationCheck/list',
        method: 'get',
        params
    })
}


