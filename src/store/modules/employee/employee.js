import { getPageEmployeeList, getEmployeeList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchEmployeeList: false,
  employeeList: [],
  total: 0,
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  employeeList: (state) => {
    return state.employeeList
  },
  total: (state) => {
    return state.total
  },
  isfetchEmployeeList: (state) => {
    return state.isfetchEmployeeList
  }
}

// mutations
const mutations = {
  startFetchEmployeeList (state) {
    state.isfetchEmployeeList = true
  },
  stopFetchEmployeeList (state) {
    state.isfetchEmployeeList = false
  },
  setEmployeeList (state, list) {
    list = list.map(item => {
      item.key = item.emp_id
      item.title = item.emp_name
      item.validate = item.is_disabled === 0
      item.genderName = item.gender === 'X' ? '' : item.gender === 'F' ? '女性' : item.gender === 'M' ? '男性' : ''
      return item
    })
    state.employeeList = list
  },
  setToal (state, total) {
    state.total = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchEmployeeList = false
  }
}

// actions
const actions = {
  fetchOrgTreeData ({ state, commit }, params) {
    if (state.isfetchOrgTreeData) return
    commit('startFetchOrgTreeData')
    getOrgTree(params).then(res => {
      commit('setOrgTreeData', res)
      commit('stopFetchOrgTreeData')
    }).catch(err => {
      commit('setOrgTreeData', [])
      commit('stopFetchOrgTreeData')
      Message.error(err.msg)
    })
  },
  fetchPageEmployeeList ({ state, commit }, params) {
    if (state.isfetchEmployeeList) return
    commit('startFetchEmployeeList')
    const data = {
      comp_id: params.comp_id ? params.comp_id : '',
      org_id: params.org_id ? params.org_id : '',
      page_num: params.page_num,
      page_size: params.page_size
    }
    getPageEmployeeList(data).then(res => {
      commit('setEmployeeList', res.rows)
      commit('setToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchEmployeeList')
    }).catch(err => {
      commit('setEmployeeList', [])
      commit('setToal', 0)
      commit('stopFetchEmployeeList')
      Message.error(err.msg)
    })
  },
  fetchEmployeeList ({ state, commit }, params) {
    if (state.isfetchEmployeeList) return
    commit('startFetchEmployeeList')
    const data = {
      comp_id: params.comp_id ? params.comp_id : '',
      org_id: params.org_id ? params.org_id : ''
    }
    getEmployeeList(data).then(res => {
      commit('setEmployeeList', res)
      if (params.success) {
        params.success()
      }
      commit('stopFetchEmployeeList')
    }).catch(err => {
      commit('setEmployeeList', [])
      commit('stopFetchEmployeeList')
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