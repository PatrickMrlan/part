import request from '@/request'

/**
 * 
 * @param {模块管理} params 
 * @returns 
 */

// 模块管理列表
export function moduleList(params) {
    return request({
        url: '/admin/sys/module/list',
        method: 'get',
        params
    })
}

// 模块管理修改
export function moduleEdit(data) {
    return request({
        url: '/admin/sys/module/edit',
        method: 'post',
        data
    })
}


// 模块管理列表-所有数据
export function allList(params) {
    return request({
        url: '/admin/sys/module/allList',
        method: 'get',
        params
    })
}
