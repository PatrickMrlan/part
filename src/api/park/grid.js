import request from "@/request";

/*
 * 网格管理 --> 网格管理
 */

// 列表
export function list(params) {
  return request({
    url: "/admin/sys/ent/grid/list",
    method: "get",
    params
  });
}

export function getGrid(params) {
  return request({
    url: "/admin/sys/information/getGrid",
    method: "get",
    params
  });
}


// 详情
export function detail(params) {
  return request({
    url: "/admin/sys/ent/grid/detail",
    method: "get",
    params
  });
}

// 删除
export function remove(data) {
  return request({
    url: "/admin/sys/ent/grid/delete",
    method: "post",
    data
  });
}

// 新增
export function add(data) {
  return request({
    url: "/admin/sys/ent/grid/add",
    method: "post",
    data
  });
}

// 修改
export function edit(data) {
  return request({
    url: "/admin/sys/ent/grid/edit",
    method: "post",
    data
  });
}
