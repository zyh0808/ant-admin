import { getPageList } from '@/api/system.js'
const initialState = {
  isfetchSysList: false,
  employeeSysList: [],
  total: 0
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  employeeSysList: (state) => {
    return state.employeeSysList
  },
  total: (state) => {
    return state.total
  }
}

// mutations
const mutations = {
  startFetchSysList (state) {
    state.isfetchSysList = true
  },
  stopFetchSysList (state) {
    state.isfetchSysList = false
  },
  setEmployeeSysList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.employeeSysList = list
  },
  setToal (state, total) {
    state.total = total
  }
}

// actions
const actions = {
  fetchEmployeeSysList ({ state, commit }, params) {
    if (state.isfetchSysList) return
    commit('startFetchSysList')
    getPageList(params).then(res => {
      commit('setEmployeeSysList', res.rows)
      commit('setToal', res.total)
      commit('stopFetchSysList')
    }).catch(err => {
      commit('setEmployeeSysList', [])
      commit('setToal', 0)
      commit('stopFetchSysList')
    })
  }
}


export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}