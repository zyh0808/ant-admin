import { getPageRoleList, getRoleEmpList, getRoleList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchRoleList: false,
  roleList: [],
  total: 0,
  isfetchRoleEmpList: false,
  roleEmpList: [],
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  roleList: (state) => {
    return state.roleList
  },
  total: (state) => {
    return state.total
  },
  isfetchRoleList: (state) => {
    return state.isfetchRoleList
  },
  roleEmpList: (state) => {
    return state.roleEmpList
  }
}

// mutations
const mutations = {
  startFetchRoleList (state) {
    state.isfetchRoleList = true
  },
  stopFetchRoleList (state) {
    state.isfetchRoleList = false
  },
  setRoleList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.roleList = list
  },
  setToal (state, total) {
    state.total = total
  },
  startFetchRoleEmpList (state) {
    state.isfetchRoleEmpList = true
  },
  stopFetchRoleEmpList (state) {
    state.isfetchRoleEmpList = false
  },
  setRoleEmpList (state, list) {
    list = list.map(item => item.user_id)
    state.roleEmpList = list
  },
  setRoleEmpToal (state, total) {
    state.roleEmpTotal = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchRoleList = false
    state.isfetchRoleEmpList = false
  }
}

// actions
const actions = {
  fetchRolePageList ({ state, commit }, params) {
    if (state.isfetchRoleList) return
    commit('startFetchRoleList')
    const data = {
      role_name: params.role_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getPageRoleList(data).then(res => {
      commit('setRoleList', res.rows)
      commit('setToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchRoleList')
    }).catch(err => {
      commit('setRoleList', [])
      commit('setToal', 0)
      commit('stopFetchRoleList')
      Message.error(err.msg)
    })
  },
  fetchRoleList ({ state, commit }, params) {
    if (state.isfetchRoleList) return
    commit('startFetchRoleList')
    getRoleList(params).then(res => {
      commit('setRoleList', res)
      commit('stopFetchRoleList')
    }).catch(err => {
      commit('setRoleList', [])
      commit('stopFetchRoleList')
      Message.error(err.msg)
    })
  },
  fetchRoleEmpList ({ state, commit }, params) {
    if (state.isfetchRoleEmpList) return
    commit('startFetchRoleEmpList')
    getRoleEmpList(params).then(res => {
      commit('setRoleEmpList', res)
      commit('stopFetchRoleEmpList')
    }).catch(err => {
      commit('setRoleEmpList', [])
      commit('stopFetchRoleEmpList')
      Message.error(err.msg)
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