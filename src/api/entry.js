import { service } from '@/js/request'

// let API = 'http://192.168.0.103:16800'
let API = ''
if (process.env.NODE_ENV === "production") {
  API = 'http://123.57.86.56:16800'
}

// export function getClientList (data) {
//   return service({
//     url: API + '/api/wms/clientinfo/list',
//     method: 'post',
//     data
//   })
// }