import { service } from '@/js/request'

export function getList (data) {
  return service({
    url: '/api/pub/sys/list',
    method: 'post',
    data
  })
}

export function getPageList (data) {
  return service({
    url: '/api/pub/sys/pagelist',
    method: 'post',
    data
  })
}

export function addSystem (data) {
  return service({
    url: '/api/pub/sys/add',
    method: 'post',
    data
  })
}

export function editSystem (data) {
  return service({
    url: '/api/pub/sys/update',
    method: 'post',
    data
  })
}

export function deleteSystem (data) {
  return service({
    url: '/api/pub/sys/delete',
    method: 'post',
    data
  })
}