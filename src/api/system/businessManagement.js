import request from '../../request'

// 应用管理

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/app/authorizeList',
        method: 'get',
        params
    })
}
// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/app/authorizeInfo',
        method: 'get',
        params
    })
}
// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/app/authorizeDelete',
        method: 'post',
        data
    })
}
// 新增
export function add(data) {
    return request({
        url: '/admin/sys/app/authorizeAdd',
        method: 'post',
        data
    })
}

// 新增
export function addList(data) {
    return request({
        url: '/admin/sys/app/authorizeAddList',
        method: 'post',
        data
    })
}

// 获取企业列表
export function getSelectEntList(params) {
    return request({
        url: '/admin/sys/app/getSelectEntList',
        method: 'get',
        params
    })
}

// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/app/authorizeEdit',
        method: 'post',
        data
    })
}
// 是否禁用
export function disable(data) {
    return request({
        url: '/admin/sys/app/authorizeDisable',
        method: 'post',
        data
    })
}
// 应用授权页面加载
export function authorizeDetail(params) {
    return request({
        url: '/admin/sys/app/authorizeDetail',
        method: 'get',
        params
    })
}