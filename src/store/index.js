import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from './logger/logger'

import common from './modules/common'
import userInfo from './modules/userInfo'

import system from './modules/employee/system'
import company from './modules/employee/company'
import area from './modules/employee/area'
import orgnization from './modules/employee/orgnization'
import role from './modules/employee/role'
import module from './modules/employee/module'
import auth from './modules/employee/auth'
import employee from './modules/employee/employee'
import user from './modules/employee/user'
import dictionary from './modules/employee/dictionary'
import seed from './modules/employee/seed'
import log from './modules/employee/log'

import client from './modules/wms/client'
import drug from './modules/wms/drug'
import site from './modules/wms/site'
import house from './modules/wms/house'
import box from './modules/wms/box'

import input from './modules/entry/input'
import allot from './modules/entry/allot'


Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const modules = {
  common,
  userInfo,
  system,
  company,
  area,
  orgnization,
  role,
  module,
  auth,
  employee,
  user,
  dictionary,
  seed,
  log,
  client,
  drug,
  site,
  house,
  box,
  input,
  allot
}

const mutations = {
  //刷新时重置所有module的fetching状态
  resetFetching (state) {
    for (let key in modules) {
      this.commit(`${key}/resetFetching`)
    }
  },
  //重置所有Vuex数据
  resetAllData (state) {
    for (let key in modules) {
      this.commit(`${key}/resetAllData`)
    }
  }
}

export default new Vuex.Store({
  modules,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
