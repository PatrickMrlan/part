const state = {
  enterpriseView: true,
  riskView: false,
  hiddenView: false,
  emergencyView: false
}

const getters = {

}

const mutations = {
  setEnterpriseView(state, flag) {
    state.enterpriseView = flag;
  },
  setRiskView(state, flag) {
    state.riskView = flag;
  },
  setHiddenView(state, flag) {
    state.hiddenView = flag;
  },
  setEmergencyView(state, flag) {
    state.emergencyView = flag;
  }

}

const actions = {

}


export default {
  state,
  getters,
  mutations,
  actions
}
