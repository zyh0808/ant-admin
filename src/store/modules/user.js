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
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                commit('setToken', data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
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