import { getPageSystemList, getSystemList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchSystemPageList: false,
  systemPageList: [],
  isfetchSystemList: false,
  systemList: [],
  total: 0
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  systemPageList: (state) => {
    return state.systemPageList
  },
  systemList: (state) => {
    return state.systemList
  },
  total: (state) => {
    return state.total
  },
  isfetchSystemPageList: (state) => {
    return state.isfetchSystemPageList
  }
}

// mutations
const mutations = {
  startFetchSystemPageList (state) {
    state.isfetchSystemPageList = true
  },
  stopFetchSystemPageList (state) {
    state.isfetchSystemPageList = false
  },
  setSystemPageList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.systemPageList = list
  },
  startFetchSystemList (state) {
    state.isfetchSystemList = true
  },
  stopFetchSystemList (state) {
    state.isfetchSystemList = false
  },
  setSystemList (state, list) {
    state.systemList = list
  },
  setToal (state, total) {
    state.total = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchSystemPageList = false
    state.isfetchSystemList = false
  }
}

// actions
const actions = {
  fetchSystemPageList ({ state, commit }, params) {
    if (state.isfetchSystemPageList) return
    const data = {
      sys_name: params.sys_name,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    commit('startFetchSystemPageList')
    getPageSystemList(data).then(res => {
      commit('setSystemPageList', res.rows)
      commit('setToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchSystemPageList')
    }).catch(err => {
      commit('setSystemPageList', [])
      commit('setToal', 0)
      commit('stopFetchSystemPageList')
      Message.error(err.msg)
    })
  },
  fetchSystemList ({ state, commit }, params) {
    if (state.isfetchSystemList) return
    commit('startFetchSystemList')
    getSystemList(params).then(res => {
      commit('setSystemList', res)
      commit('stopFetchSystemList')
    }).catch(err => {
      commit('setSystemList', [])
      commit('stopFetchSystemList')
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