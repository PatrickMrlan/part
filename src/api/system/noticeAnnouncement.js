import request from '../../request'

// 通知公告管理


// 列表
export function list(params) {
    return request({
        url: '/admin/sys/notice/list',
        method: 'get',
        params
    })
}
// 详情
export function detail(params) {
    return request({
        url: '/admin/sys/notice/detail',
        method: 'get',
        params
    })
}
// 删除
export function remove(data) {
    return request({
        url: '/admin/sys/notice/delete',
        method: 'post',
        data
    })
}
// 新增
export function add(data) {
    return request({
        url: '/admin/sys/notice/add',
        method: 'post',
        data
    })
}
// 修改
export function edit(data) {
    return request({
        url: '/admin/sys/notice/edit',
        method: 'post',
        data
    })
}
// 下发
export function send(data) {
    return request({
        url: '/admin/sys/notice/send',
        method: 'post',
        data
    })
}

// 获取重要提醒
export function getImportantList(data) {
    return request({
        url: '/admin/sys/notice/getImportantList',
        method: 'get',
        data
    })
}
