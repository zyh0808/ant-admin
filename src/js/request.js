import axios from 'axios'
import store from '@/store'
import { SHA256 } from '@/js/crypt.js'

function randomString (len) {
  len = len || 16;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

// create an axios instance
export const service = axios.create({
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    let token = store.getters['userInfo/token'] ? store.getters['userInfo/token'] : ''
    let user_id = store.getters['userInfo/user_id'] ? store.getters['userInfo/user_id'] : ''
    let timestamp = ((new Date()).getTime() / 1000).toFixed()
    let nonce = randomString(16)
    let sign = SHA256(timestamp + token + nonce + timestamp)

    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    config.headers['x-ce-appid'] = 'CE16801'
    if (user_id) {
      config.headers['x-ce-userid'] = user_id
    }
    if (token) {
      config.headers['x-ce-token'] = token
    }
    config.headers['x-ce-timestamp'] = timestamp
    config.headers['x-ce-nonce'] = nonce
    config.headers['x-ce-sign'] = sign
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
    //对接口返回结果判断
    if (res && res.code !== 10000) {
      return Promise.reject({ msg: res.msg })
    } else if (res && res.sub_code !== 10000) {
      return Promise.reject({ msg: res.sub_msg, data: res.biz_data, code: res.sub_code })
    } else if (res && res.biz_data) {
      return Promise.resolve(res.biz_data);
    } else if (res && res.sub_msg) {
      return Promise.reject({ msg: res.sub_msg, data: res.biz_data, code: res.sub_code })
    } else {
      return Promise.reject({ msg: '获取数据发生错误' })
    }
  },
  error => {
    return Promise.reject({ msg: error.toString() })
  }
)

// create an axios instance
export const jsonService = axios.create({
  timeout: 5000 // request timeout
})

// request interceptor
jsonService.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
jsonService.interceptors.response.use(
  response => {
    // console.log(response)
    return Promise.resolve(response.data);
  },
  error => {
    return Promise.reject({ msg: error.toString() })
  }
)
// export default service
