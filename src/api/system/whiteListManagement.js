import request from '../../request'

// 应用列表
export function appList(params) {
    return request({
        url: '/admin/sys/appIpWhiteList/appList',
        method: 'get',
        params
    })
}

// 应用白名单加载
export function whiteListInfo(params) {
    return request({
        url: '/admin/sys/appIpWhiteList/whiteListInfo',
        method: 'get',
        params
    })
}

// 保存应用白名单
export function editWhiteList(data) {
    return request({
        url: '/admin/sys/appIpWhiteList/editWhiteList',
        method: 'post',
        data
    })
}