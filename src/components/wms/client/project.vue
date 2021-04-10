<template>
  <div>
    <div class="project-search">
      <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
        class="search-form" :label-col="{ span: 10 }"
        :wrapper-col="{ span: 14 }">
        <a-row class="searchRow">
          <a-col :span="6">
            <a-form-model-item label="项目名称">
              <a-input v-model="searchForm.proj_name" placeholder="请输入"
                allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="项目号">
              <a-input v-model="searchForm.proj_no" placeholder="请输入"
                allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="付费账号">
              <a-select v-model="searchForm.paid_account_id" placeholder="请选择">
                <a-select-option v-for="item in payAccountList"
                  :key="item.paid_account_id" :value="item.paid_account_id">
                  {{item.paid_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
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
    <div class="project-table">
      <a-row class="toolRow" type="flex" justify="end">
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
      <a-table :columns="tableColumns" :data-source="projectList"
        class="table-one" :rowKey="record => record.proj_id"
        :loading="isfetchProjectList" :pagination="false" :scroll="{x:1600}">
        <span slot="validate" slot-scope="validate">
          <a-switch :checked="validate" disabled />
        </span>
        <template slot="action" slot-scope="record">
          <a-button type="link" size="small"
            @click="toProjectDetail(record.proj_id)">
            查看详情
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="showEditModal(record)">
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm v-if="projectList.length" title="确认删除吗?" cancelText="取消"
            okText="确认" @confirm="() => deleteProject(record.proj_id)">
            <a-button type="link" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="800">
      <a-form-model ref="projectFormRef" :model="projectForm"
        :rules="projectFormRules" :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="项目号" prop="proj_no" ref="proj_no">
              <a-input v-model="projectForm.proj_no" placeholder="请输入" @blur="
          () => {
            $refs.proj_no.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目名称" prop="proj_name" ref="proj_name">
              <a-input v-model="projectForm.proj_name" placeholder="请输入" @blur="
          () => {
            $refs.proj_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="付费账号" prop="paid_account_id">
              <a-select v-model="projectForm.paid_account_id" placeholder="请选择">
                <a-select-option v-for="item in payAccountList"
                  :key="item.paid_account_id" :value="item.paid_account_id">
                  {{item.paid_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人" prop="proj_person" ref="proj_person">
              <a-input v-model="projectForm.proj_person" placeholder="请输入"
                @blur="
          () => {
            $refs.proj_person.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="proj_phone" ref="proj_phone">
              <a-input v-model="projectForm.proj_phone" placeholder="请输入" @blur="
          () => {
            $refs.proj_phone.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同编号" prop="contracts_code"
              ref="contracts_code">
              <a-input v-model="projectForm.contracts_code" placeholder="请输入"
                @blur="
          () => {
            $refs.contracts_code.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="项目客服" prop="proj_pm" ref="proj_pm">
              <a-input v-model="projectForm.proj_pm" placeholder="请输入" @blur="
          () => {
            $refs.proj_pm.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="业务类型" prop="oper_type">
              <a-select v-model="projectForm.oper_type" placeholder="请选择">
                <a-select-option v-for="item in operList" :key="item.item_value"
                  :value="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="是否有效" prop="validate">
              <a-switch v-model="projectForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addProject, editProject, deleteProject } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
const searchForm = {
  client_id: '',
  client_code: '',
  client_name: '',
  paid_account_id: undefined,
  paid_name: '',
  proj_no: '',
  proj_name: ''
}
const projectForm = {
  client_id: '',
  proj_id: '',
  paid_account_id: undefined,
  proj_no: '',
  proj_name: '',
  proj_person: '',
  proj_phone: '',
  contracts_code: '',
  proj_pm: '',
  oper_type: undefined,
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '项目号',
        dataIndex: 'proj_no',
        value: 'proj_no',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '项目名称',
        dataIndex: 'proj_name',
        value: 'proj_name',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '付费账号名称',
        dataIndex: 'paid_name',
        value: 'paid_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '付费账号',
        dataIndex: 'paid_account_id',
        value: 'paid_account_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '联系人',
        dataIndex: 'proj_person',
        value: 'proj_person',
        width: 100,
        ellipsis: true
      },
      {
        title: '联系电话',
        dataIndex: 'proj_phone',
        value: 'proj_phone',
        width: 100,
        ellipsis: true
      },
      {
        title: '合同编号',
        dataIndex: 'contracts_code',
        value: 'contracts_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '项目客服',
        dataIndex: 'proj_pm',
        value: 'proj_pm',
        width: 150,
        ellipsis: true
      },
      {
        title: '业务类型',
        dataIndex: 'oper_type_name',
        value: 'oper_type_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加项目',
      isShowEditModal: false,
      confirmLoading: false,
      projectForm: {
        ...projectForm
      },
      projectFormRules: {
        proj_no: [{ required: true, message: '请输入项目号', trigger: 'blur' }],
        paid_account_id: [{ required: true, message: '请选择付费账号', trigger: 'blur' }],
        proj_name: [{ required: true, message: '请输入付项目名称', trigger: 'blur' }],
        proj_person: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        proj_phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        contracts_code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        proj_pm: [{ required: true, message: '请输入项目客服', trigger: 'blur' }],
        oper_type: [{ required: true, message: '请选择业务类型', trigger: 'blur' }]
      },
      isEdit: false
    }
  },
  components: {
    columnSelect
  },
  computed: {
    ...mapGetters({
      clientInfo: 'client/clientInfo',
      projectList: 'client/projectList',
      payAccountList: 'client/payAccountList',
      operList: 'dictionary/operList',
      isfetchProjectList: 'client/isfetchProjectList'
    })
  },
  created () {
    this.searchForm = Object.assign(this.searchForm, { client_id: this.clientInfo.client_id })
    this.projectForm = Object.assign(this.projectForm, { client_id: this.clientInfo.client_id })
  },
  mounted () {
    this.getProjectList()
  },
  methods: {
    ...mapActions({
      fetchProjectList: 'client/fetchProjectList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getProjectList () {
      this.fetchProjectList(this.searchForm)
    },
    handleSearch: debounce(function () {
      this.getProjectList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
      this.searchForm = Object.assign(this.searchForm, { client_id: this.clientInfo.client_id })
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加项目'
      if (info) {
        this.isEdit = true
        this.title = '编辑项目'
        this.projectForm = Object.assign(this.projectForm, info, {})
      }
    },
    editOk () {
      this.$refs.projectFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editProject()
          } else {
            this.addProject()
          }
        } else {
          return false
        }
      });
    },
    addProject () {
      this.confirmLoading = true
      const params = Object.assign(this.projectForm,
        {
          is_disabled: this.projectForm.validate ? 0 : 1,
          oper_type: parseInt(this.clientForm.oper_type)
        }
      )
      addProject(params).then(res => {
        this.$message.success('操作成功')
        this.getProjectList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editProject () {
      this.confirmLoading = true
      const params = Object.assign(this.projectForm,
        {
          is_disabled: this.projectForm.validate ? 0 : 1,
          oper_type: parseInt(this.clientForm.oper_type)
        }
      )
      editProject(params).then(res => {
        this.$message.success('修改成功')
        this.getProjectList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteProject (paid_account_id) {
      const params = {
        paid_account_id: paid_account_id
      }
      deleteProject(params).then(res => {
        this.$message.success('删除成功')
        this.getProjectList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.projectFormRef.resetFields()
      this.projectForm = Object.assign({}, projectForm)
      this.projectForm = Object.assign(this.projectForm, { client_id: this.clientInfo.client_id })
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    toProjectDetail (proj_id) {
      this.$router.push({ name: 'wms_project_detail', params: { id: proj_id } })
    },
    reloadList () {
      this.getProjectList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    }
  }
}
</script>

<style lang="less" scoped>
.project-search {
  background-color: #f5f5f5;
  padding: 10px 0;
  border-radius: 5px;
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
.project-table {
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
</style>