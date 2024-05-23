import request from '../../request'

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/CloudMail/list',
        method: 'get',
        params
    })
}

// 新增
export function add(data) {
    return request({
        url: '/admin/sys/CloudMail/add',
        method: 'post',
        data
    })
}

// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/CloudMail/delete',
        method: 'post',
        data
    })
}

// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/CloudMail/detail',
        method: 'get',
        params
    })
}

// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/CloudMail/edit',
        method: 'post',
        data
    })
}

