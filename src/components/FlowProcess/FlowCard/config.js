//节点定义
export default {
  start: {
    type: "start",
    content: "所有人",
    properties: { title: '发起人', initiator: [] }
  },
  approver: {
    type: "approver",
    content: "请设置审批人",
    properties: { title: '审批人', initiator: [] }
  },
  copy:{
    type: 'copy',
    content: '发起人自选',
    properties: {
      title: '抄送人',
      initiator: [],
      userOptional: true
    }
  },
  condition: {
    type: "condition",
    content: "请设置条件",
    properties: { title: '条件', conditions: [], initiator: null }
  },
  branch: { type: "branch", content: "", properties: {} },
  empty: { type: "empty", content: "", properties: {} }
}