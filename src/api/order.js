import { service } from '@/js/request'

// let API = 'http://192.168.0.110:16800'
let API = ''
if (process.env.NODE_ENV === "test") {
  API = 'http://123.57.86.56:16800'
}

export function getOrderList (data) {
  return service({
    url: API + '/api/piw/drug_in_audit/pagelist',
    method: 'post',
    data
  })
}

export function getOrderInfo (data) {
  return service({
    url: API + '/api/piw/drug_in_audit/get',
    method: 'post',
    data
  })
}

export function getCodeList (data) {
  return service({
    url: API + '/api/piw/drug_in_audit/getdrugcodelist',
    method: 'post',
    data
  })
}

//http://192.168.0.101:16800
export function checkPass (data) {
  return service({
    url: API + '/api/piw/drug_in_audit/audit',
    method: 'post',
    data
  })
}

export function getPackUpList (data) {
  return service({
    url: API + '/api/piw/taskallocation/list',
    method: 'post',
    data
  })
}

export function getPackUpInfo (data) {
  return service({
    url: API + '/api/piw/taskallocation/get',
    method: 'post',
    data
  })
}

export function importOrderFile (data) {
  return service({
    url: API + '/api/piwhr/hr_drug_import/import',
    method: 'post',
    data
  })
}

export function addDrugOrder (data) {
  return service({
    url: API + '/api/piwhr/hr_drug_in/add',
    method: 'post',
    data
  })
}

export function receiveSave (data) {
  return service({
    url: API + '/api/piw/drug_in_receive/save',
    method: 'post',
    data
  })
}

export function orderReceive (data) {
  return service({
    url: API + '/api/piw/drug_in_receive/receive',
    method: 'post',
    data
  })
}

export function packUpAllot (data) {
  return service({
    url: API + '/api/piw/taskallocation/update',
    method: 'post',
    data
  })
}

export function getPackList (data) {
  return service({
    url: API + '/api/piw/packing_task/list',
    method: 'post',
    data
  })
}

export function getUpList (data) {
  return service({
    url: API + '/api/piw/onshelf_task/list',
    method: 'post',
    data
  })
}

export function getOrderReceiveInfo (data) {
  return service({
    url: API + '/api/piw/drug_in_receive/get',
    // url: API + '/api/piw/drug_in_receive/getreceive',
    method: 'post',
    data
  })
}

export function getPackInfo (data) {
  return service({
    url: API + '/api/piw/packing_task/get',
    method: 'post',
    data
  })
}

export function getUpInfo (data) {
  return service({
    url: API + '/api/piw/onshelf_task/get',
    method: 'post',
    data
  })
}

export function taskPack (data) {
  return service({
    url: API + '/api/piw/packing_task/update',
    method: 'post',
    data
  })
}


