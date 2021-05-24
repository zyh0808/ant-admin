import { getUnselectPageAuth, getSelectPageAuth, getUnselectUserAuth, getSelectUserAuth, getAuthPageList, getUnselectRoleAuth, getSelectRoleAuth, getAllAuthTree } from '@/api/system.js'
import { Message } from 'ant-design-vue'

let keyList = []

const initialState = {
  isfetchUnselectPageAuth: false,
  unselectPageAuth: [],
  isfetchSelectPageAuth: false,
  selectPageAuth: [],
  isfetchUnselectUserAuth: false,
  unselectUserAuth: [],
  isfetchSelectUserAuth: false,
  selectUserAuth: [],
  isfetchUnselectRoleAuth: false,
  unselectRoleAuth: [],
  isfetchSelectRoleAuth: false,
  selectRoleAuth: [],
  isfetchAllAuth: false,
  allAuth: [],

  authPageList: [],
  isfetchAuthPageList: false,
  authTotal: 0
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  unselectPageAuth: (state) => {
    return state.unselectPageAuth
  },
  selectPageAuth: (state) => {
    return state.selectPageAuth
  },
  unselectUserAuth: (state) => {
    return state.unselectUserAuth
  },
  selectUserAuth: (state) => {
    return state.selectUserAuth
  },
  unselectRoleAuth: (state) => {
    return state.unselectRoleAuth
  },
  selectRoleAuth: (state) => {
    return state.selectRoleAuth
  },
  allAuth: (state) => {
    return state.allAuth
  },
  authPageList: (state) => {
    return state.authPageList
  },
  isfetchAuthPageList: (state) => {
    return state.isfetchAuthPageList
  },
  authTotal: (state) => {
    return state.authTotal
  }
}

// mutations
const mutations = {
  startFetchUnselectPageAuth (state) {
    state.isfetchUnselectPageAuth = true
  },
  stopFetchUnselectPageAuth (state) {
    state.isfetchUnselectPageAuth = false
  },
  setUnselectPageAuth (state, data) {
    state.unselectPageAuth = handleTreeData(data)
  },
  startFetchSelectPageAuth (state) {
    state.isfetchSelectPageAuth = true
  },
  stopFetchSelectPageAuth (state) {
    state.isfetchSelectPageAuth = false
  },
  setSelectPageAuth (state, data) {
    state.selectPageAuth = handleTreeData(data)
  },

  startFetchUnselectUserAuth (state) {
    state.isfetchUnselectUserAuth = true
  },
  stopFetchUnselectUserAuth (state) {
    state.isfetchUnselectUserAuth = false
  },
  setUnselectUserAuth (state, data) {
    state.unselectUserAuth = handleTreeData(data)
  },
  startFetchSelectUserAuth (state) {
    state.isfetchSelectUserAuth = true
  },
  stopFetchSelectUserAuth (state) {
    state.isfetchSelectUserAuth = false
  },
  setSelectUserAuth (state, data) {
    state.selectUserAuth = handleTreeData(data)
  },

  startFetchUnselectRoleAuth (state) {
    state.isfetchUnselectRoleAuth = true
  },
  stopFetchUnselectRoleAuth (state) {
    state.isfetchUnselectRoleAuth = false
  },
  setUnselectRoleAuth (state, data) {
    state.unselectRoleAuth = handleTreeData(data)
  },
  startFetchSelectRoleAuth (state) {
    state.isfetchSelectRoleAuth = true
  },
  stopFetchSelectRoleAuth (state) {
    state.isfetchSelectRoleAuth = false
  },
  setSelectRoleAuth (state, data) {
    state.selectRoleAuth = handleTreeData(data)
    // keyList = []
    // state.selectRoleAuth = getRoleAuthKeyList(data)
    // state.allAuth = filterSelectedItems(state.allAuth, state.selectRoleAuth)
  },
  startFetchAllAuth (state) {
    state.isfetchAllAuth = true
  },
  stopFetchAllAuth (state) {
    state.isfetchAllAuth = false
  },
  setAllAuth (state, data) {
    state.allAuth = handleTreeData(data)
    // const allAuth = handleTreeData(data)
    // state.allAuth = filterSelectedItems(allAuth, state.selectRoleAuth)
  },

  startFetchAuthPageList (state) {
    state.isfetchAuthPageList = true
  },
  stopFetchAuthPageList (state) {
    state.isfetchAuthPageList = false
  },
  setAuthPageList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      return item
    })
    state.authPageList = list
  },
  setAuthTotal (state, total) {
    state.authTotal = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchUnselectPageAuth = false
    state.isfetchSelectPageAuth = false
    state.isfetchUnselectUserAuth = false
    state.isfetchSelectUserAuth = false
    state.isfetchUnselectRoleAuth = false
    state.isfetchSelectRoleAuth = false
    state.isfetchAllAuth = false
    state.isfetchAuthPageList = false
  }
}

// function filterSelectedItems (data, items) {
//   return data.length > 0 ? data.map((item, index) => {
//     let list = {}
//     if (!item.children) {//最底层
//       items.forEach(key => {
//         if (key === item.key) {
//           return null
//         }
//       })
//       return item
//     } else {
//       list = filterSelectedItems(item.children, items)
//     }
//     return list
//   }) : []
// }

function getRoleAuthKeyList (data) {
  data.length > 0 && data.forEach(item => {
    if (!item.auth_id && item.items) {
      getRoleAuthKeyList(item.items)
    }
    if (item.auth_id) {
      keyList.push(item.auth_id)
    }
  })
  return keyList
}

function handleTreeData (data, key = '') {
  return data.length > 0 ? data.map((item, index) => {
    let temp = {}
    if (item.auth_id) {//最底层
      temp['key'] = item.auth_id
      temp['title'] = item.auth_name
    } else {
      temp['key'] = key === '' ? index + key : key + '-' + index
      temp['title'] = item.sys_name || item.category_desc || item.auth_name || item.group_code || ''
    }
    if (item.items) {
      temp['children'] = handleTreeData(item.items, temp.key)
    }
    return temp
  }) : []
}

// actions
const actions = {
  fetchUnselectPageAuth ({ state, commit }, params) {
    if (state.isfetchUnselectPageAuth) return
    commit('startFetchUnselectPageAuth')
    getUnselectPageAuth(params).then(res => {
      commit('setUnselectPageAuth', res)
      commit('stopFetchUnselectPageAuth')
    }).catch(err => {
      commit('setUnselectPageAuth', [])
      commit('stopFetchUnselectPageAuth')
      Message.error(err.msg)
    })
  },
  fetchSelectPageAuth ({ state, commit }, params) {
    if (state.isfetchSelectPageAuth) return
    commit('startFetchSelectPageAuth')
    getSelectPageAuth(params).then(res => {
      commit('setSelectPageAuth', res)
      commit('stopFetchSelectPageAuth')
    }).catch(err => {
      commit('setSelectPageAuth', [])
      commit('stopFetchSelectPageAuth')
      Message.error(err.msg)
    })
  },
  fetchUnselectUserAuth ({ state, commit }, params) {
    if (state.isfetchUnselectUserAuth) return
    commit('startFetchUnselectUserAuth')
    getUnselectUserAuth(params).then(res => {
      commit('setUnselectUserAuth', res)
      commit('stopFetchUnselectUserAuth')
    }).catch(err => {
      commit('setUnselectUserAuth', [])
      commit('stopFetchUnselectUserAuth')
      Message.error(err.msg)
    })
  },
  fetchSelectUserAuth ({ state, commit }, params) {
    if (state.isfetchSelectUserAuth) return
    commit('startFetchSelectUserAuth')
    getSelectUserAuth(params).then(res => {
      commit('setSelectUserAuth', res)
      commit('stopFetchSelectUserAuth')
    }).catch(err => {
      commit('setSelectUserAuth', [])
      commit('stopFetchSelectUserAuth')
      Message.error(err.msg)
    })
  },
  fetchUnselectRoleAuth ({ state, commit }, params) {
    if (state.isfetchUnselectRoleAuth) return
    commit('startFetchUnselectRoleAuth')
    getUnselectRoleAuth(params).then(res => {
      commit('setUnselectRoleAuth', res)
      commit('stopFetchUnselectRoleAuth')
    }).catch(err => {
      commit('setUnselectRoleAuth', [])
      commit('stopFetchUnselectRoleAuth')
      Message.error(err.msg)
    })
  },
  fetchSelectRoleAuth ({ state, commit }, params) {
    if (state.isfetchSelectRoleAuth) return
    commit('startFetchSelectRoleAuth')
    getSelectRoleAuth(params).then(res => {
      commit('setSelectRoleAuth', res)
      commit('stopFetchSelectRoleAuth')
    }).catch(err => {
      commit('setSelectRoleAuth', [])
      commit('stopFetchSelectRoleAuth')
      Message.error(err.msg)
    })
  },
  fetchAllAuth ({ state, commit }, params) {
    if (state.isfetchAllAuth) return
    commit('startFetchAllAuth')
    getAllAuthTree(params).then(res => {
      commit('setAllAuth', res)
      commit('stopFetchAllAuth')
    }).catch(err => {
      commit('setAllAuth', [])
      commit('stopFetchAllAuth')
      Message.error(err.msg)
    })
  },
  fetchAuthPageList ({ state, commit }, params) {
    if (state.isfetchAuthPageList) return
    commit('startFetchAuthPageList')
    const data = {
      condition: params.condition,
      keyword: params.keyword,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getAuthPageList(data).then(res => {
      commit('setAuthPageList', res.rows)
      commit('setAuthTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchAuthPageList')
    }).catch(err => {
      commit('setAuthPageList', [])
      commit('setAuthTotal', 0)
      commit('stopFetchAuthPageList')
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