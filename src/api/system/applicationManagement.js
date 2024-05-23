import request from '../../request'

// 企业管理

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/app/list',
        method: 'get',
        params
    })
}
// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/app/detail',
        method: 'get',
        params
    })
}
// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/app/delete',
        method: 'post',
        data
    })
}
// 新增
export function add(data) {
    return request({
        url: '/admin/sys/app/add',
        method: 'post',
        data
    })
}
// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/app/edit',
        method: 'post',
        data
    })
}
// 是否禁用
export function disable(data) {
    return request({
        url: '/admin/sys/app/disable',
        method: 'post',
        data
    })
}


export function myAppList(params) {
    return request({
        url: '/admin/myApp',
        method: 'get',
        params
    })
}
export function saveMyApp(data) {
    return request({
        url: '/admin/sys/app/saveMyApp',
        method: 'post',
        data
    })
}