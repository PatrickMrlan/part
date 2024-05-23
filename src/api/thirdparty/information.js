import request from "../../request";

//第三方信息列表
export function list(params) {
  return request({
    url: "/admin/sys/thirdParty/list",
    method: "get",
    params
  });
}

//枚举列表
export function enumList(params) {
  return request({
    url: "/admin/sys/thirdParty/enumList",
    method: "get",
    params
  });
}
//第三方管理详情
export function detail(params) {
    return request({
      url: "/admin/sys/thirdParty/detail",
      method: "get",
      params
    });
  }

//台账统计
export function ledger(params) {
  return request({
    url: "/admin/sys/thirdParty/ledger",
    method: "get",
    params
  });
}

//第三方管理新增
export function add(data) {
  return request({
    url: "/admin/sys/thirdParty/add",
    method: "post",
    data
  });
}

//第三方管理删除
export function del(data) {
  return request({
    url: "/admin/sys/thirdParty/delete",
    method: "post",
    data
  });
}

//第三方管理修改
export function edit(data) {
  return request({
    url: "/admin/sys/thirdParty/edit",
    method: "post",
    data
  });
}

// 根据第三方项目来获取企业列表
export function thirdPartyEntList(params) {
  return request({
    url: '/admin/sys/thirdParty/entList',
    method: 'get',
    params
  })
}