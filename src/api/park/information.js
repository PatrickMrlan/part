import request from "../../request";

//园区信息列表
export function list(params) {
  return request({
    url: "/admin/sys/park/list",
    method: "get",
    params
  });
}

//枚举列表
export function enumList(params) {
  return request({
    url: "/admin/sys/park/enumList",
    method: "get",
    params
  });
}
//园区管理详情
export function detail(params) {
    return request({
      url: "/admin/sys/park/detail",
      method: "get",
      params
    });
  }

//台账统计
export function ledger(params) {
  return request({
    url: "/admin/sys/park/ledger",
    method: "get",
    params
  });
}

//园区管理新增
export function add(data) {
  return request({
    url: "/admin/sys/park/add",
    method: "post",
    data
  });
}

//园区管理删除
export function del(data) {
  return request({
    url: "/admin/sys/park/delete",
    method: "post",
    data
  });
}

//园区管理修改
export function edit(data) {
  return request({
    url: "/admin/sys/park/edit",
    method: "post",
    data
  });
}
