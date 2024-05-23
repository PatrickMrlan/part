import request from "../../request";

//安全操作规程列表
export function list(params) {
  return request({
    url: "/admin/sys/ent/safeRegulation/list",
    method: "get",
    params
  });
}

//安全操作规程枚举
export function enumList(params) {
  return request({
    url: "/admin/sys/ent/safeRegulation/enumList",
    method: "get",
    params
  });
}

//安全操作规程台账统计
export function ledger(params) {
  return request({
    url: "/admin/sys/ent/safeRegulation/ledger",
    method: "get",
    params
  });
}

//安全操作规程详情
export function detail(params) {
  return request({
    url: "/admin/sys/ent/safeRegulation/detail",
    method: "get",
    params
  });
}

//安全操作规程新增
export function add(data) {
  return request({
    url: "/admin/sys/ent/safeRegulation/add",
    method: "post",
    data
  });
}

//安全操作规程删除
export function del(data) {
  return request({
    url: "/admin/sys/ent/safeRegulation/delete",
    method: "post",
    data
  });
}

//安全操作规程修改
export function edit(data) {
  return request({
    url: "/admin/sys/ent/safeRegulation/edit",
    method: "post",
    data
  });
}
