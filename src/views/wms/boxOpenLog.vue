<template>
  <div class="box-open-log" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="box-open-log-search">
        <a-form-model :model="searchForm" ref="searchFormRef" class="search-form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="仓库编码">
                <a-input v-model="searchForm.house_id" placeholder="请输入" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="箱子条码">
                <a-input v-model="searchForm.box_barcode" placeholder="请输入" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="6">
              <a-form-model-item label="操作日期">
                <a-input v-model="searchForm.op_date" placeholder="请选择" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="6">
              <a-form-model-item label="操作人名称">
                <a-input v-model="searchForm.op_username" placeholder="请输入" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" v-if="showMoreSearchOptions">
              <a-form-model-item label="操作类别">
                <a-input v-model="searchForm.op_code" placeholder="请选择" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="showMoreSearchOptions">
              <a-form-model-item label="操作日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-range-picker v-model="searchForm.op_date" :format="dateFormat" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="showMoreSearchOptions? 6 : 0">
              <a-form-model-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <div class="search-btns">
                  <a-button type="primary" @click="handleSearch">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                  <a-button type="link" :style="{ marginLeft: '8px' }" v-if="!showMoreSearchOptions" @click="showMoreSearchOptions = true">
                    更多
                  </a-button>
                  <a-button type="link" :style="{ marginLeft: '8px' }" v-else @click="showMoreSearchOptions = false">
                    收起
                  </a-button>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="box-open-log-table">
        <a-row class="toolRow" type="flex" justify="end">
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
                <columnSelect :plainOptions="columns" @changeColumns="changeColumns"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef" :data-source="boxOpenLogList" class="table-list" :rowKey="record => record.box_inscreen_log_id" :loading="isfetchBoxOpenLogList" :pagination="pagination" @change="handleTableChange" @showSizeChange="onShowSizeChange">
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
import moment from 'moment'
const pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'small'
}
const searchForm = {
  house_id: '',
  box_barcode: '',
  // op_date: '',
  op_code: '',
  op_username: '',
  op_date: []
}
export default {
  data () {
    const columns = [
      {
        title: '开箱日志ID',
        dataIndex: 'box_open_log_id',
        value: 'box_open_log_id',
        ellipsis: true
      },
      {
        title: '仓库编码',
        dataIndex: 'house_id',
        value: 'house_id',
        ellipsis: true
      },
      {
        title: '箱子ID',
        dataIndex: 'box_id',
        value: 'box_id'
      },
      {
        title: '箱子条码',
        dataIndex: 'box_barcode',
        value: 'box_barcode'
      },
      {
        title: '开箱日期',
        dataIndex: 'op_date',
        value: 'op_date'
      },
      {
        title: '操作类别',
        dataIndex: 'op_name',
        value: 'op_name'
      },
      {
        title: '操作人ID',
        dataIndex: 'op_uid',
        value: 'op_uid'
      },
      {
        title: '操作人名称',
        dataIndex: 'op_username',
        value: 'op_username'
      },
      {
        title: '操作时间',
        dataIndex: 'op_time',
        value: 'op_time'
      }
    ]
    return {
      showMoreSearchOptions: false,
      moment,
      dateFormat: 'YYYY-MM-DD',
      columns,
      tableColumns: columns,
      searchForm: {
        ...searchForm
      },
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
      path: 'box_open_log',
      breadcrumbName: '箱子开箱日志'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchBoxOpenLogList: 'box/isfetchBoxOpenLogList',
      boxOpenLogList: 'box/boxOpenLogList',
      boxOpenLogTotal: 'box/boxOpenLogTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getBoxOpenLogPageList()
  },
  methods: {
    ...mapActions({
      fetchBoxOpenLogPageList: 'box/fetchBoxOpenLogPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getBoxOpenLogPageList () {
      const params = {
        house_id: this.searchForm.house_id,
        box_barcode: this.searchForm.box_barcode,
        // op_date: this.searchForm.op_date,
        op_code: this.searchForm.op_code,
        op_username: this.searchForm.op_username,
        op_time_start: this.searchForm.op_date[0] ? Math.round(new Date(this.searchForm.op_date[0]).getTime() / 1000) : 0,
        op_time_end: this.searchForm.op_date[1] ? Math.round(new Date(this.searchForm.op_date[1]).getTime() / 1000) : 0,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.boxOpenLogTotal
        }
      }
      this.fetchBoxOpenLogPageList(params)
    },
    handleSearch: debounce(function () {
      this.getBoxOpenLogPageList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxOpenLogPageList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxOpenLogPageList()
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getBoxOpenLogPageList()
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
.box-open-log {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .box-open-log-search {
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
  .box-open-log-table {
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