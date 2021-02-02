import { login, register } from '@/api/user.js'
import { Message } from 'ant-design-vue'
const initialState = {
    token: ''
}

const state = () => ({
    ...initialState
})

// getters
const getters = {
    token: (state) => {
        return state.token
    }
}

// mutations
const mutations = {
    setToken (state, token) {
        state.token = token
    }
}

// actions
const actions = {
    login ({ commit }, loginInfo) {
        const { username, password } = loginInfo
        login({ username: username, password: password }).then(response => {
            console.log(response)
            // const { data } = response
            // commit('setToken', data.token)
        }).catch(error => {
            Message.error(error.msg)
        })
    },
    register ({ commit }, registerInfo) {
        const { username, password, passwordConfirm, email, phone, question = '问题', answer = '答案' } = registerInfo
        register({
            username: username,
            password: password,
            passwordConfirm: passwordConfirm,
            email: email,
            phone: phone,
            question: question,
            answer: answer
        }).then(response => {
            console.log(response)
            Message.error('注册成功，请前往登录！')
        }).catch(error => {
            Message.error(error.msg)
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