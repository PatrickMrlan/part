import request from "../../request";

//企业人员列表
export function list(params) {
  return request({
    url: "/admin/ent/workPersonnel/list",
    method: "get",
    params
  });
}

//台账统计
export function ledger(params) {
  return request({
    url: "/admin/ent/workPersonnel/ledger",
    method: "get",
    params
  });
}

//企业有关枚举、字典列表
export function enumList(params) {
  return request({
    url: "/admin/ent/workPersonnel/enumList",
    method: "get",
    params
  });
}

//企业人员详情
export function detail(params) {
  return request({
    url: "/admin/ent/workPersonnel/detail",
    method: "get",
    params
  });
}

//企业人员新增
export function add(data) {
  return request({
    url: "/admin/ent/workPersonnel/add",
    method: "post",
    data
  });
}

//企业人员删除
export function del(data) {
  return request({
    url: "/admin/ent/workPersonnel/delete",
    method: "post",
    data
  });
}

//企业人员修改
export function edit(data) {
  return request({
    url: "/admin/ent/workPersonnel/edit",
    method: "post",
    data
  });
}

//企业人员审核
export function audit(data) {
  return request({
    url: "/admin/ent/workPersonnel/audit",
    method: "post",
    data
  });
}
