import request from "../../request";

//目标计划列表
export function list(params) {
  return request({
    url: "/admin/security/targetplan/list",
    method: "get",
    params
  });
}

//目标计划枚举
export function enumList(params) {
  return request({
    url: "/admin/security/targetplan/enumList",
    method: "get",
    params
  });
}

//目标计划详情
export function detail(params) {
  return request({
    url: "/admin/security/targetplan/detail",
    method: "get",
    params
  });
}

//目标计划新增
export function add(data) {
  return request({
    url: "/admin/security/targetplan/add",
    method: "post",
    data
  });
}

//目标计划删除
export function del(data) {
  return request({
    url: "/admin/security/targetplan/delete",
    method: "post",
    data
  });
}

//目标计划修改
export function edit(data) {
  return request({
    url: "/admin/security/targetplan/edit",
    method: "post",
    data
  });
}

//目标计划导入
export function upload(data) {
  return request({
    url: "/admin/security/targetplan/import",
    method: "post",
    data
  });
}

