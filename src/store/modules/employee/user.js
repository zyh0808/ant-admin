import { getPageUserList, getUnselectOrgUserList, getOrgUserList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchUserList: false,
  userList: [],
  total: 0,
  isfetchUnselectOrgUserList: false,
  unselectOrgUserList: [],
  isfetchOrgUserList: false,
  orgUserList: [],
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  userList: (state) => {
    return state.userList
  },
  total: (state) => {
    return state.total
  },
  isfetchUserList: (state) => {
    return state.isfetchUserList
  },
  unselectOrgUserList: (state) => {
    return state.unselectOrgUserList
  },
  isfetchUnselectOrgUserList: (state) => {
    return state.isfetchUnselectOrgUserList
  },
  orgUserList: (state) => {
    return state.orgUserList
  },
  isfetchOrgUserList: (state) => {
    return state.isfetchOrgUserList
  }
}

// mutations
const mutations = {
  startFetchUserList (state) {
    state.isfetchUserList = true
  },
  stopFetchUserList (state) {
    state.isfetchUserList = false
  },
  setUserList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.locked = item.is_lock === 1
      return item
    })
    state.userList = list
  },
  setToal (state, total) {
    state.total = total
  },
  startFetchUnselectOrgUserList (state) {
    state.isfetchUnselectOrgUserList = true
  },
  stopFetchUnselectOrgUserList (state) {
    state.isfetchUnselectOrgUserList = false
  },
  setUnselectOrgUserList (state, list) {
    list = list.map(item => {
      item.key = item.user_id
      item.title = item.username
      return item
    })
    state.unselectOrgUserList = list
  },
  resetUnselectOrgUserList (state) {
    state.unselectOrgUserList = []
  },
  startFetchOrgUserList (state) {
    state.isfetchOrgUserList = true
  },
  stopFetchOrgUserList (state) {
    state.isfetchOrgUserList = false
  },
  setOrgUserList (state, list) {
    list = list.map(item => {
      item.key = item.user_id
      item.title = item.username
      return item
    })
    state.orgUserList = list
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchUserList = false
    state.isfetchUnselectOrgUserList = false
    state.isfetchOrgUserList = false
  }
}

// actions
const actions = {
  fetchUserList ({ state, commit }, params) {
    if (state.isfetchUserList) return
    commit('startFetchUserList')
    const data = {
      condition: params.condition,
      keyword: params.keyword,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getPageUserList(data).then(res => {
      commit('setUserList', res.rows)
      commit('setToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchUserList')
    }).catch(err => {
      commit('setUserList', [])
      commit('setToal', 0)
      commit('stopFetchUserList')
      Message.error(err.msg)
    })
  },
  fetchUnselectOrgUserList ({ state, commit }, params) {
    if (state.isfetchUnselectOrgUserList) return
    commit('startFetchUnselectOrgUserList')
    getUnselectOrgUserList(params).then(res => {
      commit('setUnselectOrgUserList', res)
      commit('stopFetchUnselectOrgUserList')
    }).catch(err => {
      commit('setUnselectOrgUserList', [])
      commit('stopFetchUnselectOrgUserList')
      Message.error(err.msg)
    })
  },
  fetchOrgUserList ({ state, commit }, params) {
    if (state.isfetchOrgUserList) return
    commit('startFetchOrgUserList')
    getOrgUserList(params).then(res => {
      commit('setOrgUserList', res)
      commit('stopFetchOrgUserList')
    }).catch(err => {
      commit('setOrgUserList', [])
      commit('stopFetchOrgUserList')
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