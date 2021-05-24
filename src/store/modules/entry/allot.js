const pack_up_list = [
  {
    order_time: '2021-02-23',
    order_no: 'RI2021022300001',
    pack_status: '未分配',
    up_status: '未分配',
    house: '北京1号仓库',
    client_code: 'CS0001',
    client_name: '长沙代运公司',
    pay_count: '01002305',
    pro_no: 'HR-SPR-001',
    pro_name: '流感专药',
    drug_name: '阿司匹林',
    drug_batch: 'ASPL001001',
    spec: '0.5ml',
    drug_date: '2022-05',
    drug_count: 10000,
    receive_count: 9999,
    have_code: true,
    box_kind: '药品箱A',
    box_count: 5
  }
]
const order_info = {
  order_no: 'DT2021040300001',
  order_status: '已确认',
  house: '北京1号仓库',
  order_time: '2020-04-03'
}
const project_info = {
  client_code: 'BJ0001',
  client_name: '北京申办方一号',
  proj_no: 'HYJT-UYIJ',
  proj_name: '不知道叫什么项目名',
  proj_person: '王五',
  proj_phone: '13899999999',
  paid_account_id: 'ZF1029876'
}
const drug_info = {
  drug_name: '阿司匹林',
  spec: '0.5ml',
  pck_unit: '盒',
  op_type: 0,
  temp_range: '2~8℃',
  env: '常温',
  drug_batch: 'ASPL001001',
  drug_date: '2022-05',
  drug_count: 100,
  receive_count: 99,
  box_kind: '药品箱A',
  box_count: 5,
  apply_cells: ['BJ01010010101', 'BJ01010010102', 'BJ01010010103', 'BJ01010010104', 'BJ01010010105']
}
const pack_list = [
  {
    pack_id: '001',
    line_name: '一号流水线',
    operator_ids: ['1000', '1001', '1002'],
    operator_names: ['zzz', 'yyy', 'hhh']
  }
]
const up_list = [
  {
    up_id: '001',
    line_name: '一号流水线',
    operator_ids: ['1000'],
    operator_names: ['zzz']
  }
]
const getEmpList = () => {
  let list = []
  for (let i = 0; i < 10; i++) {
    const item = {
      key: i + '',
      title: 'code' + i,
      emp_name: 'name' + i,
      role: '业务员'
    }
    list.push(item)
  }
  return list
}

const initialState = {
  pack_up_list,
  drug_info,
  order_info,
  project_info,
  pack_list,
  up_list,
  emp_list: getEmpList()
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  pack_up_list: (state) => {
    return state.pack_up_list
  },
  drug_info: (state) => {
    return state.drug_info
  },
  order_info: (state) => {
    return state.order_info
  },
  pack_list: (state) => {
    return state.pack_list
  },
  up_list: (state) => {
    return state.up_list
  },
  emp_list: (state) => {
    return state.emp_list
  }
}

// mutations
const mutations = {
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