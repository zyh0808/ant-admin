<template>
  <div class="wms-temp-rang">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="温区列表"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="tempRange-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="温区编码">
                <a-input v-model="searchForm.temp_range_id" placeholder="请输入"
                  allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="温区名称">
                <a-input v-model="searchForm.temp_range_name" placeholder="请输入"
                  allowClear />
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
      <div class="tempRange-table">
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
        <a-table :columns="tableColumns" :data-source="tempRangeList"
          class="table-one" :rowKey="record => record.temp_range_id"
          :loading="isfetchTempRangeList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="tempRangeList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteTempRange(record.temp_range_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
      <a-modal :title="title" :visible="isShowEditModal"
        :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
        cancelText="取消" okText="确定" :width="700">
        <a-form-model ref="tempRangeFormRef" :model="tempRangeForm"
          :rules="tempRangeFormRules" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-form-model-item label="温区编码" prop="temp_range_id"
            ref="temp_range_id" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }">
            <a-input v-model="tempRangeForm.temp_range_id" placeholder="请输入"
              @blur="
          () => {
            $refs.temp_range_id.onFieldBlur()
          }" />
          </a-form-model-item>
          <a-form-model-item label="温区名称" prop="temp_range_name"
            ref="temp_range_name" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }">
            <a-input v-model="tempRangeForm.temp_range_name" placeholder="请输入"
              @blur="
          () => {
            $refs.temp_range_name.onFieldBlur()
          }" />
          </a-form-model-item>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="温度区间下限">
                <a-input-number v-model="tempRangeForm.temp_min" :min="0" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="温度区间上限">
                <a-input-number v-model="tempRangeForm.temp_max" :min="0" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="低温阈值">
                <a-input-number v-model="tempRangeForm.warn_min" :min="0" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="高温阈值">
                <a-input-number v-model="tempRangeForm.warn_max" :min="0" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="排序码" prop="sort_code">
                <a-input-number v-model="tempRangeForm.sort_code" :min="1" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="有效">
                <a-switch v-model="tempRangeForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="备注" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }">
            <a-input v-model="tempRangeForm.memo" placeholder="请输入"
              type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addTempRange, editTempRange, deleteTempRange } from '@/api/wms.js'
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
  temp_range_id: '',
  temp_range_name: ''
}
const tempRangeForm = {
  temp_range_id: '',
  temp_range_name: '',
  temp_min: 0,
  temp_max: 0,
  warn_min: 0,
  warn_max: 0,
  sort_code: 1,
  validate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '温区编码',
        dataIndex: 'temp_range_id',
        value: 'temp_range_id',
        // width: 150,
        ellipsis: true
      },
      {
        title: '温区名称',
        dataIndex: 'temp_range_name',
        value: 'temp_range_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '温度区间下限',
        dataIndex: 'temp_min',
        value: 'temp_min',
        // width: 150,
        ellipsis: true
      },
      {
        title: '温度区间上限',
        dataIndex: 'temp_max',
        value: 'temp_max',
        // width: 150,
        ellipsis: true
      },
      {
        title: '低温阈值',
        dataIndex: 'warn_min',
        value: 'warn_min',
        // width: 150,
        ellipsis: true
      },
      {
        title: '高温阈值',
        dataIndex: 'warn_max',
        value: 'warn_max',
        // width: 150,
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
        title: '备注',
        dataIndex: 'memo',
        value: 'memo',
        // width: 150,
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
        // fixed: 'right',
        width: 160,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: {
        ...searchForm
      },
      title: '添加温区',
      isShowEditModal: false,
      confirmLoading: false,
      tempRangeForm: { ...tempRangeForm },
      tempRangeFormRules: {
        temp_range_id: [{ required: true, message: '请输入温区编码(A ~ Z)', trigger: 'blur' }],
        temp_range_name: [{ required: true, message: '请输入温区名称', trigger: 'blur' }]
      },
      isEdit: false,
      pagination: { ...pagination },
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
      path: 'wms_tempRange',
      breadcrumbName: '温区列表'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchTempRangeList: 'house/isfetchTempRangeList',
      tempRangeList: 'house/tempRangeList',
      tempRangeTotal: 'house/tempRangeTotal',
    })
  },
  mounted () {
    this.getTempRangeList()
  },
  methods: {
    ...mapActions({
      fetchTempRangePageList: 'house/fetchTempRangePageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getTempRangeList () {
      const params = {
        temp_range_id: this.searchForm.temp_range_id,
        temp_range_name: this.searchForm.temp_range_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.tempRangeTotal
        }
      }
      this.fetchTempRangePageList(params)
    },
    handleSearch: debounce(function () {
      this.getTempRangeList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTempRangeList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTempRangeList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加温区'
      if (info) {
        this.isEdit = true
        this.title = '编辑温区'
        this.tempRangeForm = Object.assign(this.tempRangeForm, info, {})
      }
    },
    editOk () {
      this.$refs.tempRangeFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editTempRange()
          } else {
            this.addTempRange()
          }
        } else {
          return false
        }
      });
    },
    addTempRange () {
      this.confirmLoading = true
      const params = Object.assign(this.tempRangeForm,
        { is_disabled: this.tempRangeForm.validate ? 0 : 1 }
      )
      addTempRange(params).then(res => {
        this.$message.success('操作成功')
        this.getTempRangeList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editTempRange () {
      this.confirmLoading = true
      const params = Object.assign(this.tempRangeForm,
        { is_disabled: this.tempRangeForm.validate ? 0 : 1 }
      )
      editTempRange(params).then(res => {
        this.$message.success('修改成功')
        this.getTempRangeList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteTempRange (temp_range_id) {
      const params = {
        temp_range_id: temp_range_id
      }
      deleteTempRange(params).then(res => {
        this.$message.success('删除成功')
        this.getTempRangeList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.tempRangeFormRef.resetFields()
      this.tempRangeForm = Object.assign({}, tempRangeForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getTempRangeList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    }
  }
}
</script>

<style lang="less" scoped>
.wms-temp-rang {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .tempRange-search {
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
  .tempRange-table {
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