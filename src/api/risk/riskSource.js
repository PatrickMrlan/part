import request from '@/request'

/**
 * 风险--> 风险源（点）
 */

// 列表
export function list(params) {
    return request({
        url: '/admin/risk/source/list',
        method: 'get',
        params
    })
}

// 详情
export function detail(params) {
    return request({
        url: '/admin/risk/source/detail',
        method: 'get',
        params
    })
}

// 枚举
export function enumList(params) {
    return request({
        url: '/admin/risk/source/enumList',
        method: 'get',
        params
    })
}

// 编辑
export function edit(data) {
    return request({
        url: '/admin/risk/source/edit',
        method: 'post',
        data
    })
}

// 删除
export function remove(data) {
    return request({
        url: '/admin/risk/source/delete',
        method: 'post',
        data
    })
}

// 获取单个风险等级
export function getSingleLevel(data) {
    return request({
        url: '/admin/risk/source/getSingleLevel',
        method: 'post',
        data
    })
}

// 获取风险源（点）的风险等级
export function getSourceLevel(data) {
    return request({
        url: '/admin/risk/source/getSourceLevel',
        method: 'post',
        data
    })
}