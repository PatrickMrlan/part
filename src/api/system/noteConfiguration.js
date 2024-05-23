import request from '../../request'

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/CloudSms/list',
        method: 'get',
        params
    })
}

// 新增
export function add(data) {
    return request({
        url: '/admin/sys/CloudSms/add',
        method: 'post',
        data
    })
}

// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/CloudSms/delete',
        method: 'post',
        data
    })
}

// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/CloudSms/detail',
        method: 'get',
        params
    })
}

// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/CloudSms/edit',
        method: 'post',
        data
    })
}

