import request from '@/js/request'

export function login (data) {
  return request({
    url: '/user/login.do',
    method: 'post',
    data
  })
}

export function register (data) {
  return request({
    url: '/user/register.do',
    method: 'post',
    data
  })
}