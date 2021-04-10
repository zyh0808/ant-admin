import { getCompanyTree, getPageCompanyList, getCompanyInfo } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchCompanyTreeData: false,
  companyTreeData: [],
  isfetchCompanyList: false,
  companyList: [],
  total: 0,
  isfetchCurrentCompanyInfo: false,
  currentCompanyInfo: {},
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  companyTreeData: (state) => {
    return state.companyTreeData
  },
  companyList: (state) => {
    return state.companyList
  },
  currentCompanyInfo: (state) => {
    return state.currentCompanyInfo
  },
  total: (state) => {
    return state.total
  },
  isfetchCompanyList: (state) => {
    return state.isfetchCompanyList
  }
}
function addIcon (list) {
  return list.map(item => {
    item['slots'] = {
      icon: 'home'
    }
    item.children = item.hasChildren > 0 ? addIcon(item.children) : []
    return item
  })
}

// mutations
const mutations = {
  startFetchCompanyTreeData (state) {
    state.isfetchCompanyTreeData = true
  },
  stopFetchCompanyTreeData (state) {
    state.isfetchCompanyTreeData = false
  },
  setCompanyTreeData (state, list) {
    let result = list ? JSON.parse(list.replace(/"comp_id"/g, "\"key\"").replace(/"comp_name"/g, "\"title\"").replace(/"childNodes"/g, "\"children\"")) : []
    state.companyTreeData = addIcon(result)
    state.companyTreeData = result
  },
  startFetchCompanyList (state) {
    state.isfetchCompanyList = true
  },
  stopFetchCompanyList (state) {
    state.isfetchCompanyList = false
  },
  setCompanyList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 1 ? '客服部' : item.category === 2 ? '营销' :
        item.category === 3 ? '职能' : item.category === 4 ? '运营' : ''
      item.natureName = item.nature === 0 ? '直营' : item.nature === 1 ? '加盟' :
        item.nature === 2 ? '分控' : ''
      return item
    })
    state.companyList = list
  },
  setToal (state, total) {
    state.total = total
  },
  startFetchCurrentCompanyInfo (state) {
    state.isfetchCurrentCompanyInfo = true
  },
  stopFetchCurrentCompanyInfo (state) {
    state.isfetchCurrentCompanyInfo = false
  },
  setCurrentCompanyInfo (state, info) {
    state.currentCompanyInfo = info
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchCompanyTreeData = false
    state.isfetchCompanyList = false
    state.isfetchCurrentCompanyInfo = false
  }
}

// actions
const actions = {
  fetchCompanyTreeData ({ state, commit }, params) {
    if (state.isfetchCompanyTreeData) return
    commit('startFetchCompanyTreeData')
    getCompanyTree(params).then(res => {
      commit('setCompanyTreeData', res)
      commit('stopFetchCompanyTreeData')
    }).catch(err => {
      commit('setCompanyTreeData', [])
      commit('stopFetchCompanyTreeData')
      Message.error(err.msg)
    })
  },
  fetchCompanyList ({ state, commit }, params) {
    if (state.isfetchCompanyList) return
    commit('startFetchCompanyList')
    const data = {
      pid: params.pid,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getPageCompanyList(data).then(res => {
      commit('setCompanyList', res.rows)
      commit('setToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchCompanyList')
    }).catch(err => {
      commit('setCompanyList', [])
      commit('setToal', 0)
      commit('stopFetchCompanyList')
      Message.error(err.msg)
    })
  },
  fetchCurrentCompanyInfo ({ state, commit }, params) {
    if (state.isfetchCurrentCompanyInfo) return
    commit('startFetchCurrentCompanyInfo')
    const data = { comp_id: params.comp_id }
    getCompanyInfo(data).then(res => {
      commit('setCurrentCompanyInfo', res)
      if (params.success) {
        params.success(res)
      }
      commit('stopFetchCurrentCompanyInfo')
    }).catch(err => {
      commit('setCurrentCompanyInfo', {})
      commit('stopFetchCurrentCompanyInfo')
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