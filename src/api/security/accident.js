import request from "../../request";

//事故管理列表
export function list(params) {
  return request({
    url: "/admin/security/accident/list",
    method: "get",
    params
  });
}

//事故管理枚举
export function enumList(params) {
  return request({
    url: "/admin/security/accident/enumList",
    method: "get",
    params
  });
}



//事故管理详情
export function detail(params) {
  return request({
    url: "/admin/security/accident/detail",
    method: "get",
    params
  });
}

//事故管理新增
export function add(data) {
  return request({
    url: "/admin/security/accident/add",
    method: "post",
    data
  });
}

//事故管理删除
export function del(data) {
  return request({
    url: "/admin/security/accident/delete",
    method: "post",
    data
  });
}

//事故管理修改
export function edit(data) {
  return request({
    url: "/admin/security/accident/edit",
    method: "post",
    data
  });
}



