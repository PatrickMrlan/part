/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import { GET_DEPT_ROOT, GET_DEPT_TREE, GET_PAGE_EMPLOYEE, GET_POSITION_TREE } from '@/api/flow';

const toHump = name => name.replace(/\_(\w)/g, function (all, letter) {
  return letter.toUpperCase()
})
// 需要返回一个promise
async function loadDepOrUser(node, loadDep = true) {
  let nodeData = [];
  if (node.level === 0) { // 根目录
    const test = await getRootDept();  // 获取根节点
    nodeData = [test]
  } else if (node.level === 1 || node.level === 2) {
    if (node.data.isEnt == 1) {
      nodeData = await getDepChildNode(node.data);  // 获取部门节点
    }
    else {
      nodeData = await getPageUser(node.data);
    }
  } else if (!loadDep && node.level === 3) {
    nodeData = await getPageUser(node.data);  // 获取部门下人员
  }
  return nodeData
}

// 需要返回一个promise
async function loadComOrPosition(node) {
  let nodeData = [];
  if (node.level === 0) { // 根目录
    const test = await getRootDept();  // 获取根节点
    nodeData = [test]
  } else if (node.level === 1) {
    if (node.data.isEnt == 1) {
      nodeData = await getDepChildNode(node.data);  // 获取部门节点
    }
    else {
      nodeData = await getPosition(node.data);  // 获取部门下人员
    }
  } else if (node.level === 2) {
    nodeData = await getPosition(node.data);  // 获取部门下人员
  }
  return nodeData
}
// 获取组织结构根节点
async function getRootDept() {
  let res2 = {};
  try {
    await GET_DEPT_ROOT().then((res) => {
      console.log(res);
      if (res) {
        for (var i = 0; i < res.length; i++) {
          if (!res[i].parentId) {
            res2 = {
              deptId: res[i].depId,
              deptName: res[i].depName,
              isEnt: res[i].isEnt,
              parentDeptId: null,
            };
            break;
          }
        }
      }
    });
  } catch (res) { }
  return res2;
}
// 获取孩子节点
async function getDepChildNode(node) {
  const nodes = [];
  try {
    await GET_DEPT_TREE().then((res) => {
      if (res) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].parentId === node.deptId) {
            var item = {
              deptId: res[i].depId,
              deptName: res[i].depName,
              isEnt: res[i].isEnt,
              parentDeptId: res[i].parentId
            };
            nodes.push(item);
          }
        }
      }
    });
  }
  catch (res) {
  }
  return nodes;
}
// 获取用戶信息
async function getPageUser(node) {
  let nodes = [];
  let param = { pageIndex: 1, pageSize: 100 };
  if (node.deptId) {
    param.depId = node.deptId;
  }
  if (node.userName) {
    param.userName = node.realName;
  }
  console.log(node);
  try {
    await GET_PAGE_EMPLOYEE(param).then((res) => {
      console.log(res);
      if (res.page.records) {
        for (var i = 0; i < res.page.records.length; i++) {
          var data = res.page.records[i];
          var item = {
            deptId: data.depId || param.depId,
            userName: data.realName,
            userId: data.userId
          };
          nodes.push(item);
        }
      }
    });
  } catch (res) { }
  return nodes;
}
// 获取职位信息
async function getPosition(node) {
  let nodes = [];
  let param = {};
  if (node.deptId) {
    param.entId = node.deptId;
  }
  console.log(node);
  try {
    await GET_POSITION_TREE(param).then((res) => {
      console.log(res);
      if (res) {
        for (var i = 0; i < res.length; i++) {
          var data = res[i];
          var item = {
            postId: data.postId,
            postName: data.post,
          };
          nodes.push(item);
        }
      }
    });
  } catch (res) { }
  return nodes;
}

function loadPositionData(node) {
  return loadComOrPosition(node); // 返回的promise
}
function loadDepData(node) {
  return loadDepOrUser(node); // 返回的promise
}

function loadUserData(node) {
  return loadDepOrUser(node, false);  // 返回的promise
}

const defaultOption = {
  tabName: '部门',  // 选项卡名称
  tabKey: 'dep', //选项卡键值 传入的selected要和键值保持一致 eg: {dep: [], role: []}
  children: 'children', // 子节点标志
  // 生成每个节点的id 保证唯一
  nodeId: function (data) {
    return data.hasOwnProperty('userId') ? data.userId : (data.deptId || data.postId)
  },
  // 生成节点的名称 可选值 string | function
  label: function (data, node) {
    return data.hasOwnProperty('userId') ? data.userName : (data.deptName || data.postName)
  },
  // 判断是否为叶子节点 可选值 string | function
  isLeaf: function (data, node) {
    return (data.hasOwnProperty('userId') || data.hasOwnProperty('postId'))
  },
  // 搜索后的结果如果需要展示一些提示文字 例如搜索人员 提示人员所属部门  可以使用该属性
  // function
  searchResTip: function (data) {
    return '部门：' + data.deptId;
  },
  // 判断该节点是否可选 例如同时选择部门和部门下的人
  disabled: function (data, node) {
    return false;
  },
  // 动态请求后台拿到节点数据 返回一个promise
  onload: loadDepData,
  // 搜索节点方法 
  onsearch: async function (searchString, resolve, reject) {
    const param = { userName: searchString };
    resolve(await getPageUser(param));
  }
}

export const DEP_CONFIG = Object.assign({}, defaultOption)
export const ROLE_CONFIG = Object.assign({}, defaultOption, { tabKey: 'role', tabName: '角色' })
export const USER_CONFIG = Object.assign({}, defaultOption, { tabKey: 'user', tabName: '指定人员', onload: loadUserData, disabled: (data, node) => !data.hasOwnProperty('userId') })
const DEP_USER_CONFIG = Object.assign({}, defaultOption, { tabKey: 'dep&user', tabName: '部门和人员', onload: loadUserData, disabled: (data, node) => false })
const POSITION_CONFIG = Object.assign({}, defaultOption, { tabKey: 'position', tabName: '岗位', onload: loadPositionData, disabled: (data, node) => !data.hasOwnProperty('postId') })
export const CONFIG_LIST = [DEP_CONFIG, ROLE_CONFIG, USER_CONFIG, DEP_USER_CONFIG, POSITION_CONFIG]
