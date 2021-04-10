<template>
  <div class="employee-seed" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="权限字典"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="employee-seed-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="编号">
                <a-input v-model="searchForm.code_key" placeholder="请输入" />
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
      <div class="employee-seed-table">
        <a-row class="toolRow" type="flex" justify="space-between">
          <h3 class="listTitle">编号种子列表</h3>
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
          :data-source="seedPageList" class="table-list"
          :rowKey="record => record.code_key" :loading="isfetchSeedPageList"
          :pagination="pagination" @change="handleTableChange"
          @showSizeChange="onShowSizeChange" :scroll="{x:1050}">
          <span slot="isDayUpdate" slot-scope="isDayUpdate">
            <a-switch :checked="isDayUpdate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="seedPageList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteSeed(record.code_key)">
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
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="700">
      <a-form-model ref="seedFormRef" :model="seedForm" :rules="seedFormRules"
        :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item ref="code_key" label="种子编号" prop="code_key">
          <a-input v-model="seedForm.code_key" placeholder="请输入" @blur="
          () => {
            $refs.code_key.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-form-model-item label="当前流水号" prop="cur_number" ref="cur_number">
          <a-input-number v-model="seedForm.cur_number" :min="1" @blur="
          () => {
            $refs.cur_number.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-form-model-item label="步长" prop="step" ref="step">
          <a-input-number v-model="seedForm.step" :min="1" @blur="
          () => {
            $refs.step.onFieldBlur()
          }
        " />
        </a-form-model-item>
        <a-form-model-item label="编码生成日期" prop="code_date">
          <a-date-picker v-model="seedForm.code_date" type="date"
            :format="dateFormat" allowClear placeholder="请选择" />
        </a-form-model-item>
        <a-form-model-item label="是否每日更新">
          <a-switch v-model="seedForm.isDayUpdate" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="memo">
          <a-input v-model="seedForm.memo" type="textarea" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addSeed, editSeed, deleteSeed } from '@/api/system.js'
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
const searchForm = {
  code_key: ''
}
const seedForm = {
  code_key: '',
  cur_number: 1,
  step: 1,
  code_date: '',
  // is_day_update: true,
  isDayUpdate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '编号',
        dataIndex: 'code_key',
        value: 'code_key',
        width: 150,
        ellipsis: true
      },
      {
        title: '当前流水号',
        dataIndex: 'cur_number',
        value: 'cur_number',
        width: 150,
        ellipsis: true
      },
      {
        title: '步长',
        dataIndex: 'step',
        value: 'step',
        width: 100,
        ellipsis: true
      },
      {
        title: '编码生成日期',
        dataIndex: 'code_date',
        value: 'code_date',
        width: 150,
        ellipsis: true
      },
      {
        title: '是否每日更新',
        dataIndex: 'isDayUpdate',
        value: 'isDayUpdate',
        width: 150,
        key: 'isDayUpdate',
        scopedSlots: { customRender: 'isDayUpdate' },
      },
      {
        title: '描述',
        dataIndex: 'memo',
        value: 'memo',
        width: 200,
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
      searchForm: { ...searchForm },
      title: '添加编号种子',
      isShowEditModal: false,
      confirmLoading: false,
      seedForm,
      isSubmit: false,
      dateFormat: 'YYYY-MM-DD',
      seedFormRules: {
        code_key: [{ required: true, message: '请输入种子编号', trigger: 'blur' }],
        cur_number: [{ required: true, message: '请输入当前流水号', trigger: 'blur' }],
        step: [{ required: true, message: '请输入步长', trigger: 'blur' }],
        code_date: [{ required: true, message: '请选择编码生成日期', trigger: 'blur' }]
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
      seedPageList: 'seed/seedPageList',
      seedTotal: 'seed/seedTotal',
      isfetchSeedPageList: 'seed/isfetchSeedPageList'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_seed',
      breadcrumbName: '编号种子'
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
    this.getSeedList()
  },
  methods: {
    ...mapActions({
      fetchSeedPageList: 'seed/fetchSeedPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getSeedList () {
      this.fetchSeedPageList({
        code_key: this.searchForm.code_key,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.seedTotal
        }
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getSeedList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getSeedList()
    },
    handleSearch: debounce(function () {
      this.getSeedList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    showEditModal (seedInfo) {
      this.isShowEditModal = true
      this.isEdit = false
      if (seedInfo) {
        this.isEdit = true
        this.title = '编辑编号种子'
        this.seedForm = Object.assign(this.seedForm, seedInfo, {
          code_date: moment(seedInfo.code_date, 'YYYY-MM-DD')
        })
      }
    },
    editOk () {
      this.$refs.seedFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editSeed()
          } else {
            this.addSeed()
          }
        } else {
          return false
        }
      });
    },
    addSeed () {
      this.confirmLoading = true
      const params = Object.assign(this.seedForm,
        {
          is_day_update: this.seedForm.isDayUpdate ? 0 : 1,
          code_date: this.seedForm.code_date ? this.seedForm.code_date.format('YYYY-MM-DD') : '',
        }
      )
      addSeed(params).then(res => {
        this.$message.success('操作成功')
        this.getSeedList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editSeed () {
      this.confirmLoading = true
      const params = Object.assign(this.seedForm,
        {
          is_day_update: this.seedForm.isDayUpdate ? 0 : 1,
          code_date: this.seedForm.code_date ? this.seedForm.code_date.format('YYYY-MM-DD') : '',
        }
      )
      editSeed(params).then(res => {
        this.$message.success('修改成功')
        this.getSeedList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteSeed (code_key) {
      const params = {
        code_key: code_key
      }
      deleteSeed(params).then(res => {
        this.$message.success('删除成功')
        this.getSeedList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.seedFormRef.resetFields()
      this.seedForm = Object.assign({}, seedForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getSeedList()
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
.employee-seed {
  padding: 5px;
}
.content {
  margin: 10px;
  .employee-seed-search {
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
  .employee-seed-table {
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