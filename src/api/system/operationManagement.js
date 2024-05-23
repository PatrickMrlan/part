import request from '../../request'

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/operate/list',
        method: 'get',
        params
    })
}

// 新增
export function add(data) {
    return request({
        url: '/admin/sys/operate/add',
        method: 'post',
        data
    })
}

// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/operate/delete',
        method: 'post',
        data
    })
}

// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/operate/edit',
        method: 'post',
        data
    })
}

// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/operate/detail',
        method: 'get',
        params
    })
}
