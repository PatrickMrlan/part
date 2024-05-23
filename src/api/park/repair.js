import request from "../../request";

//维修保养列表
export function list(params) {
  return request({
    url: "/admin/sys/ent/repair/list",
    method: "get",
    params,
  });
}

//维修保养详情
export function detail(params) {
  return request({
    url: "/admin/sys/ent/repair/detail",
    method: "get",
    params,
  });
}

//维修保养新增
export function add(data) {
  return request({
    url: "/admin/sys/ent/repair/add",
    method: "post",
    data,
  });
}

//维修保养删除
export function remove(data) {
  return request({
    url: "/admin/sys/ent/repair/delete",
    method: "post",
    data,
  });
}

//维修保养修改
export function edit(data) {
  return request({
    url: "/admin/sys/ent/repair/edit",
    method: "post",
    data,
  });
}
