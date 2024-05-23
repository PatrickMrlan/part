import request from "../../request";

//三同时列表
export function list(params) {
  return request({
    url: "/admin/sys/ent/meanWhile/list",
    method: "get",
    params,
  });
}

//三同时详情
export function detail(params) {
  return request({
    url: "/admin/sys/ent/meanWhile/detail",
    method: "get",
    params,
  });
}

//三同时新增
export function add(data) {
  return request({
    url: "/admin/sys/ent/meanWhile/add",
    method: "post",
    data,
  });
}

//三同时删除
export function remove(data) {
  return request({
    url: "/admin/sys/ent/meanWhile/delete",
    method: "post",
    data,
  });
}

//三同时修改
export function edit(data) {
  return request({
    url: "/admin/sys/ent/meanWhile/edit",
    method: "post",
    data,
  });
}
