import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from './logger/logger'
import menu from './modules/menu'
import user from './modules/user'
import drug from './modules/drug'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    menu,
    user,
    drug
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
