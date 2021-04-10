import { getOrgTree, getComOrgList, getOtherOrgList, getOrgInfo } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchOrgTreeData: false,
  orgTreeData: [],
  isfetchCurrentOrgInfo: false,
  currentOrgInfo: [],
  isfetchOrgList: false,
  orgList: []
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  orgTreeData: (state) => {
    return state.orgTreeData
  },
  currentOrgInfo: (state) => {
    return state.currentOrgInfo
  },
  orgList: (state) => {
    return state.orgList
  },
  isfetchOrgList: (state) => {
    return state.isfetchOrgList
  }
}

// mutations
const mutations = {
  startFetchOrgTreeData (state) {
    state.isfetchOrgTreeData = true
  },
  stopFetchOrgTreeData (state) {
    state.isfetchOrgTreeData = false
  },
  setOrgTreeData (state, list) {
    list = dataToTree(list)
    state.orgTreeData = list
  },
  startFetchOrgList (state) {
    state.isfetchOrgList = true
  },
  stopFetchOrgList (state) {
    state.isfetchOrgList = false
  },
  setOrgList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.categoryName = item.category === 1 ? '客服部' : item.category === 2 ? '营销' :
        item.category === 3 ? '职能' : item.category === 4 ? '运营' : ''
      item.natureName = item.nature === 0 ? '直营' : item.nature === 1 ? '加盟' :
        item.nature === 2 ? '分控' : ''
      return item
    })
    state.orgList = list
  },
  startFetchCurrentOrgInfo (state) {
    state.isfetchCurrentOrgInfo = true
  },
  stopFetchCurrentOrgInfo (state) {
    state.isfetchCurrentOrgInfo = false
  },
  setCurrentOrgInfo (state, info) {
    state.currentOrgInfo = info
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchOrgTreeData = false
    state.isfetchCurrentOrgInfo = false
    state.isfetchOrgList = false
  }
}

function dataToTree (list, key = '') {
  return list.map((every, index) => {
    let temp = {}
    temp['key'] = key === '' ? index + key : key + '-' + index
    temp['value'] = every.item.no
    temp['title'] = every.item.full_name
    temp['kind'] = every.item.kind
    temp['parent_no'] = every.item.parent_no
    temp['slots'] = {
      icon: every.item.kind === 0 ? 'apartment' : 'home',
    }
    if (every.children.length > 0) {
      temp['children'] = dataToTree(every.children, temp.key)
    }
    return temp
  })
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
  fetchTopOrgList ({ state, commit }, params) {
    if (state.isfetchOrgList) return
    commit('startFetchOrgList')
    getComOrgList(params).then(res => {
      commit('setOrgList', res)
      commit('stopFetchOrgList')
    }).catch(err => {
      commit('setOrgList', [])
      commit('stopFetchOrgList')
      Message.error(err.msg)
    })
  },
  fetchOtherOrgList ({ state, commit }, params) {
    if (state.isfetchOrgList) return
    commit('startFetchOrgList')
    getOtherOrgList(params).then(res => {
      commit('setOrgList', res)
      commit('stopFetchOrgList')
    }).catch(err => {
      commit('setOrgList', [])
      commit('stopFetchOrgList')
      Message.error(err.msg)
    })
  },
  fetchCurrentOrgInfo ({ state, commit }, params) {
    if (state.isfetchCurrentOrgInfo) return
    commit('startFetchCurrentOrgInfo')
    const data = { org_id: params.org_id }
    getOrgInfo(data).then(res => {
      commit('setCurrentOrgInfo', res)
      if (params.success) {
        params.success(res)
      }
      commit('stopFetchCurrentOrgInfo')
    }).catch(err => {
      commit('setCurrentOrgInfo', {})
      commit('stopFetchCurrentOrgInfo')
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