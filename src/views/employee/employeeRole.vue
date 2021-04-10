<template>
  <div class="employee-role" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="系统信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="employee-role-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="角色名称">
                <a-input v-model="searchForm.role_name" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="12">
              <a-row type="flex" justify="end" style="marginTop:4px">
                <a-button type="primary" @click="handleSearch">
                  查询
                </a-button>
                <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                  重置
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="employee-role-table">
        <a-row class="toolRow" type="flex" justify="space-between">
          <h3 class="listTitle">角色管理列表</h3>
          <a-row class="toolsBtn">
            <a-space :size="12">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新建</span>
                </template>
                <a-button type="primary" icon="plus-circle"
                  @click="showEditModal()" />
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>刷新</span>
                </template>
                <a-button type="dashed" icon="reload" @click="reloadList" />
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>设置</span>
                </template>
                <columnSelect :plainOptions="columns"
                  @changeColumns="changeColumns(arguments)">
                </columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef" :data-source="roleList"
          class="table-list" :rowKey="record =>record.role_id"
          :pagination="pagination" @change="handleTableChange"
          @showSizeChange="onShowSizeChange" :loading="isfetchRoleList"
          :scroll="{x:1050}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="roleList.length" title="确认删除吗?" cancelText="取消"
              okText="确认" @confirm="() => deleteRole(record.role_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="showRoleModal(record)">
              角色用户
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small"
              @click="showRoleAuthModal(record)">
              角色授权
            </a-button>
          </template>
        </a-table>
        <a-table :columns="tableColumns"
          :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef"
          :style="{display: 'none',width: stickyWidth + 'px'}"
          table-layout="fixed">
        </a-table>
      </div>
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="600">
      <a-form-model ref="roleFormRef" :model="roleForm" :rules="roleFormRules"
        :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="角色名称" prop="role_name" ref="role_name">
          <a-input v-model="roleForm.role_name" :max-length="50"
            placeholder="请输入" @blur="
          () => {
            $refs.role_name.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-form-model-item label="排序码" prop="sort_code">
          <a-input-number v-model="roleForm.sort_code" :min="1" />
        </a-form-model-item>
        <a-form-model-item label="有效">
          <a-switch v-model="roleForm.validate" />
        </a-form-model-item>
        <a-form-model-item label="角色描述">
          <a-input v-model="roleForm.memo" type="textarea" placeholder="请输入"
            :max-length="200" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :title="roleTitle" :visible="isShowRoleModal"
      @cancel="roleUserCancel" :footer="null" :bodyStyle="{ height: '700px' }"
      :width="1200">
      <a-row style="height:100%">
        <a-col :span="6">
          <a-tree v-if="orgTreeData && orgTreeData.length > 0" show-icon
            :tree-data="orgTreeData" :default-expanded-keys="['0']"
            @select="onTreeSelect">
            <a-icon slot="switcherIcon" type="down" />
            <a-icon slot="home" type="home" />
            <a-icon slot="apartment" type="apartment" />
          </a-tree>
        </a-col>
        <a-col :span="18">
          <a-transfer :data-source="orgUserList" show-search :filter-option="(inputValue, item) => item.title.indexOf(inputValue)
          !== -1" :titles="['员工列表（未选）', '员工列表（已选）']" :target-keys="roleEmpList"
            :show-select-all="false" @change="onRoleChange">
            <template slot="children" slot-scope="{
          props: { filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }">
              <!-- :data-source="direction === 'left' ? orgUserList :  roleEmpList" -->
              <a-table :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          " :columns="userColumns" :data-source="filteredItems" size="small"
                :pagination="false" class="table-one"
                :rowKey="record => record.user_id"
                :style="{ pointerEvents: listDisabled ? 'none' : null }" />
            </template>
          </a-transfer>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal :title="roleAuthTitle" :visible="isShowRoleAuthModal"
      @cancel="isShowRoleAuthModal = false" :footer="null"
      :bodyStyle="{ height: '700px' }" :width="1200">
      <a-transfer class="tree-transfer" :data-source="unselectRoleAuth"
        :titles="['角色权限列表（未选）', '角色权限列表（已选）']" :target-keys="roleAuthTargetKeys"
        :render="item => item.title" :show-select-all="false"
        @change="roleAuthChange">
        <template slot="children"
          slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
          <a-tree
            v-if="direction === 'left'? (unselectRoleAuth && unselectRoleAuth.length > 0 ) : (selectRoleAuth && selectRoleAuth.length > 0 ) "
            blockNode checkable defaultExpandAll
            :checkedKeys="[...selectedKeys, ...roleAuthTargetKeys]"
            :treeData="direction === 'left' ? unselectRoleAuth : selectRoleAuth"
            @check="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...roleAuthTargetKeys], itemSelect);
            }
          " @select="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...roleAuthTargetKeys], itemSelect);
            }
          " />
        </template>
      </a-transfer>
      <!-- <a-transfer class="tree-transfer" :data-source="allAuth"
        :titles="['角色权限列表（未选）', '角色权限列表（已选）']" :target-keys="selectRoleAuth"
        :render="item => item.title" :show-select-all="false"
        @change="roleAuthChange">
        <template slot="children"
          slot-scope="{ props: { direction,selectedKeys }, on: { itemSelect } }">
          <a-tree checkable defaultExpandAll v-if="direction === 'left'"
            :checkedKeys="[...selectedKeys, ...selectRoleAuth]"
            :treeData="allAuth" @check="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...selectRoleAuth], itemSelect);
            }
          " @select="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...selectRoleAuth], itemSelect);
            }
          " />
        </template>
      </a-transfer> -->
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addRole, editRole, deleteRole, addRoleEmp, removeRoleEmp, addRoleAuth, removeRoleAuth } from '@/api/system.js'
import debounce from '@/js/debounce.js'
import difference from 'lodash/difference';

import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'

function isChecked (selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}
const searchForm = {
  role_name: ''
}
const roleForm = {
  role_name: '',
  sort_code: 1,
  validate: true,
  memo: ''
}
const pagination = {
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'small'
}
export default {
  data () {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'role_name',
        value: 'role_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '角色编码',
        dataIndex: 'role_id',
        value: 'role_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '排序码',
        dataIndex: 'sort_code',
        value: 'sort_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 150,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
      },
      {
        title: '角色描述',
        dataIndex: 'memo',
        width: 150,
        value: 'memo',
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 300,
        scopedSlots: { customRender: 'action' },
      }
    ]
    const userColumns = [
      {
        title: '用户名称',
        dataIndex: 'username',
        ellipsis: true
      },
      {
        title: '登陆账户',
        dataIndex: 'login_name',
        ellipsis: true
      }
    ]
    return {
      searchForm: { ...searchForm },
      columns,
      tableColumns: columns,
      userColumns,
      title: '添加角色',
      isShowEditModal: false,
      confirmLoading: false,
      roleForm,
      isSubmit: false,
      roleFormRules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      isEdit: false,
      pagination,
      isShowRoleModal: false,
      roleTitle: '角色用户',
      roleConfirmLoading: false,
      showEmpList: [],
      currentId: '',
      roleInfo: {},
      roleTargetKeys: [],
      checkedOrgUserKey: [],
      isShowRoleAuthModal: false,
      roleAuthTitle: '角色授权',
      roleAuthTargetKeys: [],
      roleAuthChecked: [],
      system: 'employee',
      showSticky: false,
      stickyWidth: 0
    }
  },
  components: {
    columnSelect,
    pageHeader
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      orgTreeData: 'orgnization/orgTreeData',
      roleList: 'role/roleList',
      total: 'role/total',
      isfetchRoleList: 'role/isfetchRoleList',
      roleEmpList: 'role/roleEmpList',
      // unselectOrgUserList: 'user/unselectOrgUserList',
      orgUserList: 'user/orgUserList',
      // employeeList: 'employee/employeeList',
      unselectRoleAuth: 'auth/unselectRoleAuth',
      allAuth: 'auth/allAuth',
      selectRoleAuth: 'auth/selectRoleAuth'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_role',
      breadcrumbName: '角色管理'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getRoleList()
    this.fetchAllAuth({})
  },
  methods: {
    ...mapActions({
      fetchRoleList: 'role/fetchRoleList',
      fetchOrgTreeData: 'orgnization/fetchOrgTreeData',
      // fetchUnselectOrgUserList: 'user/fetchUnselectOrgUserList',
      fetchOrgUserList: 'user/fetchOrgUserList',
      fetchRoleEmpList: 'role/fetchRoleEmpList',
      fetchUnselectRoleAuth: 'auth/fetchUnselectRoleAuth',
      fetchSelectRoleAuth: 'auth/fetchSelectRoleAuth',
      fetchAllAuth: 'auth/fetchAllAuth'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetUnselectOrgUserList: 'user/resetUnselectOrgUserList'
    }),
    getRoleList () {
      this.fetchRoleList({
        role_name: this.searchForm.role_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.total
        }
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getRoleList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getRoleList()
    },
    handleSearch: debounce(function () {
      this.getRoleList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (roleInfo) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加角色'
      if (roleInfo) {
        this.isEdit = true
        this.title = '编辑角色'
        this.roleForm = Object.assign(this.roleForm, roleInfo)
      }
    },
    editOk () {
      this.$refs.roleFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editRole()
          } else {
            this.addRole()
          }
        } else {
          return false
        }
      })
    },
    addRole () {
      const roleForm = Object.assign(this.roleForm, {
        is_disabled: this.roleForm.validate ? 0 : 1
      })
      const params = {
        ...roleForm,
        success: () => {
          this.$message.success('操作成功')
          this.editCancel()
        }
      }
      addRole(params).then(res => {
        if (params.success) {
          params.success()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editRole () {
      this.confirmLoading = true
      const params = Object.assign(this.roleForm,
        {
          is_disabled: this.roleForm.validate ? 0 : 1
        }
      )
      editRole(params).then(res => {
        this.$message.success('修改成功')
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteRole (role_id) {
      const params = {
        role_id: role_id
      }
      deleteRole(params).then(res => {
        this.$message.success('删除成功')
        this.getRoleList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.roleForm = Object.assign({}, roleForm)
      this.getRoleList()
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    showRoleModal (roleInfo) {
      this.isShowRoleModal = true
      this.roleTitle = `角色用户 -- [ ${roleInfo.role_name} ]`
      this.roleInfo = roleInfo
      this.fetchOrgTreeData({})
      this.fetchRoleEmpList({
        role_id: roleInfo.role_id,
        username: '',
        login_name: ''
      })
    },
    // getUnselectOrgUseList () {
    //   this.fetchUnselectOrgUserList({
    //     org_id: this.currentId,
    //     role_id: this.roleInfo.role_id,
    //     condition: 'username',
    //     keyword: ''
    //   })
    // },
    getOrgUseList () {
      this.fetchOrgUserList({
        org_id: this.currentId,
        condition: 'username',
        keyword: ''
      })
    },
    onTreeSelect (selectedKeys, e) {
      const { selected, selectedNodes, node, event } = e
      this.currentId = node.value
      // this.currentEmployeeName = node.title
      this.kind = node.$options.propsData.dataRef.kind
      if (this.kind === 1) {//公司
        this.$message.warning('请选择组织机构')
      } else {//组织机构
        this.getOrgUseList()
      }
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      const that = this
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          if (selected) {
            that.checkedOrgUserKey = selectedRows.map(item => {
              return item.key
            })
          } else {
            that.checkedOrgUserKey = []
          }
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect ({ key }, selected) {
          if (selected) {
            that.checkedOrgUserKey.push(key)
          } else {
            const index = that.checkedOrgUserKey.findIndex(item => item === key)
            that.checkedOrgUserKey.splice(index, 1)
          }
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      }
    },
    onRoleChange (targetKeys, direction) {
      if (direction === 'left') {
        removeRoleEmp({
          role_id: this.roleInfo.role_id,
          user_ids: this.checkedOrgUserKey
        }).then(res => {
          this.$message.success('操作成功')
          this.fetchRoleEmpList({
            role_id: this.roleInfo.role_id,
            username: '',
            login_name: ''
          })
          this.getOrgUseList()
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        addRoleEmp({
          role_id: this.roleInfo.role_id,
          user_ids: this.checkedOrgUserKey
        }).then(res => {
          this.$message.success('操作成功')
          this.fetchRoleEmpList({
            role_id: this.roleInfo.role_id,
            username: '',
            login_name: ''
          })
          this.getOrgUseList()
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    roleUserCancel () {
      this.isShowRoleModal = false
      this.resetUnselectOrgUserList()
    },
    showRoleAuthModal (roleInfo) {
      this.roleInfo = roleInfo
      this.isShowRoleAuthModal = true
      this.roleAuthTitle = `角色授权 --- ${roleInfo.role_name}`
      this.fetchUnselectRoleAuth({ role_id: this.roleInfo.role_id })
      this.fetchSelectRoleAuth({ role_id: this.roleInfo.role_id })
    },
    onChecked (_, e, checkedKeys, itemSelect) {
      this.roleAuthChecked = _.filter(item => item.indexOf('-') === -1)
      this.roleAuthChecked = this.roleAuthChecked.filter(item => item !== '0')
      const { eventKey } = e.node

      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    roleAuthChange (targetKeys, direction) {
      if (direction === 'left') {
        const deleteAuth = {
          role_id: this.roleInfo.role_id,
          auth_ids: this.roleAuthChecked
        }
        removeRoleAuth(deleteAuth).then(res => {
          this.fetchUnselectRoleAuth({ role_id: this.roleInfo.role_id })
          this.fetchSelectRoleAuth({ role_id: this.roleInfo.role_id })
          this.$message.success('操作成功')
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        const addAuth = {
          role_id: this.roleInfo.role_id,
          auth_ids: this.roleAuthChecked
        }
        addRoleAuth(addAuth).then(res => {
          this.fetchUnselectRoleAuth({ role_id: this.roleInfo.role_id })
          this.fetchSelectRoleAuth({ role_id: this.roleInfo.role_id })
          this.$message.success('操作成功')
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getRoleList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    },
    handleScroll (e) {
      const top = this.$refs.tableRef.$el.offsetTop - e.target.scrollTop
      if (top < 0) {
        this.showSticky = true
      } else {
        this.showSticky = false
      }
    },
    handleTableScroll () {
      this.table = this.$refs.tableRef
      this.stickyTable = this.$refs.stickyTableRef
      const scrollLeft = this.table.$el.querySelector('.ant-table-body').scrollLeft
      this.stickyTable.$el.querySelector('.ant-table-body').scrollLeft = scrollLeft
    }
  },
  beforeDestroy () {
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.employee-role {
  padding: 5px;
}
.content {
  margin: 10px;
  .employee-role-search {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px 0;
    .search-form {
      margin: 10px 20px;
      .searchRow {
        height: 40px;
        line-height: 40px;
        align-items: center;
        padding: 0 20px;
        .ant-form-item {
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }
}
.employee-role-table {
  background-color: white;
  padding: 5px 10px;
  .toolRow {
    height: 60px;
    align-items: center;
    .listTitle {
      padding: 0 10px;
      // font-weight: 600;
    }
    .toolsBtn {
      .ant-btn {
        margin-right: 10px;
      }
    }
  }
}
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
}

/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  height: auto;
  word-break: break-word;
  // word-wrap: break-word;
  white-space: pre-wrap;
  // overflow: hidden;
  // .ant-tree-title {
  //   word-break: normal;
  //   word-wrap: break-word;
  //   white-space: pre-wrap;
  //   overflow: hidden;
  // }
}

/deep/ .ant-transfer {
  height: 640px;
}
/deep/ .ant-transfer-list-body {
  overflow: auto;
}

/deep/ .ant-tree {
  height: 640px;
  overflow: auto;
}
/deep/ .ant-transfer-list .ant-tree {
  height: 100%;
}
.sticky-table {
  display: block !important;
  position: fixed;
  top: 48px;
  overflow: hidden;
  z-index: 10;
  /deep/ .ant-table-placeholder {
    display: none;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
}
</style>