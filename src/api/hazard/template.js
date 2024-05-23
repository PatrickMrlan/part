import request from '@/request'


/**
 * 隐患标准
 */



// 新增隐患标准
export function add(data) {
    return request({
        url: '/admin/hazard/template/add',
        method: 'post',
        data
    })
}

// 删除隐患标准
export function remove(data) {
    return request({
        url: '/admin/hazard/template/delete',
        method: 'post',
        data
    })
}

// 隐患标准详情
export function detail(params) {
    return request({
        url: '/admin/hazard/template/detail',
        method: 'get',
        params
    })
}

// 修改隐患标准
export function edit(data) {
    return request({
        url: '/admin/hazard/template/edit',
        method: 'post',
        data
    })
}

// 枚举列表
export function enumList(params) {
    return request({
        url: '/admin/hazard/template/enumList',
        method: 'get',
        params
    })
}

// 隐患标准列表
export function list(params) {
    return request({
        url: '/admin/hazard/template/list',
        method: 'get',
        params
    })
}



/**
 * 隐患标准分类
 */

// 新增隐患标准分类
export function addCategory(data) {
    return request({
        url: '/admin/hazard/template/category/add',
        method: 'post',
        data
    })
}

// 删除隐患标准分类
export function removeCategory(data) {
    return request({
        url: '/admin/hazard/template/category/delete',
        method: 'post',
        data
    })
}

// 隐患标准分类详情
export function detailCategory(params) {
    return request({
        url: '/admin/hazard/template/category/detail',
        method: 'get',
        params
    })
}

// 修改隐患标准分类
export function editCategory(data) {
    return request({
        url: '/admin/hazard/template/category/edit',
        method: 'post',
        data
    })
}

// 枚举列表  分类
export function enumListCategory(params) {
    return request({
        url: '/admin/hazard/template/category/enumList',
        method: 'get',
        params
    })
}

// 隐患标准分类列表
export function listCategory(params) {
    return request({
        url: '/admin/hazard/template/category/list',
        method: 'get',
        params
    })
}
