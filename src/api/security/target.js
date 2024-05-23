import request from "../../request";



//总目标详情ByeId
export function detailByEId(params) {
  return request({
    url: "/admin/security/target/detailByEId",
    method: "get",
    params
  });
}


//总目标详情
export function detail(params) {
  return request({
    url: "/admin/security/target/detail",
    method: "get",
    params
  });
}

//总目标新增
export function add(data) {
  return request({
    url: "/admin/security/target/add",
    method: "post",
    data
  });
}


//总目标修改
export function edit(data) {
  return request({
    url: "/admin/security/target/edit",
    method: "post",
    data
  });
}


