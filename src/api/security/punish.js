import request from "../../request";

//行政处罚列表
export function list(params) {
  return request({
    url: "/admin/security/punish/list",
    method: "get",
    params
  });
}

//行政处罚枚举
export function enumList(params) {
  return request({
    url: "/admin/security/punish/enumList",
    method: "get",
    params
  });
}



//行政处罚详情
export function detail(params) {
  return request({
    url: "/admin/security/punish/detail",
    method: "get",
    params
  });
}

//行政处罚新增
export function add(data) {
  return request({
    url: "/admin/security/punish/add",
    method: "post",
    data
  });
}

//行政处罚删除
export function del(data) {
  return request({
    url: "/admin/security/punish/delete",
    method: "post",
    data
  });
}

//行政处罚修改
export function edit(data) {
  return request({
    url: "/admin/security/punish/edit",
    method: "post",
    data
  });
}


//行政处罚导入
export function upload(data) {
  return request({
    url: "/admin/security/punish/import",
    method: "post",
    data
  });
}



