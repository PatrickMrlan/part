import request from '../../request'

// 数据权限配置

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/dataRole/list',
        method: 'get',
        params
    })
}
// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/dataRole/detail',
        method: 'get',
        params
    })
}
// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/dataRole/delete',
        method: 'post',
        data
    })
}
// 新增
export function add(data) {
    return request({
        url: '/admin/sys/dataRole/add',
        method: 'post',
        data
    })
}
// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/dataRole/edit',
        method: 'post',
        data
    })
}