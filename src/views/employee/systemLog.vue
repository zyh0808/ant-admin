<template>
  <div class="employee-log" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="权限字典"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="employee-log-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef" class="search-form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="8">
              <a-form-model-item label="操作时间">
                <a-range-picker v-model="searchForm.searchDate" :format="dateFormat" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="操作类型">
                <a-select v-model="searchForm.type_code" placeholder="请选择">
                  <a-select-option :value=1>
                    登陆
                  </a-select-option>
                  <a-select-option :value=2>
                    访问
                  </a-select-option>
                  <a-select-option :value=3>
                    操作
                  </a-select-option>
                  <a-select-option :value=4>
                    异常
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="4">
              <a-form-model-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
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
      <div class="employee-log-table">
        <a-row class="toolRow" type="flex" justify="space-between">
          <h3 class="listTitle">系统日志列表</h3>
          <a-row class="toolsBtn">
            <a-space :size="12">
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
                <columnSelect :plainOptions="columns" @changeColumns="changeColumns">
                </columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef" :data-source="logPageList" class="table-list" :rowKey="record => record.log_id" :pagination="pagination" @change="handleTableChange" @showSizeChange="onShowSizeChange" :loading="isfetchLogPageList" :scroll="{x:1200}">
        </a-table>
        <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
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
  type_code: null,
  searchDate: []
}
export default {
  data () {
    const columns = [
      {
        title: '序号',
        dataIndex: 'log_id',
        value: 'log_id',
        width: 100,
        ellipsis: true
      },
      {
        title: '操作时间',
        dataIndex: 'create_time',
        value: 'create_time',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作人',
        dataIndex: 'create_uid',
        value: 'create_uid',
        width: 150,
        ellipsis: true
      },
      {
        title: 'IP地址',
        dataIndex: 'ipaddr',
        value: 'ipaddr',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作类型',
        dataIndex: 'type_name',
        value: 'type_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '执行功能',
        dataIndex: 'method_name',
        value: 'method_name',
        width: 200,
        ellipsis: true
      },
      {
        title: '执行结果',
        dataIndex: 'result_code',
        value: 'result_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '执行结果信息',
        dataIndex: 'result_msg',
        value: 'result_msg',
        width: 150,
        ellipsis: true
      }
    ]
    return {
      columns,
      tableColumns: columns,
      moment,
      searchForm: {
        ...searchForm
      },
      dateFormat: 'YYYY-MM-DD',
      title: '添加编号种子',
      pagination: {
        ...pagination
      },
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
      logPageList: 'log/logPageList',
      isfetchLogPageList: 'log/isfetchLogPageList',
      logTotal: 'log/logTotal'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_log',
      breadcrumbName: '系统日志'
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
    this.getLogList()
  },
  methods: {
    ...mapActions({
      fetchLogPageList: 'log/fetchLogPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getLogList () {
      // const oneMonthAgoTS = new Date(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 3600 * 1000).getTime() / 1000
      // const currentTS = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() / 1000
      this.fetchLogPageList({
        start_time: this.searchForm.searchDate[0] ? Math.round(new Date(this.searchForm.searchDate[0]).getTime() / 1000) : 0,
        end_time: this.searchForm.searchDate[1] ? Math.round(new Date(this.searchForm.searchDate[1]).getTime() / 1000) : 0,
        type_code: this.searchForm.type_code === null ? -1 : this.searchForm.type_code,
        result_code: '',
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.logTotal
        }
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getLogList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getLogList()
    },
    handleSearch: debounce(function () {
      this.getLogList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getLogList()
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
.employee-log {
  padding: 5px;
}
.content {
  margin: 10px;
  .employee-log-search {
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
  .employee-log-table {
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