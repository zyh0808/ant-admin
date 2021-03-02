<template>
  <div class="employee-company">
    <div class="title">
      <a-page-header style="backgroundColor:#fff" title="系统信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" />
    </div>
    <div class="content">
      <a-row>
        <a-col :span="6">
          <a-card title="目录信息">
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-card title="区域信息" class="area-info-card">
            <p>card content</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-modal title="添加系统信息" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="800">
      <a-form-model ref="systemFormRef" :model="systemForm"
        :rules="systemFormRules" :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }">
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
          <a-input v-model="systemForm.memo" type="textarea"
            placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addSystem, editSystem, deleteSystem } from '@/api/system.js'
export default {
  data () {
    const columns = [
      {
        title: '系统名称',
        dataIndex: 'sys_name',
        width: 150
      },
      {
        title: '系统编码',
        dataIndex: 'sys_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '排序码',
        dataIndex: 'sort_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        width: 150,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
      },
      {
        title: '系统描述',
        dataIndex: 'memo',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        scopedSlots: { customRender: 'action' },
      }
    ]
    return {
      columns,
      searchForm: {
        sysName: ''
      },
      isShowEditModal: false,
      confirmLoading: false,
      systemForm: {
        sys_name: '',
        sys_code: '',
        sort_code: 1,
        memo: '',
        validate: false
      },
      isSubmit: false,
      systemFormRules: {
        sys_name: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        sys_code: [{ required: true, message: '请输入系统编码', trigger: 'blur' }]
      },
      isEdit: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共${total}条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        size: 'small'
      }
    }
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      employeeSysList: 'systemInfo/employeeSysList',
      authList: 'userInfo/authList'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_company',
      breadcrumbName: '公司信息'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.fetchEmployeeSysList({
      sys_name: this.searchForm.sysName,
      page_num: this.pagination.current,
      page_size: this.pagination.pageSize
    })
  },
  methods: {
    ...mapActions({
      fetchEmployeeSysList: 'systemInfo/fetchEmployeeSysList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.fetchEmployeeSysList({
        sys_name: this.searchForm.sysName,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize
      })
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.fetchEmployeeSysList({
        sys_name: this.searchForm.sysName,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize
      })
    },
    handleSearch: debounce(function () {
      this.fetchEmployeeSysList({
        sys_name: this.searchForm.sysName,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize
      })
    }),
    handleReset () {
      this.$refs.searchFormRef.resetFields()
    },
    showSystemEditModal (systemInfo) {
      this.isShowEditModal = true
      if (systemInfo) {
        this.isEdit = true
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
      const params = Object.assign(this.systemForm,
        { is_disabled: this.systemForm.validate ? 0 : 1 }
      )
      addSystem(params).then(res => {
        this.$message.success('操作成功')
        this.$refs.systemFormRef.resetFields()
        this.fetchEmployeeSysList({
          sys_name: this.searchForm.sysName,
          page_num: this.pagination.current,
          page_size: this.pagination.pageSize
        })
        this.isShowEditModal = false
      }).catch(err => {
        this.$message.error(err.sub_msg)
      })
    },
    editSystem () {
      const params = Object.assign(this.systemForm,
        { is_disabled: this.systemForm.validate ? 0 : 1 }
      )
      editSystem(params).then(res => {
        this.$message.success('修改成功')
        this.$refs.systemFormRef.resetFields()
        this.fetchEmployeeSysList({
          sys_name: this.searchForm.sysName,
          page_num: this.pagination.current,
          page_size: this.pagination.pageSize
        })
        this.isShowEditModal = false
      }).catch(err => {
        this.$message.error(err.sub_msg)
      })
    },
    deleteSystem (systemId) {
      const params = {
        sys_id: systemId
      }
      deleteSystem(params).then(res => {
        this.$message.success(res.sub_desc)
        this.fetchEmployeeSysList({
          sys_name: this.searchForm.sysName,
          page_num: this.pagination.current,
          page_size: this.pagination.pageSize
        })
      }).catch(err => {
        this.$message.error(err.sub_msg)
      })
    },
    editCancel () {
      this.$refs.systemFormRef.resetFields()
      this.isShowEditModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin: 10px;
  .area-info-card {
    margin-left: -1px;
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
</style>