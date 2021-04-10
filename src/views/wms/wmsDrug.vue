<template>
  <div class="wms-drug" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="药品信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="drug-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <!-- <a-col :span="6">
              <a-form-model-item label="药品编号">
                <a-input v-model="searchForm.drug_code" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col> -->
            <a-col :span="6">
              <a-form-model-item label="药品名称">
                <a-input v-model="searchForm.drug_name" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="作业模式">
                <a-select v-model="searchForm.op_type" placeholder="请选择">
                  <a-select-option :value=0>
                    编盲药
                  </a-select-option>
                  <a-select-option :value=1>
                    非编盲药
                  </a-select-option>
                </a-select>
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
      <div class="drug-table">
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
        <a-table :columns="tableColumns" ref="tableRef" :data-source="drugList"
          class="table-list" :rowKey="record => record.drug_id"
          :loading="isfetchDrugList" :pagination="false" :scroll="{x: 1690}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="drugList.length" title="确认删除吗?" cancelText="取消"
              okText="确认" @confirm="() => deleteDrug(record.drug_id)">
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
      <a-modal :title="title" :visible="isShowEditModal"
        :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
        cancelText="取消" okText="确定" :width="800">
        <a-form-model ref="drugFormRef" :model="drugForm" :rules="drugFormRules"
          :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <!-- <a-col :span="12">
              <a-form-model-item label="药品编号" prop="drug_code" ref="drug_code">
                <a-input v-model="drugForm.drug_code" placeholder="请输入"
                  @blur="
          () => {
            $refs.drug_code.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col> -->

          <a-form-model-item label="药品名称" prop="drug_name" ref="drug_name"
            :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
            <a-input v-model="drugForm.drug_name" placeholder="请输入" @blur="
          () => {
            $refs.drug_name.onFieldBlur()
          }" />
          </a-form-model-item>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="作业模式" prop="op_type">
                <!-- <a-select v-model="drugForm.op_type" placeholder="请选择">
                  <a-select-option :value=0>
                    编盲药
                  </a-select-option>
                  <a-select-option :value=1>
                    非编盲药
                  </a-select-option>
                </a-select> -->
                <a-radio-group v-model="drugForm.op_type">
                  <a-radio-button :value=0>
                    编盲药
                  </a-radio-button>
                  <a-radio-button :value=1>
                    非编盲药
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药品规格" prop="spec" ref="spec">
                <a-input v-model="drugForm.spec" placeholder="请输入" @blur="
          () => {
            $refs.spec.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="存储条件" prop="env" ref="env">
                <a-input v-model="drugForm.env" placeholder="请输入" @blur="
          () => {
            $refs.env.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="温度区间" prop="temp_range"
                ref="temp_range">
                <a-input v-model="drugForm.temp_range" placeholder="请输入" @blur="
          () => {
            $refs.temp_range.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="有效值" prop="valid_period"
                ref="valid_period">
                <a-input-number v-model="drugForm.valid_period"
                  placeholder="请输入" @blur="
          () => {
            $refs.valid_period.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="有效值类型" prop="period_unit"
                ref="period_unit">
                <!-- <a-select v-model="drugForm.period_unit" placeholder="请选择">
                  <a-select-option :value=1>
                    天
                  </a-select-option>
                  <a-select-option :value=2>
                    月
                  </a-select-option>
                  <a-select-option :value=3>
                    年
                  </a-select-option>
                </a-select> -->
                <a-radio-group v-model="drugForm.period_unit">
                  <a-radio-button :value=0>
                    天
                  </a-radio-button>
                  <a-radio-button :value=1>
                    月
                  </a-radio-button>
                  <a-radio-button :value=2>
                    年
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="药品包装(单位)" prop="pck_unit"
                ref="pck_unit">
                <a-input v-model="drugForm.pck_unit" placeholder="请输入" @blur="
          () => {
            $refs.pck_unit.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="最小包装数量" prop="min_pck_cnt"
                ref="min_pck_cnt">
                <a-input-number v-model="drugForm.min_pck_cnt" placeholder="请输入"
                  @blur="
          () => {
            $refs.min_pck_cnt.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="包装长(cm)" prop="pck_len" ref="pck_len">
                <a-input-number v-model="drugForm.pck_len" placeholder="请输入"
                  @blur="
          () => {
            $refs.pck_len.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="包装宽(cm)" prop="pck_width"
                ref="pck_width">
                <a-input-number v-model="drugForm.pck_width" placeholder="请输入"
                  @blur="
          () => {
            $refs.pck_width.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="包装高(cm)" prop="pck_height"
                ref="pck_height">
                <a-input-number v-model="drugForm.pck_height" placeholder="请输入"
                  @blur="
          () => {
            $refs.pck_height.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="预警天数" prop="warning_days"
                ref="warning_days">
                <a-input-number v-model="drugForm.warning_days"
                  placeholder="请输入" @blur="
          () => {
            $refs.warning_days.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="是否有效" prop="validate">
                <a-switch v-model="drugForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addDrug, editDrug, deleteDrug } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
const searchForm = {
  drug_name: '',
  op_type: undefined
}
const drugForm = {
  drug_name: '',
  spec: '',
  period_unit: 0,
  valid_period: 0,
  warning_days: 0,
  pck_unit: '',
  min_pck_cnt: 0,
  pck_len: 0,
  pck_width: 0,
  pck_height: 0,
  env: '',
  temp_range: '',
  op_type: 0,
  validate: true
}
export default {
  data () {
    const columns = [
      // {
      //   title: '药品编号',
      //   dataIndex: 'drug_code',
      //   value: 'drug_code',
      //   width: 150,
      //   fixed: 'left',
      //   ellipsis: true
      // },
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        value: 'drug_name',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '药品规格',
        dataIndex: 'spec',
        value: 'spec',
        width: 150,
        ellipsis: true
      },
      {
        title: '有效值',
        dataIndex: 'validPeriod',
        value: 'validPeriod',
        width: 100,
        ellipsis: true
      },
      {
        title: '预警天数',
        dataIndex: 'warning_days',
        value: 'warning_days',
        width: 100,
        ellipsis: true
      },
      {
        title: '药品包装(单位)',
        dataIndex: 'pck_unit',
        value: 'pck_unit',
        width: 150,
        ellipsis: true
      },
      {
        title: '最小包装单位数量',
        dataIndex: 'min_pck_cnt',
        value: 'min_pck_cnt',
        width: 150,
        ellipsis: true
      },
      {
        title: '包装长(cm)',
        dataIndex: 'pck_len',
        value: 'pck_len',
        width: 100,
        ellipsis: true
      },
      {
        title: '包装宽(cm)',
        dataIndex: 'pck_width',
        value: 'pck_width',
        width: 100,
        ellipsis: true
      },
      {
        title: '包装高(cm)',
        dataIndex: 'pck_height',
        value: 'pck_height',
        width: 100,
        ellipsis: true
      },
      {
        title: '存储条件',
        dataIndex: 'env',
        value: 'env',
        width: 150,
        ellipsis: true
      },
      {
        title: '温度区间',
        dataIndex: 'temp_range',
        value: 'temp_range',
        width: 150,
        ellipsis: true
      },
      {
        title: '作业模式',
        dataIndex: 'op_type_desc',
        value: 'op_type_desc',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 140,
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
      drugForm: {
        // drug_code: '',
        ...drugForm
      },
      drugFormRules: {
        // drug_code: [{ required: true, message: '请输入药品编号', trigger: 'blur' }],
        drug_name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        spec: [{ required: true, message: '请输入药品规格', trigger: 'blur' }],
        period_unit: [{ required: true, message: '请选择有效值类型', trigger: 'blur' }],
        valid_period: [{ required: true, message: '请输入有效值', trigger: 'blur' }],
        warning_days: [{ required: true, message: '请输入预警天数', trigger: 'blur' }],
        pck_unit: [{ required: true, message: '请输入药品包装(单位)', trigger: 'blur' }],
        min_pck_cnt: [{ required: true, message: '请输入含药品最小包装单位数量', trigger: 'blur' }],
        pck_len: [{ required: true, message: '请输入包装长', trigger: 'blur' }],
        pck_width: [{ required: true, message: '请输入包装宽', trigger: 'blur' }],
        pck_height: [{ required: true, message: '请输入包装高', trigger: 'blur' }],
        env: [{ required: true, message: '请输入存储条件', trigger: 'blur' }],
        temp_range: [{ required: true, message: '请输入温度区间', trigger: 'blur' }],
        op_type: [{ required: true, message: '请选择作业模式', trigger: 'blur' }]
      },
      isEdit: false,
      system: 'wms',
      showSticky: false,
      stickyWidth: 0
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
      path: 'wms_drug',
      breadcrumbName: '药品管理'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      drugList: 'drug/drugList',
      isfetchDrugList: 'drug/isfetchDrugList'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getDrugList()
  },
  methods: {
    ...mapActions({
      fetchDrugList: 'drug/fetchDrugList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getDrugList () {
      const params = {
        // drug_code: this.searchForm.drug_code,
        drug_name: this.searchForm.drug_name,
        op_type: this.searchForm.op_type ? this.searchForm.op_type : ''
      }
      this.fetchDrugList(params)
    },
    handleSearch: debounce(function () {
      this.getDrugList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加药品'
      if (info) {
        this.isEdit = true
        this.title = '编辑药品'
        this.drugForm = Object.assign(this.drugForm, info, {})
      }
    },
    editOk () {
      this.$refs.drugFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editDrug()
          } else {
            this.addDrug()
          }
        } else {
          return false
        }
      });
    },
    addDrug () {
      this.confirmLoading = true
      const params = Object.assign(this.drugForm,
        { is_disabled: this.drugForm.validate ? 0 : 1 }
      )
      addDrug(params).then(res => {
        this.$message.success('操作成功')
        this.getDrugList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editDrug () {
      this.confirmLoading = true
      const params = Object.assign(this.drugForm,
        { is_disabled: this.drugForm.validate ? 0 : 1 }
      )
      editDrug(params).then(res => {
        this.$message.success('修改成功')
        this.getDrugList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteDrug (drug_id) {
      const params = {
        drug_id: drug_id
      }
      deleteDrug(params).then(res => {
        this.$message.success('删除成功')
        this.getDrugList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.drugFormRef.resetFields()
      this.drugForm = Object.assign({}, drugForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.getDrugList()
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
.wms-drug {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .drug-search {
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
  .drug-table {
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