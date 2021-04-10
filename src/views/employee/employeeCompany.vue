<template>
  <div class="employee-company" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="公司信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <a-row class="content-row">
        <a-col :span="5">
          <a-card title="目录信息" :bordered="false" class="left-card">
            <a-tree autoExpandParent show-icon
              v-if="companyTreeData && companyTreeData.length > 0"
              :tree-data="companyTreeData" default-expand-all
              @select="onTreeSelect">
              <a-icon slot="switcherIcon" type="down" />
              <a-icon slot="home" type="home" />
            </a-tree>
            <a-spin v-else size="small" />
          </a-card>
        </a-col>
        <a-col :span="19" style="height:100%">
          <a-card title="区域信息" class="right-card" :bordered="false"
            ref="contentRowRefs">
            <div class="employee-sys-table">
              <a-row class="toolRow" type="flex" justify="space-between">
                <div>
                  <h3 class="listTitle" v-if="currentCompanyId">
                    {{currentCompanyInfo.comp_name}}
                  </h3>
                </div>
                <a-row class="toolsBtn">
                  <a-space :size="12">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>添加</span>
                      </template>
                      <a-button type="primary" icon="plus-circle"
                        @click="showEditModal()"
                        :disabled="currentCompanyId === ''" />
                    </a-tooltip>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>刷新</span>
                      </template>
                      <a-button type="dashed" icon="reload"
                        @click="reloadList" />
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
              <a-table :columns="tableColumns" ref="tableRef"
                :data-source="companyList" class="table-list"
                :rowKey="record => record.comp_id" :loading="isfetchCompanyList"
                :pagination="pagination" @change="handleTableChange"
                @showSizeChange="onShowSizeChange" :scroll="{x:1350}">
                <span slot="validate" slot-scope="validate">
                  <a-switch :checked="validate" disabled />
                </span>
                <template slot="action" slot-scope="record">
                  <a-button type="link" size="small"
                    @click="showEditModal(record)">
                    编辑
                  </a-button>
                  <a-divider type="vertical" />
                  <a-popconfirm v-if="companyList.length" title="确认删除吗?"
                    cancelText="取消" okText="确认"
                    @confirm="() => deleteCompany(record.comp_id)">
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
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="1000">
      <a-form-model ref="companyFormRef" :model="companyForm"
        :rules="companyFormRules" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="16">
            <a-form-model-item label="上级名称" :label-col="{ span: 3 }"
              :wrapper-col="{ span: 16 }">
              <a-input :value="currentCompanyInfo.comp_name" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="公司名称" prop="comp_name" ref="comp_name">
              <a-input v-model="companyForm.comp_name" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.comp_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="公司简称" prop="short_name" ref="short_name">
              <a-input v-model="companyForm.short_name" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.short_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="英文名称" prop="en_name" ref="en_name">
              <a-input v-model="companyForm.en_name" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.en_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="公司分类">
              <a-select v-model="companyForm.category" placeholder="请选择">
                <a-select-option :value=1>
                  客服部
                </a-select-option>
                <a-select-option :value=2>
                  营销
                </a-select-option>
                <a-select-option :value=3>
                  职能
                </a-select-option>
                <a-select-option :value=4>
                  运营
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="法人代表" prop="manager" ref="manager">
              <a-input v-model="companyForm.manager" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.manager.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="公司性质" prop="nature">
              <!-- <a-select v-model="companyForm.nature" placeholder="请选择">
                <a-select-option :value=0>
                  直营
                </a-select-option>
                <a-select-option :value=1>
                  加盟
                </a-select-option>
                <a-select-option :value=2>
                  分控
                </a-select-option>
              </a-select> -->
              <a-radio-group v-model="companyForm.nature">
                <a-radio-button :value=0>
                  直营
                </a-radio-button>
                <a-radio-button :value=1>
                  加盟
                </a-radio-button>
                <a-radio-button :value=2>
                  分控
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="开户行" prop="bank_name" ref="bank_name">
              <a-input v-model="companyForm.bank_name" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.bank_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="银行账号" prop="bank_account"
              ref="bank_account">
              <a-input v-model="companyForm.bank_account" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.bank_account.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="联系电话" prop="telephone" ref="telephone">
              <a-input v-model="companyForm.telephone" placeholder="请输入" @blur="
          () => {
            $refs.telephone.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="传真" prop="fax" ref="fax">
              <a-input v-model="companyForm.fax" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.fax.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="省份" prop="province_id" ref="province_id">
              <a-select v-model="companyForm.province_id"
                @select="fetchCityList" :loading="isfetchProvinceList"
                placeholder="请选择">
                <a-select-option v-for="item in provinceList"
                  :value="item.item_value" :key="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="市区" prop="city_id" ref="city_id">
              <a-select v-model="companyForm.city_id" @select="fetchCountyList"
                :loading="isfetchCityList" :disabled="cityList.length === 0"
                placeholder="请选择">
                <a-select-option v-for="item in cityList"
                  :value="item.item_value" :key="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="县/区" prop="county_id" ref="county_id">
              <a-select v-model="companyForm.county_id" @select="fetchTownList"
                :loading="isfetchCountyList" :disabled="countyList.length === 0"
                placeholder="请选择">
                <a-select-option v-for="item in countyList"
                  :value="item.item_value" :key="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="街道/镇" prop="town_id" ref="town_id">
              <a-select v-model="companyForm.town_id" @select="fetchVillageList"
                :loading="isfetchTownList" :disabled="townList.length === 0"
                placeholder="请选择">
                <a-select-option v-for="item in townList"
                  :value="item.item_value" :key="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="社区/村" prop="village_id" ref="village_id">
              <a-select v-model="companyForm.village_id"
                :loading="isfetchVillageList"
                :disabled="villageList.length === 0" placeholder="请选择">
                <a-select-option v-for="item in villageList"
                  :value="item.item_value" :key="item.item_value">
                  {{item.item_name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <a-form-model-item label="详细地址" prop="addr" ref="addr"
              :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }">
              <a-input v-model="companyForm.addr" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.addr.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="排序码" prop="sort_code">
              <a-input-number v-model="companyForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="有效">
              <a-switch v-model="companyForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="经营范围" :label-col="{ span: 2 }"
          :wrapper-col="{ span: 16 }">
          <a-input v-model="companyForm.biz_scope" type="textarea"
            placeholder="请输入" :max-length="200" />
        </a-form-model-item>
        <a-form-model-item label="备注" :label-col="{ span: 2 }"
          :wrapper-col="{ span: 16 }">
          <a-input v-model="companyForm.memo" type="textarea" placeholder="请输入"
            :max-length="200" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addCompany, editCompany, deleteCompany } from '@/api/system.js'
import { checkPhone } from '@/js/utils.js'
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
const companyForm = {
  comp_name: '',
  short_name: '',
  en_name: '',
  category: undefined,
  manager: '',
  nature: 0,
  bank_name: '',
  bank_account: '',
  telephone: '',
  fax: '',
  province_id: undefined,
  city_id: undefined,
  county_id: undefined,
  town_id: undefined,
  village_id: undefined,
  addr: '',
  sort_code: 1,
  validate: true,
  biz_scope: '',
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'comp_name',
        value: 'comp_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '公司简称',
        dataIndex: 'short_name',
        value: 'short_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '英文名称',
        dataIndex: 'en_name',
        value: 'en_name',
        width: 100,
        ellipsis: true
      },
      {
        title: '公司分类',
        dataIndex: 'categoryName',
        value: 'categoryName',
        width: 100,
        ellipsis: true
      },
      {
        title: '公司性质',
        dataIndex: 'natureName',
        value: 'natureName',
        width: 100,
        ellipsis: true
      },
      {
        title: '法人代表',
        dataIndex: 'manager',
        value: 'manager',
        width: 100,
        ellipsis: true
      },
      {
        title: '经营范围',
        dataIndex: 'biz_scope',
        value: 'biz_scope',
        width: 150,
        ellipsis: true
      },
      {
        title: '税号',
        dataIndex: 'tax_code',
        value: 'tax_code',
        width: 200,
        ellipsis: true
      },
      {
        title: '排序码',
        dataIndex: 'sort_code',
        value: 'sort_code',
        width: 100,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 50,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
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
      currentCompanyId: '',
      contentHeight: 0,
      title: '添加公司',
      isShowEditModal: false,
      confirmLoading: false,
      companyForm,
      isSubmit: false,
      companyFormRules: {
        comp_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        short_name: [{ required: true, message: '请输入公司简称', trigger: 'blur' }],
        en_name: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        manager: [{ required: true, message: '请输入法人代表', trigger: 'blur' }],
        bank_name: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        bank_account: [{ required: true, message: '请输入银行账号', trigger: 'blur' },
        { min: 16, message: '请输入至少16位银行账号', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, {
          validator: this.checkPhone, trigger: 'blur'
        }],
        fax: [{ required: true, message: '请输入传真', trigger: 'blur' }],
        province_id: [{ required: true, message: '请选择省份', trigger: 'blur' }],
        city_id: [{ required: true, message: '请选择市区', trigger: 'blur' }],
        county_id: [{ required: true, message: '请选择县/区', trigger: 'blur' }],
        town_id: [{ required: true, message: '请选择街道/镇', trigger: 'blur' }],
        village_id: [{ required: true, message: '请选择社区/村', trigger: 'blur' }],
        addr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        sort_code: [{ required: true, message: '请输入排序码', trigger: 'blur' }],
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
      companyTreeData: 'company/companyTreeData',
      companyList: 'company/companyList',
      total: 'company/total',
      isfetchCompanyList: 'company/isfetchCompanyList',
      currentCompanyInfo: 'company/currentCompanyInfo',
      isfetchProvinceList: 'area/isfetchProvinceList',
      isfetchCityList: 'area/isfetchCityList',
      isfetchCountyList: 'area/isfetchCountyList',
      isfetchTownList: 'area/isfetchTownList',
      isfetchVillageList: 'area/isfetchVillageList',
      provinceList: 'area/provinceList',
      cityList: 'area/cityList',
      countyList: 'area/countyList',
      townList: 'area/townList',
      villageList: 'area/villageList'
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
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.fetchCompanyTreeData({})
  },
  methods: {
    ...mapActions({
      fetchCompanyTreeData: 'company/fetchCompanyTreeData',
      fetchCompanyList: 'company/fetchCompanyList',
      fetchCurrentCompanyInfo: 'company/fetchCurrentCompanyInfo',
      fetchProvinceList: 'area/fetchProvinceList',
      fetchCityList: 'area/fetchCityList',
      fetchCityList: 'area/fetchCityList',
      fetchCountyList: 'area/fetchCountyList',
      fetchTownList: 'area/fetchTownList',
      fetchVillageList: 'area/fetchVillageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'company/resetAllData'
    }),
    getCompanyList () {
      this.fetchCompanyList({
        pid: this.currentCompanyId,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.total
        }
      })
    },
    onTreeSelect (selectedKeys) {
      this.currentCompanyId = selectedKeys[0]
      this.fetchCurrentCompanyInfo({ comp_id: this.currentCompanyId })
      this.getCompanyList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCompanyList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCompanyList()
    },
    showEditModal (companyInfo) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加公司'
      this.fetchProvinceList({})
      if (companyInfo) {
        this.isEdit = true
        this.title = '编辑公司'
        this.fetchCityList(companyInfo.province_id)
        this.fetchCountyList(companyInfo.city_id)
        this.fetchTownList(companyInfo.county_id)
        this.fetchVillageList(companyInfo.town_id)
        this.companyForm = Object.assign(this.companyForm, companyInfo, {})
      }
    },
    editOk () {
      this.$refs.companyFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editCompany()
          } else {
            this.addCompany()
          }
        } else {
          return false
        }
      })
    },
    addCompany () {
      this.confirmLoading = true
      const params = Object.assign(this.companyForm,
        {
          is_disabled: this.companyForm.validate ? 0 : 1,
          pid: this.currentCompanyId
        }
      )
      addCompany(params).then(res => {
        this.$message.success('操作成功')
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCompany () {
      this.confirmLoading = true
      const params = Object.assign(this.companyForm,
        {
          is_disabled: this.companyForm.validate ? 0 : 1,
          pid: this.currentCompanyId
        }
      )
      editCompany(params).then(res => {
        this.$message.success('修改成功')
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteCompany (comp_id) {
      const params = {
        comp_id: comp_id
      }
      deleteCompany(params).then(res => {
        this.$message.success('删除成功')
        this.getCompanyList()
        this.fetchCompanyTreeData({})
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.companyForm = Object.assign({}, companyForm)
      this.getCompanyList()
      this.fetchCompanyTreeData({})
      this.isShowEditModal = false
      this.confirmLoading = false
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
      this.getCompanyList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
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
.employee-company {
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