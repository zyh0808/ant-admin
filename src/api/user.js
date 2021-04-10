import { service } from '@/js/request'

// let API = 'http://192.168.0.103:16800'
let API = ''
if (process.env.NODE_ENV === "production") {
  API = 'http://123.57.86.56:16800'
}

export function login (data) {
  return service({
    url: API + '/api/pub/user/check_login',
    method: 'post',
    data
  })
}

export function user_auth (data) {
  return service({
    url: API + '/api/pub/user/user_auth',
    method: 'post',
    data
  })
}

export function logout (data) {
  return service({
    url: API + '/api/pub/user/logout',
    method: 'post',
    data
  })
}

export function editPsw (data) {
  return service({
    url: API + '/api/pub/user/change_password',
    method: 'post',
    data
  })
}