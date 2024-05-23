const state = {
  projectId: null,
  projectName: null,

  isOnline: false, // 是否网评
  isAttend: false, // 是否批复
  isShowAttendBtn: false, // 是否显示批复按钮
  isShowBtn: false, // 是否显示按钮
  isShowProjectLx: false, // 是否显示立项按钮
}

const getters = {

}

const mutations = {
  setProjectId(state, val) {
    state.projectId = val;
  },
  setProjectName(state, val) {
    state.projectName = val;
  },

  setIsOnline(state, val) {
    state.isOnline = val;
  },
  setIsShowBtn(state, val) {
    state.isShowBtn = val;
  },
  setIsAttend(state, val) {
    state.isAttend = val;
  },
  setIsShowAttendBtn(state, val) {
    state.isShowAttendBtn = val;
  },
  setIsShowProjectLx(state, val) {
    state.isShowProjectLx = val;
  },

}

const actions = {

}


export default {
  state,
  getters,
  mutations,
  actions
}
