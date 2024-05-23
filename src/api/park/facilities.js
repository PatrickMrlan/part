import request from "../../request";

//设备设施列表
export function list(params) {
  return request({
    url: "/admin/sys/ent/device/list",
    method: "get",
    params,
  });
}

//设备台账
export function ledger(params) {
  return request({
    url: "/admin/sys/ent/device/ledger",
    method: "get",
    params,
  });
}

//设备设施详情
export function detail(params) {
  return request({
    url: "/admin/sys/ent/device/detail",
    method: "get",
    params,
  });
}

//设备设施枚举
export function enumList(params) {
  return request({
    url: "/admin/sys/ent/device/enumList",
    method: "get",
    params,
  });
}

//设备设施新增
export function add(data) {
  return request({
    url: "/admin/sys/ent/device/add",
    method: "post",
    data,
  });
}

//设备设施删除
export function remove(data) {
  return request({
    url: "/admin/sys/ent/device/delete",
    method: "post",
    data,
  });
}

//设备设施修改
export function edit(data) {
  return request({
    url: "/admin/sys/ent/device/edit",
    method: "post",
    data,
  });
}
