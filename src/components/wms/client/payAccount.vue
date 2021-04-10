<template>
  <div>
    <div class="payaccount-search">
      <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
        class="search-form" :label-col="{ span: 10 }"
        :wrapper-col="{ span: 14 }">
        <a-row class="searchRow">
          <a-col :span="6">
            <a-form-model-item label="付费账号">
              <a-input v-model="searchForm.paid_name" placeholder="请输入付费账号"
                allowClear />
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
    <div class="payaccount-table">
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
      <a-table :columns="tableColumns" :data-source="payAccountList"
        class="table-one" :rowKey="record => record.paid_account_id"
        :loading="isfetchPayAccountList" :pagination="false">
        <span slot="validate" slot-scope="validate">
          <a-switch :checked="validate" disabled />
        </span>
        <template slot="action" slot-scope="record">
          <a-button type="link" size="small" @click="showEditModal(record)">
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm v-if="payAccountList.length" title="确认删除吗?"
            cancelText="取消" okText="确认"
            @confirm="() => deletePayAccount(record.paid_account_id)">
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
      <a-form-model ref="payAccountFormRef" :model="payAccountForm"
        :rules="payAccountFormRules" :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="付费账号名称" prop="paid_name" ref="paid_name">
              <a-input v-model="payAccountForm.paid_name" placeholder="请输入"
                @blur="
          () => {
            $refs.paid_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="付费账号联系人" prop="paid_person"
              ref="paid_person">
              <a-input v-model="payAccountForm.paid_person" placeholder="请输入"
                @blur="
          () => {
            $refs.paid_person.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="付费账号联系电话" prop="paid_phone"
              ref="paid_phone">
              <a-input v-model="payAccountForm.paid_phone" placeholder="请输入"
                @blur="
          () => {
            $refs.paid_phone.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同编号" prop="contracts_code"
              ref="contracts_code">
              <a-input v-model="payAccountForm.contracts_code" placeholder="请输入"
                @blur="
          () => {
            $refs.contracts_code.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="项目客服" prop="paid_pm" ref="paid_pm">
              <a-input v-model="payAccountForm.paid_pm" placeholder="请输入" @blur="
          () => {
            $refs.paid_pm.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="业务类型" prop="oper_type">
              <a-select v-model="payAccountForm.oper_type" placeholder="请选择">
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
            <a-form-model-item label="发票类型" prop="invoice_type">
              <a-select v-model="payAccountForm.invoice_type" placeholder="请选择">
                <a-select-option v-for="item in ticketList"
                  :key="item.item_value" :value="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否有效" prop="validate">
              <a-switch v-model="payAccountForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="发票抬头" prop="invoice_head" ref="invoice_head"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-model="payAccountForm.invoice_head" placeholder="请输入"
            @blur="
          () => {
            $refs.invoice_head.onFieldBlur()
          }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addPayAccount, editPayAccount, deletePayAccount } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
const searchForm = {
  client_id: '',
  client_code: '',
  client_name: '',
  paid_name: ''
}
const payAccountForm = {
  client_id: '',
  paid_name: '',
  paid_person: '',
  paid_phone: '',
  contracts_code: '',
  paid_pm: '',
  oper_type: undefined,
  invoice_type: undefined,
  invoice_head: '',
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '付费账号名称',
        dataIndex: 'paid_name',
        value: 'paid_name',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '付费账号联系人',
        dataIndex: 'paid_person',
        value: 'paid_person',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '付费账号联系电话',
        dataIndex: 'paid_phone',
        value: 'paid_phone',
        width: 150,
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
        dataIndex: 'paid_pm',
        value: 'paid_pm',
        width: 100,
        ellipsis: true
      },
      {
        title: '业务类型',
        dataIndex: 'oper_type_name',
        value: 'oper_type_name',
        width: 100,
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
        dataIndex: 'invoice_head',
        value: 'invoice_head',
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加付费账号',
      isShowEditModal: false,
      confirmLoading: false,
      payAccountForm: {
        ...payAccountForm
      },
      payAccountFormRules: {
        paid_name: [{ required: true, message: '请输入付费账号名称', trigger: 'blur' }],
        paid_person: [{ required: true, message: '请输入付费账号联系人', trigger: 'blur' }],
        paid_phone: [{ required: true, message: '请输入付费账号联系电话', trigger: 'blur' }],
        contracts_code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        paid_pm: [{ required: true, message: '请输入项目客服', trigger: 'blur' }],
        oper_type: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
        invoice_type: [{ required: true, message: '请选择发票类型', trigger: 'blur' }],
        invoice_head: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }]
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
      payAccountList: 'client/payAccountList',
      operList: 'dictionary/operList',
      ticketList: 'dictionary/ticketList',
      isfetchPayAccountList: 'client/isfetchPayAccountList'
    })
  },
  created () {
    this.$refs.payAccountFormRef.resetFields()
    this.searchForm = Object.assign(this.searchForm, { client_id: this.clientInfo.client_id })
    this.payAccountForm = Object.assign(this.payAccountForm, { client_id: this.clientInfo.client_id })
  },
  mounted () {
    this.getPayAccountList()
  },
  methods: {
    ...mapActions({
      fetchPayAccountList: 'client/fetchPayAccountList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getPayAccountList () {
      this.fetchPayAccountList(this.searchForm)
    },
    handleSearch: debounce(function () {
      this.getPayAccountList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加付费账号'
      if (info) {
        this.isEdit = true
        this.title = '编辑付费账号'
        this.payAccountForm = Object.assign(this.payAccountForm, info, {})
      }
    },
    editOk () {
      this.$refs.payAccountFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editPayAccount()
          } else {
            this.addPayAccount()
          }
        } else {
          return false
        }
      });
    },
    addPayAccount () {
      this.confirmLoading = true
      const params = Object.assign(this.payAccountForm,
        {
          is_disabled: this.payAccountForm.validate ? 0 : 1,
          invoice_type: parseInt(this.clientForm.invoice_type),
          oper_type: parseInt(this.clientForm.oper_type)
        }
      )
      addPayAccount(params).then(res => {
        this.$message.success('操作成功')
        this.getPayAccountList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editPayAccount () {
      this.confirmLoading = true
      const params = Object.assign(this.payAccountForm,
        {
          is_disabled: this.payAccountForm.validate ? 0 : 1,
          invoice_type: parseInt(this.clientForm.invoice_type),
          oper_type: parseInt(this.clientForm.oper_type)
        }
      )
      editPayAccount(params).then(res => {
        this.$message.success('修改成功')
        this.getPayAccountList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deletePayAccount (paid_account_id) {
      const params = {
        paid_account_id: paid_account_id
      }
      deletePayAccount(params).then(res => {
        this.$message.success('删除成功')
        this.getPayAccountList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.payAccountFormRef.resetFields()
      this.payAccountForm = Object.assign({}, payAccountForm)
      this.payAccountForm = Object.assign(this.payAccountForm, { client_id: this.clientInfo.client_id })
      this.isShowEditModal = false
    },
    reloadList () {
      this.getPayAccountList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    }
  }
}
</script>

<style lang="less" scoped>
.payaccount-search {
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
.payaccount-table {
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