const list = [];
for (let i = 0; i < 100; i++) {
  list.push({
    key: (i + 1).toString(),
    name: '测试药品',
    proKey: 'HR-CS-666',
    standard: '7片/盒',
    draBatch: '20200304',
    dragNumber: 'P3616',
    inNumber: 1,
    park: '盒',
    saveCondition: '遮光、密封、25℃以下',
    temperature: '15℃～25℃'
  });
}

const initialState = {
  list
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  list: (state) => {
    return state.list
  }
}

// mutations
const mutations = {
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