import { service } from '@/js/request'

// let API = 'http://192.168.0.103:16800'
let API = ''
if (process.env.NODE_ENV === "production") {
  API = 'http://123.57.86.56:16800'
  // API = 'http://60.205.139.20:16800'
}

export function getSystemList (data) {
  return service({
    url: API + '/api/pub/sys/list',
    method: 'post',
    data
  })
}

export function getPageSystemList (data) {
  return service({
    url: API + '/api/pub/sys/pagelist',
    method: 'post',
    data
  })
}

export function addSystem (data) {
  return service({
    url: API + '/api/pub/sys/add',
    method: 'post',
    data
  })
}

export function editSystem (data) {
  return service({
    url: API + '/api/pub/sys/update',
    method: 'post',
    data
  })
}

export function deleteSystem (data) {
  return service({
    url: API + '/api/pub/sys/delete',
    method: 'post',
    data
  })
}

export function getCompanyTree (data) {
  return service({
    url: API + '/api/pub/company/treejson',
    method: 'post',
    data
  })
}

export function getPageCompanyList (data) {
  return service({
    url: API + '/api/pub/company/pagelist',
    method: 'post',
    data
  })
}

export function getCompanyInfo (data) {
  return service({
    url: API + '/api/pub/company/get',
    method: 'post',
    data
  })
}

export function getProvinceList (data) {
  return service({
    url: API + '/api/pub/area/province',
    method: 'post',
    data
  })
}

export function getChildrenList (data) {
  return service({
    url: API + '/api/pub/area/children_list',
    method: 'post',
    data
  })
}

export function getAreaList (data) {
  return service({
    url: API + '/api/pub/area/list',
    method: 'post',
    data
  })
}

export function addCompany (data) {
  return service({
    url: API + '/api/pub/company/add',
    method: 'post',
    data
  })
}

export function editCompany (data) {
  return service({
    url: API + '/api/pub/company/update',
    method: 'post',
    data
  })
}

export function deleteCompany (data) {
  return service({
    url: API + '/api/pub/company/delete',
    method: 'post',
    data
  })
}

export function getOrgTree (data) {
  return service({
    url: API + '/api/pub/company/company_org_tree',
    method: 'post',
    data
  })
}

export function getComOrgList (data) {
  return service({
    url: API + '/api/pub/org/company_top_org',
    method: 'post',
    data
  })
}

export function getOtherOrgList (data) {
  return service({
    url: API + '/api/pub/org/org_children',
    method: 'post',
    data
  })
}

export function addTopOrg (data) {
  return service({
    url: API + '/api/pub/org/addtop',
    method: 'post',
    data
  })
}

export function addOtherOrg (data) {
  return service({
    url: API + '/api/pub/org/add',
    method: 'post',
    data
  })
}

export function editOrg (data) {
  return service({
    url: API + '/api/pub/org/update',
    method: 'post',
    data
  })
}

export function deleteOrg (data) {
  return service({
    url: API + '/api/pub/org/delete',
    method: 'post',
    data
  })
}

export function getOrgInfo (data) {
  return service({
    url: API + '/api/pub/org/get',
    method: 'post',
    data
  })
}

export function getPageRoleList (data) {
  return service({
    url: API + '/api/pub/role/pagelist',
    method: 'post',
    data
  })
}

export function getPageRoleEmpList (data) {
  return service({
    url: API + '/api/pub/user_role/list',
    method: 'post',
    data
  })
}

export function addRoleEmp (data) {
  return service({
    url: API + '/api/pub/user_role/add_member',
    method: 'post',
    data
  })
}

export function removeRoleEmp (data) {
  return service({
    url: API + '/api/pub/user_role/remove_member',
    method: 'post',
    data
  })
}

export function addRole (data) {
  return service({
    url: API + '/api/pub/role/add',
    method: 'post',
    data
  })
}

export function editRole (data) {
  return service({
    url: API + '/api/pub/role/update',
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return service({
    url: API + '/api/pub/role/delete',
    method: 'post',
    data
  })
}

export function getPageEmployeeList (data) {
  return service({
    url: API + '/api/pub/employee/pagelist',
    method: 'post',
    data
  })
}

export function getEmployeeList (data) {
  return service({
    url: API + '/api/pub/employee/list',
    method: 'post',
    data
  })
}

export function addEmployee (data) {
  return service({
    url: API + '/api/pub/employee/add',
    method: 'post',
    data
  })
}

export function editEmployee (data) {
  return service({
    url: API + '/api/pub/employee/update',
    method: 'post',
    data
  })
}

export function deleteEmployee (data) {
  return service({
    url: API + '/api/pub/employee/delete',
    method: 'post',
    data
  })
}

export function changeDisableEmployee (data) {
  return service({
    url: API + '/api/pub/employee/disable',
    method: 'post',
    data
  })
}

export function getModuleTree (data) {
  return service({
    url: API + '/api/pub/module/treejson',
    method: 'post',
    data
  })
}

export function getPageModuleList (data) {
  return service({
    url: API + '/api/pub/module/pagelist',
    method: 'post',
    data
  })
}

export function addModule (data) {
  return service({
    url: API + '/api/pub/module/add',
    method: 'post',
    data
  })
}

export function editModule (data) {
  return service({
    url: API + '/api/pub/module/update',
    method: 'post',
    data
  })
}

export function deleteModule (data) {
  return service({
    url: API + '/api/pub/module/delete',
    method: 'post',
    data
  })
}

export function getUnselectPageAuth (data) {
  return service({
    url: API + '/api/pub/page_auth/unselected',
    method: 'post',
    data
  })
}

export function getSelectPageAuth (data) {
  return service({
    url: API + '/api/pub/page_auth/selected',
    method: 'post',
    data
  })
}

export function addPageAuth (data) {
  return service({
    url: API + '/api/pub/page_auth/add_member',
    method: 'post',
    data
  })
}

export function removePageAuth (data) {
  return service({
    url: API + '/api/pub/page_auth/remove_member',
    method: 'post',
    data
  })
}

export function getPageUserList (data) {
  return service({
    url: API + '/api/pub/user/pagelist',
    method: 'post',
    data
  })
}

export function userUpdateLock (data) {
  return service({
    url: API + '/api/pub/user/update_lock',
    method: 'post',
    data
  })
}

export function addUser (data) {
  return service({
    url: API + '/api/pub/user/add',
    method: 'post',
    data
  })
}

export function deleteUser (data) {
  return service({
    url: API + '/api/pub/user/delete',
    method: 'post',
    data
  })
}

export function editUser (data) {
  return service({
    url: API + '/api/pub/user/update',
    method: 'post',
    data
  })
}

export function resetUserPsw (data) {
  return service({
    url: API + '/api/pub/user/revise_password',
    method: 'post',
    data
  })
}

export function getUnselectUserAuth (data) {
  return service({
    url: API + '/api/pub/user_auth/unselected',
    method: 'post',
    data
  })
}

export function getSelectUserAuth (data) {
  return service({
    url: API + '/api/pub/user_auth/selected',
    method: 'post',
    data
  })
}

export function addUserAuth (data) {
  return service({
    url: API + '/api/pub/user_auth/add_member',
    method: 'post',
    data
  })
}

export function removeUseAuth (data) {
  return service({
    url: API + '/api/pub/user_auth/remove_member',
    method: 'post',
    data
  })
}

export function getAuthPageList (data) {
  return service({
    url: API + '/api/pub/authdict/pagelist',
    method: 'post',
    data
  })
}

export function addAuth (data) {
  return service({
    url: API + '/api/pub/authdict/add',
    method: 'post',
    data
  })
}

export function editAuth (data) {
  return service({
    url: API + '/api/pub/authdict/update',
    method: 'post',
    data
  })
}

export function deleteAuth (data) {
  return service({
    url: API + '/api/pub/authdict/delete',
    method: 'post',
    data
  })
}

export function getUnselectRoleAuth (data) {
  return service({
    url: API + '/api/pub/role_auth/unselected',
    method: 'post',
    data
  })
}

export function getSelectRoleAuth (data) {
  return service({
    url: API + '/api/pub/role_auth/selected',
    method: 'post',
    data
  })
}

export function addRoleAuth (data) {
  return service({
    url: API + '/api/pub/role_auth/add_member',
    method: 'post',
    data
  })
}

export function removeRoleAuth (data) {
  return service({
    url: API + '/api/pub/role_auth/remove_member',
    method: 'post',
    data
  })
}

export function getAreaPageList (data) {
  return service({
    url: API + '/api/pub/area/pagelist',
    method: 'post',
    data
  })
}

export function addArea (data) {
  return service({
    url: API + '/api/pub/area/add',
    method: 'post',
    data
  })
}

export function editArea (data) {
  return service({
    url: API + '/api/pub/area/update',
    method: 'post',
    data
  })
}

export function deleteArea (data) {
  return service({
    url: API + '/api/pub/area/delete',
    method: 'post',
    data
  })
}

export function addDict (data) {
  return service({
    url: API + '/api/pub/item_dict/add',
    method: 'post',
    data
  })
}

export function editDict (data) {
  return service({
    url: API + '/api/pub/item_dict/update',
    method: 'post',
    data
  })
}

export function deleteDict (data) {
  return service({
    url: API + '/api/pub/item_dict/delete',
    method: 'post',
    data
  })
}

export function getAllDictTree (data) {
  return service({
    url: API + '/api/pub/item_dict/treejson',
    method: 'post',
    data
  })
}

export function getDictPageList (data) {
  return service({
    url: API + '/api/pub/item_dict/pagelist',
    method: 'post',
    data
  })
}

export function getDictList (data) {
  return service({
    url: API + '/api/pub/item_dict/list',
    method: 'post',
    data
  })
}

export function getSeedPageList (data) {
  return service({
    url: API + '/api/pub/code_seed/pagelist',
    method: 'post',
    data
  })
}

export function addSeed (data) {
  return service({
    url: API + '/api/pub/code_seed/add',
    method: 'post',
    data
  })
}

export function editSeed (data) {
  return service({
    url: API + '/api/pub/code_seed/update',
    method: 'post',
    data
  })
}

export function deleteSeed (data) {
  return service({
    url: API + '/api/pub/code_seed/delete',
    method: 'post',
    data
  })
}

export function getLogPageList (data) {
  return service({
    url: API + '/api/pub/log/pagelist',
    method: 'post',
    data
  })
}

export function getUnselectOrgUserList (data) {
  return service({
    url: API + '/api/pub/user_role/unselected',
    method: 'post',
    data
  })
}

export function getOrgUserList (data) {
  return service({
    url: API + '/api/pub/org/user',
    method: 'post',
    data
  })
}

export function getAllAuthTree (data) {
  return service({
    url: API + '/api/pub/authdict/tree',
    method: 'post',
    data
  })
}