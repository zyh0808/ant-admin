const initialState = {
    userInfo: {},
    moduleList: [],
    currentModule: [],
    subModuleList: [],
    currentSubModule: [],
    pageAuthList: [],
    currentRouter: '',
    authList: [],
    authInfo: {}
}

const state = () => ({
    ...initialState
})

// getters
const getters = {
    token: (state) => {
        return state.userInfo.token
    },
    user_id: (state) => {
        return state.userInfo.user_id
    },
    moduleList: (state) => {
        return state.moduleList
    },
    currentModule: (state) => {
        return state.currentModule
    },
    subModuleList: (state) => {
        return state.subModuleList
    },
    currentSubModule: (state) => {
        return state.currentSubModule
    },
    pageAuthList: (state) => {
        return state.pageAuthList
    },
    currentRouter: (state) => {
        return state.currentRouter
    },
    authInfo: (state) => {
        return state.authInfo
    },
    authList: (state) => {
        return state.authList
    },
    userInfo: (state) => {
        return state.userInfo
    }
}

// mutations
const mutations = {
    setUserInfo (state, info) {
        state.userInfo = Object.assign({}, state.userInfo, info)
    },
    setModuleList (state, list) {
        state.moduleList = list
    },
    setCurrentModule (state, key) {
        state.currentModule = [key]
        const module = state.moduleList.find(item => item.id === key)
        state.subModuleList = module ? module.childrens : []
        state.currentSubModule = [state.subModuleList[0].id]
        state.currentRouter = state.subModuleList[0].url
        // state.currentSubModule.splice(0, 1, state.subModuleList[0].id)
        const pageAuth = state.pageAuthList.find(item => item.module_id === state.subModuleList[0].id)
        state.authList = pageAuth.auth_list
    },
    setCurrentSubModule (state, current) {
        state.currentSubModule = current
    },
    setCurrentRouter (state, current) {
        state.currentRouter = current
    },
    setAuthList (state, list) {
        state.authList = list
    },
    setPageAuthList (state, list) {
        state.pageAuthList = list
    },
    setAuthInfo (state) {
        const info = {
            editable: state.authList.some(item => {
                return item.auth_id === '100001'
            }),
            addable: state.authList.some(item => {
                return item.auth_id === '100000'
            })
        }
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