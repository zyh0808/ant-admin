import { getProjectDrugList, getDrugList } from '@/api/wms.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchDrugList: false,
  drugList: [],
  isfetchProjectDrugList: false,
  projectDrugList: [],
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  drugList: (state) => {
    return state.drugList
  },
  isfetchDrugList: (state) => {
    return state.isfetchDrugList
  },
  projectDrugList: (state) => {
    return state.projectDrugList
  },
  isfetchProjectDrugList: (state) => {
    return state.isfetchProjectDrugList
  }
}

// mutations
const mutations = {
  startFetchDrugList (state) {
    state.isfetchDrugList = true
  },
  stopFetchDrugList (state) {
    state.isfetchDrugList = false
  },
  setDrugList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.op_type_desc = item.op_type === 0 ? '编盲药' : '非编盲药'
      const unit = item.period_unit === 1 ? '天' : item.period_unit === 2 ? '月' : item.period_unit === 3 ? '年' : ''
      item.validPeriod = item.valid_period + ' ' + unit
      return item
    })
    state.drugList = list
  },
  startFetchProjectDrugList (state) {
    state.isfetchProjectDrugList = true
  },
  stopFetchProjectDrugList (state) {
    state.isfetchProjectDrugList = false
  },
  setProjectDrugList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.oper_type_name = item.oper_type === 0 ? '编盲药' : item.oper_type === 1 ? '非编盲药' : ''
      return item
    })
    state.projectDrugList = list
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchDrugList = false
    state.isfetchProjectDrugList = false
  }
}

// actions
const actions = {
  fetchDrugList ({ state, commit }, params) {
    if (state.isfetchDrugList) return
    commit('startFetchDrugList')
    getDrugList(params).then(res => {
      commit('setDrugList', res)
      commit('stopFetchDrugList')
    }).catch(err => {
      commit('setDrugList', [])
      commit('stopFetchDrugList')
      Message.error(err.msg)
    })
  },
  fetchProjectDrugList ({ state, commit }, params) {
    if (state.isfetchProjectDrugList) return
    commit('startFetchProjectDrugList')
    getProjectDrugList(params).then(res => {
      commit('setProjectDrugList', res)
      commit('stopFetchProjectDrugList')
    }).catch(err => {
      commit('setProjectDrugList', [])
      commit('stopFetchProjectDrugList')
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