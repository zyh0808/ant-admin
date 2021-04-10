<template>
  <div class="employee-dict" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="字典信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <a-row class="content-row">
        <a-col :span="5">
          <a-card title="分类目录" class="left-card" :bordered="false">
            <a-tree v-if="allDictTree && allDictTree.length > 0"
              :tree-data="allDictTree" @select="onTreeSelect"
              :default-expanded-keys="['TOP']">
              <a-icon slot="switcherIcon" type="down" />
            </a-tree>
            <a-spin v-else size="small" />
          </a-card>
        </a-col>
        <a-col :span="19" style="height:100%">
          <a-card title="区域信息" class="right-card" :bordered="false"
            ref="contentRowRefs">
            <div class="employee-dict-table">
              <a-row class="toolRow" type="flex" justify="space-between">
                <div>
                  <h3 class="listTitle" v-if="currentDictName">
                    {{currentDictName}}
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
                        :disabled="currentDictId === ''" />
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
                :data-source="dictPageList" class="table-list"
                :rowKey="record => record.item_id" :pagination="pagination"
                :loading="isfetchDictPageList" @change="handleTableChange"
                @showSizeChange="onShowSizeChange" :scroll="{x:1000}">
                <span slot="validate" slot-scope="validate">
                  <a-switch :checked="validate" disabled />
                </span>
                <template slot="action" slot-scope="record">
                  <a-button type="link" size="small"
                    @click="showEditModal(record)">
                    编辑
                  </a-button>
                  <a-divider type="vertical" />
                  <a-popconfirm v-if="dictPageList.length" title="确认删除吗?"
                    cancelText="取消" okText="确认"
                    @confirm="() => deleteDict(record.item_id)">
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
      cancelText="取消" okText="确定" :width="600">
      <a-form-model ref="dictFormRef" :model="dictForm" :rules="dictFormRules"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="上级字典">
          <a-input :value="dictForm.top_dict_name" disabled />
        </a-form-model-item>
        <a-form-model-item label="项目名称" prop="item_name" ref="item_name">
          <a-input v-model="dictForm.item_name" :max-length="100"
            placeholder="请输入" @blur="
          () => {
            $refs.item_name.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-form-model-item label="项目值" prop="item_value" ref="item_value">
          <a-input v-model="dictForm.item_value" :max-length="100"
            placeholder="请输入" @blur="
          () => {
            $refs.item_value.onFieldBlur()
          }" />
        </a-form-model-item>
        <!-- <a-form-model-item v-if="isTop" label="项目分类编码" prop="kind_code"
          ref="kind_code">
          <a-input v-model="dictForm.kind_code" :max-length="50"
            placeholder="请输入" @blur="
          () => {
            $refs.kind_code.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-form-model-item v-if="isTop" label="项目分类名称" prop="kind_name"
          ref="kind_name">
          <a-input v-model="dictForm.kind_name" :max-length="100"
            placeholder="请输入" @blur="
          () => {
            $refs.kind_name.onFieldBlur()
          }" />
        </a-form-model-item> -->
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="排序码" prop="sort_code"
              :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
              <a-input-number v-model="dictForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效" prop="validate"
              :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
              <a-switch v-model="dictForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="项目描述" prop="item_desc">
          <a-input v-model="dictForm.item_desc" type="textarea"
            placeholder="请输入" :max-length="300" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addDict, editDict, deleteDict } from '@/api/system.js'
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
const dictForm = {
  item_name: '',
  item_value: '',
  sort_code: 1,
  validate: true,
  item_desc: ''
}
export default {
  data () {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'item_id',
        value: 'item_id',
        width: 100,
        ellipsis: true
      },
      {
        title: '项目名称',
        dataIndex: 'item_name',
        value: 'item_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '项目值',
        dataIndex: 'item_value',
        value: 'item_value',
        width: 150,
        ellipsis: true
      },
      {
        title: '项目描述',
        dataIndex: 'item_desc',
        value: 'item_desc',
        width: 150,
        ellipsis: true
      },
      {
        title: '排序号',
        dataIndex: 'sort_code',
        value: 'sort_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 150,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
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
      title: '添加字典',
      currentDictId: '',
      currentDictName: '',
      isTop: false,
      dictTreeData: [],
      isShowEditModal: false,
      confirmLoading: false,
      dictForm: {
        parent_value: '',
        top_dict_name: '',
        kind_code: '',
        kind_name: '',
        ...dictForm
      },
      isSubmit: false,
      dictFormRules: {
        item_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        item_value: [{ required: true, message: '请输入项目值', trigger: 'blur' }],
        // kind_code: [{ required: true, message: '请输入项目分类编码', trigger: 'blur' }],
        // kind_name: [{ required: true, message: '请输入项目分类名称', trigger: 'blur' }]
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
      dictPageList: 'dictionary/dictPageList',
      total: 'dictionary/total',
      isfetchDictPageList: 'dictionary/isfetchDictPageList',
      allDictTree: 'dictionary/allDictTree'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_dict',
      breadcrumbName: '字典信息'
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
    this.fetchAllDictTree()
  },
  methods: {
    ...mapActions({
      fetchDictPageList: 'dictionary/fetchDictPageList',
      fetchAllDictTree: 'dictionary/fetchAllDictTree'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'dictionary/resetAllData'
    }),
    getDictList () {
      this.fetchDictPageList({
        parent_value: this.currentDictId,
        kind_code: '',
        is_disabled: -1,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.total
        }
      })
    },
    onTreeSelect (selectedKeys, e) {
      const { selected, selectedNodes, node, event } = e
      // console.log(selected, selectedNodes, node, event)
      this.currentDictId = selectedKeys[0]
      this.currentDictName = node.title
      this.isTop = this.currentDictId === 'TOP' ? true : false
      this.dictForm = Object.assign({}, this.dictForm, {
        parent_value: this.currentDictId,
        top_dict_name: this.currentDictName,
        kind_code: this.isTop ? '' : node.dataRef.kind_code,
        kind_name: this.isTop ? '' : node.dataRef.kind_name
      })
      this.getDictList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getDictList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getDictList()
    },
    showEditModal (dictInfo) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加字典'
      if (dictInfo) {
        this.isEdit = true
        this.title = '编辑字典'
        this.dictForm = Object.assign(this.dictForm, dictInfo, {})
      }
    },
    editOk () {
      this.$refs.dictFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editDict()
          } else {
            this.addDict()
          }
        } else {
          return false
        }
      })
    },
    addDict () {
      this.confirmLoading = true
      const dictForm = Object.assign(this.dictForm, {
        is_disabled: this.dictForm.validate ? 0 : 1,
        kind_code: this.isTop ? this.dictForm.item_value : this.dictForm.kind_code,
        kind_name: this.isTop ? this.dictForm.item_name : this.dictForm.kind_name
      })
      addDict(dictForm).then(res => {
        this.$message.success('操作成功')
        this.getDictList()
        this.fetchAllDictTree()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editDict () {
      this.confirmLoading = true
      const params = Object.assign(this.dictForm,
        {
          is_disabled: this.dictForm.validate ? 0 : 1
        }
      )
      editDict(params).then(res => {
        this.$message.success('修改成功')
        this.getDictList()
        this.fetchAllDictTree()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteDict (item_id) {
      const params = {
        item_id: item_id
      }
      deleteDict(params).then(res => {
        this.$message.success('删除成功')
        this.getDictList()
        this.fetchAllDictTree()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.dictFormRef.resetFields()
      this.dictForm = Object.assign(this.dictForm, dictForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getDictList()
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
.employee-dict {
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
.employee-dict-table {
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