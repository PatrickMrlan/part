import { get } from '../request'
const BASE_URL = process.env.BASE_URL
// 获取组织机构根节点
export function GET_DEPT_ROOT(){
   return get( BASE_URL + 'fldata/depRoot.json');
}

// 根据部门id获取分页人员信息
export function  GET_PAGE_EMPLOYEE(){
    return get( BASE_URL + 'fldata/userData.json');
}
// 获取组织机构子节点
export function  GET_DEPT_TREE(){
    return get( BASE_URL + 'fldata/depChild.json');
}
// 获取组织机构下人员信息
export function  GET_USER_BY_DEPT (){
    return get(BASE_URL + 'fldata/userData.json');
}
// 获取Mock数据
export function  GET_MOCK_CONF(){
    return get(BASE_URL + 'fldata/mockConf.json');
}