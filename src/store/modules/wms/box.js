import { getBoxKindPageList, getBoxKindList, getBoxPageList, getBoxKindDrugPageList, getCellBoxPageList, getBoxList } from '@/api/wms.js'
import { Message } from 'ant-design-vue'

const initialBoxKindState = {
  isfetchBoxKindList: false,
  boxKindList: []
}
const initialBoxState = {
  isfetchBoxList: false,
  boxList: [],
}
const initialBoxKindDrugState = {
  isfetchBoxKindDrugList: false,
  boxKindDrugList: [],
}
const initialCellBoxState = {
  isfetchCellBoxList: false,
  cellBoxList: [],
}
const initialState = {
  ...initialBoxKindState,
  ...initialBoxState,
  ...initialBoxKindDrugState,
  ...initialCellBoxState
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  isfetchBoxKindList: (state) => {
    return state.isfetchBoxKindList
  },
  boxKindList: (state) => {
    return state.boxKindList
  },
  boxKindTotal: (state) => {
    return state.boxKindTotal
  },
  isfetchBoxList: (state) => {
    return state.isfetchBoxList
  },
  boxList: (state) => {
    return state.boxList
  },
  boxTotal: (state) => {
    return state.boxTotal
  },
  isfetchBoxKindDrugList: (state) => {
    return state.isfetchBoxKindDrugList
  },
  boxKindDrugList: (state) => {
    return state.boxKindDrugList
  },
  boxKindDrugTotal: (state) => {
    return state.boxKindDrugTotal
  },
  isfetchCellBoxList: (state) => {
    return state.isfetchCellBoxList
  },
  cellBoxList: (state) => {
    return state.cellBoxList
  },
  cellBoxTotal: (state) => {
    return state.cellBoxTotal
  }
}

// mutations
const mutations = {
  startFetchBoxKindList (state) {
    state.isfetchBoxKindList = true
  },
  stopFetchBoxKindList (state) {
    state.isfetchBoxKindList = false
  },
  setBoxKindList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 0 ? '药品箱' : item.category === 1 ? '拣药箱' : item.category === 2 ? '其他' : ''
      return item
    })
    state.boxKindList = list
  },
  setBoxKindTotal (state, total) {
    state.boxKindTotal = total
  },
  startFetchBoxList (state) {
    state.isfetchBoxList = true
  },
  stopFetchBoxList (state) {
    state.isfetchBoxList = false
  },
  setBoxList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 0 ? '药品箱' : item.category === 1 ? '拣药箱' : item.category === 2 ? '其他' : ''
      return item
    })
    state.boxList = list
  },
  setBoxTotal (state, total) {
    state.boxTotal = total
  },
  resetBoxData (state) {
    state = Object.assign(state, initialBoxState)
  },
  startFetchBoxKindDrugList (state) {
    state.isfetchBoxKindDrugList = true
  },
  stopFetchBoxKindDrugList (state) {
    state.isfetchBoxKindDrugList = false
  },
  setBoxKindDrugList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.boxKindDrugList = list
  },
  setBoxKindDrugTotal (state, total) {
    state.boxKindDrugTotal = total
  },
  resetCellData (state) {
    state = Object.assign(state, initialCellState)
  },
  startFetchCellBoxList (state) {
    state.isfetchCellBoxList = true
  },
  stopFetchCellBoxList (state) {
    state.isfetchCellBoxList = false
  },
  setCellBoxList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.cellBoxList = list
  },
  setCellBoxTotal (state, total) {
    state.cellBoxTotal = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchBoxKindList = false
  }
}

// actions
const actions = {
  fetchBoxKindPageList ({ state, commit }, params) {
    if (state.isfetchBoxKindList) return
    commit('startFetchBoxKindList')
    const data = {
      box_kind_name: params.box_kind_name,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getBoxKindPageList(data).then(res => {
      commit('setBoxKindList', res.rows)
      commit('setBoxKindTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchBoxKindList')
    }).catch(err => {
      commit('setBoxList', [])
      commit('stopFetchBoxKindList')
      Message.error(err.msg)
    })
  },
  fetchBoxKindList ({ state, commit }, params) {
    if (state.isfetchBoxKindList) return
    commit('startFetchBoxKindList')
    getBoxKindList(params).then(res => {
      commit('setBoxKindList', res)
      commit('stopFetchBoxKindList')
    }).catch(err => {
      commit('setBoxKindList', [])
      commit('stopFetchBoxKindList')
      Message.error(err.msg)
    })
  },
  fetchBoxPageList ({ state, commit }, params) {
    if (state.isfetchBoxList) return
    commit('startFetchBoxList')
    const data = {
      box_barcode: params.box_barcode,
      box_name: params.box_name,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getBoxPageList(data).then(res => {
      commit('setBoxList', res.rows)
      commit('setBoxTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchBoxList')
    }).catch(err => {
      commit('setBoxList', [])
      commit('stopFetchBoxList')
      Message.error(err.msg)
    })
  },
  fetchBoxList ({ state, commit }, params) {
    if (state.isfetchBoxList) return
    commit('startFetchBoxList')
    getBoxList(params).then(res => {
      commit('setBoxList', res)
      commit('stopFetchBoxList')
    }).catch(err => {
      commit('setBoxList', [])
      commit('stopFetchBoxList')
      Message.error(err.msg)
    })
  },
  fetchBoxKindDrugPageList ({ state, commit }, params) {
    if (state.isfetchBoxKindDrugList) return
    commit('startFetchBoxKindDrugList')
    const data = {
      box_kind_id: params.box_kind_id,
      drug_name: params.drug_name,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getBoxKindDrugPageList(data).then(res => {
      commit('setBoxKindDrugList', res.rows)
      commit('setBoxKindDrugTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchBoxKindDrugList')
    }).catch(err => {
      commit('setBoxKindDrugList', [])
      commit('stopFetchBoxKindDrugList')
      Message.error(err.msg)
    })
  },
  fetchCellBoxPageList ({ state, commit }, params) {
    if (state.isfetchCellBoxList) return
    commit('startFetchCellBoxList')
    const data = {
      house_id: params.house_id,
      shelf_cell_id: params.shelf_cell_id,
      box_barcode: params.box_barcode,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getCellBoxPageList(data).then(res => {
      commit('setCellBoxList', res.rows)
      commit('setCellBoxTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchCellBoxList')
    }).catch(err => {
      commit('setCellBoxList', [])
      commit('stopFetchCellBoxList')
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