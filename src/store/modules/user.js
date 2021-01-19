import { login } from '@/api/user.js'
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
    setToken(state, token) {
        state.token = token
    }
}

// actions
const actions = {
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        login({ username: username.trim(), password: password }).then(response => {
            console.log(response)
            // const { data } = response
            // commit('setToken', data.token)
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