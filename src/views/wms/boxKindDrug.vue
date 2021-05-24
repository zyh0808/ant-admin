<template>
  <div class="wms-box-kind-drug" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="箱型药品配置"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="box-kind-drug-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="箱型名称">
                <a-select v-model="searchForm.box_kind_id" placeholder="请选择"
                  allowClear>
                  <a-select-option v-for="item in boxKindList"
                    :key="item.box_kind_id" :value='item.box_kind_id'>
                    {{ item.box_kind_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="药品名称">
                <a-input v-model="searchForm.drug_name" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="6">
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
      <div class="box-kind-drug-table">
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
                  @changeColumns="changeColumns"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef"
          :data-source="boxKindDrugList" class="table-list"
          :rowKey="record => record.boxkind_drug_id"
          :loading="isfetchBoxKindDrugList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange">
          <!-- :scroll="{x:890}" -->
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
            <a-popconfirm v-if="boxKindDrugList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteBoxKindDrug(record.boxkind_drug_id)">
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
        cancelText="取消" okText="确定" :width="700">
        <a-form-model ref="boxKindDrugFormRef" :model="boxKindDrugForm"
          :rules="boxKindDrugFormRules" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="箱型名称" prop="box_kind_id"
                ref="box_kind_id">
                <a-select v-model="boxKindDrugForm.box_kind_id"
                  placeholder="请选择" allowClear>
                  <a-select-option v-for="item in boxKindList"
                    :key="item.box_kind_id" :value='item.box_kind_id'>
                    {{ item.box_kind_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药品名称" prop="drug_id" ref="drug_id">
                <a-select v-model="boxKindDrugForm.drug_id" placeholder="请选择"
                  @select="getDrugInfo" allowClear>
                  <a-select-option v-for="item in drugList" :key="item.drug_id"
                    :value='item.drug_id'>
                    {{ item.drug_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="药品规格" ref="spec">
                <a-input v-model="boxKindDrugForm.spec" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药品包装" ref="pck_unit">
                <a-input v-model="boxKindDrugForm.pck_unit" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="最多存放量" prop="max_value" ref="max_value">
                <a-input-number v-model="boxKindDrugForm.max_value"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.max_value.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="报警下限值" prop="warn_min_value"
                ref="warn_min_value">
                <a-input-number v-model="boxKindDrugForm.warn_min_value"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.warn_min_value.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="报警上限值" prop="warn_max_value"
                ref="warn_max_value">
                <a-input-number v-model="boxKindDrugForm.warn_max_value"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.warn_max_value.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="有效">
                <a-switch v-model="boxKindDrugForm.validate" />
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
import { addBoxKindDrug, editBoxKindDrug, deleteBoxKindDrug, getDrugInfo } from '@/api/wms.js'
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
  box_kind_id: undefined,
  drug_name: ''
}
const boxKindDrugForm = {
  box_kind_id: undefined,
  drug_id: undefined,
  max_value: 0,
  warn_min_value: 0,
  warn_max_value: 0,
  box_kind_name: '',
  drug_code: '',
  drug_name: '',
  spec: '',
  pck_unit: '',
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '箱型名称',
        dataIndex: 'box_kind_name',
        value: 'box_kind_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        value: 'drug_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '最多存放量',
        dataIndex: 'max_value',
        value: 'max_value',
        // width: 100,
        ellipsis: true
      },
      {
        title: '药品规格',
        dataIndex: 'spec',
        value: 'spec',
        // width: 150,
        ellipsis: true
      },
      {
        title: '药品包装',
        dataIndex: 'pck_unit',
        value: 'pck_unit',
        // width: 100,
        ellipsis: true
      },
      {
        title: '是否有效',
        dataIndex: 'validate',
        value: 'validate',
        // width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' }
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 140,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加箱型药品配置',
      isShowEditModal: false,
      confirmLoading: false,
      boxKindDrugForm: { ...boxKindDrugForm },
      // setTempList: [],
      boxKindDrugFormRules: {
        box_kind_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        drug_id: [{ required: true, message: '请选择药品名称', trigger: 'blur' }],
        max_value: [{ required: true, message: '请输入最多存放量', trigger: 'blur' }],
        warn_min_value: [{ required: true, message: '请输入报警下限值', trigger: 'blur' }],
        warn_max_value: [{ required: true, message: '请输入报警上限值', trigger: 'blur' }]
      },
      isEdit: false,
      // boxKindDrugInfo: {},
      pagination: { ...pagination },
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
      path: 'wms_boxkinddrug',
      breadcrumbName: '箱型药品配置'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchBoxKindDrugList: 'box/isfetchBoxKindDrugList',
      boxKindDrugList: 'box/boxKindDrugList',
      boxKindList: 'box/boxKindList',
      drugList: 'drug/drugList',
      boxKindDrugTotal: 'box/boxKindDrugTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getBoxKindDrugList()
    this.fetchDrugList({ drug_code: '', drug_name: '', op_type: -1 })
    this.fetchBoxKindList({ category: -1, boxKindDrug_kind_name: '' })
  },
  methods: {
    ...mapActions({
      fetchBoxKindDrugPageList: 'box/fetchBoxKindDrugPageList',
      fetchBoxKindList: 'box/fetchBoxKindList',
      fetchDrugList: 'drug/fetchDrugList',
      fetchBoxKindInfo: 'box/fetchBoxKindInfo'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getBoxKindDrugList () {
      const params = {
        box_kind_id: this.searchForm.box_kind_id ? this.searchForm.box_kind_id : '',
        drug_name: this.searchForm.drug_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.boxKindDrugTotal
        }
      }
      this.fetchBoxKindDrugPageList(params)
    },
    getDrugInfo (drug_id) {
      getDrugInfo({ drug_id }).then(res => {
        const drugInfo = res
        this.boxKindDrugForm = Object.assign(this.boxKindDrugForm, {
          spec: drugInfo.spec,
          pck_unit: drugInfo.pck_unit
        })
      })
    },
    handleSearch: debounce(function () {
      this.getBoxKindDrugList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxKindDrugList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxKindDrugList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加箱型药品配置'
      if (info) {
        this.isEdit = true
        this.title = '编辑箱型药品配置'
        this.boxKindDrugForm = Object.assign(this.boxKindDrugForm, info, {})
      }
    },
    editOk () {
      this.$refs.boxKindDrugFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editBoxKindDrug()
          } else {
            this.addBoxKindDrug()
          }
        } else {
          return false
        }
      });
    },
    addBoxKindDrug () {
      this.confirmLoading = true
      let params = Object.assign(this.boxKindDrugForm,
        { is_disabled: this.boxKindDrugForm.validate ? 0 : 1 }
      )
      addBoxKindDrug(params).then(res => {
        this.$message.success('操作成功')
        this.getBoxKindDrugList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    editBoxKindDrug () {
      this.confirmLoading = true
      const params = Object.assign(this.boxKindDrugForm,
        { is_disabled: this.boxKindDrugForm.validate ? 0 : 1 }
      )
      editBoxKindDrug(params).then(res => {
        this.$message.success('修改成功')
        this.getBoxKindDrugList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    deleteBoxKindDrug (boxkind_drug_id) {
      const params = {
        boxkind_drug_id: boxkind_drug_id
      }
      deleteBoxKindDrug(params).then(res => {
        this.$message.success('删除成功')
        this.getBoxKindDrugList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.boxKindDrugFormRef.resetFields()
      this.boxKindDrugForm = Object.assign({}, boxKindDrugForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getBoxKindDrugList()
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
.wms-box-kind-drug {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .box-kind-drug-search {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px 0;
    .search-form {
      margin: 10px 20px;
      .searchRow {
        // height: 40px;
        // line-height: 40px;
        align-items: center;
        padding: 0 20px;
        .ant-form-item {
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }
  .box-kind-drug-table {
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
.table-row {
  height: 32px;
  line-height: 32px;
}
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
}
</style>