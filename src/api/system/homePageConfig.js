import request from '../../request'

export function list(params) {
    return request({
        url: '/admin/system/homePageConfig/list',
        method: 'get',
        params
    })
}

export function optionList(params) {
    return request({
        url: '/admin/system/homePageConfig/optionList',
        method: 'get',
        params
    })
}



export function info(params) {
    return request({
        url: '/admin/system/homePageConfig/info',
        method: 'get',
        params
    })
}

export function detail(params) {
    return request({
        url: '/admin/system/homePageConfig/detail',
        method: 'get',
        params
    })
}

export function optionDetail(params) {
    return request({
        url: '/admin/system/homePageConfig/optionDetail',
        method: 'get',
        params
    })
}

export function edit(data) {
    return request({
        url: '/admin/system/homePageConfig/edit',
        method: 'post',
        data
    })
}
export function add(data) {
    return request({
        url: '/admin/system/homePageConfig/add',
        method: 'post',
        data
    })
}

export function optionEdit(data) {
    return request({
        url: '/admin/system/homePageConfig/optionEdit',
        method: 'post',
        data
    })
}

export function optionAdd(data) {
    return request({
        url: '/admin/system/homePageConfig/optionAdd',
        method: 'post',
        data
    })
}

export function optionByConfigCode(params) {
    return request({
        url: '/admin/system/homePageConfig/optionByConfigCode',
        method: 'get',
        params
    })
}

export function optionListByConfigCode(params) {
    return request({
        url: '/admin/system/homePageConfig/optionListByConfigCode',
        method: 'get',
        params
    })
}
export function loginData(params) {
    return request({
        url: '/admin/system/homePageConfig/loginData',
        method: 'get',
        params
    })
}



