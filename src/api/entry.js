import { service } from '@/js/request'

let API = ''
if (process.env.NODE_ENV === "production") {
  API = 'http://123.57.86.56:16800'
}

export function testBigscreen (data) {
  return service({
    url: API + '/api',
    method: 'post',
    data
  })
}