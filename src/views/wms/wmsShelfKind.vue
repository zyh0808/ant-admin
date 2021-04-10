<template>
  <div class="wms-shelfKind" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="货架种类列表"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="shelfKind-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="货架类型">
                <a-select v-model="searchForm.category" placeholder="请选择"
                  allowClear>
                  <a-select-option :value=0>
                    轻型
                  </a-select-option>
                  <a-select-option :value=1>
                    重型
                  </a-select-option>
                  <a-select-option :value=2>
                    其他
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="种类名称">
                <a-input v-model="searchForm.shelf_kind_name" placeholder="请输入"
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
      <div class="shelfKind-table">
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
        <a-table :columns="tableColumns" ref="tableRef"
          :data-source="shelfKindList" class="table-list"
          :rowKey="record => record.shelf_kind_id"
          :loading="isfetchShelfKindList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange"
          :scroll="{x:940}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="shelfKindList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteShelfKind(record.shelf_kind_id)">
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
        <a-form-model ref="shelfKindFormRef" :model="shelfKindForm"
          :rules="shelfKindFormRules" :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }">
          <a-form-model-item label="货架种类名称" prop="shelf_kind_name"
            ref="shelf_kind_name">
            <a-input v-model="shelfKindForm.shelf_kind_name" placeholder="请输入"
              @blur="
          () => {
            $refs.shelf_kind_name.onFieldBlur()
          }" />
          </a-form-model-item>
          <a-form-model-item label="货架类型" prop="category">
            <!-- <a-select v-model="shelfKindForm.category" placeholder="请选择">
              <a-select-option :value=0>
                轻型
              </a-select-option>
              <a-select-option :value=1>
                重型
              </a-select-option>
              <a-select-option :value=2>
                其他
              </a-select-option>
            </a-select> -->
            <a-radio-group v-model="shelfKindForm.category">
              <a-radio-button :value=0>
                轻型
              </a-radio-button>
              <a-radio-button :value=1>
                重型
              </a-radio-button>
              <a-radio-button :value=2>
                其他
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="长（cm）" prop="shelf_length"
                ref="shelf_length" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="shelfKindForm.shelf_length"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_length.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="宽（cm）" prop="shelf_width"
                ref="shelf_width" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="shelfKindForm.shelf_width"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_width.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="高（cm）" prop="shelf_height"
                ref="shelf_height" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="shelfKindForm.shelf_height"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_height.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货架层数" prop="shelf_rows" ref="shelf_rows"
                :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-input-number v-model="shelfKindForm.shelf_rows"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_rows.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="有效">
            <a-switch v-model="shelfKindForm.validate" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addShelfKind, editShelfKind, deleteShelfKind } from '@/api/wms.js'
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
  category: undefined,
  shelf_kind_name: ''
}
const shelfKindForm = {
  shelf_kind_id: '',
  shelf_kind_name: '',
  category: 0,
  shelf_length: 0,
  shelf_width: 0,
  shelf_height: 0,
  shelf_rows: 1,
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '货架种类名称',
        dataIndex: 'shelf_kind_name',
        value: 'shelf_kind_name',
        width: 150,
        // fixed: 'left',
        ellipsis: true
      },
      {
        title: '货架类型',
        dataIndex: 'categoryName',
        value: 'categoryName',
        width: 150,
        // fixed: 'left',
        ellipsis: true
      },
      {
        title: '长（cm）',
        dataIndex: 'shelf_length',
        value: 'shelf_length',
        width: 100,
        ellipsis: true
      },
      {
        title: '宽（cm）',
        dataIndex: 'shelf_width',
        value: 'shelf_width',
        width: 100,
        ellipsis: true
      },
      {
        title: '高（cm）',
        dataIndex: 'shelf_height',
        value: 'shelf_height',
        width: 100,
        ellipsis: true
      },
      {
        title: '货架层数',
        dataIndex: 'shelf_rows',
        value: 'shelf_rows',
        width: 100,
        ellipsis: true
      },
      {
        title: '是否有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' }
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        // fixed: 'right',
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
      title: '添加申办方信息',
      isShowEditModal: false,
      confirmLoading: false,
      shelfKindForm: { ...shelfKindForm },
      shelfKindFormRules: {
        shelf_kind_name: [{ required: true, message: '请输入货架种类名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择货架类型', trigger: 'blur' }],
      },
      isEdit: false,
      shelfKindInfo: {},
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
      path: 'wms_shelfKind',
      breadcrumbName: '货架种类列表'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchShelfKindList: 'house/isfetchShelfKindList',
      shelfKindList: 'house/shelfKindList',
      shelfKindTotal: 'house/shelfKindTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getShelfKindList()
  },
  methods: {
    ...mapActions({
      fetchShelfKindPageList: 'house/fetchShelfKindPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getShelfKindList () {
      const params = {
        category: this.searchForm.category ? this.searchForm.category : -1,
        shelf_kind_name: this.searchForm.shelf_kind_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.shelfKindTotal
        }
      }
      this.fetchShelfKindPageList(params)
    },
    handleSearch: debounce(function () {
      this.getShelfKindList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getShelfKindList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getShelfKindList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加货架种类'
      if (info) {
        this.isEdit = true
        this.title = '编辑货架种类'
        this.shelfKindForm = Object.assign(this.shelfKindForm, info, {})
      }
    },
    editOk () {
      this.$refs.shelfKindFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editShelfKind()
          } else {
            this.addShelfKind()
          }
        } else {
          return false
        }
      });
    },
    addShelfKind () {
      this.confirmLoading = true
      const params = Object.assign(this.shelfKindForm,
        { is_disabled: this.shelfKindForm.validate ? 0 : 1 }
      )
      addShelfKind(params).then(res => {
        this.$message.success('操作成功')
        this.getShelfKindList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editShelfKind () {
      this.confirmLoading = true
      const params = Object.assign(this.shelfKindForm,
        { is_disabled: this.shelfKindForm.validate ? 0 : 1 }
      )
      editShelfKind(params).then(res => {
        this.$message.success('修改成功')
        this.getShelfKindList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteShelfKind (shelf_kind_id) {
      const params = {
        shelf_kind_id: shelf_kind_id
      }
      deleteShelfKind(params).then(res => {
        this.$message.success('删除成功')
        this.getShelfKindList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.shelfKindFormRef.resetFields()
      this.shelfKindForm = Object.assign({}, shelfKindForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getShelfKindList()
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
.wms-shelfKind {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .shelfKind-search {
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
  .shelfKind-table {
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
/deep/ .ant-transfer {
  min-height: 400px;
  max-height: 640px;
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