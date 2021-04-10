import { getLogPageList } from '@/api/system.js'
import moment from 'moment';
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchLogPageList: false,
  logPageList: [],
  logTotal: 0
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  logPageList: (state) => {
    return state.logPageList
  },
  logTotal: (state) => {
    return state.logTotal
  },
  isfetchLogPageList: (state) => {
    return state.isfetchLogPageList
  }
}

// mutations
const mutations = {
  startFetchLogPageList (state) {
    state.isfetchLogPageList = true
  },
  stopFetchLogPageList (state) {
    state.isfetchLogPageList = false
  },
  setLogPageList (state, list) {
    list = list.map(item => {
      item.create_time = moment.unix(item.create_time).format('YYYY-MM-DD')
      return item
    })
    state.logPageList = list
  },
  setLogToal (state, total) {
    state.logTotal = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchLogPageList = false
  }
}

// actions
const actions = {
  fetchLogPageList ({ state, commit }, params) {
    if (state.isfetchLogPageList) return
    commit('startFetchLogPageList')
    const data = {
      start_time: params.start_time,
      end_time: params.end_time,
      type_code: params.type_code,
      result_code: params.result_code,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getLogPageList(data).then(res => {
      commit('setLogPageList', res.rows)
      commit('setLogToal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchLogPageList')
    }).catch(err => {
      commit('setLogPageList', [])
      commit('setLogToal', 0)
      commit('stopFetchLogPageList')
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