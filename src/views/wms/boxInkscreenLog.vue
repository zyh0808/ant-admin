<template>
  <div class="box-inkscreen-log" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="box-inkscreen-log-search">
        <a-form-model :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="仓库编码">
                <!-- <a-input v-model="se`archForm.house_id" placeholder="请选择"
                  allowClear>
                </a-input>` -->
                <a-select v-model="searchForm.house_id" placeholder="请选择"
                  allowClear>
                  <a-select-option v-for="item in houseList"
                    :key="item.house_id" :value='item.house_id'>
                    {{ item.house_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="箱子条码">
                <a-input v-model="searchForm.box_barcode" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="墨水屏条码">
                <a-input v-model="searchForm.screen_barcode" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" v-if="showMoreSearchOptions">
              <a-form-model-item label="操作人名称">
                <a-input v-model="searchForm.op_username" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="showMoreSearchOptions">
              <a-form-model-item label="操作日期" :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }">
                <a-range-picker v-model="searchForm.op_date"
                  :format="dateFormat" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="showMoreSearchOptions ? 6 : 0">
              <a-form-model-item :label-col="{ span: 0 }"
                :wrapper-col="{ span: 24 }">
                <div class="search-btns">
                  <a-button type="primary" @click="handleSearch">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                  <a-button type="link" :style="{ marginLeft: '8px' }"
                    v-if="!showMoreSearchOptions"
                    @click="showMoreSearchOptions = true">
                    更多
                  </a-button>
                  <a-button type="link" :style="{ marginLeft: '8px' }" v-else
                    @click="showMoreSearchOptions = false">
                    收起
                  </a-button>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="box-inkscreen-log-table">
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
                <columnSelect :plainOptions="columns"
                  @changeColumns="changeColumns"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef"
          :data-source="boxInkscreenLogList" class="table-list"
          :rowKey="record => record.box_inscreen_log_id"
          :loading="isfetchBoxInkscreenLogList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange">
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
  house_id: undefined,
  box_barcode: '',
  screen_barcode: '',
  op_username: '',
  op_date: []
}
export default {
  data () {
    const columns = [
      {
        title: '药品箱墨水屏ID',
        dataIndex: 'box_inscreen_log_id',
        value: 'box_inscreen_log_id',
        ellipsis: true
      },
      {
        title: '箱子ID',
        dataIndex: 'box_id',
        value: 'box_id',
        ellipsis: true
      },
      {
        title: '箱子条码',
        dataIndex: 'box_barcode',
        value: 'box_barcode'
      },
      {
        title: '墨水屏ID',
        dataIndex: 'inkscreen_id',
        value: 'inkscreen_id'
      },
      {
        title: '墨水屏条码',
        dataIndex: 'screen_barcode',
        value: 'screen_barcode'
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
      path: 'box_inkscreen_log',
      breadcrumbName: '箱子墨水屏日志'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchBoxInkscreenLogList: 'inkscreen/isfetchBoxInkscreenLogList',
      boxInkscreenLogList: 'inkscreen/boxInkscreenLogList',
      houseList: 'house/houseList',
      boxInkscreenLogTotal: 'inkscreen/boxInkscreenLogTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getBoxInkscreenLogPageList()
    this.fetchHouseList({})
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList',
      fetchBoxInkscreenLogPageList: 'inkscreen/fetchBoxInkscreenLogPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getBoxInkscreenLogPageList () {
      const params = {
        house_id: this.searchForm.house_id,
        box_barcode: this.searchForm.box_barcode,
        screen_barcode: this.searchForm.screen_barcode,
        op_username: this.searchForm.op_username,
        op_time_start: this.searchForm.op_date[0] ? Math.round(new Date(this.searchForm.op_date[0]).getTime() / 1000) : 0,
        op_time_end: this.searchForm.op_date[1] ? Math.round(new Date(this.searchForm.op_date[1]).getTime() / 1000) : 0,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.boxInkscreenLogTotal
        }
      }
      this.fetchBoxInkscreenLogPageList(params)
    },
    handleSearch: debounce(function () {
      this.getBoxInkscreenLogPageList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxInkscreenLogPageList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxInkscreenLogPageList()
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getBoxInkscreenLogPageList()
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
.box-inkscreen-log {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .box-inkscreen-log-search {
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
  .box-inkscreen-log-table {
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