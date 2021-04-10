<template>
  <div class="employee-auth" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="权限字典"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="employee-auth-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="查询条件">
                <a-select v-model="searchForm.condition" placeholder="请选择">
                  <a-select-option value=" sys_id">
                    系统编码
                  </a-select-option>
                  <a-select-option value="sys_name">
                    系统名称
                  </a-select-option>
                  <a-select-option value="category">
                    系统类别
                  </a-select-option>
                  <a-select-option value="group_code">
                    权限分组
                  </a-select-option>
                  <a-select-option value="auth_code">
                    权限编码
                  </a-select-option>
                  <a-select-option value="auth_name">
                    权限名称
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
      <div class="employee-auth-table">
        <a-row class="toolRow" type="flex" justify="space-between">
          <h3 class="listTitle">权限字典列表</h3>
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
        <a-table :columns="tableColumns" ref="tableRef"
          :data-source="authPageList" class="table-list"
          :rowKey="record => record.auth_id" :loading="isfetchAuthPageList"
          :pagination="pagination" @change="handleTableChange"
          @showSizeChange="onShowSizeChange" :scroll="{x:1580}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="authPageList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteAuth(record.auth_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
        <a-table :columns="tableColumns"
          :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef"
          :style="{display: 'none',width: stickyWidth + 'px'}"
          table-layout="fixed" :scroll="{x:1580}">
        </a-table>
      </div>
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="800">
      <a-form-model ref="authFormRef" :model="authForm" :rules="authFormRules"
        :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="auth_code" label="权限编码" prop="auth_code">
              <a-input v-model="authForm.auth_code" placeholder="请输入" @blur="
          () => {
            $refs.auth_code.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="auth_name" label="权限名称" prop="auth_name">
              <a-input v-model="authForm.auth_name" placeholder="请输入" @blur="
          () => {
            $refs.auth_name.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="系统" prop="sys_id" ref="sys_id">
              <a-select v-model="authForm.sys_id" placeholder="请选择" @blur="
          () => {
            $refs.sys_id.onFieldBlur()
          }">
                <a-select-option v-for="item in systemList" :value="item.sys_id"
                  :key="item.sys_id">
                  {{item.sys_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="category" label="系统类别" prop="category">
              <!-- <a-select v-model="authForm.category" placeholder="请选择">
                <a-select-option :value=1>
                  PC
                </a-select-option>
                <a-select-option :value=2>
                  APP
                </a-select-option>
                <a-select-option :value=3>
                  Wechat
                </a-select-option>
              </a-select> -->
              <a-radio-group v-model="authForm.category">
                <a-radio-button :value=1>
                  PC
                </a-radio-button>
                <a-radio-button :value=2>
                  APP
                </a-radio-button>
                <a-radio-button :value=3>
                  Wechat
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="group_code" label="权限分组" prop="group_code">
              <a-input v-model="authForm.group_code" placeholder="请输入" @blur="
          () => {
            $refs.group_code.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="api_url" label="Api地址" prop="api_url">
              <a-input v-model="authForm.api_url" placeholder="请输入" @blur="
          () => {
            $refs.api_url.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item ref="btn_icon" label="按钮图标" prop="btn_icon"
          :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }">
          <a-input v-model="authForm.btn_icon" placeholder="请输入"
            :max-length="100" @blur="
          () => {
            $refs.btn_icon.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="排序码">
              <a-input-number v-model="authForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效">
              <a-switch v-model="authForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="备注" :label-col="{ span: 3 }"
          :wrapper-col="{ span: 16 }" prop="memo">
          <a-input v-model="authForm.memo" type="textarea" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addAuth, editAuth, deleteAuth } from '@/api/system.js'
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
const authForm = {
  auth_code: '',
  auth_name: '',
  sys_id: undefined,
  category: 1,
  group_code: '',
  api_url: '',
  btn_icon: '',
  sort_code: 1,
  validate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '序号',
        dataIndex: 'auth_id',
        value: 'auth_id',
        width: 80,
        ellipsis: true
      },
      {
        title: '权限编码',
        dataIndex: 'auth_code',
        value: 'auth_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '权限名称',
        dataIndex: 'auth_name',
        value: 'auth_name',
        width: 150,
        ellipsis: true
      },
      {
        title: 'Api地址',
        dataIndex: 'api_url',
        value: 'api_url',
        width: 150,
        ellipsis: true
      },
      {
        title: '系统类别',
        dataIndex: 'category_desc',
        value: 'category_desc',
        width: 150,
        ellipsis: true
      },
      {
        title: '权限分组',
        dataIndex: 'group_code',
        value: 'group_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '所属系统',
        dataIndex: 'sys_name',
        value: 'sys_name',
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
        title: '备注',
        dataIndex: 'memo',
        value: 'memo',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: { customRender: 'action' },
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加权限',
      isShowEditModal: false,
      confirmLoading: false,
      authForm,
      isSubmit: false,
      authFormRules: {
        auth_code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
        auth_name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        sys_id: [{ required: true, message: '请选择系统', trigger: 'blur' }],
        category: [{ required: true, message: '请选择系统类别', trigger: 'blur' }],
        group_code: [{ required: true, message: '请输入权限分组', trigger: 'blur' }],
        api_url: [{ required: true, message: '请输入Api地址', trigger: 'blur' }],
        btn_icon: [{ required: true, message: '请输入按钮图标', trigger: 'blur' }],
        memo: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      isEdit: false,
      pagination: { ...pagination },
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
      authPageList: 'auth/authPageList',
      isfetchAuthPageList: 'auth/isfetchAuthPageList',
      systemList: 'system/systemList',
      authTotal: 'auth/authTotal'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_auth',
      breadcrumbName: '权限字典'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getAuthList()
  },
  methods: {
    ...mapActions({
      fetchAuthPageList: 'auth/fetchAuthPageList',
      fetchSystemList: 'system/fetchSystemList',
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getAuthList () {
      this.fetchAuthPageList({
        condition: this.searchForm.condition ? this.searchForm.condition : '',
        keyword: this.searchForm.keyword,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.authTotal
        }
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAuthList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAuthList()
    },
    handleSearch: debounce(function () {
      this.getAuthList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (authInfo) {
      this.isShowEditModal = true
      this.fetchSystemList({ sys_name: '' })
      this.isEdit = false
      this.title = '添加权限'
      if (authInfo) {
        this.isEdit = true
        this.title = '编辑权限'
        this.authForm = Object.assign(this.authForm, authInfo, {})
      }
    },
    editOk () {
      this.$refs.authFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editAuth()
          } else {
            this.addAuth()
          }
        } else {
          return false
        }
      });
    },
    addAuth () {
      this.confirmLoading = true
      const params = Object.assign(this.authForm,
        { is_disabled: this.authForm.validate ? 0 : 1 }
      )
      addAuth(params).then(res => {
        this.$message.success('操作成功')
        this.getAuthList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    editAuth () {
      this.confirmLoading = true
      const params = Object.assign(this.authForm,
        { is_disabled: this.authForm.validate ? 0 : 1 }
      )
      editAuth(params).then(res => {
        this.$message.success('修改成功')
        this.getAuthList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    deleteAuth (authId) {
      const params = {
        auth_id: authId
      }
      deleteAuth(params).then(res => {
        this.$message.success(res.sub_desc)
        this.getAuthList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.authFormRef.resetFields()
      this.authForm = Object.assign({}, authForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getAuthList()
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
.employee-auth {
  padding: 5px;
}
.content {
  margin: 10px;
  .employee-auth-search {
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
  .employee-auth-table {
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
}
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
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