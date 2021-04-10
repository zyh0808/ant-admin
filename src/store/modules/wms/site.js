import { getProjectSiteList, getSiteList } from '@/api/wms.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchSiteList: false,
  siteList: [],
  isfetchProjectSiteList: false,
  projectSiteList: [],
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  siteList: (state) => {
    return state.siteList
  },
  isfetchSiteList: (state) => {
    return state.isfetchSiteList
  },
  projectSiteList: (state) => {
    return state.projectSiteList
  },
  isfetchProjectSiteList: (state) => {
    return state.isfetchProjectSiteList
  }
}

// mutations
const mutations = {
  startFetchSiteList (state) {
    state.isfetchSiteList = true
  },
  stopFetchSiteList (state) {
    state.isfetchSiteList = false
  },
  setSiteList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.siteList = list
  },
  startFetchProjectSiteList (state) {
    state.isfetchProjectSiteList = true
  },
  stopFetchProjectSiteList (state) {
    state.isfetchProjectSiteList = false
  },
  setProjectSiteList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.projectSiteList = list
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchSiteList = false
    state.isfetchProjectSiteList = false
  }
}

// actions
const actions = {
  fetchSiteList ({ state, commit }, params) {
    if (state.isfetchSiteList) return
    commit('startFetchSiteList')
    getSiteList(params).then(res => {
      commit('setSiteList', res)
      commit('stopFetchSiteList')
    }).catch(err => {
      commit('setSiteList', [])
      commit('stopFetchSiteList')
      Message.error(err.msg)
    })
  },
  fetchProjectSiteList ({ state, commit }, params) {
    if (state.isfetchProjectSiteList) return
    commit('startFetchProjectSiteList')
    getProjectSiteList(params).then(res => {
      commit('setProjectSiteList', res)
      commit('stopFetchProjectSiteList')
    }).catch(err => {
      commit('setProjectSiteList', [])
      commit('stopFetchProjectSiteList')
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