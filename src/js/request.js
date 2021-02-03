import axios from 'axios'
import store from '@/store'

// create an axios instance
const service = axios.create({
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    console.log(config)
    // do something before request is sent
    if (store.getters.token) {
      config.headers['X-Token'] = store.getters.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    return Promise.resolve(res)

    //对接口返回结果判断
    // if (res.status !== 0) {
    //   if (res.status === 10) {//未登录
    //     //to re-login
    //   }
    //   return Promise.reject({ msg: res.msg })
    // } else {
    //   // return res
    //   return Promise.resolve(res)
    // }
  },
  error => {
    return Promise.reject({ msg: error.toString() })
  }
)

export default service
