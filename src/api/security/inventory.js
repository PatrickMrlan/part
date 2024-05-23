import request from "../../request";

//岗位管理列表
export function list(params) {
  return request({
    url: "/admin/sys/post/list",
    method: "get",
    params
  });
}

//岗位管理枚举
export function enumList(params) {
  return request({
    url: "/admin/sys/post/enumList",
    method: "get",
    params
  });
}


//岗位管理详情
export function detail(params) {
  return request({
    url: "/admin/sys/post/detail",
    method: "get",
    params
  });
}

//岗位管理新增
export function add(data) {
  return request({
    url: "/admin/sys/post/add",
    method: "post",
    data
  });
}

//岗位管理删除
export function del(data) {
  return request({
    url: "/admin/sys/post/delete",
    method: "post",
    data
  });
}

//岗位管理修改
export function edit(data) {
  return request({
    url: "/admin/sys/post/edit",
    method: "post",
    data
  });
}

//用户列表
export function userlist(params) {
  return request({
    url: "/admin/sys/user/list",
    method: "get",
    params
  });
}
