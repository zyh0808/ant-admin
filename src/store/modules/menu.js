import { myMenu } from "@/js/menu.js"
const initialState = {
    tabs: [
        { key: "home", title: '首页', icon: 'windows', closable: false }
    ],
    activeName: 'home'
}

const state = () => ({
    ...initialState
})

// getters
const getters = {
    tabs: (state) => {
        return state.tabs
    },
    activeName: (state) => {
        return state.activeName
    }
}

// mutations
const mutations = {
    addTab (state, tab) {
        state.tabs.push(tab)
    },
    switchTab (state, index) {
        state.activeName = index
    },
    changeTabs (state, tabs) {
        state.tabs = tabs
    }
}

// actions
const actions = {
    clickMenuItem ({ commit, state }, index) {
        const tab = state.tabs.find(item => item.key === index)
        if (tab) {
            commit("switchTab", tab.key)
            return
        } else {
            let menu = myMenu.find(it => it.key === index)
            if (!menu) {
                menu = myMenu.map(a => a.children).flat().find(it => it.key === index)
            }
            const newTab = {
                key: menu.key,
                title: menu.name,
                closable: true,
                icon: 'apple'
            }
            commit("addTab", newTab)
            commit("switchTab", menu.key)
        }
    }
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}