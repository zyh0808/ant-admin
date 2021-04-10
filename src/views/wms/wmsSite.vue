<template>
  <div class="wms-site">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="药品信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="site-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 10 }"
          :wrapper-col="{ span: 14 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="实验中心编号">
                <a-input v-model="searchForm.site_code" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="实验中心名称">
                <a-input v-model="searchForm.site_name" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="所在城市">
                <a-input v-model="searchForm.site_city" placeholder="请输入"
                  allowClear />
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
      <div class="site-table">
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
        <a-table :columns="tableColumns" :data-source="siteList"
          class="table-one" :rowKey="record => record.site_id"
          :loading="isfetchSiteList" :pagination="false" :scroll="{x: 1700}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="siteList.length" title="确认删除吗?" cancelText="取消"
              okText="确认" @confirm="() => deleteSite(record.site_id)">
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
        <a-form-model ref="siteFormRef" :model="siteForm" :rules="siteFormRules"
          :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="实验中心编码" prop="site_code"
                ref="site_code">
                <a-input v-model="siteForm.site_code" placeholder="请输入" @blur="
          () => {
            $refs.site_code.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="实验中心名称" prop="site_name"
                ref="site_name">
                <a-input v-model="siteForm.site_name" placeholder="请输入" @blur="
          () => {
            $refs.site_name.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="联系人" prop="site_person"
                ref="site_person">
                <a-input v-model="siteForm.site_person" placeholder="请输入" @blur="
          () => {
            $refs.site_person.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系电话" prop="site_phone"
                ref="site_phone">
                <a-input v-model="siteForm.site_phone" placeholder="请输入" @blur="
          () => {
            $refs.site_phone.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="合同编号" prop="contracts_code"
                ref="contracts_code">
                <a-input v-model="siteForm.contracts_code" placeholder="请输入"
                  @blur="
          () => {
            $refs.contracts_code.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="所在城市" prop="site_city" ref="site_city">
                <a-input v-model="siteForm.site_city" placeholder="请输入" @blur="
          () => {
            $refs.site_city.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="销售员" prop="current_salesman"
                ref="current_salesman">
                <a-input v-model="siteForm.current_salesman" placeholder="请输入"
                  @blur="
          () => {
            $refs.current_salesman.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="项目负责人" prop="site_pm" ref="site_pm">
                <a-input v-model="siteForm.site_pm" placeholder="请输入" @blur="
          () => {
            $refs.site_pm.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="发票类型" prop="invoice_type">
                <a-select v-model="siteForm.invoice_type" placeholder="请选择">
                  <a-select-option :value=0>
                    普票1
                  </a-select-option>
                  <a-select-option :value=1>
                    普票2
                  </a-select-option>
                  <a-select-option :value=2>
                    专票1
                  </a-select-option>
                  <a-select-option :value=3>
                    专票2
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="是否有效" prop="validate">
                <a-switch v-model="siteForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="发票抬头" prop="invoice_head" ref="invoice_head"
            :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-input v-model="siteForm.invoice_head" placeholder="请输入" @blur="
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
import { addSite, editSite, deleteSite } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
const searchForm = {
  site_code: '',
  site_name: '',
  site_city: ''
}
const siteForm = {
  site_code: '',
  site_name: '',
  site_person: '',
  site_phone: '',
  contracts_code: '',
  site_city: '',
  current_salesman: '',
  site_pm: '',
  invoice_type: undefined,
  invoice_head: '',
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '实验中心编码',
        dataIndex: 'site_code',
        value: 'site_code',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '实验中心名称',
        dataIndex: 'site_name',
        value: 'site_name',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '联系人',
        dataIndex: 'site_person',
        value: 'site_person',
        width: 150,
        ellipsis: true
      },
      {
        title: '联系电话',
        dataIndex: 'site_phone',
        value: 'site_phone',
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
        title: '所在城市',
        dataIndex: 'site_city',
        value: 'site_city',
        width: 150,
        ellipsis: true
      },
      {
        title: '销售员',
        dataIndex: 'current_salesman',
        value: 'current_salesman',
        width: 150,
        ellipsis: true
      },
      {
        title: '项目负责人',
        dataIndex: 'site_pm',
        value: 'site_pm',
        width: 150,
        ellipsis: true
      },
      {
        title: '发票类型',
        dataIndex: 'invoice_type',
        value: 'invoice_type',
        width: 150,
        ellipsis: true
      },
      {
        title: '发票抬头',
        dataIndex: 'invoice_head',
        value: 'invoice_head',
        width: 200,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 130,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: {
        ...searchForm
      },
      title: '添加药品信息',
      isShowEditModal: false,
      confirmLoading: false,
      siteForm: {
        ...siteForm
      },
      siteFormRules: {
        site_code: [{ required: true, message: '请输入实验中心编码', trigger: 'blur' }],
        site_name: [{ required: true, message: '请输入实验中心名称', trigger: 'blur' }],
        site_person: [{ required: true, message: '请输入实验中心联系人', trigger: 'blur' }],
        site_phone: [{ required: true, message: '请输入实验中心联系电话', trigger: 'blur' }],
        contracts_code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        site_city: [{ required: true, message: '请输入所在城市', trigger: 'blur' }],
        current_salesman: [{ required: true, message: '请输入销售员', trigger: 'blur' }],
        site_pm: [{ required: true, message: '请输入项目负责人', trigger: 'blur' }],
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
      path: 'wms_site',
      breadcrumbName: '实验中心列表'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      siteList: 'site/siteList',
      isfetchSiteList: 'site/isfetchSiteList'
    })
  },
  mounted () {
    this.getSiteList()
  },
  methods: {
    ...mapActions({
      fetchSiteList: 'site/fetchSiteList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getSiteList () {
      const params = {
        site_id: '',
        site_code: this.searchForm.site_code,
        site_name: this.searchForm.site_name,
        site_city: this.searchForm.site_city
      }
      this.fetchSiteList(params)
    },
    handleSearch: debounce(function () {
      this.getSiteList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加实验中心'
      if (info) {
        this.isEdit = true
        this.title = '编辑实验中心'
        this.siteForm = Object.assign(this.siteForm, info, {})
      }
    },
    editOk () {
      this.$refs.siteFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editSite()
          } else {
            this.addSite()
          }
        } else {
          return false
        }
      });
    },
    addSite () {
      this.confirmLoading = true
      const params = Object.assign(this.siteForm,
        { is_disabled: this.siteForm.validate ? 0 : 1 }
      )
      addSite(params).then(res => {
        this.$message.success('操作成功')
        this.getSiteList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editSite () {
      this.confirmLoading = true
      const params = Object.assign(this.siteForm,
        { is_disabled: this.siteForm.validate ? 0 : 1 }
      )
      editSite(params).then(res => {
        this.$message.success('修改成功')
        this.getSiteList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteSite (site_id) {
      const params = {
        site_id: site_id
      }
      deleteSite(params).then(res => {
        this.$message.success('删除成功')
        this.getSiteList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.siteForm = Object.assign({}, siteForm)
      this.$refs.siteFormRef.resetFields()
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.getSiteList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    }
  }
}
</script>

<style lang="less" scoped>
.wms-site {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .site-search {
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
  .site-table {
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