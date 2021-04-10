import { getClientList, getPayAccountList, getClientInfo, getProjectList, getProjectInfo } from '@/api/wms.js'
import { Message } from 'ant-design-vue'
import store from '@/store'
const initialState = {
  isfetchClientList: false,
  clientList: [],
  isfetchPayAccountList: false,
  payAccountList: [],
  isfetchClientInfo: false,
  clientInfo: {},
  isfetchProjectList: false,
  projectList: [],
  isfetchProjectInfo: false,
  projectInfo: {}
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  clientList: (state) => {
    return state.clientList
  },
  isfetchClientList: (state) => {
    return state.isfetchClientList
  },
  payAccountList: (state) => {
    return state.payAccountList
  },
  isfetchPayAccountList: (state) => {
    return state.isfetchPayAccountList
  },
  isfetchClientInfo: (state) => {
    return state.isfetchClientInfo
  },
  clientInfo: (state) => {
    return state.clientInfo
  },
  projectList: (state) => {
    return state.projectList
  },
  isfetchProjectList: (state) => {
    return state.isfetchProjectList
  },
  isfetchProjectInfo: (state) => {
    return state.isfetchProjectInfo
  },
  projectInfo: (state) => {
    return state.projectInfo
  }
}

// mutations
const mutations = {
  startFetchClientList (state) {
    state.isfetchClientList = true
  },
  stopFetchClientList (state) {
    state.isfetchClientList = false
  },
  setClientList (state, list) {
    const ticketList = store.getters['dictionary/ticketList']
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.marketing_type_name = item.marketing_type === 0 ? '独立开发' : item.marketing_type === 1 ? '合作开发' : item.marketing_type === 2 ? '分享客户' : item.marketing_type === 3 ? '交接客户' : ''
      const ticket = ticketList.find(ticket => item.invoice_type === parseInt(ticket.item_value))
      item.invoice_type_name = ticket ? ticket.item_name : ''
      return item
    })
    state.clientList = list
  },
  startFetchPayAccountList (state) {
    state.isfetchPayAccountList = true
  },
  stopFetchPayAccountList (state) {
    state.isfetchPayAccountList = false
  },
  setPayAccountList (state, list) {
    const operList = store.getters['dictionary/operList']
    const ticketList = store.getters['dictionary/ticketList']
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      const oper = operList.find(oper => item.oper_type === parseInt(oper.item_value))
      item.oper_type_name = oper ? oper.item_name : ''
      const ticket = ticketList.find(ticket => item.invoice_type === parseInt(ticket.item_value))
      item.invoice_type_name = ticket ? ticket.item_name : ''
      return item
    })
    state.payAccountList = list
  },
  startFetchClientInfo (state) {
    state.isfetchClientInfo = true
  },
  stopFetchClientInfo (state) {
    state.isfetchClientInfo = false
  },
  setClientInfo (state, info) {
    const ticketList = store.getters['dictionary/ticketList']
    info.validate = info.is_disabled === 0 ? true : false
    info.marketing_type_name = info.marketing_type === 0 ? '独立开发' : info.marketing_type === 1 ? '合作开发' : info.marketing_type === 2 ? '分享客户' : info.marketing_type === 3 ? '交接客户' : ''
    const ticket = ticketList.find(ticket => info.invoice_type === parseInt(ticket.item_value))
    info.invoice_type_name = ticket ? ticket.item_name : ''
    state.clientInfo = info
  },
  startFetchProjectList (state) {
    state.isfetchProjectList = true
  },
  stopFetchProjectList (state) {
    state.isfetchProjectList = false
  },
  setProjectList (state, list) {
    const operList = store.getters['dictionary/operList']
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      const oper = operList.find(oper => item.oper_type === parseInt(oper.item_value))
      item.oper_type_name = oper ? oper.item_name : ''
      return item
    })
    state.projectList = list
  },
  startFetchProjectInfo (state) {
    state.isfetchProjectInfo = true
  },
  stopFetchProjectInfo (state) {
    state.isfetchProjectInfo = false
  },
  setProjectInfo (state, info) {
    const operList = store.getters['dictionary/operList']
    info.validate = info.is_disabled === 0 ? true : false
    const oper = operList.find(oper => info.oper_type === parseInt(oper.item_value))
    info.oper_type_name = oper ? oper.item_name : ''
    state.projectInfo = info
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchClientList = false
    state.isfetchPayAccountList = false
    state.isfetchClientInfo = false
    state.isfetchProjectList = false
    state.isfetchProjectInfo = false
  }
}

// actions
const actions = {
  fetchClientList ({ state, commit }, params) {
    if (state.isfetchClientList) return
    commit('startFetchClientList')
    getClientList(params).then(res => {
      commit('setClientList', res)
      commit('stopFetchClientList')
    }).catch(err => {
      commit('setClientList', [])
      commit('stopFetchClientList')
      Message.error(err.msg)
    })
  },
  fetchPayAccountList ({ state, commit }, params) {
    if (state.isfetchPayAccountList) return
    commit('startFetchPayAccountList')
    getPayAccountList(params).then(res => {
      commit('setPayAccountList', res)
      commit('stopFetchPayAccountList')
    }).catch(err => {
      commit('setPayAccountList', [])
      commit('stopFetchPayAccountList')
      Message.error(err.msg)
    })
  },
  fetchClientInfo ({ state, commit }, params) {
    if (state.isfetchClientInfo) return
    commit('startFetchClientInfo')
    getClientInfo(params).then(res => {
      commit('setClientInfo', res)
      commit('stopFetchClientInfo')
    }).catch(err => {
      commit('setClientInfo', [])
      commit('stopFetchClientInfo')
      Message.error(err.msg)
    })
  },
  fetchProjectList ({ state, commit }, params) {
    if (state.isfetchProjectList) return
    commit('startFetchProjectList')
    getProjectList(params).then(res => {
      commit('setProjectList', res)
      commit('stopFetchProjectList')
    }).catch(err => {
      commit('setProjectList', [])
      commit('stopFetchProjectList')
      Message.error(err.msg)
    })
  },
  fetchProjectInfo ({ state, commit }, params) {
    if (state.isfetchProjectInfo) return
    commit('startFetchProjectInfo')
    getProjectInfo(params).then(res => {
      commit('setProjectInfo', res)
      commit('stopFetchProjectInfo')
    }).catch(err => {
      commit('setProjectInfo', [])
      commit('stopFetchProjectInfo')
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