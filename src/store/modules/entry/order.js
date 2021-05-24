import { getOrderList, getCodeList, getOrderInfo, getOrderReceiveInfo } from '@/api/order'
import { Message } from 'ant-design-vue'
import moment from 'moment'

const initialState = {
  isFetchOrderList: false,
  orderList: [],
  orderListTotal: 0,

  isFetchOrderInfo: false,
  orderInfo: {},

  isFecthCodeList: false,
  codeList: [],
  orderStatus: [
    {
      index: 1,
      name: '待审核'
    },
    {
      index: 2,
      name: '待收货'
    },
    {
      index: 4,
      name: '待确认'
    },
    {
      index: 5,
      name: '已收货'
    }
  ],
  currentStatus: 1,
  orderDrugList: []
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  isFetchOrderList: (state) => {
    return state.isFetchOrderList
  },
  orderList: (state) => {
    return state.orderList
  },
  orderListTotal: (state) => {
    return state.orderListTotal
  },
  orderInfo: (state) => {
    return state.orderInfo
  },
  isFecthCodeList: (state) => {
    return state.isFecthCodeList
  },
  codeList: (state) => {
    return state.codeList
  },
  orderStatus: (state) => {
    return state.orderStatus
  },
  currentStatus: (state) => {
    return state.currentStatus
  },
  orderDrugList: (state) => {
    return state.orderDrugList
  }
}

// mutations
const mutations = {
  startFetchOrderList (state) {
    state.isFetchOrderList = true
  },
  stopFetchOrderList (state) {
    state.isFetchOrderList = false
  },
  setOrderList (state, list) {
    list.map(item => {
      item.drugInDetails = item.drugInDetails.map(drug => {
        if (drug.op_type === 0) {
          drug.op_type_desc = '非编盲药'
        } else {
          drug.op_type_desc = '编盲药'
        }
        return drug
      })
      item.in_ts = moment(item.in_ts * 1000).format('YYYY-MM-DD HH:mm:ss')
      return item
    })
    state.orderList = list
  },
  setOrderListTotal (state, total) {
    state.orderListTotal = total
  },
  startFetchOrderInfo (state) {
    state.isFetchOrderInfo = true
  },
  stopFetchOrderInfo (state) {
    state.isFetchOrderInfo = false
  },
  setOrderInfo (state, info) {
    state.orderInfo = info
  },
  startFetchCodeList (state) {
    state.isFetchCodeList = true
  },
  stopFetchCodeList (state) {
    state.isFetchCodeList = false
  },
  setCodeList (state, list) {
    state.codeList = list
  },
  setCurrentStatus (state, status) {
    state.currentStatus = status
  },
  setOrderDrugList (state, list) {
    state.orderDrugList = list
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isFetchOrderList = false
  }
}

// actions
const actions = {
  fetchOrderList ({ commit }, params) {
    if (state.isFetchOrderList) return
    commit('startFetchOrderList')
    const data = {
      drug_in_no: params.drug_in_no,
      proj_no: params.proj_no,
      drug_name: params.drug_name,
      house_id: params.house_id,
      status: params.status,
      start_create_time: params.start_create_time,
      end_create_time: params.end_create_time,
      page_num: params.page_num,
      page_size: params.page_size
    }
    console.log(JSON.stringify(data))
    getOrderList(data).then(res => {
      commit('setOrderList', res.rows)
      commit('setOrderListTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchOrderList')
    }).catch(err => {
      commit('setOrderList', [])
      commit('setOrderListTotal', 0)
      commit('stopFetchOrderList')
      Message.error(err.msg)
    })
  },
  fetchOrderInfo ({ commit }, params) {
    if (state.isFetchOrderInfo) return
    commit('startFetchOrderInfo')
    getOrderInfo(params).then(res => {
      commit('setOrderInfo', res)
      commit('setOrderDrugList', res.drugInDetails)
      commit('stopFetchOrderInfo')
    }).catch(err => {
      commit('setOrderInfo', {})
      commit('setOrderDrugList', [])
      commit('stopFetchOrderInfo')
      Message.error(err.msg)
    })
  },
  fetchOrderReceiveInfo ({ commit }, params) {
    if (state.isFetchOrderInfo) return
    commit('startFetchOrderInfo')
    getOrderReceiveInfo(params).then(res => {
      commit('setOrderInfo', res)
      commit('setOrderDrugList', res.drugInDetails)
      commit('stopFetchOrderInfo')
    }).catch(err => {
      commit('setOrderInfo', {})
      commit('setOrderDrugList', [])
      commit('stopFetchOrderInfo')
      Message.error(err.msg)
    })
  },
  fetchCodeList ({ commit }, params) {
    if (state.isFetchCodeList) return
    commit('startFetchCodeList')
    getCodeList(params).then(res => {
      commit('setCodeList', res)
      commit('stopFetchCodeList')
    }).catch(err => {
      commit('stopFetchCodeList')
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