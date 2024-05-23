import request from "../../request";

//制度分类列表
export function list(params) {
  return request({
    url: "/admin/security/ism/list",
    method: "get",
    params
  });
}


//制度分类详情
export function detail(params) {
  return request({
    url: "/admin/security/ism/detail",
    method: "get",
    params
  });
}

//制度分类新增
export function add(data) {
  return request({
    url: "/admin/security/ism/add",
    method: "post",
    data
  });
}

//制度分类删除
export function del(data) {
  return request({
    url: "/admin/security/ism/delete",
    method: "post",
    data
  });
}

//制度分类修改
export function edit(data) {
  return request({
    url: "/admin/security/ism/edit",
    method: "post",
    data
  });
}
