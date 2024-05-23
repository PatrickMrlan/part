import request from '../../request'

// 列表
export function list(params) {
    return request({
        url: '/admin/sys/modular/list',
        method: 'get',
        params
    })
}

// 新增
export function add(data) {
    return request({
        url: '/admin/sys/modular/add',
        method: 'post',
        data
    })
}

// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/modular/delete',
        method: 'post',
        data
    })
}

// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/modular/detail',
        method: 'get',
        params
    })
}

// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/modular/edit',
        method: 'post',
        data
    })
}

// 当前用户包含的模块
export function allModularByUser(params) {
    return request({
        url: '/admin/sys/modular/allModularByUser',
        method: 'get',
        params
    })
}

// 模块配置解绑
export function unbinding(data) {
    return request({
        url: '/admin/sys/modular/unbinding',
        method: 'post',
        data
    })
}

// 主题空间列表
export function spaceList(params) {
    return request({
        url: '/admin/sys/space/list',
        method: 'get',
        params
    })
}

