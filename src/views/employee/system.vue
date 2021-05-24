<template>
  <div class="employee-sys" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="系统信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="employee-sys-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef" class="search-form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="系统名称">
                <a-input v-model="searchForm.sysName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="12">
              <a-form-model-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <div class="search-btns">
                  <a-button type="primary" @click="handleSearch">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="employee-sys-table">
        <a-row class="toolRow" type="flex" justify="space-between">
          <h3 class="listTitle">系统信息列表</h3>
          <a-row class="toolsBtn">
            <a-space :size="12">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新建</span>
                </template>
                <a-button type="primary" icon="plus-circle" @click="showEditModal()" />
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
                <columnSelect :plainOptions="columns" @changeColumns="changeColumns"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef" :data-source="systemPageList" class="table-list" :rowKey="record => record.sys_id" :loading="isfetchSystemPageList" :pagination="pagination" @change="handleTableChange" @showSizeChange="onShowSizeChange">
          <span slot="validate" slot-scope="validate">
            <!-- :scroll="{x:1150}" -->
            <!-- <a-switch :checked="validate" disabled /> -->
            <a-tag v-if="validate" color="green">有效</a-tag>
            <a-tag v-else color="red">无效</a-tag>
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="systemPageList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteSystem(record.sys_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
        <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
        </a-table>
      </div>
    </div>
    <a-modal :title="title" :visible="isShowEditModal" :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel" cancelText="取消" okText="确定" :width="800">
      <a-form-model ref="systemFormRef" :model="systemForm" :rules="systemFormRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item ref="sys_name" label="系统名称" prop="sys_name">
          <a-input v-model="systemForm.sys_name" placeholder="请输入" @blur="
          () => {
            $refs.sys_name.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-form-model-item ref="sys_code" label="系统编码" prop="sys_code">
          <a-input v-model="systemForm.sys_code" placeholder="请输入" @blur="
          () => {
            $refs.sys_code.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-form-model-item label="排序码">
          <a-input-number v-model="systemForm.sort_code" :min="1" :max="10" />
        </a-form-model-item>
        <a-form-model-item label="有效">
          <a-switch v-model="systemForm.validate" />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="systemForm.memo" type="textarea" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addSystem, editSystem, deleteSystem } from '@/api/system.js'

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
  sysName: ''
}
const systemForm = {
  sys_name: '',
  sys_code: '',
  sort_code: 1,
  memo: '',
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '系统名称',
        dataIndex: 'sys_name',
        value: 'sys_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '系统编码',
        dataIndex: 'sys_code',
        value: 'sys_code',
        // width: 150,
        ellipsis: true
      },
      {
        title: '系统描述',
        dataIndex: 'memo',
        value: 'memo',
        // width: 200,
        ellipsis: true
      },
      {
        title: '排序码',
        dataIndex: 'sort_code',
        value: 'sort_code',
        // width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        // width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 150,
        fixed: 'right',
        scopedSlots: { customRender: 'action' },
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加系统信息',
      isShowEditModal: false,
      confirmLoading: false,
      systemForm,
      isSubmit: false,
      systemFormRules: {
        sys_name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
        sys_code: [{ required: true, message: '请输入系统编码', trigger: 'blur' }]
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
      systemPageList: 'system/systemPageList',
      total: 'system/total',
      isfetchSystemPageList: 'system/isfetchSystemPageList',
      authList: 'userInfo/authList'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_sys',
      breadcrumbName: '系统信息'
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
    this.getSysList()
  },
  methods: {
    ...mapActions({
      fetchSystemPageList: 'system/fetchSystemPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getSysList () {
      this.fetchSystemPageList({
        sys_name: this.searchForm.sysName,
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
      this.getSysList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getSysList()
    },
    handleSearch: debounce(function () {
      this.getSysList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (systemInfo) {
      this.isShowEditModal = true
      if (systemInfo) {
        this.isEdit = true
        this.title = '编辑系统信息'
        this.systemForm = Object.assign(this.systemForm, systemInfo, {})
      }
    },
    editOk () {
      this.$refs.systemFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editSystem()
          } else {
            this.addSystem()
          }
        } else {
          return false
        }
      });
    },
    addSystem () {
      this.confirmLoading = true
      const params = Object.assign(this.systemForm,
        { is_disabled: this.systemForm.validate ? 0 : 1 }
      )
      addSystem(params).then(res => {
        this.$message.success('操作成功')
        this.getSysList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editSystem () {
      this.confirmLoading = true
      const params = Object.assign(this.systemForm,
        { is_disabled: this.systemForm.validate ? 0 : 1 }
      )
      editSystem(params).then(res => {
        this.$message.success('修改成功')
        this.getSysList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteSystem (systemId) {
      const params = {
        sys_id: systemId
      }
      deleteSystem(params).then(res => {
        this.$message.success(res.sub_desc)
        this.getSysList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.systemForm = Object.assign({}, systemForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getSysList()
    },
    changeColumns (columns) {
      this.tableColumns = columns
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
.employee-sys {
  padding: 5px;
}
.content {
  margin: 10px;
  .employee-sys-search {
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
  .employee-sys-table {
    background-color: white;
    padding: 5px 10px;
    .toolRow {
      height: 60px;
      align-items: center;
      .listTitle {
        padding: 0 10px;
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