import { getAllDictTree, getDictPageList, getDictList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  allDictTree: [],
  isfetchAllDictTree: false,
  dictPageList: [],
  isfetchDictPageList: false,
  total: 0,

  isfetchTicketList: false,
  ticketList: [],
  isfetchOperList: false,
  operList: [],
  isfetchEntryOrdertStatusList: false,
  entryOrdertStatusList: []
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  dictPageList: (state) => {
    return state.dictPageList
  },
  total: (state) => {
    return state.total
  },
  isfetchDictPageList: (state) => {
    return state.isfetchDictPageList
  },
  allDictTree: (state) => {
    return state.allDictTree
  },
  isfetchTicketList: (state) => {
    return state.isfetchTicketList
  },
  ticketList: (state) => {
    return state.ticketList
  },
  isfetchOperList: (state) => {
    return state.isfetchOperList
  },
  operList: (state) => {
    return state.operList
  },
  isfetchEntryOrderStatusList: (state) => {
    return state.isfetchEntryOrderStatusList
  },
  entryOrderStatusList: (state) => {
    return state.entryOrderStatusList
  }
}

// mutations
const mutations = {
  startFetchDictPageList (state) {
    state.isfetchDictPageList = true
  },
  stopFetchDictPageList (state) {
    state.isfetchDictPageList = false
  },
  setDictPageList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.dictPageList = list
  },
  setTotal (state, total) {
    state.total = total
  },
  startFetchAllDictTree (state) {
    state.isFetchAllDictTree = true
  },
  stopFetchAllDictTree (state) {
    state.isFetchAllDictTree = false
  },
  setAllDictTree (state, list) {
    let result = list ? JSON.parse(list.replace(/"item_value"/g, "\"key\"").replace(/"item_name"/g, "\"title\"").replace(/"childNodes"/g, "\"children\"")) : []
    result = [{
      key: 'TOP',
      title: '全部分类',
      children: result
    }]
    state.allDictTree = result
  },
  startFetchTicketList (state) {
    state.isfetchTicketList = true
  },
  stopFetchTicketList (state) {
    state.isfetchTicketList = false
  },
  setTicketList (state, list) {
    state.ticketList = list
  },
  startFetchEntryOrderStatusList (state) {
    state.isfetchEntryOrderStatusList = true
  },
  stopFetchEntryOrderStatusList (state) {
    state.isfetchEntryOrderStatusList = false
  },
  setEntryOrderStatusList (state, list) {
    state.entryOrderStatusList = list
  },
  startFetchOperList (state) {
    state.isfetchOperList = true
  },
  stopFetchOperList (state) {
    state.isfetchOperList = false
  },
  setOperList (state, list) {
    state.operList = list
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchAllDictTree = false
    state.isfetchDictPageList = false
    state.isfetchTicketList = false
  }
}

// actions
const actions = {
  fetchDictPageList ({ state, commit }, params) {
    if (state.isfetchDictPageList) return
    commit('startFetchDictPageList')
    const data = {
      parent_value: params.parent_value,
      kind_code: params.kind_code,
      is_disabled: params.is_disabled,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getDictPageList(data).then(res => {
      commit('setDictPageList', res.rows)
      commit('setTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchDictPageList')
    }).catch(err => {
      commit('setDictPageList', [])
      commit('setTotal', 0)
      commit('stopFetchDictPageList')
      Message.error(err.msg)
    })
  },
  fetchAllDictTree ({ state, commit }, params) {
    if (state.isFetchAllDictTree) return
    commit('startFetchAllDictTree')
    getAllDictTree(params).then(res => {
      commit('setAllDictTree', res)
      commit('stopFetchAllDictTree')
    }).catch(err => {
      commit('setAllDictTree', [])
      commit('stopFetchAllDictTree')
      Message.error(err.msg)
    })
  },
  fetchTicketList ({ state, commit }, params) {
    if (state.isfetchTicketList) return
    const data = {
      parent_value: params.parent_value,
      kind_code: params.kind_code,
      is_disabled: params.is_disabled,
    }
    commit('startFetchTicketList')
    getDictList(data).then(res => {
      commit('setTicketList', res)
      commit('stopFetchTicketList')
      if (params.success) {
        params.success()
      }
    }).catch(err => {
      commit('setTicketList', [])
      commit('stopFetchTicketList')
      Message.error(err.msg)
    })
  },
  fetchOperList ({ state, commit }, params) {
    if (state.isfetchOperList) return
    commit('startFetchOperList')
    getDictList(params).then(res => {
      commit('setOperList', res)
      commit('stopFetchOperList')
    }).catch(err => {
      commit('setOperList', [])
      commit('stopFetchOperList')
      Message.error(err.msg)
    })
  },
  fetchEntryOrderStatusList ({ state, commit }, params) {
    if (state.isfetchEntryOrderStatusList) return
    commit('startFetchEntryOrderStatusList')
    getDictList(params).then(res => {
      commit('setEntryOrderStatusList', res)
      commit('stopFetchEntryOrderStatusList')
    }).catch(err => {
      commit('setEntryOrderStatusList', [])
      commit('stopFetchEntryOrderStatusList')
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