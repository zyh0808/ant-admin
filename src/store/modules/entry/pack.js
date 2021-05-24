const packList = [
  {
    order_time: '2021-02-23',
    order_no: 'ZX2021041500001',
    status: '待装箱',
    packer_id: '1001',
    packer_name: '李四',
    drug_name: '阿司匹林',
    drug_batch: 'ASPL001001',
    house: '长沙#1仓库',
    client_name: '长沙申办方',
    pro_name: '肺炎专药',
    drug_count: 10000
  },
  {
    order_time: '2021-02-23',
    order_no: 'ZX2021041500002',
    status: '待审核',
    packer_id: '1001',
    packer_name: '李四',
    drug_name: '阿司匹林',
    drug_batch: 'ASPL001002',
    house: '长沙#1仓库',
    client_name: '长沙申办方',
    pro_name: '肺炎专药',
    drug_count: 1000
  }
]
const upList = [
  {
    order_time: '2021-02-23',
    order_no: 'ZX2021041500001',
    status: '待上架',
    packer_id: '1001',
    packer_name: '李四',
    drug_name: '阿司匹林',
    drug_batch: 'ASPL001001',
    house: '长沙#1仓库',
    client_name: '长沙申办方',
    pro_name: '肺炎专药',
    drug_count: 10000
  },
  {
    order_time: '2021-02-23',
    order_no: 'ZX2021041500002',
    status: '已上架',
    packer_id: '1001',
    packer_name: '李四',
    drug_name: '阿司匹林',
    drug_batch: 'ASPL001002',
    house: '长沙#1仓库',
    client_name: '长沙申办方',
    pro_name: '肺炎专药',
    drug_count: 1000
  }
]
const packInfo = {
  pack_count: 5,
  status: '待装箱',
  drug_name: '阿司匹林',
  drug_batch: 'ASPL001001',
  spec: '盒',
  packers: ['张三', '李四', '王五']
}

const boxList = [
  {
    box_no: '药品箱A001',
    drug_count: 20,
    drug_codes: 'code001、code002、code003'
  }
]
const packBoxDetailList = [
  {
    box_no: '药品箱A001',
    drug_count: 20,
    drug_codes: 'code001、code002、code003',
    box_status: 0
  }
]
const upBoxDetailList = [
  {
    box_no: '药品箱A001',
    cell_code: 'BJ01010010101'
  }
]
const codeList = [
  {
    key: '001',
    drug_code: 'code001'
  },
  {
    key: '002',
    drug_code: 'code002'
  },
  {
    key: '003',
    drug_code: 'code003'
  },
  {
    key: '004',
    drug_code: 'code004'
  }
]

const initialState = {
  packList,
  packInfo,
  boxList,
  codeList,
  upList,
  packBoxDetailList,
  upBoxDetailList
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  packList: (state) => {
    return state.packList
  },
  packInfo: (state) => {
    return state.packInfo
  },
  boxList: (state) => {
    return state.boxList
  },
  codeList: (state) => {
    return state.codeList
  },
  upList: (state) => {
    return state.upList
  },
  packBoxDetailList: (state) => {
    return state.packBoxDetailList
  },
  upBoxDetailList: (state) => {
    return state.upBoxDetailList
  }
}

// mutations
const mutations = {
  addCodeList (state, list) {
    state.codeList.push(list)
  },
  deleteCode (state, index) {
    state.codeList.splice(index, 1)
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
  }
}

// actions
const actions = {
}


export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}