import { getModuleTree, getPageModuleList, getModuleInfo } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchModuleTreeData: false,
  moduleTreeData: [],
  isfetchModuleList: false,
  moduleList: [],
  moudleTotal: 0,
  isfetchCurrentModuleInfo: false,
  currentModuleInfo: {},
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  moduleTreeData: (state) => {
    return state.moduleTreeData
  },
  moduleList: (state) => {
    return state.moduleList
  },
  isfetchModuleList: (state) => {
    return state.isfetchModuleList
  },
  currentModuleInfo: (state) => {
    return state.currentModuleInfo
  },
  moudleTotal: (state) => {
    return state.moudleTotal
  }
}

function changeData (list) {
  return list.map(every => {
    every.isLeaf = every.isLeaf ? true : false
    if (every.hasChildren) {
      every.children = changeData(every.children)
    } else {
      delete every.children
    }
    return every
  })
}

// mutations
const mutations = {
  startFetchModuleTreeData (state) {
    state.isfetchModuleTreeData = true
  },
  stopFetchModuleTreeData (state) {
    state.isfetchModuleTreeData = false
  },
  setModuleTreeData (state, data) {
    let result = [{
      key: 'TOP',
      title: '全部模块',
      hasChildren: true,
      children: data ? JSON.parse(data.replace(/"value"/g, "\"key\"").replace(/"text"/g, "\"title\"").replace(/"childNodes"/g, "\"children\"")) : []
    }]
    state.moduleTreeData = changeData(result)
  },
  startFetchModuleList (state) {
    state.isfetchModuleList = true
  },
  stopFetchModuleList (state) {
    state.isfetchModuleList = false
  },
  setModuleList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.isPage = item.is_page === 1
      item.categoryName = item.category === 1 ? 'PC' : item.category === 2 ? 'APP' :
        item.category === 3 ? 'Wechat' : '-'
      return item
    })
    state.moduleList = list
  },
  setModuleToal (state, total) {
    state.moudleTotal = total
  },
  startFetchCurrentModuleInfo (state) {
    state.isfetchCurrentModuleInfo = true
  },
  stopFetchCurrentModuleInfo (state) {
    state.isfetchCurrentModuleInfo = false
  },
  setCurrentModuleInfo (state, info) {
    state.currentModuleInfo = info
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchModuleTreeData = false
    state.isfetchModuleList = false
    state.isfetchCurrentModuleInfo = false
  }
}

// actions
const actions = {
  fetchModuleTreeData ({ state, commit }, params) {
    if (state.isfetchModuleTreeData) return
    commit('startFetchModuleTreeData')
    getModuleTree(params).then(res => {
      commit('setModuleTreeData', res)
      commit('stopFetchModuleTreeData')
    }).catch(err => {
      commit('setModuleTreeData', [])
      commit('stopFetchModuleTreeData')
      Message.error(err.msg)
    })
  },
  fetchModuleList ({ state, commit }, params) {
    if (state.isfetchModuleList) return
    commit('startFetchModuleList')
    const data = {
      module_id: params.module_id,
      module_name: params.module_name,
      page_num: params.page_num,
      page_size: params.page_size,
    }
    getPageModuleList(data).then(res => {
      commit('setModuleList', res.rows)
      commit('setModuleToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchModuleList')
    }).catch(err => {
      commit('setModuleList', [])
      commit('setModuleToal', 0)
      commit('stopFetchModuleList')
      Message.error(err.msg)
    })
  },
  // fetchCurrentModuleInfo ({ state, commit }, params) {
  //   if (state.isfetchCurrentModuleInfo) return
  //   commit('startFetchCurrentModuleInfo')
  //   const data = { comp_id: params.comp_id }
  //   getModuleInfo(data).then(res => {
  //     commit('setCurrentModuleInfo', res)
  //     if (params.success) {
  //       params.success(res)
  //     }
  //     commit('stopFetchCurrentModuleInfo')
  //   }).catch(err => {
  //     commit('setCurrentModuleInfo', {})
  //     commit('stopFetchCurrentModuleInfo')
  //   })
  // }
}


export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}