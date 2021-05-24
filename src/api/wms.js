import { service } from '@/js/request'

// let API = 'http://192.168.0.103:16800'
let API = ''
if (process.env.NODE_ENV === "test") {
  API = 'http://123.57.86.56:16800'
}

export function getClientList (data) {
  return service({
    url: API + '/api/wms/clientinfo/list',
    method: 'post',
    data
  })
}

export function addClient (data) {
  return service({
    url: API + '/api/wms/clientinfo/add',
    method: 'post',
    data
  })
}

export function editClient (data) {
  return service({
    url: API + '/api/wms/clientinfo/update',
    method: 'post',
    data
  })
}

export function deleteClient (data) {
  return service({
    url: API + '/api/wms/clientinfo/delete',
    method: 'post',
    data
  })
}

export function getClientInfo (data) {
  return service({
    url: API + '/api/wms/clientinfo/get',
    method: 'post',
    data
  })
}

export function getPayAccountList (data) {
  return service({
    url: API + '/api/wms/paid_account/list',
    method: 'post',
    data
  })
}

export function addPayAccount (data) {
  return service({
    url: API + '/api/wms/paid_account/add',
    method: 'post',
    data
  })
}

export function editPayAccount (data) {
  return service({
    url: API + '/api/wms/paid_account/update',
    method: 'post',
    data
  })
}

export function deletePayAccount (data) {
  return service({
    url: API + '/api/wms/paid_account/delete',
    method: 'post',
    data
  })
}

export function getProjectList (data) {
  return service({
    url: API + '/api/wms/projinfo/list',
    method: 'post',
    data
  })
}

export function addProject (data) {
  return service({
    url: API + '/api/wms/projinfo/add',
    method: 'post',
    data
  })
}

export function editProject (data) {
  return service({
    url: API + '/api/wms/projinfo/update',
    method: 'post',
    data
  })
}

export function deleteProject (data) {
  return service({
    url: API + '/api/wms/projinfo/delete',
    method: 'post',
    data
  })
}

export function getProjectInfo (data) {
  return service({
    url: API + '/api/wms/projinfo/get',
    method: 'post',
    data
  })
}

export function getProjectDrugList (data) {
  return service({
    url: API + '/api/wms/drug_proj_setting/list',
    method: 'post',
    data
  })
}

export function getDrugList (data) {
  return service({
    url: API + '/api/wms/druginfo/list',
    method: 'post',
    data
  })
}

//http://192.168.0.101:16800
export function addDrug (data) {
  return service({
    url: API + '/api/wms/druginfo/add',
    method: 'post',
    data
  })
}

export function editDrug (data) {
  return service({
    url: API + '/api/wms/druginfo/update',
    method: 'post',
    data
  })
}

export function deleteDrug (data) {
  return service({
    url: API + '/api/wms/druginfo/delete',
    method: 'post',
    data
  })
}

export function getDrugInfo (data) {
  return service({
    url: API + '/api/wms/druginfo/get',
    method: 'post',
    data
  })
}

export function getSiteList (data) {
  return service({
    url: API + '/api/wms/siteinfo/list',
    method: 'post',
    data
  })
}

export function addSite (data) {
  return service({
    url: API + '/api/wms/siteinfo/add',
    method: 'post',
    data
  })
}

export function editSite (data) {
  return service({
    url: API + '/api/wms/siteinfo/update',
    method: 'post',
    data
  })
}

export function deleteSite (data) {
  return service({
    url: API + '/api/wms/siteinfo/delete',
    method: 'post',
    data
  })
}

export function getProjectSiteList (data) {
  return service({
    url: API + '/api/wms/proj_site/list',
    method: 'post',
    data
  })
}

export function addProjectSite (data) {
  return service({
    url: API + '/api/wms/proj_site/add',
    method: 'post',
    data
  })
}

export function editProjectSite (data) {
  return service({
    url: API + '/api/wms/proj_site/update',
    method: 'post',
    data
  })
}

export function deleteProjectSite (data) {
  return service({
    url: API + '/api/wms/proj_site/delete',
    method: 'post',
    data
  })
}

export function addProjectDrug (data) {
  return service({
    url: API + '/api/wms/drug_proj_setting/add',
    method: 'post',
    data
  })
}

export function editProjectDrug (data) {
  return service({
    url: API + '/api/wms/drug_proj_setting/update',
    method: 'post',
    data
  })
}

export function deleteProjectDrug (data) {
  return service({
    url: API + '/api/wms/drug_proj_setting/delete',
    method: 'post',
    data
  })
}

export function getHousePageList (data) {
  return service({
    url: API + '/api/wms/house/pagelist',
    method: 'post',
    data
  })
}

export function addHouse (data) {
  return service({
    url: API + '/api/wms/house/add',
    method: 'post',
    data
  })
}

export function editHouse (data) {
  return service({
    url: API + '/api/wms/house/update',
    method: 'post',
    data
  })
}

export function deleteHouse (data) {
  return service({
    url: API + '/api/wms/house/delete',
    method: 'post',
    data
  })
}

export function getTempRangePageList (data) {
  return service({
    url: API + '/api/wms/temp_range/pagelist',
    method: 'post',
    data
  })
}

export function getTempRangeList (data) {
  return service({
    url: API + '/api/wms/temp_range/list',
    method: 'post',
    data
  })
}

export function addTempRange (data) {
  return service({
    url: API + '/api/wms/temp_range/add',
    method: 'post',
    data
  })
}

export function editTempRange (data) {
  return service({
    url: API + '/api/wms/temp_range/update',
    method: 'post',
    data
  })
}

export function deleteTempRange (data) {
  return service({
    url: API + '/api/wms/temp_range/delete',
    method: 'post',
    data
  })
}

export function getSetTempList (data) {
  return service({
    url: API + '/api/wms/house_temp/list',
    method: 'post',
    data
  })
}

export function getFloorList (data) {
  return service({
    url: API + '/api/wms/house_shelf/floor',
    method: 'post',
    data
  })
}

export function removeHouseTempRange (data) {
  return service({
    url: API + '/api/wms/house_temp/remove_member',
    method: 'post',
    data
  })
}

export function addHouseTempRange (data) {
  return service({
    url: API + '/api/wms/house_temp/add_member',
    method: 'post',
    data
  })
}

export function getShelfKindPageList (data) {
  return service({
    url: API + '/api/wms/shelf_kind/pagelist',
    method: 'post',
    data
  })
}

export function addShelfKind (data) {
  return service({
    url: API + '/api/wms/shelf_kind/add',
    method: 'post',
    data
  })
}

export function editShelfKind (data) {
  return service({
    url: API + '/api/wms/shelf_kind/update',
    method: 'post',
    data
  })
}

export function deleteShelfKind (data) {
  return service({
    url: API + '/api/wms/shelf_kind/delete',
    method: 'post',
    data
  })
}

export function getHouseList (data) {
  return service({
    url: API + '/api/wms/house/list',
    method: 'post',
    data
  })
}

export function getShelfPageList (data) {
  return service({
    url: API + '/api/wms/house_shelf/pagelist',
    method: 'post',
    data
  })
}

export function getShelfKindList (data) {
  return service({
    url: API + '/api/wms/shelf_kind/list',
    method: 'post',
    data
  })
}

export function getShelfKindInfo (data) {
  return service({
    url: API + '/api/wms/shelf_kind/get',
    method: 'post',
    data
  })
}

export function addShelf (data) {
  return service({
    url: API + '/api/wms/house_shelf/add',
    method: 'post',
    data
  })
}

export function editShelf (data) {
  return service({
    url: API + '/api/wms/house_shelf/update',
    method: 'post',
    data
  })
}

export function deleteShelf (data) {
  return service({
    url: API + '/api/wms/house_shelf/delete',
    method: 'post',
    data
  })
}

export function getCellPageList (data) {
  return service({
    url: API + '/api/wms/shelf_cell/pagelist',
    method: 'post',
    data
  })
}

export function addCell (data) {
  return service({
    url: API + '/api/wms/shelf_cell/add',
    method: 'post',
    data
  })
}

export function editCell (data) {
  return service({
    url: API + '/api/wms/shelf_cell/update',
    method: 'post',
    data
  })
}

export function deleteCell (data) {
  return service({
    url: API + '/api/wms/shelf_cell/delete',
    method: 'post',
    data
  })
}

export function getShelfList (data) {
  return service({
    url: API + '/api/wms/house_shelf/list',
    method: 'post',
    data
  })
}

export function getBoxKindPageList (data) {
  return service({
    url: API + '/api/wms/box_kind/pagelist',
    method: 'post',
    data
  })
}

export function getBoxKindList (data) {
  return service({
    url: API + '/api/wms/box_kind/list',
    method: 'post',
    data
  })
}

export function addBoxKind (data) {
  return service({
    url: API + '/api/wms/box_kind/add',
    method: 'post',
    data
  })
}

export function editBoxKind (data) {
  return service({
    url: API + '/api/wms/box_kind/update',
    method: 'post',
    data
  })
}

export function deleteBoxKind (data) {
  return service({
    url: API + '/api/wms/box_kind/delete',
    method: 'post',
    data
  })
}

export function getBoxKindInfo (data) {
  return service({
    url: API + '/api/wms/box_kind/get',
    method: 'post',
    data
  })
}

export function getBoxPageList (data) {
  return service({
    url: API + '/api/wms/box_info/pagelist',
    method: 'post',
    data
  })
}

export function addBox (data) {
  return service({
    url: API + '/api/wms/box_info/add',
    method: 'post',
    data
  })
}

export function editBox (data) {
  return service({
    url: API + '/api/wms/box_info/update',
    method: 'post',
    data
  })
}

export function deleteBox (data) {
  return service({
    url: API + '/api/wms/box_info/delete',
    method: 'post',
    data
  })
}

export function getBoxKindDrugPageList (data) {
  return service({
    url: API + '/api/wms/boxkind_drug/pagelist',
    method: 'post',
    data
  })
}

export function addBoxKindDrug (data) {
  return service({
    url: API + '/api/wms/boxkind_drug/add',
    method: 'post',
    data
  })
}

export function editBoxKindDrug (data) {
  return service({
    url: API + '/api/wms/boxkind_drug/update',
    method: 'post',
    data
  })
}

export function deleteBoxKindDrug (data) {
  return service({
    url: API + '/api/wms/boxkind_drug/delete',
    method: 'post',
    data
  })
}

export function getShelfRowList (data) {
  return service({
    url: API + '/api/wms/shelf_cell/rows',
    method: 'post',
    data
  })
}

export function getRowCellList (data) {
  return service({
    url: API + '/api/wms/shelf_cell/cells',
    method: 'post',
    data
  })
}

export function getCellBoxPageList (data) {
  return service({
    url: API + '/api/wms/shelfcell_box/pagelist',
    method: 'post',
    data
  })
}

export function addCellBox (data) {
  return service({
    url: API + '/api/wms/shelfcell_box/add',
    method: 'post',
    data
  })
}

export function editCellBox (data) {
  return service({
    url: API + '/api/wms/shelfcell_box/update',
    method: 'post',
    data
  })
}

export function deleteCellBox (data) {
  return service({
    url: API + '/api/wms/shelfcell_box/delete',
    method: 'post',
    data
  })
}

export function getBoxList (data) {
  return service({
    url: API + '/api/wms/box_info/list',
    method: 'post',
    data
  })
}

export function getInkscreenPageList (data) {
  return service({
    url: API + '/api/wms/inkscreen/pagelist',
    method: 'post',
    data
  })
}

export function addInkscreen (data) {
  return service({
    url: API + '/api/wms/inkscreen/add',
    method: 'post',
    data
  })
}

export function editInkscreen (data) {
  return service({
    url: API + '/api/wms/inkscreen/update',
    method: 'post',
    data
  })
}

export function deleteInkscreen (data) {
  return service({
    url: API + '/api/wms/inkscreen/delete',
    method: 'post',
    data
  })
}

export function getInkscreenCodeLogPageList (data) {
  return service({
    url: API + '/api/wms/inkscreen_log/pagelist',
    method: 'post',
    data
  })
}

export function getBoxInkscreenLogPageList (data) {
  return service({
    url: API + '/api/wms/box_inkscreen_log/pagelist',
    method: 'post',
    data
  })
}

export function getBoxOpenLogPageList (data) {
  return service({
    url: API + '/api/wms/box_open_log/pagelist',
    method: 'post',
    data
  })
}

export function getCellList (data) {
  return service({
    url: API + '/api/wms/shelf_cell/list',
    method: 'post',
    data
  })
}
