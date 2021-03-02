// import { login, register } from '@/api/user.js'
// import { Message } from 'ant-design-vue'
const initialState = {
    userInfo: {
    },
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
        state.subModuleList = module.childrens
        state.currentSubModule.splice(0, 1, state.subModuleList[0].id)
        const pageAuth = state.pageAuthList.find(item => item.module_id === state.subModuleList[0].id)
        state.currentRouter = pageAuth.url_addr
        state.authList = pageAuth.auth_list
    },
    setCurrentSubModule (state, current) {
        state.currentSubModule = current
    },
    setCurrentRouter (state, current) {
        state.currentSubModule = current
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
    }
}

// actions
const actions = {
    // login ({ commit }, loginInfo) {
    //     const { username, password } = loginInfo
    //     login({ username: username, password: password }).then(response => {
    //         // const { data } = response
    //         // commit('setToken', data.token)
    //     }).catch(error => {
    //         Message.error(error.msg)
    //     })
    // },
    // register ({ commit }, registerInfo) {
    //     const { username, password, passwordConfirm, email, phone, question = '问题', answer = '答案' } = registerInfo
    //     register({
    //         username: username,
    //         password: password,
    //         passwordConfirm: passwordConfirm,
    //         email: email,
    //         phone: phone,
    //         question: question,
    //         answer: answer
    //     }).then(response => {
    //         Message.error('注册成功，请前往登录！')
    //     }).catch(error => {
    //         Message.error(error.msg)
    //     })
    // }
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}