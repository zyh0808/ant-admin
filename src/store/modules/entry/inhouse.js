import { getPackUpList, getPackUpInfo, getPackList, getUpList, getPackInfo, getUpInfo } from '@/api/order'
import { Message } from 'ant-design-vue'
import moment from 'moment'

const initialState = {
  isFetchPackUpList: false,
  packUpList: [],
  packUpListTotal: 0,

  isFecthPackUpInfo: false,
  packUpInfo: {},

  isFetchPackList: false,
  packList: [],
  packListTotal: 0,
  currentPackStatus: 0,
  packStatus: [
    {
      index: 0,
      name: '未装箱'
    },
    {
      index: 1,
      name: '装箱中 '
    },
    {
      index: 2,
      name: '已装箱'
    }
  ],
  isFetchPackInfo: false,
  packInfo: {},

  isFetchUpList: false,
  upList: [],
  upListTotal: 0,
  currentUpStatus: 0,
  upStatus: [
    {
      index: 0,
      name: '未上架'
    },
    {
      index: 1,
      name: '上架中 '
    },
    {
      index: 2,
      name: '已上架'
    }
  ],
  isFetchUpInfo: false,
  upInfo: {}
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  isFetchPackUpList: (state) => {
    return state.isFetchPackUpList
  },
  packUpList: (state) => {
    return state.packUpList
  },
  packUpListTotal: (state) => {
    return state.packUpListTotal
  },
  packUpInfo: (state) => {
    return state.packUpInfo
  },
  isFetchPackList: (state) => {
    return state.isFetchPackList
  },
  packList: (state) => {
    return state.packList
  },
  packListTotal: (state) => {
    return state.packListTotal
  },
  currentPackStatus: (state) => {
    return state.currentPackStatus
  },
  packStatus: (state) => {
    return state.packStatus
  },
  isFetchPackInfo: (state) => {
    return state.packInfo
  },
  packInfo: (state) => {
    return state.packInfo
  },
  isFetchUpList: (state) => {
    return state.isFetchUpList
  },
  upList: (state) => {
    return state.upList
  },
  upListTotal: (state) => {
    return state.upListTotal
  },
  currentUpStatus: (state) => {
    return state.currentUpStatus
  },
  upStatus: (state) => {
    return state.upStatus
  },
  isFetchUpInfo: (state) => {
    return state.upInfo
  },
  upInfo: (state) => {
    return state.upInfo
  }
}

// mutations
const mutations = {
  startFetchPackUpList (state) {
    state.isFetchPackUpList = true
  },
  stopFetchPackUpList (state) {
    state.isFetchPackUpList = false
  },
  setPackUpList (state, list) {
    state.packUpList = list
  },
  setPackUpListTotal (state, total) {
    state.packUpListTotal = total
  },
  startFetchPackUpInfo (state) {
    state.isFetchPackUpInfo = true
  },
  stopFetchPackUpInfo (state) {
    state.isFetchPackUpInfo = false
  },
  setPackUpInfo (state, list) {
    state.packUpInfo = list
  },
  startFetchPackList (state) {
    state.isFetchPackList = true
  },
  stopFetchPackList (state) {
    state.isFetchPackList = false
  },
  setPackList (state, list) {
    list.map(item => {
      item.create_time = moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      item.personIdList = item.packingTaskPersonList.map(detail => detail.person_id)
      item.personNameList = item.packingTaskPersonList.map(detail => detail.person_name)
      return item
    })
    state.packList = list
  },
  setPackListTotal (state, total) {
    state.packListTotal = total
  },
  addPackList (state, info) {
    state.packList.push(info)
  },
  deletePackList (state, index) {
    state.packList.splice(index, 1)
  },
  setCurrentPackStatus (state, index) {
    state.currentPackStatus = index
  },
  startFetchPackInfo (state) {
    state.isFetchPackInfo = true
  },
  stopFetchPackInfo (state) {
    state.isFetchPackInfo = false
  },
  setPackInfo (state, info) {
    state.packInfo = info
  },
  startFetchUpList (state) {
    state.isFetchUpList = true
  },
  stopFetchUpList (state) {
    state.isFetchUpList = false
  },
  setUpList (state, list) {
    list.map(item => {
      item.create_time = moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      item.personIdList = item.onshelfTaskPersonList.map(detail => detail.person_id)
      item.personNameList = item.onshelfTaskPersonList.map(detail => detail.person_name)
      return item
    })
    state.upList = list
  },
  setUpListTotal (state, total) {
    state.upListTotal = total
  },
  addUpList (state, info) {
    state.upList.push(info)
  },
  deleteUpList (state, index) {
    state.upList.splice(index, 1)
  },
  setCurrentUpStatus (state, index) {
    state.currentUpStatus = index
  },
  startFetchUpInfo (state) {
    state.isFetchUpInfo = true
  },
  stopFetchUpInfo (state) {
    state.isFetchUpInfo = false
  },
  setUpInfo (state, info) {
    state.upInfo = info
  },
  resetPackList (state) {
    state.packList = []
  },
  resetUpList (state) {
    state.upList = []
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isFetchUpUpList = false
  }
}

// actions
const actions = {
  fetchPackUpList ({ commit }, params) {
    if (state.isFetchPackUpList) return
    commit('startFetchPackUpList')
    const data = {
      proj_no: params.proj_no,
      drug_name: params.drug_name,
      house_id: params.house_id,
      in_ts_start: params.in_ts_start,
      in_ts_end: params.in_ts_end,
      packing_status: params.packing_status,
      onshelf_status: params.onshelf_status,
      page_num: params.page_num,
      page_size: params.page_size
    }
    console.log(JSON.stringify(data))
    getPackUpList(data).then(res => {
      commit('setPackUpList', res.rows)
      commit('setPackUpListTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchPackUpList')
    }).catch(err => {
      commit('setPackUpList', [])
      commit('setPackUpListTotal', 0)
      commit('stopFetchPackUpList')
      Message.error(err.msg)
    })
  },
  fetchPackUpInfo ({ commit }, params) {
    if (state.isFetchPackUpInfo) return
    commit('startFetchPackUpInfo')
    getPackUpInfo(params).then(res => {
      commit('setPackUpInfo', res)
      commit('stopFetchPackUpInfo')
    }).catch(err => {
      commit('setPackUpInfo', {})
      commit('stopFetchPackUpInfo')
      Message.error(err.msg)
    })
  },
  fetchPackList ({ commit }, params) {
    if (state.isFetchPackList) return
    commit('startFetchPackList')
    const data = {
      house_id: params.house_id,
      drug_name: params.drug_name,
      create_time_start: params.create_time_start,
      create_time_end: params.create_time_end,
      packing_task_no: params.packing_task_no,
      packing_task_status: params.packing_task_status,
      person_id: params.person_id,
      person_name: params.person_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    console.log(JSON.stringify(data))
    getPackList(data).then(res => {
      commit('setPackList', res.rows)
      commit('setPackListTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchPackList')
    }).catch(err => {
      commit('setPackList', [])
      commit('setPackListTotal', 0)
      commit('stopFetchPackList')
      Message.error(err.msg)
    })
  },
  fetchPackInfo ({ commit }, params) {
    if (state.isFetchPackInfo) return
    commit('startFetchPackInfo')
    getPackInfo(params).then(res => {
      commit('setPackInfo', res)
      commit('stopFetchPackInfo')
    }).catch(err => {
      commit('setPackInfo', {})
      commit('stopFetchPackInfo')
      Message.error(err.msg)
    })
  },
  fetchUpList ({ commit }, params) {
    if (state.isFetchUpList) return
    commit('startFetchUpList')
    const data = {
      drug_name: params.drug_name,
      house_id: params.house_id,
      create_time_start: params.create_time_start,
      create_time_end: params.create_time_end,
      onshelf_task_no: params.onshelf_task_no,
      onshelf_task_status: params.onshelf_task_status,
      person_id: params.person_id,
      person_name: params.person_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    console.log(JSON.stringify(data))
    getUpList(data).then(res => {
      commit('setUpList', res.rows)
      commit('setUpListTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchUpList')
    }).catch(err => {
      commit('setUpList', [])
      commit('setUpListTotal', 0)
      commit('stopFetchUpList')
      Message.error(err.msg)
    })
  },
  fetchUpInfo ({ commit }, params) {
    if (state.isFetchUpInfo) return
    commit('startFetchUpInfo')
    getUpInfo(params).then(res => {
      commit('setUpInfo', res)
      commit('stopFetchUpInfo')
    }).catch(err => {
      commit('setUpInfo', {})
      commit('stopFetchUpInfo')
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