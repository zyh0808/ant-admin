import { service, jsonService } from '@/js/request'

export function login (data) {
  return service({
    url: '/api/pub/user/check_login',
    method: 'post',
    data
  })
}

export function user_auth (data) {
  return service({
    url: '/api/pub/user/user_auth',
    method: 'post',
    data
  })
}

export function userAuth () {
  return jsonService({
    url: './json/auth.json',
    method: 'get'
  })
}

export function logout (data) {
  return service({
    url: '/api/pub/user/logout',
    method: 'post',
    data
  })
}