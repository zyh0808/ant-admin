<template>
  <div class="wms-client">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="申办方信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="client-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 10 }"
          :wrapper-col="{ span: 14 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="申办方编码">
                <a-input v-model="searchForm.client_code" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="申办方名称">
                <a-input v-model="searchForm.client_name" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="所在城市">
                <a-input v-model="searchForm.city" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item :label-col="{ span: 0 }"
                :wrapper-col="{ span: 24 }">
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
      <div class="client-table">
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
                  @changeColumns="changeColumns">
                </columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" :data-source="clientList"
          class="table-one" :rowKey="record => record.client_id"
          :loading="isfetchClientList" :pagination="false" :scroll="{x: 1900}">
          <span slot="validate" slot-scope="validate">
            <!-- <a-switch :checked="validate" disabled /> -->
            <a-tag v-if="validate" color="green">
              有效</a-tag>
            <a-tag v-else color="red">无效</a-tag>
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="toClientDetail(record)">
              查看详情
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="clientList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteClient(record.client_id)">
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
        <a-form-model ref="clientFormRef" :model="clientForm"
          :rules="clientFormRules" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="申办方编码" prop="client_code"
                ref="client_code">
                <a-input v-model="clientForm.client_code" placeholder="请输入"
                  @blur="
          () => {
            $refs.client_code.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="申办方名称" prop="client_name"
                ref="client_name">
                <a-input v-model="clientForm.client_name" placeholder="请输入"
                  @blur="
          () => {
            $refs.client_name.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="所在城市" prop="city" ref="city">
                <a-input v-model="clientForm.city" placeholder="请输入" @blur="
          () => {
            $refs.city.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人" prop="linkman" ref="linkman">
                <a-input v-model="clientForm.linkman" placeholder="请输入" @blur="
          () => {
            $refs.linkman.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="联系人电话" prop="phone" ref="phone">
                <a-input v-model="clientForm.phone" placeholder="请输入" @blur="
          () => {
            $refs.phone.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="合同编号" prop="contracts_code"
                ref="contracts_code">
                <a-input v-model="clientForm.contracts_code" placeholder="请输入"
                  @blur="
          () => {
            $refs.contracts_code.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="营销类型" prop="marketing_type">
                <a-select v-model="clientForm.marketing_type" placeholder="请选择">
                  <a-select-option :value=0>
                    独立开发
                  </a-select-option>
                  <a-select-option :value=1>
                    合作开发
                  </a-select-option>
                  <a-select-option :value=2>
                    分享客户
                  </a-select-option>
                  <a-select-option :value=3>
                    交接客户
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="销售员" prop="salesman" ref="salesman">
                <a-input v-model="clientForm.salesman" placeholder="请输入" @blur="
          () => {
            $refs.salesman.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="发票类型" prop="invoice_type">
                <a-select v-model="clientForm.invoice_type" placeholder="请选择">
                  <a-select-option v-for="item in ticketList"
                    :key="item.item_value" :value="item.item_value">
                    {{item.item_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="是否有效" prop="validate">
                <a-switch v-model="clientForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="发票抬头" prop="invoice_head" ref="invoice_head"
            :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
            <a-input v-model="clientForm.invoice_head" placeholder="请输入" @blur="
          () => {
            $refs.invoice_head.onFieldBlur()
          }" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addClient, editClient, deleteClient } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
const searchForm = {
  client_code: '',
  client_name: '',
  city: ''
}
const clientForm = {
  client_id: '',
  client_code: '',
  client_name: '',
  linkman: '',
  phone: '',
  contracts_code: '',
  city: '',
  marketing_type: undefined,
  salesman: '',
  invoice_type: undefined,
  invoice_head: '',
  // version: 1,
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '申办方编码',
        dataIndex: 'client_code',
        value: 'client_code',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '申办方名称',
        dataIndex: 'client_name',
        value: 'client_name',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
        value: 'linkman',
        width: 150,
        ellipsis: true
      },
      {
        title: '联系人电话',
        dataIndex: 'phone',
        value: 'phone',
        width: 150,
        ellipsis: true
      },
      {
        title: '所在城市',
        dataIndex: 'city',
        value: 'city',
        width: 150,
        ellipsis: true
      },
      {
        title: '合同编码',
        dataIndex: 'contracts_code',
        value: 'contracts_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '营销类型',
        dataIndex: 'marketing_type_name',
        value: 'marketing_type_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '销售员',
        dataIndex: 'salesman',
        value: 'salesman',
        width: 150,
        ellipsis: true
      },
      {
        title: '发票类型',
        dataIndex: 'invoice_type_name',
        value: 'invoice_type_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '发票抬头',
        value: 'invoice_head',
        dataIndex: 'invoice_head',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 260,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加申办方信息',
      isShowEditModal: false,
      confirmLoading: false,
      clientForm: {
        ...clientForm
      },
      clientFormRules: {
        client_code: [{ required: true, message: '请输入申办方编码', trigger: 'blur' }],
        client_name: [{ required: true, message: '请输入申办方名称', trigger: 'blur' }],
        city: [{ required: true, message: '请选择所在城市', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
        contracts_code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        marketing_type: [{ required: true, message: '请选择营销类型', trigger: 'blur' }],
        salesman: [{ required: true, message: '请输入销售员', trigger: 'blur' }],
        invoice_type: [{ required: true, message: '请选择发票类型', trigger: 'blur' }],
        invoice_head: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }]
      },
      isEdit: false,
      system: 'wms'
    }
  },
  components: {
    columnSelect,
    pageHeader
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '仓库管理',
    },
    {
      path: 'wms_client',
      breadcrumbName: '申办方信息'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      clientList: 'client/clientList',
      ticketList: 'dictionary/ticketList',
      isfetchClientList: 'client/isfetchClientList'
    })
  },
  mounted () {
    this.fetchTicketList({
      parent_value: '1002',
      kind_code: '',
      is_disabled: -1,
      success: () => {
        this.getClientList()
      }
    })
    this.fetchOperList({
      parent_value: '1001',
      kind_code: '',
      is_disabled: -1
    })
  },
  methods: {
    ...mapActions({
      fetchClientList: 'client/fetchClientList',
      fetchTicketList: 'dictionary/fetchTicketList',
      fetchOperList: 'dictionary/fetchOperList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      setClientInfo: 'client/setClientInfo'
    }),
    getClientList () {
      const params = {
        client_code: this.searchForm.client_code,
        client_name: this.searchForm.client_name,
        city: this.searchForm.city
      }
      this.fetchClientList(params)
    },
    handleSearch: debounce(function () {
      this.getClientList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加申办方信息'
      if (info) {
        this.isEdit = true
        this.title = '编辑申办方信息'
        this.clientForm = Object.assign(this.clientForm, info, { invoice_type: info.invoice_type + '' })
      }
    },
    editOk () {
      this.$refs.clientFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editClient()
          } else {
            this.addClient()
          }
        } else {
          return false
        }
      });
    },
    addClient () {
      this.confirmLoading = true
      const params = Object.assign(this.clientForm,
        {
          is_disabled: this.clientForm.validate ? 0 : 1,
          invoice_type: parseInt(this.clientForm.invoice_type)
        }
      )
      addClient(params).then(res => {
        this.$message.success('操作成功')
        this.getClientList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editClient () {
      this.confirmLoading = true
      const params = Object.assign(this.clientForm,
        {
          is_disabled: this.clientForm.validate ? 0 : 1,
          invoice_type: parseInt(this.clientForm.invoice_type)
        }
      )
      editClient(params).then(res => {
        this.$message.success('修改成功')
        this.getClientList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteClient (clientId) {
      const params = {
        sys_id: clientId
      }
      deleteClient(params).then(res => {
        this.$message.success('删除成功')
        this.getClientList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.clientForm = Object.assign({}, clientForm)
      this.$refs.clientFormRef.resetFields()
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    toClientDetail (client) {
      this.setClientInfo(client)
      this.$router.push({ name: 'wms_client_detail', params: { id: client.client_id } })
    },
    reloadList () {
      this.getClientList()
    },
    changeColumns (columns) {
      this.tableColumns = columns
    }
  }
}
</script>

<style lang="less" scoped>
.wms-client {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .client-search {
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
  .client-table {
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
</style>