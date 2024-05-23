import request from "../../request";

//安全生产费用列表
export function list(params) {
  return request({
    url: "/admin/security/cost/list",
    method: "get",
    params
  });
}

//安全生产费用枚举
export function enumList(params) {
  return request({
    url: "/admin/security/cost/enumList",
    method: "get",
    params
  });
}

//安全生产费用台账统计
export function ledger(params) {
  return request({
    url: "/admin/security/cost/ledger",
    method: "get",
    params
  });
}

//安全生产费用详情
export function detail(params) {
  return request({
    url: "/admin/security/cost/detail",
    method: "get",
    params
  });
}

//安全生产费用新增
export function add(data) {
  return request({
    url: "/admin/security/cost/add",
    method: "post",
    data
  });
}

//安全生产费用删除
export function del(data) {
  return request({
    url: "/admin/security/cost/delete",
    method: "post",
    data
  });
}

//安全生产费用修改
export function edit(data) {
  return request({
    url: "/admin/security/cost/edit",
    method: "post",
    data
  });
}


//安全生产费用上传明细文件
export function upDetailedFile(data) {
  return request({
    url: "/admin/security/cost/upDetailedFile",
    method: "post",
    data
  });
}
