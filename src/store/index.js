import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from './logger/logger'

import common from './modules/common'
import userInfo from './modules/userInfo'
import systemInfo from './modules/employee/systemInfo'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common,
    userInfo,
    systemInfo
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
