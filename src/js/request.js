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
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    let token = store.getters['userInfo/token'] ? store.getters['userInfo/token'] : ''
    let user_id = store.getters['userInfo/user_id'] ? store.getters['userInfo/user_id'] : ''
    let timestamp = ((new Date()).getTime() / 1000).toFixed()
    let nonce = randomString(16)
    let sign = SHA256(timestamp + token + nonce + timestamp)
    if (config.url === '/api/piw/hr_drug_import/import') {
      config.headers['Content-Type'] = 'multipart/form-data;charset=utf-8'
    } else {
      config.headers['Content-Type'] = 'application/json;charset=utf-8'
    }
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
    // console.log(response)
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


// const doRequest = (url, data, method, userType, header, type = 0) => new Promise((resolve, reject) => {
//   let userid = header.userid ? header.userid : "";
//   let token = store.getters['userInfo/token'] ? store.getters['userInfo/token'] : ''
//   let user_id = store.getters['userInfo/user_id'] ? store.getters['userInfo/user_id'] : ''
//   let timestamp = ((new Date()).getTime() / 1000).toFixed()
//   let nonce = randomString(16)
//   let sign = SHA256(timestamp + token + nonce + timestamp)
//   let addHeader = {
//     "Content-Type": 'application/json;charset=utf-8',
//     "x-ce-appid": 'CE16801',
//     // "x-tif-userid": userid,
//     "x-tif-loginUserid": loginUserid,
//     "x-tif-token": token,
//     "x-tif-timestamp": timestamp,
//     "x-tif-nonce": nonce,
//     "x-tif-sign": sign,
//   }
//   // if (type === 1) {
//   //   addHeader = {}
//   // }
//   axios({
//     method,
//     url,
//     params: method === 'get' && data ? data : {},
//     data: method === 'post' && data ? data : {},
//     timeout: 30000,
//     headers: {
//       "Content-Type": "application/json",
//       ...addHeader,
//       ...header
//     }
//   })
//     .then(resp => {
//       let res = resp.data;
//       console.log(resp)
//       if (type === 1) {
//         resolve(res)
//         return
//       }
//       if (res && res.Code !== 10000) {
//         reject({ msg: res.Msg })
//       } else if (res && res.SubCode !== 10000) {
//         reject({ msg: res.SubMsg, data: res.Data, code: res.SubCode })
//       } else if (res && res.Data) {
//         resolve(res.Data);
//       } else if (res && res.SubMsg) {
//         reject({ msg: res.SubMsg, data: res.Data, code: res.SubCode })
//       } else {
//         reject({ msg: '获取数据发生错误' })
//       }
//     })
//     .catch(error => {
//       console.log(error)
//       if (error.toString() === 'Error: Network Error') {
//         reject({ msg: '网络连接失败' })
//       } else if (error.toString().indexOf('Error: timeout of') !== -1) {
//         reject({ msg: '网络连接超时' })
//       } else {
//         reject({ msg: error.toString() })
//       }
//     });
// })

// create an axios instance
export const jsonService = axios.create({
  timeout: 50000 // request timeout
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
