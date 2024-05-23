import request from "../../request";

//安全制度管理列表
export function list(params) {
  return request({
    url: "/admin/sys/entInstitution/list",
    method: "get",
    params
  });
}

//安全制度枚举列表
export function enumList(params) {
  return request({
    url: "/admin/sys/entInstitution/enumList",
    method: "get",
    params
  });
}

//台账统计
export function ledger(params) {
  return request({
    url: "/admin/sys/entInstitution/ledger",
    method: "get",
    params
  });
}


//安全制度管理详情
export function detail(params) {
  return request({
    url: "/admin/sys/entInstitution/detail",
    method: "get",
    params
  });
}

//安全制度管理新增
export function add(data) {
  return request({
    url: "/admin/sys/entInstitution/add",
    method: "post",
    data
  });
}

//安全制度管理删除
export function del(data) {
  return request({
    url: "/admin/sys/entInstitution/delete",
    method: "post",
    data
  });
}

//安全制度管理修改
export function edit(data) {
  return request({
    url: "/admin/sys/entInstitution/edit",
    method: "post",
    data
  });
}
