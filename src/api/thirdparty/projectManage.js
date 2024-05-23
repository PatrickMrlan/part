import request from "@/request";

/**
 * 第三方机构管理
 * 项目管理
 */



// 列表
export function list(params) {
    return request({
        url: "/admin/sys/thirdParty/project/list",
        method: "get",
        params
    });
}

// 枚举列表
export function enumList(params) {
    return request({
        url: "/admin/sys/thirdParty/project/enumList",
        method: "get",
        params
    });
}

// 详情
export function detail(params) {
    return request({
        url: "/admin/sys/thirdParty/project/detail",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "/admin/sys/thirdParty/project/add",
        method: "post",
        data
    });
}

// 修改
export function edit(data) {
    return request({
        url: "/admin/sys/thirdParty/project/edit",
        method: "post",
        data
    });
}

// 删除
export function remove(data) {
    return request({
        url: "/admin/sys/thirdParty/project/delete",
        method: "post",
        data
    });
}