import { getTempRangePageList, getHousePageList, getHouseList, getTempRangeList, getSetTempList, getShelfKindPageList, getShelfPageList, getShelfKindList, getCellPageList } from '@/api/wms.js'
import { Message } from 'ant-design-vue'

const initialHouseState = {
  isfetchHouseList: false,
  houseList: [],
  houseTotal: 0
}
const initialTempRangeState = {
  isfetchTempRangeList: false,
  tempRangeList: [],
  tempRangeTotal: 0
}
const initialSetTempState = {
  isfetchSetTempList: false,
  setTempList: []
}
const initialShelfKindState = {
  isfetchShelfKindList: false,
  shelfKindList: []
}
const initialShelfState = {
  isfetchShelfList: false,
  shelfList: [],
}
const initialCellState = {
  isfetchCellList: false,
  cellList: [],
}
const initialState = {
  ...initialHouseState,
  ...initialTempRangeState,
  ...initialSetTempState,
  ...initialShelfKindState,
  ...initialShelfState,
  ...initialCellState
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  isfetchHouseList: (state) => {
    return state.isfetchHouseList
  },
  houseList: (state) => {
    return state.houseList
  },
  houseTotal: (state) => {
    return state.houseTotal
  },
  isfetchTempRangeList: (state) => {
    return state.isfetchTempRangeList
  },
  tempRangeList: (state) => {
    return state.tempRangeList
  },
  tempRangeTotal: (state) => {
    return state.tempRangeTotal
  },
  setTempList: (state) => {
    return state.setTempList
  },
  isfetchShelfKindList: (state) => {
    return state.isfetchShelfKindList
  },
  shelfKindList: (state) => {
    return state.shelfKindList
  },
  shelfKindTotal: (state) => {
    return state.shelfKindTotal
  },
  isfetchShelfList: (state) => {
    return state.isfetchShelfList
  },
  shelfList: (state) => {
    return state.shelfList
  },
  shelfTotal: (state) => {
    return state.shelfTotal
  },
  isfetchCellList: (state) => {
    return state.isfetchCellList
  },
  cellList: (state) => {
    return state.cellList
  },
  cellTotal: (state) => {
    return state.cellTotal
  },
}

// mutations
const mutations = {
  startFetchHouseList (state) {
    state.isfetchHouseList = true
  },
  stopFetchHouseList (state) {
    state.isfetchHouseList = false
  },
  setHouseList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 0 ? '自有' : item.category === 1 ? '租赁' : ''
      return item
    })
    state.houseList = list
  },
  setHouseTotal (state, total) {
    state.houseTotal = total
  },
  resetHouseData (state) {
    state = Object.assign(state, initialHouseState)
  },
  startFetchTempRangeList (state) {
    state.isfetchTempRangeList = true
  },
  stopFetchTempRangeList (state) {
    state.isfetchTempRangeList = false
  },
  setTempRangeList (state, list) {
    list = list.map(item => {
      item.key = item.temp_range_id
      item.title = item.temp_range_name
      item.validate = item.is_disabled === 0
      return item
    })
    state.tempRangeList = list
  },
  setTempRangeTotal (state, total) {
    state.tempRangeTotal = total
  },
  resetTempRangeData (state) {
    state = Object.assign(state, initialTempRangeState)
  },
  startFetchSetTempList (state) {
    state.isfetchSetTempList = true
  },
  stopFetchSetTempList (state) {
    state.isfetchSetTempList = false
  },
  setSetTempList (state, list) {
    list = list.map(item => item.temp_range_id)
    state.setTempList = list
  },
  startFetchShelfKindList (state) {
    state.isfetchShelfKindList = true
  },
  stopFetchShelfKindList (state) {
    state.isfetchShelfKindList = false
  },
  setShelfKindList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 0 ? '轻型' : item.category === 1 ? '重型' : item.category === 2 ? '其他' : ''
      return item
    })
    state.shelfKindList = list
  },
  setShelfKindTotal (state, total) {
    state.shelfKindTotal = total
  },
  startFetchShelfList (state) {
    state.isfetchShelfList = true
  },
  stopFetchShelfList (state) {
    state.isfetchShelfList = false
  },
  setShelfList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 0 ? '轻型' : item.category === 1 ? '重型' : item.category === 2 ? '其他' : ''
      return item
    })
    state.shelfList = list
  },
  setShelfTotal (state, total) {
    state.shelfTotal = total
  },
  startFetchCellList (state) {
    state.isfetchCellList = true
  },
  stopFetchCellList (state) {
    state.isfetchCellList = false
  },
  setCellList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 0 ? '药品' : item.category === 1 ? '样本' : item.category === 2 ? '器械（设备）' : ''
      return item
    })
    state.cellList = list
  },
  setCellTotal (state, total) {
    state.cellTotal = total
  },
  resetCellData (state) {
    state = Object.assign(state, initialCellState)
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchHouseList = false
    state.isfetchTempRangeList = false
    state.isfetchSetTempList = false
    state.isfetchShelfKindList = false
    state.isfetchShelfList = false
    state.isfetchCellList = false
  }
}

// actions
const actions = {
  fetchHousePageList ({ state, commit }, params) {
    if (state.isfetchHouseList) return
    commit('startFetchHouseList')
    const data = {
      house_id: params.house_id,
      house_name: params.house_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getHousePageList(data).then(res => {
      commit('setHouseList', res.rows)
      commit('setHouseTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchHouseList')
    }).catch(err => {
      commit('setHouseList', [])
      commit('stopFetchHouseList')
      Message.error(err.msg)
    })
  },
  fetchHouseList ({ state, commit }, params) {
    if (state.isfetchHouseList) return
    commit('startFetchHouseList')
    getHouseList(params).then(res => {
      commit('setHouseList', res)
      commit('stopFetchHouseList')
    }).catch(err => {
      commit('setHouseList', [])
      commit('stopFetchHouseList')
      Message.error(err.msg)
    })
  },
  fetchTempRangePageList ({ state, commit }, params) {
    if (state.isfetchTempRangeList) return
    commit('startFetchTempRangeList')
    const data = {
      temp_range_id: params.temp_range_id,
      temp_range_name: params.temp_range_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getTempRangePageList(data).then(res => {
      commit('setTempRangeList', res.rows)
      commit('setTempRangeTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchTempRangeList')
    }).catch(err => {
      commit('setTempRangeList', [])
      commit('stopFetchTempRangeList')
      Message.error(err.msg)
    })
  },
  fetchTempRangeList ({ state, commit }, params) {
    if (state.isfetchTempRangeList) return
    getTempRangeList(params).then(res => {
      commit('setTempRangeList', res)
      commit('stopFetchTempRangeList')
    }).catch(err => {
      commit('setTempRangeList', [])
      commit('stopFetchTempRangeList')
      Message.error(err.msg)
    })
  },
  fetchSetTempList ({ state, commit }, params) {
    if (state.isfetchSetTempList) return
    getSetTempList(params).then(res => {
      commit('setSetTempList', res)
      commit('stopFetchSetTempList')
    }).catch(err => {
      commit('setSetTempList', [])
      commit('stopFetchSetTempList')
      Message.error(err.msg)
    })
  },
  fetchShelfKindPageList ({ state, commit }, params) {
    if (state.isfetchShelfKindList) return
    commit('startFetchShelfKindList')
    const data = {
      category: params.category,
      shelf_kind_name: params.shelf_kind_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getShelfKindPageList(data).then(res => {
      commit('setShelfKindList', res.rows)
      commit('setShelfKindTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchShelfKindList')
    }).catch(err => {
      commit('setShelfKindList', [])
      commit('stopFetchShelfKindList')
      Message.error(err.msg)
    })
  },
  fetchShelfKindList ({ state, commit }, params) {
    if (state.isfetchShelfKindList) return
    commit('startFetchShelfKindList')
    getShelfKindList(params).then(res => {
      commit('setShelfKindList', res)
      commit('stopFetchShelfKindList')
    }).catch(err => {
      commit('setShelfKindList', [])
      commit('stopFetchShelfKindList')
      Message.error(err.msg)
    })
  },
  fetchShelfPageList ({ state, commit }, params) {
    if (state.isfetchShelfList) return
    commit('startFetchShelfList')
    const data = {
      house_id: params.house_id,
      temp_range_id: params.temp_range_id,
      floor_id: params.floor_id,
      house_shelf_id: params.house_shelf_id,
      house_shelf_name: params.house_shelf_name,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getShelfPageList(data).then(res => {
      commit('setShelfList', res.rows)
      commit('setShelfTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchShelfList')
    }).catch(err => {
      commit('setShelfList', [])
      commit('stopFetchShelfList')
      Message.error(err.msg)
    })
  },
  fetchCellPageList ({ state, commit }, params) {
    if (state.isfetchCellList) return
    commit('startFetchCellList')
    const data = {
      house_id: params.house_id,
      temp_range_id: params.temp_range_id,
      floor_id: params.floor_id,
      shelf_cell_id: params.shelf_cell_id,
      shelf_cell_name: params.shelf_cell_name,
      state: params.state,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getCellPageList(data).then(res => {
      commit('setCellList', res.rows)
      commit('setCellTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchCellList')
    }).catch(err => {
      commit('setCellList', [])
      commit('stopFetchCellList')
      Message.error(err.msg)
    })
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}