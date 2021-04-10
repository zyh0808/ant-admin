<template>
  <div class="employee-user" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="用户管理"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="employee-user-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="查询条件">
                <a-select v-model="searchForm.condition" placeholder="请选择">
                  <a-select-option value="username">
                    用户姓名
                  </a-select-option>
                  <a-select-option value="login_name">
                    登录账户
                  </a-select-option>
                  <a-select-option value="mobile">
                    手机号码
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="关键字">
                <a-input v-model="searchForm.keyword" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="6">
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
      <div class="employee-user-table">
        <a-row class="toolRow" type="flex" justify="space-between">
          <h3 class="listTitle">用户信息管理</h3>
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
                  @changeColumns="changeColumns(arguments)"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" :data-source="userList" ref="tableRef"
          class="table-list" :rowKey="record =>record.user_id"
          :pagination="pagination" :loading="isfetchUserList"
          @change="handleTableChange" @showSizeChange="onShowSizeChange"
          :scroll="{x: 2140}">
          <span slot="locked" slot-scope="text, record">
            <!-- <a-popconfirm v-if="userList.length"
              :title="record.locked? '确定解锁吗?': '确定锁定吗?'" cancelText="取消"
              okText="确认" @confirm="() => changeLockUser(record)">
              <a-switch :checked="record.locked" />
            </a-popconfirm> -->
            <a-switch :checked="record.locked"
              @change="changeLockUser(record)" />
          </span>
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="resetPsw(record)">
              重置密码
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small"
              @click="showUserAuthModal(record)">
              用户权限
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="userList.length" title="确认删除吗?" cancelText="取消"
              okText="确认" @confirm="() => deleteUser(record)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
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
      <a-form-model ref="userFormRef" :model="userForm" :rules="userFormRules"
        :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="用户姓名" prop="username" ref="username">
              <a-input v-model="userForm.username" placeholder="请输入"
                :max-length="20" @blur="
          () => {
            $refs.username.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="员工账号" prop="emp_id">
              <a-select v-model="userForm.emp_id" placeholder="请选择">
                <a-select-option v-for="item in employeeList" :key="item.key"
                  :value="item.key">
                  {{item.title}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="登陆账号" prop="login_name" ref="login_name">
              <a-input v-model="userForm.login_name" placeholder="请输入"
                :max-length="20" @blur="
          () => {
            $refs.login_name.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="登陆密码" prop="pwd" ref="pwd">
              <a-input v-model="userForm.pwd" placeholder="请输入" :max-length="64"
                @blur="
          () => {
            $refs.pwd.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="手机号码" prop="mobile" ref="mobile">
              <a-input v-model="userForm.mobile" placeholder="请输入" @blur="
          () => {
            $refs.mobile.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="微信ID">
              <a-input v-model="userForm.openid" placeholder="请输入" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="排序码">
              <a-input-number v-model="userForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效">
              <a-switch v-model="userForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="备注" :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }">
          <a-input v-model="userForm.memo" type="textarea" :max-length="200"
            placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal title="重置密码" :visible="isShowResetPswModal"
      :confirm-loading="resetLoading" @ok="resetOk" @cancel="resetCancel"
      cancelText="取消" okText="确定" :width="500">
      <a-form-model ref="userFormRef" :model="resetPswForm"
        :rules="resetPswFormRules" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }">
        <a-form-model-item label="姓名">
          <a-input v-model="resetPswForm.userName" disabled />
        </a-form-model-item>
        <a-form-model-item label="账号">
          <a-input v-model="resetPswForm.loginName" disabled />
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="newPwd" ref="newPwd">
          <a-input-password v-model="resetPswForm.newPwd" placeholder="请输入"
            @blur="
          () => {
            $refs.newPwd.onFieldBlur()
          }
        " />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :title="userTitle" :visible="isShowUserAuthModal"
      @cancel="isShowUserAuthModal = false" :footer="null"
      :bodyStyle="{ height: '700px' }" cancelText=" 取消" okText="确定"
      :width="1000">
      <a-transfer class="tree-transfer" :titles="['用户权限列表（未选）', '用户权限列表（已选）']"
        :data-source="unselectUserAuth" :target-keys="userAuthTargetKeys"
        :render="item => item.title" :show-select-all="false"
        @change="userAuthChange">
        <template slot="children"
          slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
          <a-tree
            v-if="direction === 'left'? (unselectUserAuth && unselectUserAuth.length > 0 ) : (selectUserAuth && selectUserAuth.length > 0 ) "
            blockNode checkable defaultExpandAll
            :checkedKeys="[...selectedKeys, ...userAuthTargetKeys]"
            :treeData="direction === 'left' ? unselectUserAuth : selectUserAuth"
            @check="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...userAuthTargetKeys], itemSelect);
            }
          " @select="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...userAuthTargetKeys], itemSelect);
            }
          " />
        </template>
      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addUser, editUser, deleteUser, userUpdateLock, resetUserPsw, addUserAuth, removeUseAuth } from '@/api/system.js'
import debounce from '@/js/debounce.js'
import { SHA256 } from '@/js/crypt.js'
import { checkPhone } from '@/js/utils.js'

function isChecked (selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
const pagination = {
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'small'
}
const searchForm = {
  condition: undefined,
  keyword: ''
}
const userForm = {
  username: '',
  emp_id: undefined,
  login_name: '',
  pwd: '',
  mobile: '',
  openid: '',
  sort_code: 1,
  validate: true,
  memo: ''
}
const resetPswForm = {
  userName: '',
  loginName: '',
  newPwd: ''
}
export default {
  data () {
    const columns = [
      {
        title: '用户主键',
        dataIndex: 'user_id',
        value: 'user_id',
        fixed: 'left',
        width: 120,
        ellipsis: true
      },
      {
        title: '用户姓名',
        dataIndex: 'username',
        value: 'username',
        fixed: 'left',
        width: 120,
        ellipsis: true
      },
      {
        title: '员工账号',
        dataIndex: 'emp_id',
        value: 'emp_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '登陆账户',
        dataIndex: 'login_name',
        value: 'login_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        value: 'mobile',
        width: 150,
        ellipsis: true
      },
      {
        title: '微信ID',
        dataIndex: 'openid',
        value: 'openid',
        width: 150,
        ellipsis: true
      },
      {
        title: '小程序ID',
        dataIndex: 'unionid',
        value: 'unionid',
        width: 150,
        ellipsis: true
      },
      {
        title: '锁定',
        dataIndex: 'locked',
        value: 'locked',
        width: 100,
        key: 'locked',
        scopedSlots: { customRender: 'locked' }
      },
      {
        title: '第一次访问时间',
        dataIndex: 'first_login',
        value: 'first_login',
        width: 150,
        ellipsis: true
      },
      {
        title: '最后一次访问时间',
        dataIndex: 'last_login',
        value: 'last_login',
        width: 150,
        ellipsis: true
      },
      {
        title: '登录次数',
        dataIndex: 'login_cnt',
        value: 'login_cnt',
        width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        value: 'sys_name',
        width: 200,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 300,
        scopedSlots: { customRender: 'action' },
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加用户',
      isShowEditModal: false,
      confirmLoading: false,
      userForm,
      isSubmit: false,
      userFormRules: {
        username: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        emp_id: [{ required: true, message: '请选择员工账号', trigger: 'blur' }],
        login_name: [{ required: true, message: '请输入登陆账号', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入登陆密码', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
        { validator: this.checkPhone, trigger: 'blur' }],
      },
      isEdit: false,
      pagination: { ...pagination },
      userInfo: {},
      isShowUserAuthModal: false,
      userTitle: '人员角色',
      userAuthTargetKeys: [],
      totalChecked: [],
      isShowResetPswModal: false,
      resetPswForm,
      resetLoading: false,
      resetPswFormRules: {
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      },
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
      userList: 'user/userList',
      total: 'user/total',
      isfetchUserList: 'user/isfetchUserList',
      employeeList: 'employee/employeeList',
      unselectUserAuth: 'auth/unselectUserAuth',
      selectUserAuth: 'auth/selectUserAuth'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_user',
      breadcrumbName: '用户管理'
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
    this.getUserList()
  },
  methods: {
    ...mapActions({
      fetchUserList: 'user/fetchUserList',
      fetchEmployeeList: 'employee/fetchEmployeeList',
      fetchUnselectUserAuth: 'auth/fetchUnselectUserAuth',
      fetchSelectUserAuth: 'auth/fetchSelectUserAuth'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getUserList () {
      this.fetchUserList({
        condition: this.searchForm.condition ? this.searchForm.condition : '',
        keyword: this.searchForm.keyword,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.total
        }
      })
    },
    changeLockUser (userInfo) {
      userUpdateLock({
        user_id: userInfo.user_id,
        version: userInfo.version,
        is_lock: userInfo.is_lock === 0 ? 1 : 0
      }).then(res => {
        if (userInfo.is_lock === 0) {
          this.$message.success('锁定成功')
        } else {
          this.$message.success('解锁成功')
        }
        this.getUserList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getUserList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getUserList()
    },
    handleSearch: debounce(function () {
      this.getUserList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (userInfo) {
      this.isShowEditModal = true
      this.fetchEmployeeList({})
      if (userInfo) {
        this.isEdit = true
        this.title = '编辑用户'
        this.userForm = Object.assign(this.userForm, userInfo)
      }
    },
    editOk () {
      this.$refs.userFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editUser()
          } else {
            this.addUser()
          }
        } else {
          return false
        }
      })
    },
    addUser () {
      this.confirmLoading = true
      const userForm = Object.assign(this.userForm, {
        is_disabled: this.userForm.validate ? 0 : 1
      })
      const params = {
        ...userForm,
        success: () => {
          this.$message.success('操作成功')
          this.getUserList()
          this.editCancel()
        }
      }
      addUser(params).then(res => {
        if (params.success) {
          params.success()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editUser () {
      const params = Object.assign(this.userForm,
        {
          is_disabled: this.userForm.validate ? 0 : 1
        }
      )
      editUser(params).then(res => {
        this.$message.success('修改成功')
        this.getUserList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteUser (userInfo) {
      const params = {
        user_id: userInfo.user_id,
        version: userInfo.version
      }
      deleteUser(params).then(res => {
        this.$message.success('删除成功')
        this.getUserList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.userForm = Object.assign({}, userForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    resetPsw (userInfo) {
      this.userInfo = userInfo
      this.isShowResetPswModal = true
      this.resetPswForm = Object.assign(this.resetPswForm, {
        userName: userInfo.username,
        loginName: userInfo.login_name
      })
    },
    resetOk () {
      this.resetLoading = true
      this.$refs.userFormRef.validate(valid => {
        if (valid) {
          resetUserPsw({
            user_id: this.userInfo.user_id,
            version: this.userInfo.version,
            pwd: SHA256(this.resetPswForm.newPwd)
          }).then(res => {
            this.$message.success('密码重置成功')
            this.getUserList()
            this.resetCancel()
          }).catch(err => {
            this.$message.error(err.msg)
          })
        } else {
          return false
        }
      })
    },
    resetCancel () {
      this.resetPswForm = Object.assign({}, resetPswForm)
      this.isShowResetPswModal = false
      this.resetLoading = false
    },
    onChecked (_, e, checkedKeys, itemSelect) {
      // this.totalChecked = _.filter(item => item.length === 6);//所以初始化一个状态赋值
      this.totalChecked = _ //所以初始化一个状态赋值
      const { eventKey } = e.node

      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    showUserAuthModal (userInfo) {
      this.userInfo = userInfo
      this.isShowUserAuthModal = true
      this.userTitle = `人员角色 --- ${userInfo.username}`
      this.fetchUnselectUserAuth({ user_id: this.userInfo.user_id })
      this.fetchSelectUserAuth({ user_id: this.userInfo.user_id })
    },
    userAuthChange (targetKeys, direction) {
      if (direction === 'left') {
        const deleteAuth = {
          user_id: this.userInfo.user_id,
          auth_ids: this.totalChecked
        }
        removeUseAuth(deleteAuth).then(res => {
          this.$message.success('操作成功')
          this.fetchUnselectUserAuth({ user_id: this.userInfo.user_id })
          this.fetchSelectUserAuth({ user_id: this.userInfo.user_id })
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        const addAuth = {
          user_id: this.userInfo.user_id,
          auth_ids: this.totalChecked
        }
        addUserAuth(addAuth).then(res => {
          this.$message.success('操作成功')
          this.fetchUnselectUserAuth({ user_id: this.userInfo.user_id })
          this.fetchSelectUserAuth({ user_id: this.userInfo.user_id })
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    checkPhone (rule, value, callback) {
      if (!checkPhone(value)) {
        callback('手机号码有误，请重填！')
      } else {
        callback()
      }
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getUserList()
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
.employee-user {
  padding: 5px;
}
.content {
  margin: 10px;
  .employee-user-search {
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
.employee-user-table {
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
  white-space: pre-wrap;
}

/deep/ .ant-transfer {
  height: 100%;
}
/deep/ .ant-transfer-list-body {
  overflow: auto;
}

/deep/ .ant-tree {
  height: 100%;
  overflow-y: auto;
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