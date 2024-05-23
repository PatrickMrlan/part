const state = {
  themeColor: '#006EFF',
  messageData: [],
}

const getters = {
  themeColor: (state) => {
    if (window.localStorage.getItem('appThemeColor')) {
      state.themeColor = window.localStorage.getItem('appThemeColor')
    }
    return state.themeColor
  }
}

const mutations = {
  setThemeColor(state, color) {
    state.themeColor = color;
    window.localStorage.setItem('appThemeColor', color)
  },

  setAgencyMessagelist(state, data) {
    state.messageData = data.map(x=> x.id);
  },
  
}
const actions = {
  modifyAgencyMessagelist(context, obj) {
    context.commit('setAgencyMessagelist', obj)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions 
}
