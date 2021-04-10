<template>
  <div class="employee-employee" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="员工管理"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <a-row class="content-row">
        <a-col :span="5">
          <a-card title="组织机构目录" class="left-card" :bordered="false">
            <a-tree v-if="orgTreeData && orgTreeData.length > 0" show-icon
              :default-expanded-keys="['0']" :tree-data="orgTreeData"
              @select="onTreeSelect">
              <a-icon slot="switcherIcon" type="down" />
              <a-icon slot="home" type="home" />
              <a-icon slot="apartment" type="apartment" />
            </a-tree>
            <a-spin v-else size="small" />
          </a-card>
        </a-col>
        <a-col :span="19" style="height:100%">
          <a-card title="员工信息" class="right-card" ref="contentRowRefs"
            :bordered="false">
            <div class="employee-sys-table">
              <a-row class="toolRow" type="flex" justify="space-between">
                <div>
                  <h3 class="listTitle" v-if="currentEmployeeName">
                    {{currentEmployeeName}}
                  </h3>
                </div>
                <a-row class="toolsBtn">
                  <a-space :size="12">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>添加</span>
                      </template>
                      <a-button type="primary" icon="plus-circle"
                        @click="showEditModal()" :disabled="!addable" />
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
                :data-source="employeeList" class="table-list"
                :rowKey="record => record.emp_code" :pagination="pagination"
                :loading="isfetchEmployeeList" @change="handleTableChange"
                @showSizeChange="onShowSizeChange" :scroll="{x:950}">
                <span slot="validate" slot-scope="text, record">
                  <!-- <a-popconfirm v-if="employeeList.length"
                    :title="record.validate? '确定禁用吗?': '确定启用吗?'" cancelText="取消"
                    okText="确认" @confirm="() => changeDisableEmployee(record)">
                    <a-switch :checked="record.validate" />
                  </a-popconfirm> -->
                  <a-switch :checked="record.validate"
                    @change="changeDisableEmployee(record)" />
                </span>
                <template slot="action" slot-scope="record">
                  <a-button type="link" size="small"
                    @click="showEditModal(record)">
                    编辑
                  </a-button>
                  <a-divider type="vertical" />
                  <a-popconfirm v-if="employeeList.length" title="确认删除吗?"
                    cancelText="取消" okText="确认"
                    @confirm="() => deleteEmployee(record)">
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
      cancelText="取消" okText="确定" :width="800">
      <a-form-model ref="employeeFormRef" :model="employeeForm"
        :rules="employeeFormRules" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="上级机构">
              <a-input :value="employeeForm.top_org_name" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="所属公司">
              <a-input :value="employeeForm.comp_name" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="员工工号" prop="emp_code" ref="emp_code">
              <a-input v-model="employeeForm.emp_code" :max-length="10"
                placeholder="请输入" @blur="
          () => {
            $refs.emp_code.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="员工姓名" prop="emp_name" ref="emp_name">
              <a-input v-model="employeeForm.emp_name" :max-length="30"
                placeholder="请输入" @blur="
          () => {
            $refs.emp_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="岗位职务" prop="duty" ref="duty">
              <a-input v-model="employeeForm.duty" placeholder="请输入"
                :max-length="10" @blur="
          () => {
            $refs.duty.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="工作性质" prop="job_nature">
              <!-- <a-select v-model="employeeForm.job_nature" placeholder="请选择">
                <a-select-option :value=1>
                  正式工
                </a-select-option>
                <a-select-option :value=2>
                  合同工
                </a-select-option>
                <a-select-option :value=3>
                  劳务派遣
                </a-select-option>
              </a-select> -->
              <a-radio-group v-model="employeeForm.job_nature">
                <a-radio-button :value=0>
                  正式工
                </a-radio-button>
                <a-radio-button :value=1>
                  合同工
                </a-radio-button>
                <a-radio-button :value=2>
                  劳务派遣
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="生日" prop="birthdayDate">
              <a-date-picker v-model="employeeForm.birthdayDate" type="date"
                :default-value="moment('2000-01-01', dateFormat)"
                :format="dateFormat" allowClear placeholder="请选择" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="性别" prop="gender">
              <!-- <a-select v-model="employeeForm.gender" placeholder="请选择">
                <a-select-option value="F">
                  女性
                </a-select-option>
                <a-select-option value="M">
                  男性
                </a-select-option>
                <a-select-option value="X">
                  未知
                </a-select-option>
              </a-select> -->
              <a-radio-group v-model="employeeForm.gender" default-value="F">
                <a-radio-button value="F">
                  女性
                </a-radio-button>
                <a-radio-button value="M">
                  男性
                </a-radio-button>
                <a-radio-button value="X">
                  未知
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="身份证号码" prop="idcard" ref="idcard">
              <a-input v-model="employeeForm.idcard" placeholder="请输入" @blur="
          () => {
            $refs.idcard.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="mobile" ref="mobile">
              <a-input v-model="employeeForm.mobile" placeholder="请输入" @blur="
          () => {
            $refs.mobile.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="办公电话" prop="phone" ref="phone">
              <a-input v-model="employeeForm.phone" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.phone.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="电子邮箱" prop="email" ref="email">
              <a-input v-model="employeeForm.email" placeholder="请输入"
                :max-length="50" @blur="
          () => {
            $refs.email.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="办公传真">
              <a-input v-model="employeeForm.fax" placeholder="请输入"
                :max-length="50" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="邮政编码">
              <a-input v-model="employeeForm.postcode" placeholder="请输入"
                :max-length="6" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="办公地址" prop="addr" ref="addr"
          :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }">
          <a-input v-model="employeeForm.addr" placeholder="请输入"
            :max-length="200" @blur="
          () => {
            $refs.addr.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="入职时间" prop="entryDate">
              <a-date-picker v-model="employeeForm.entryDate" type="date"
                :default-value="moment('2020-01-01', dateFormat)"
                :format="dateFormat" allowClear placeholder="请选择" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="QQ">
              <a-input v-model="employeeForm.qq" placeholder="请输入"
                :max-length="20" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="微信">
              <a-input v-model="employeeForm.wechat" placeholder="请输入"
                :max-length="30" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="排序码" prop="sort_code">
              <a-input-number v-model="employeeForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="有效">
              <a-switch v-model="employeeForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="备注" :label-col="{ span: 3 }"
          :wrapper-col="{ span: 16 }">
          <a-input v-model="employeeForm.memo" type="textarea"
            placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addEmployee, editEmployee, deleteEmployee, changeDisableEmployee } from '@/api/system.js'
import { checkPhone, checkIDCard, checkEmail } from '@/js/utils.js'
import moment from 'moment';
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
const employeeForm = {
  emp_code: '',
  emp_name: '',
  duty: '',
  job_nature: 0,
  birthdayDate: undefined,
  gender: undefined,
  mobile: '',
  email: '',
  phone: '',
  fax: '',
  postcode: '',
  addr: '',
  idcard: '',
  entryDate: undefined,
  qq: '',
  wechat: '',
  sort_code: 1,
  validate: false,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '员工名称',
        dataIndex: 'emp_name',
        value: 'emp_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '性别',
        dataIndex: 'genderName',
        value: 'genderName',
        width: 100,
        ellipsis: true
      },
      {
        title: '员工工号',
        dataIndex: 'emp_code',
        value: 'emp_code',
        width: 100,
        ellipsis: true
      },
      {
        title: '岗位/职务',
        dataIndex: 'duty',
        value: 'duty',
        width: 100,
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
        width: 100,
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
      moment,
      addable: false,
      dateFormat: 'YYYY-MM-DD',
      currentEmployeeId: '',
      currentEmployeeName: '',
      kind: 0,
      pid: '',
      title: '添加员工',
      isShowEditModal: false,
      confirmLoading: false,
      employeeForm: {
        org_id: '',
        top_org_name: '',
        comp_name: '',
        comp_id: '',
        ...employeeForm
      },
      isSubmit: false,
      employeeFormRules: {
        emp_code: [{ required: true, message: '请输入员工工号', trigger: 'blur' }],
        emp_name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        duty: [{ required: true, message: '请输入岗位职务', trigger: 'blur' }],
        job_nature: [{ required: true, message: '请选择工作性质', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证号码', trigger: 'blur' },
        { validator: this.checkIDCard, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' },
        { validator: this.checkPhone, trigger: 'blur' }],
        phone: [{ required: true, message: '请输入办公电话', trigger: 'blur' }],
        email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' },
        { validator: this.checkEmail, trigger: 'blur' }],
        addr: [{ required: true, message: '请输入办公地址', trigger: 'blur' }],
        entryDate: [{ required: true, message: '请输入入职时间', trigger: 'blur' }],
      },
      isEdit: true,
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
      orgTreeData: 'orgnization/orgTreeData',
      employeeList: 'employee/employeeList',
      total: 'employee/total',
      isfetchEmployeeList: 'employee/isfetchEmployeeList'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_employee',
      breadcrumbName: '员工管理'
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
    this.fetchOrgTreeData({})
  },
  methods: {
    ...mapActions({
      fetchOrgTreeData: 'orgnization/fetchOrgTreeData',
      fetchPageEmployeeList: 'employee/fetchPageEmployeeList',
      fetchCurrentOrgInfo: 'orgnization/fetchCurrentOrgInfo',
      fetchCurrentCompanyInfo: 'company/fetchCurrentCompanyInfo'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'employee/resetAllData'
    }),
    getEmpList () {
      let params = {
        success: () => {
          this.pagination.total = this.total
        }
      }
      if (this.kind === 1) {//公司
        params = Object.assign(params, {
          comp_id: this.currentEmployeeId,
          page_num: this.pagination.current,
          page_size: this.pagination.pageSize
        })
      } else {//组织机构
        params = Object.assign(params, {
          org_id: this.currentEmployeeId,
          page_num: this.pagination.current,
          page_size: this.pagination.pageSize
        })
      }
      this.fetchPageEmployeeList(params)
    },
    onTreeSelect (selectedKeys, e) {
      const { selected, selectedNodes, node, event } = e
      this.currentEmployeeId = node.value
      this.currentEmployeeName = node.title
      this.kind = node.$options.propsData.dataRef.kind
      this.pid = node.$options.propsData.dataRef.parent_no
      this.employeeForm = Object.assign({}, this.employeeForm, {
        org_id: this.kind === 1 ? '' : this.currentEmployeeId,
        comp_id: this.kind === 1 ? this.currentEmployeeId : '',
        top_org_name: node.title
      })
      this.getEmpList()
      if (this.kind === 1) {//公司
        this.addable = false
        this.fetchCurrentCompanyInfo({
          comp_id: this.currentEmployeeId, success: (companyInfo) => {
            this.employeeForm = Object.assign({}, this.employeeForm, {
              comp_name: companyInfo.comp_name
            })
          }
        })
      } else {//组织机构
        this.addable = true
        this.fetchCurrentOrgInfo({
          org_id: this.currentEmployeeId, success: (employeeInfo) => {
            this.fetchCurrentCompanyInfo({
              comp_id: employeeInfo.comp_id,
              success: (companyInfo) => {
                this.employeeForm = Object.assign({}, this.employeeForm, {
                  comp_name: companyInfo.comp_name,
                  comp_id: employeeInfo.comp_id
                })
              }
            })
          }
        })
      }
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getEmpList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getEmpList()
    },
    changeDisableEmployee (employeeInfo) {
      const params = {
        emp_id: employeeInfo.emp_id,
        is_disabled: employeeInfo.is_disabled === 0 ? 1 : 0,
        version: employeeInfo.version
      }
      changeDisableEmployee(params).then(res => {
        this.$message.success('修改成功')
        this.getEmpList()
        this.isShowEditModal = false
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    showEditModal (employeeInfo) {
      this.isShowEditModal = true
      if (employeeInfo) {
        this.isEdit = true
        this.title = '编辑员工'
        this.employeeForm = Object.assign(this.employeeForm, employeeInfo,
          {
            birthdayDate: moment(employeeInfo.birthday, 'YYYY-MM-DD'),
            entryDate: moment.unix(employeeInfo.entry_date).format('YYYY-MM-DD')
          })
      }
    },
    editOk () {
      this.$refs.employeeFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editEmployee()
          } else {
            this.addEmployee()
          }
        } else {
          return false
        }
      })
    },
    addEmployee () {
      this.confirmLoading = true
      const employeeForm = Object.assign(this.employeeForm, {
        is_disabled: this.employeeForm.validate ? 0 : 1,
        birthday: this.employeeForm.birthdayDate ? this.employeeForm.birthdayDate.format('YYYY-MM-DD') : '',
        entry_date: this.employeeForm.entryDate ? Math.round(new Date(this.employeeForm.entryDate).getTime() / 1000) : 0
      })
      const params = {
        ...employeeForm,
        success: () => {
          this.$message.success('操作成功')
          this.getEmpList()
          this.editCancel()
        }
      }
      addEmployee(params).then(res => {
        if (params.success) {
          params.success()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editEmployee () {
      this.confirmLoading = true
      const params = Object.assign(this.employeeForm,
        {
          is_disabled: this.employeeForm.validate ? 0 : 1,
          birthday: this.employeeForm.birthdayDate ? this.employeeForm.birthdayDate.format('YYYY-MM-DD') : '',
          entry_date: this.employeeForm.entryDate ? Math.round(new Date(this.employeeForm.entryDate).getTime() / 1000) : 0
        }
      )
      editEmployee(params).then(res => {
        this.$message.success('修改成功')
        this.getEmpList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteEmployee (employeeInfo) {
      const params = {
        emp_id: employeeInfo.emp_id,
        version: employeeInfo.version
      }
      deleteEmployee(params).then(res => {
        this.$message.success('删除成功')
        this.getEmpList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.employeeFormRef.resetFields()
      this.employeeForm = Object.assign(this.employeeForm, employeeForm)
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
    checkIDCard (rule, value, callback) {
      if (!checkIDCard(value)) {
        callback('身份证号有误，请重填！')
      } else {
        callback()
      }
    },
    checkEmail (rule, value, callback) {
      if (!checkEmail(value)) {
        callback('邮箱地址有误，请重填！')
      } else {
        callback()
      }
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getEmpList()
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
.employee-employee {
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