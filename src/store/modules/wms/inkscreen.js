import { getInkscreenPageList, getInkscreenCodeLogPageList, getBoxInkscreenLogPageList } from '@/api/wms.js'
import { Message } from 'ant-design-vue'

const initialInkscreenState = {
  isfetchInkscreenList: false,
  inkscreenList: [],
  inkscreenTotal: 0
}
const initialInkscreenCodeLogState = {
  isfetchInkscreenCodeLogList: false,
  inkscreenCodeLogList: [],
  inkscreenCodeLogTotal: 0
}
const initialBoxInkscreenLogState = {
  isfetchBoxInkscreenLogList: false,
  boxInkscreenLogList: [],
  boxInkscreenLogTotal: 0
}
const initialState = {
  ...initialInkscreenState,
  ...initialInkscreenCodeLogState,
  ...initialBoxInkscreenLogState
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  isfetchInkscreenList: (state) => {
    return state.isfetchInkscreenList
  },
  inkscreenList: (state) => {
    return state.inkscreenList
  },
  inkscreenTotal: (state) => {
    return state.inkscreenTotal
  },
  isfetchInkscreenCodeLogList: (state) => {
    return state.isfetchInkscreenCodeLogList
  },
  inkscreenCodeLogList: (state) => {
    return state.inkscreenCodeLogList
  },
  inkscreenCodeLogTotal: (state) => {
    return state.inkscreenCodeLogTotal
  },
  isfetchBoxInkscreenLogList: (state) => {
    return state.isfetchBoxInkscreenLogList
  },
  boxInkscreenLogList: (state) => {
    return state.boxInkscreenLogList
  },
  boxInkscreenLogTotal: (state) => {
    return state.boxInkscreenLogTotal
  }
}

// mutations
const mutations = {
  startFetchInkscreenList (state) {
    state.isfetchInkscreenList = true
  },
  stopFetchInkscreenList (state) {
    state.isfetchInkscreenList = false
  },
  setInkscreenList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.inkscreenList = list
  },
  setInkscreenTotal (state, total) {
    state.inkscreenTotal = total
  },
  startFetchInkscreenCodeLogList (state) {
    state.isfetchInkscreenCodeLogList = true
  },
  stopFetchInkscreenCodeLogList (state) {
    state.isfetchInkscreenCodeLogList = false
  },
  setInkscreenCodeLogList (state, list) {
    state.inkscreenCodeLogList = list
  },
  setInkscreenCodeLogTotal (state, total) {
    state.inkscreenCodeLogTotal = total
  },
  startFetchBoxInkscreenLogList (state) {
    state.isfetchBoxInkscreenLogList = true
  },
  stopFetchBoxInkscreenLogList (state) {
    state.isfetchBoxInkscreenLogList = false
  },
  setBoxInkscreenLogList (state, list) {
    state.boxInkscreenLogList = list
  },
  setBoxInkscreenLogTotal (state, total) {
    state.boxInkscreenLogTotal = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchInkscreenList = false
    state.isfetchInkscreenCodeLogList = false
    state.isfetchBoxInkscreenLogList = false
  }
}

// actions
const actions = {
  fetchInkscreenPageList ({ state, commit }, params) {
    if (state.isfetchInkscreenList) return
    commit('startFetchInkscreenList')
    const data = {
      house_id: params.house_id,
      device_id: params.device_id,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getInkscreenPageList(data).then(res => {
      commit('setInkscreenList', res.rows)
      commit('setInkscreenTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchInkscreenList')
    }).catch(err => {
      commit('setInkscreenList', [])
      commit('stopFetchInkscreenList')
      Message.error(err.msg)
    })
  },
  fetchInkscreenCodeLogPageList ({ state, commit }, params) {
    if (state.isfetchInkscreenCodeLogList) return
    commit('startFetchInkscreenCodeLogList')
    const data = {
      house_id: params.house_id,
      device_id: params.device_id,
      op_username: params.op_username,
      op_time_start: params.op_time_start,
      op_time_end: params.op_time_end,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getInkscreenCodeLogPageList(data).then(res => {
      commit('setInkscreenCodeLogList', res.rows)
      commit('setInkscreenCodeLogTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchInkscreenCodeLogList')
    }).catch(err => {
      commit('setInkscreenCodeLogList', [])
      commit('stopFetchInkscreenCodeLogList')
      Message.error(err.msg)
    })
  },
  fetchBoxInkscreenLogPageList ({ state, commit }, params) {
    if (state.isfetchBoxInkscreenLogList) return
    commit('startFetchBoxInkscreenLogList')
    const data = {
      house_id: params.house_id,
      box_barcode: params.box_barcode,
      screen_barcode: params.screen_barcode,
      op_username: params.op_username,
      op_time_start: params.op_time_start,
      op_time_end: params.op_time_end,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getBoxInkscreenLogPageList(data).then(res => {
      commit('setBoxInkscreenLogList', res.rows)
      commit('setBoxInkscreenLogTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchBoxInkscreenLogList')
    }).catch(err => {
      commit('setBoxInkscreenLogList', [])
      commit('stopFetchBoxInkscreenLogList')
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