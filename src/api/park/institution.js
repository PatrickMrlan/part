import request from "../../request";

//园区人员列表
export function list(params) {
    return request({
      url: "/admin/sys/park/user/list",
      method: "get",
      params
    });
  }
  
  //台账统计
  export function ledger(params) {
    return request({
      url: "/admin/sys/park/user/ledger",
      method: "get",
      params
    });
  }
  
  //园区有关枚举、字典列表
  export function enumList(params) {
    return request({
      url: "/admin/sys/park/user/enumList",
      method: "get",
      params
    });
  }
  
  //园区人员详情
  export function detail(params) {
    return request({
      url: "/admin/sys/park/user/detail",
      method: "get",
      params
    });
  }
  
  //园区人员新增
  export function add(data) {
    return request({
      url: "/admin/sys/park/user/add",
      method: "post",
      data
    });
  }
  
  //园区人员删除
  export function del(data) {
    return request({
      url: "/admin/sys/park/user/delete",
      method: "post",
      data
    });
  }
  
  //园区人员修改
  export function edit(data) {
    return request({
      url: "/admin/sys/park/user/edit",
      method: "post",
      data
    });
  }
  
  //园区人员审核
  export function audit(data) {
    return request({
      url: "/admin/sys/park/user/audit",
      method: "post",
      data
    });
  }
  //园区部门
  export function depTreeList(params) {
    return request({
      url: "/admin/sys/park/depTreeList",
      method: "get",
      params
    });
  }
  //网格员管理企业
export function editEnt(data) {
  return request({
    url: "/admin/sys/park/user/editEnt",
    method: "post",
    data
  });
}