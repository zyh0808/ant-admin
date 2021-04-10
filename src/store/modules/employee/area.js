import { getProvinceList, getChildrenList, getAreaPageList } from '@/api/system.js'
import { Message } from 'ant-design-vue'
const initialState = {
  isfetchProvinceList: false,
  provinceList: [],
  isfetchCityList: false,
  cityList: [],
  isfetchCountyList: false,
  countyList: [],
  isfetchTownList: false,
  townList: [],
  isfetchVillageList: false,
  villageList: [],

  areaPageList: [],
  isfetchAreaPageList: false,
  total: 0
}

const state = () => ({
  ...initialState
})

// getters
const getters = {
  isfetchProvinceList: (state) => {
    return state.isfetchProvinceList
  },
  isfetchCityList: (state) => {
    return state.isfetchCityList
  },
  isfetchCountyList: (state) => {
    return state.isfetchCountyList
  },
  isfetchTownList: (state) => {
    return state.isfetchTownList
  },
  isfetchVillageList: (state) => {
    return state.isfetchVillageList
  },
  provinceList: (state) => {
    return state.provinceList
  },
  cityList: (state) => {
    return state.cityList
  },
  countyList: (state) => {
    return state.countyList
  },
  townList: (state) => {
    return state.townList
  },
  villageList: (state) => {
    return state.villageList
  },
  areaPageList: (state) => {
    return state.areaPageList
  },
  total: (state) => {
    return state.total
  },
  isfetchAreaPageList: (state) => {
    return state.isfetchAreaPageList
  }
}

// mutations
const mutations = {
  startFetchProvinceList (state) {
    state.isfetchProvinceList = true
  },
  stopFetchProvinceList (state) {
    state.isfetchProvinceList = false
  },
  setProvinceList (state, list) {
    state.provinceList = list
  },
  startFetchCityList (state) {
    state.isfetchCityList = true
  },
  stopFetchCityList (state) {
    state.isfetchCityList = false
  },
  setCityList (state, list) {
    state.cityList = list
  },
  startFetchCountyList (state) {
    state.isfetchCountyList = true
  },
  stopFetchCountyList (state) {
    state.isfetchCountyList = false
  },
  setCountyList (state, list) {
    state.countyList = list
  },
  startFetchTownList (state) {
    state.isfetchTownList = true
  },
  stopFetchTownList (state) {
    state.isfetchTownList = false
  },
  setTownList (state, list) {
    state.townList = list
  },
  startFetchVillageList (state) {
    state.isfetchVillageList = true
  },
  stopFetchVillageList (state) {
    state.isfetchVillageList = false
  },
  setVillageList (state, list) {
    state.villageList = list
  },
  setAreaTreeData (state, data) {
    data = data.map(item => {
      item['key'] = item.item_value
      item['title'] = item.item_name
      return item
    })
    let result = [{
      key: 'TOP',
      title: '全部区域',
      children: data
    }]
    state.areaTreeData = result
  },
  startFetchAreaPageList (state) {
    state.isfetchAreaPageList = true
  },
  stopFetchAreaPageList (state) {
    state.isfetchAreaPageList = false
  },
  setAreaPageList (state, list) {
    list = list.map(item => {
      item.validate = item.is_disabled === 0
      item.layerName = item.layer === 1 ? '省、直辖市' : item.layer === 2 ? '地级市' : item.layer === 3 ? '县区' : item.layer === 4 ? '乡、镇、街道办' : ''
      return item
    })
    state.areaPageList = list
  },
  setTotal (state, total) {
    state.total = total
  },
  resetAllData (state) {
    state = Object.assign(state, initialState)
  },
  resetFetching (state) {
    state.isfetchProvinceList = false
    state.isfetchCityList = false
    state.isfetchCountyList = false
    state.isfetchTownList = false
    state.isfetchVillageList = false
    state.isfetchAreaPageList = false
  }
}

// actions
const actions = {
  fetchProvinceList ({ state, commit }, params) {
    if (state.isfetchProvinceList) return
    commit('startFetchProvinceList')
    getProvinceList(params).then(res => {
      commit('setProvinceList', res)
      commit('stopFetchProvinceList')
    }).catch(err => {
      commit('setProvinceList', [])
      commit('stopFetchProvinceList')
      Message.error(err.msg)
    })
  },
  fetchCityList ({ state, commit }, province_id) {
    if (state.isfetchCityList) return
    commit('startFetchCityList')
    getChildrenList({ area_id: province_id }).then(res => {
      commit('setCityList', res)
      commit('stopFetchCityList')
    }).catch(err => {
      commit('setCityList', [])
      commit('stopFetchCityList')
      Message.error(err.msg)
    })
  },
  fetchCountyList ({ state, commit }, city_id) {
    if (state.isfetchCountyList) return
    commit('startFetchCountyList')
    getChildrenList({ area_id: city_id }).then(res => {
      commit('setCountyList', res)
      commit('stopFetchCountyList')
    }).catch(err => {
      commit('setCountyList', [])
      commit('stopFetchCountyList')
      Message.error(err.msg)
    })
  },
  fetchTownList ({ state, commit }, county_id) {
    if (state.isfetchTownList) return
    commit('startFetchTownList')
    getChildrenList({ area_id: county_id }).then(res => {
      commit('setTownList', res)
      commit('stopFetchTownList')
    }).catch(err => {
      commit('setTownList', [])
      commit('stopFetchTownList')
      Message.error(err.msg)
    })
  },
  fetchVillageList ({ state, commit }, town_id) {
    if (state.isfetchVillageList) return
    commit('startFetchVillageList')
    getChildrenList({ area_id: town_id }).then(res => {
      commit('setVillageList', res)
      commit('stopFetchVillageList')
    }).catch(err => {
      commit('setVillageList', [])
      commit('stopFetchVillageList')
      Message.error(err.msg)
    })
  },
  fetchAreaPageList ({ state, commit }, params) {
    if (state.isfetchAreaPageList) return
    commit('startFetchAreaPageList')
    const data = {
      area_id: params.area_id,
      area_name: params.area_name,
      page_num: params.page_num,
      page_size: params.page_size
    }
    getAreaPageList(data).then(res => {
      commit('setAreaPageList', res.rows)
      commit('setTotal', res.total)
      if (params.success) {
        params.success()
      }
      commit('stopFetchAreaPageList')
    }).catch(err => {
      commit('setAreaPageList', [])
      commit('setTotal', 0)
      commit('stopFetchAreaPageList')
      Message.error(err.msg)
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