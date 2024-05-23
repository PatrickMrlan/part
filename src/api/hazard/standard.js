import request from '@/request'


/**
 * 隐患标准
 */



// 新增隐患标准
export function add(data) {
    return request({
        url: '/admin/hazard/standard/add',
        method: 'post',
        data
    })
}

// 删除隐患标准
export function remove(data) {
    return request({
        url: '/admin/hazard/standard/delete',
        method: 'post',
        data
    })
}

// 隐患标准详情
export function detail(params) {
    return request({
        url: '/admin/hazard/standard/detail',
        method: 'get',
        params
    })
}

// 修改隐患标准
export function edit(data) {
    return request({
        url: '/admin/hazard/standard/edit',
        method: 'post',
        data
    })
}

// 枚举列表
export function enumList(params) {
    return request({
        url: '/admin/hazard/standard/enumList',
        method: 'get',
        params
    })
}

// 隐患标准列表
export function list(params) {
    return request({
        url: '/admin/hazard/standard/list',
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
        url: '/admin/hazard/standard/category/add',
        method: 'post',
        data
    })
}

// 删除隐患标准分类
export function removeCategory(data) {
    return request({
        url: '/admin/hazard/standard/category/delete',
        method: 'post',
        data
    })
}

// 隐患标准分类详情
export function detailCategory(params) {
    return request({
        url: '/admin/hazard/standard/category/detail',
        method: 'get',
        params
    })
}

// 修改隐患标准分类
export function editCategory(data) {
    return request({
        url: '/admin/hazard/standard/category/edit',
        method: 'post',
        data
    })
}

// 枚举列表  分类
export function enumListCategory(params) {
    return request({
        url: '/admin/hazard/standard/category/enumList',
        method: 'get',
        params
    })
}

// 隐患标准分类列表
export function listCategory(params) {
    return request({
        url: '/admin/hazard/standard/category/list',
        method: 'get',
        params
    })
}



/**
 * 模板的隐患标准
 */

// 根据模板查询标准
export function listByTemplate(params) {
    return request({
        url: '/admin/hazard/standard/listByTemplate',
        method: 'get',
        params
    })
}

// 模板添加标准
export function addStandardByTemplate(data) {
    return request({
        url: '/admin/hazard/standard/addStandardByTemplate',
        method: 'post',
        data
    })
}

// 删除模板的隐患标准
export function deleteStandardByTemplate(data) {
    return request({
        url: '/admin/hazard/standard/deleteStandardByTemplate',
        method: 'post',
        data
    })
}
