<template>
  <div class="employee-module" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="系统信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <a-row class="content-row">
        <a-col :span="5">
          <a-card title="目录信息" :bordered="false" class="left-card">
            <a-tree v-if="moduleTreeData && moduleTreeData.length > 0" :default-expanded-keys="['TOP']" :tree-data="moduleTreeData" @select="onTreeSelect">
              <a-icon slot="switcherIcon" type="down" />
            </a-tree>
            <a-spin v-else size="small" />
          </a-card>
        </a-col>
        <a-col :span="19" style="height:100%">
          <a-card title="区域信息" class="right-card" :bordered="false" ref="contentRowRefs">
            <div class="employee-sys-table">
              <a-row class="toolRow" type="flex" justify="space-between">
                <div>
                  <h3 class="listTitle" v-if="currentModuleId">
                    {{currentModuleName}}
                  </h3>
                </div>
                <a-row class="toolsBtn">
                  <a-space :size="12">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>添加</span>
                      </template>
                      <a-button type="primary" icon="plus-circle" @click="showEditModal()" :disabled="currentModuleId === ''" />
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
                      <columnSelect :plainOptions="columns" @changeColumns="changeColumns">
                      </columnSelect>
                    </a-tooltip>
                  </a-space>
                </a-row>
              </a-row>
              <a-table :columns="tableColumns" ref="tableRef" :data-source="moduleList" class="table-list" :rowKey="record => record.module_id" :loading="isfetchModuleList" :pagination="pagination" @change="handleTableChange" @showSizeChange="onShowSizeChange">
                <!-- :scroll="{x:1170}" -->
                <span slot="validate" slot-scope="validate">
                  <!-- <a-switch :checked="validate" disabled /> -->
                  <a-tag v-if="validate" color="green">有效</a-tag>
                  <a-tag v-else color="red">无效</a-tag>
                </span>
                <template slot="action" slot-scope="record">
                  <a-button type="link" size="small" @click="showEditModal(record)">
                    编辑
                  </a-button>
                  <a-divider type="vertical" />
                  <a-button type="link" size="small" @click="showAuthModal(record)">
                    页面权限
                  </a-button>
                  <a-divider type="vertical" />
                  <a-popconfirm v-if="moduleList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteModule(record.module_id)">
                    <a-button type="link" size="small">
                      删除
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-table>
              <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
              </a-table>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-modal :title="title" :visible="isShowEditModal" :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel" cancelText="取消" okText="确定" :width="700">
      <a-form-model ref="moduleFormRef" :model="moduleForm" :rules="moduleFormRules" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="上级模块">
          <a-input :value="currentModuleName" disabled />
        </a-form-model-item>
        <a-form-model-item label="模块名称" prop="module_name" ref="module_name">
          <a-input v-model="moduleForm.module_name" placeholder="请输入" @blur="
          () => {
            $refs.module_name.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-form-model-item label="系统" prop="sys_id" ref="sys_id">
          <a-select v-model="moduleForm.sys_id" placeholder="请选择">
            <a-select-option v-for="item in systemList" :value="item.sys_id" :key="item.sys_id">
              {{item.sys_name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="系统类别" prop="category" ref="category">
          <!-- <a-select v-model="moduleForm.category" placeholder="请选择" @blur="
          () => {
            $refs.category.onFieldBlur()
          }">
            <a-select-option :value=1>PC</a-select-option>
            <a-select-option :value=2>APP</a-select-option>
            <a-select-option :value=3>Wechat</a-select-option>
          </a-select> -->
          <a-radio-group v-model="moduleForm.category">
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
        <a-form-model-item label="是否页面">
          <a-switch v-model="moduleForm.isPage" />
        </a-form-model-item>
        <a-form-model-item label="导航地址" prop="url_addr" ref="url_addr">
          <a-input v-model="moduleForm.url_addr" placeholder="请输入" @blur="
          () => {
            $refs.url_addr.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-form-model-item label="图标" prop="icon" ref="icon">
          <a-input v-model="moduleForm.icon" placeholder="请输入" :max-length="100" @blur="
          () => {
            $refs.icon.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="排序码" prop="sort_code" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-input-number v-model="moduleForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-switch v-model="moduleForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="项目描述">
          <a-input v-model="moduleForm.memo" type="textarea" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :title="authTitle" :visible="isShowAuthModal" keyboard :footer="null" destroyOnClose @cancel="isShowAuthModal = false" :width="1000" :bodyStyle="{height: '700px'}">
      <a-transfer class="tree-transfer" :titles="['模块权限列表（未选）', '模块权限列表（已选）']" :data-source="unselectPageAuth" :target-keys="targetKeys" :render="item => item.title" :show-select-all="false" @change="onChange">
        <template slot="children" slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
          <a-tree v-if="direction === 'left'? (unselectPageAuth && unselectPageAuth.length > 0 ) : (selectPageAuth && selectPageAuth.length > 0 ) " blockNode checkable defaultExpandAll :checkedKeys="[...selectedKeys, ...targetKeys]" :treeData="direction === 'left' ? unselectPageAuth : selectPageAuth" @check="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
            }
          " @select="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
            }
          " />
        </template>
      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addModule, editModule, deleteModule, addPageAuth, removePageAuth } from '@/api/system.js'

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
const moduleForm = {
  pid: '',
  module_name: '',
  sys_id: null,
  isPage: false,
  category: 1,
  icon: '',
  url_addr: '',
  sort_code: 1,
  validate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '模块序号',
        dataIndex: 'module_id',
        value: 'module_id',
        // width: 150,
        ellipsis: true
      },
      {
        title: '模块名称',
        dataIndex: 'module_name',
        value: 'module_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '导航地址',
        dataIndex: 'url_addr',
        value: 'url_addr',
        // width: 200,
        ellipsis: true
      },
      {
        title: '系统类别',
        dataIndex: 'categoryName',
        value: 'categoryName',
        // width: 150,
        ellipsis: true
      },
      {
        title: '图标',
        dataIndex: 'icon',
        value: 'icon',
        // width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        // width: 150,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' },
      }
    ]
    return {
      columns,
      tableColumns: columns,
      currentModuleId: '',
      currentModuleName: '',
      title: '添加模块',
      isShowEditModal: false,
      confirmLoading: false,
      isTop: false,
      moduleForm: {
        ...moduleForm
      },
      isSubmit: false,
      moduleFormRules: {
        module_name: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
        sys_id: [{ required: true, message: '请选择系统', trigger: 'blur' }],
        // category: [{ required: true, message: '请选择系统类别', trigger: 'blur' }],
        url_addr: [{ required: true, message: '请输入导航地址', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入图标', trigger: 'blur' }]
      },
      isEdit: false,
      authTitle: '页面权限',
      isShowAuthModal: false,
      authComfirmLoading: false,
      targetKeys: [],
      moduleInfo: {},//当前修改权限的模块信息
      isTransfer: false,
      totalChecked: [],
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
      moduleTreeData: 'module/moduleTreeData',
      moduleList: 'module/moduleList',
      isfetchModuleList: 'module/isfetchModuleList',
      moudleTotal: 'module/moudleTotal',
      systemList: 'system/systemList',
      unselectPageAuth: 'auth/unselectPageAuth',
      selectPageAuth: 'auth/selectPageAuth'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_module',
      breadcrumbName: '模块管理'
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
    this.fetchModuleTreeData({})
  },
  methods: {
    ...mapActions({
      fetchModuleTreeData: 'module/fetchModuleTreeData',
      fetchModuleList: 'module/fetchModuleList',
      fetchSystemList: 'system/fetchSystemList',
      fetchUnselectPageAuth: 'auth/fetchUnselectPageAuth',
      fetchSelectPageAuth: 'auth/fetchSelectPageAuth'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'module/resetAllData'
    }),
    getModuleList () {
      this.fetchModuleList({
        module_id: this.currentModuleId,
        module_name: '',
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.moudleTotal
        }
      })
    },
    onTreeSelect (selectedKeys, e) {
      const { selected, selectedNodes, node, event } = e
      this.currentModuleId = node.dataRef.key
      this.currentModuleName = node.title
      if (this.currentModuleId === 'TOP') {
        this.isTop = true
      } else {
        this.isTop = false
      }
      this.getModuleList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getModuleList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getModuleList()
    },
    showAuthModal (moduleInfo) {
      this.moduleInfo = moduleInfo
      this.fetchUnselectPageAuth({ module_id: moduleInfo.module_id })
      this.fetchSelectPageAuth({ module_id: moduleInfo.module_id })
      this.authTitle = `页面权限 --- ${moduleInfo.module_name}`
      this.isShowAuthModal = true
    },
    onChange (targetKeys, direction) {
      if (direction === 'left') {
        const deleteAuth = {
          module_id: this.moduleInfo.module_id,
          auth_ids: this.totalChecked
        }
        removePageAuth(deleteAuth).then(res => {
          this.$message.success('操作成功')
          this.fetchUnselectPageAuth({ module_id: this.moduleInfo.module_id })
          this.fetchSelectPageAuth({ module_id: this.moduleInfo.module_id })
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        const addAuth = {
          module_id: this.moduleInfo.module_id,
          auth_ids: this.totalChecked
        }
        addPageAuth(addAuth).then(res => {
          this.$message.success('操作成功')
          this.fetchUnselectPageAuth({ module_id: this.moduleInfo.module_id })
          this.fetchSelectPageAuth({ module_id: this.moduleInfo.module_id })
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    onChecked (_, e, checkedKeys, itemSelect) {
      // this.totalChecked = _.filter(item => item.length === 6);//所以初始化一个状态赋值
      this.totalChecked = _
      const { eventKey } = e.node

      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    showEditModal (moduleInfo) {
      this.isEdit = false
      this.isShowEditModal = true
      this.fetchSystemList({ sys_name: '' })
      if (moduleInfo) {
        this.isEdit = true
        this.title = '编辑模块'
        this.moduleForm = Object.assign(this.moduleForm, moduleInfo, {})
      }
    },
    editOk () {
      this.$refs.moduleFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editModule()
          } else {
            this.addModule()
          }
        } else {
          return false
        }
      })
    },
    addModule () {
      const params = Object.assign(this.moduleForm,
        {
          is_disabled: this.moduleForm.validate ? 0 : 1,
          is_page: this.moduleForm.isPage ? 1 : 0,
          pid: this.currentModuleId
        }
      )
      addModule(params).then(res => {
        this.$message.success('操作成功')
        this.fetchModuleTreeData({})
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editModule () {
      const params = Object.assign(this.moduleForm,
        {
          is_disabled: this.moduleForm.validate ? 0 : 1,
          is_page: this.moduleForm.isPage ? 1 : 0,
          pid: this.currentModuleId
        }
      )
      editModule(params).then(res => {
        this.$message.success('修改成功')
        this.fetchModuleTreeData({})
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteModule (module_id) {
      const params = {
        module_id: module_id
      }
      deleteModule(params).then(res => {
        this.$message.success('删除成功')
        this.getModuleList()
        this.fetchModuleTreeData({})
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.moduleForm = Object.assign({}, moduleForm)
      this.getModuleList()
      this.isShowEditModal = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getModuleList()
    },
    changeColumns (columns) {
      this.tableColumns = columns
    },
    handleScroll (e) {
      const top = this.$refs.tableRef.$el.offsetTop + 106 - e.target.scrollTop
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
    this.resetAllData()
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.employee-module {
  padding: 5px;
}
.content {
  margin: 10px;
  .left-card {
    border-right: 1px solid #e8e8e8;
  }
  .right-card {
    margin-left: -1px;
    border-left: 1px solid #e8e8e8;
  }
}
.employee-sys-table {
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
.tree-transfer {
  height: 100%;
}
/deep/ .ant-transfer-list-body {
  overflow: auto;
}
.content-row {
  background-color: #fff;
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