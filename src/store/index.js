import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from './logger/logger'
import menu from './modules/menu'
import user from './modules/user'
import list from './modules/list'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    menu,
    user,
    list
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
