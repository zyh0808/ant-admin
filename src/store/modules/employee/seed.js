import { getSeedPageList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchSeedPageList: false,
  seedPageList: [],
  seedTotal: 0
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  seedPageList: (state) => {
    return state.seedPageList
  },
  seedTotal: (state) => {
    return state.seedTotal
  },
  isfetchSeedPageList: (state) => {
    return state.isfetchSeedPageList
  }
}

// mutations
const mutations = {
  startFetchSeedPageList (state) {
    state.isfetchSeedPageList = true
  },
  stopFetchSeedPageList (state) {
    state.isfetchSeedPageList = false
  },
  setSeedPageList (state, list) {
    list = list.map(item => {
      item.isDayUpdate = item.is_day_update === 0
      return item
    })
    state.seedPageList = list
  },
  setSeedToal (state, total) {
    state.seedTotal = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchSeedPageList = false
  }
}

// actions
const actions = {
  fetchSeedPageList ({ state, commit }, params) {
    if (state.isfetchSeedPageList) return
    commit('startFetchSeedPageList')
    const data = {
      code_key: params.code_key,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getSeedPageList(data).then(res => {
      commit('setSeedPageList', res.rows)
      commit('setSeedToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchSeedPageList')
    }).catch(err => {
      commit('setSeedPageList', [])
      commit('setSeedToal', 0)
      commit('stopFetchSeedPageList')
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