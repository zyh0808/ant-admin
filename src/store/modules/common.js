const pageHeaderRoutes = []
const initialState = {
  pageHeaderRoutes
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  pageHeaderRoutes: (state) => {
    return state.pageHeaderRoutes
  }
}

// mutations
const mutations = {
  setPageHeaderRoutes (state, list) {
    state.pageHeaderRoutes = list
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
}

// actions
const actions = {
}


export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}