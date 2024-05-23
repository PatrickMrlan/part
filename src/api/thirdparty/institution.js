import request from "../../request";

//第三方人员列表
export function list(params) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/list",
      method: "get",
      params
    });
  }
  
  //台账统计
  export function ledger(params) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/ledger",
      method: "get",
      params
    });
  }
  
  //第三方有关枚举、字典列表
  export function enumList(params) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/enumList",
      method: "get",
      params
    });
  }
  
  //第三方人员详情
  export function detail(params) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/detail",
      method: "get",
      params
    });
  }
  
  //第三方人员新增
  export function add(data) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/add",
      method: "post",
      data
    });
  }
  
  //第三方人员删除
  export function del(data) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/delete",
      method: "post",
      data
    });
  }
  
  //第三方人员修改
  export function edit(data) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/edit",
      method: "post",
      data
    });
  }
  
  //第三方人员审核
  export function audit(data) {
    return request({
      url: "/admin/sys/park/thirdPartyUser/audit",
      method: "post",
      data
    });
  }
  //第三方部门
  export function depTreeList(params) {
    return request({
      url: "/admin/sys/thirdParty/depTreeList",
      method: "get",
      params
    });
  }