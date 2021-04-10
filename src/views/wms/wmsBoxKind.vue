<template>
  <div class="wms-boxKind" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="箱型管理"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="boxKind-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="箱型名称">
                <a-input v-model="searchForm.box_kind_name" placeholder="请输入"
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
      <div class="boxKind-table">
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
          :data-source="boxKindList" class="table-list"
          :rowKey="record => record.box_kind_id" :loading="isfetchBoxKindList"
          :pagination="pagination" @change="handleTableChange"
          @showSizeChange="onShowSizeChange" :scroll="{x:1040}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="boxKindList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteBoxKind(record.box_kind_id)">
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
        <a-form-model ref="boxKindFormRef" :model="boxKindForm"
          :rules="boxKindFormRules" :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }">
          <a-form-model-item label="箱型名称" prop="box_kind_name"
            ref="box_kind_name">
            <a-input v-model="boxKindForm.box_kind_name" placeholder="请输入"
              @blur="
          () => {
            $refs.box_kind_name.onFieldBlur()
          }" />
          </a-form-model-item>
          <a-form-model-item label="箱型类型" prop="category">
            <!-- <a-select v-model="boxKindForm.category" placeholder="请选择">
              <a-select-option :value=0>
                药品箱
              </a-select-option>
              <a-select-option :value=1>
                拣药箱
              </a-select-option>
              <a-select-option :value=2>
                其他
              </a-select-option>
            </a-select> -->
            <a-radio-group v-model="boxForm.category">
              <a-radio-button :value=0>
                药品箱
              </a-radio-button>
              <a-radio-button :value=1>
                拣药箱
              </a-radio-button>
              <a-radio-button :value=2>
                其他
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="长（cm）" prop="box_length"
                ref="box_length" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="boxKindForm.box_length"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.box_length.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="宽（cm）" prop="box_width" ref="box_width"
                :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-input-number v-model="boxKindForm.box_width"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.box_width.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="高（cm）" prop="box_height"
                ref="box_height" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="boxKindForm.box_height"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.box_height.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="重（kg）" prop="box_weight"
                ref="box_weight" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="boxKindForm.box_weight"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.box_weight.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="容积率（%）" prop="box_volume_rate"
                ref="box_volume_rate" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="boxKindForm.box_volume_rate"
                  placeholder="请输入" :min="0" @blur="
          () => {
            $refs.box_volume_rate.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="有效" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-switch v-model="boxKindForm.validate" />
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
import { addBoxKind, editBoxKind, deleteBoxKind } from '@/api/wms.js'
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
  box_kind_name: ''
}
const boxKindForm = {
  box_kind_name: '',
  category: 0,
  box_length: 0,
  box_width: 0,
  box_height: 0,
  box_weight: 0,
  box_volume_rate: 0,
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '箱型名称',
        dataIndex: 'box_kind_name',
        value: 'box_kind_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '箱型类别',
        dataIndex: 'categoryName',
        value: 'categoryName',
        width: 150,
        ellipsis: true
      },
      {
        title: '长（cm）',
        dataIndex: 'box_length',
        value: 'box_length',
        width: 100,
        ellipsis: true
      },
      {
        title: '宽（cm）',
        dataIndex: 'box_width',
        value: 'box_width',
        width: 100,
        ellipsis: true
      },
      {
        title: '高（cm）',
        dataIndex: 'box_height',
        value: 'box_height',
        width: 100,
        ellipsis: true
      },
      {
        title: '重（kg）',
        dataIndex: 'box_weight',
        value: 'box_weight',
        width: 100,
        ellipsis: true
      },
      {
        title: '容积率（%）',
        dataIndex: 'box_volume_rate',
        value: 'box_volume_rate',
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
      title: '添加箱型',
      isShowEditModal: false,
      confirmLoading: false,
      boxKindForm: { ...boxKindForm },
      boxKindFormRules: {
        box_kind_name: [{ required: true, message: '请输入箱型名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择货架类型', trigger: 'blur' }],
      },
      isEdit: false,
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
      path: 'wms_boxKind',
      breadcrumbName: '箱型管理'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchBoxKindList: 'box/isfetchBoxKindList',
      boxKindList: 'box/boxKindList',
      boxKindTotal: 'box/boxKindTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getBoxKindList()
  },
  methods: {
    ...mapActions({
      fetchBoxKindPageList: 'box/fetchBoxKindPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getBoxKindList () {
      const params = {
        box_kind_name: this.searchForm.box_kind_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.boxKindTotal
        }
      }
      this.fetchBoxKindPageList(params)
    },
    handleSearch: debounce(function () {
      this.getBoxKindList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxKindList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxKindList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加箱型'
      if (info) {
        this.isEdit = true
        this.title = '编辑箱型'
        this.boxKindForm = Object.assign(this.boxKindForm, info, {})
      }
    },
    editOk () {
      this.$refs.boxKindFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editBoxKind()
          } else {
            this.addBoxKind()
          }
        } else {
          return false
        }
      });
    },
    addBoxKind () {
      this.confirmLoading = true
      const params = Object.assign(this.boxKindForm,
        { is_disabled: this.boxKindForm.validate ? 0 : 1 }
      )
      addBoxKind(params).then(res => {
        this.$message.success('操作成功')
        this.getBoxKindList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editBoxKind () {
      this.confirmLoading = true
      const params = Object.assign(this.boxKindForm,
        { is_disabled: this.boxKindForm.validate ? 0 : 1 }
      )
      editBoxKind(params).then(res => {
        this.$message.success('修改成功')
        this.getBoxKindList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteBoxKind (box_kind_id) {
      const params = {
        box_kind_id: box_kind_id
      }
      deleteBoxKind(params).then(res => {
        this.$message.success('删除成功')
        this.getBoxKindList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.boxKindFormRef.resetFields()
      this.boxKindForm = Object.assign({}, boxKindForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getBoxKindList()
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
.wms-boxKind {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .boxKind-search {
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
  .boxKind-table {
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