<template>
  <div class="pack-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
        <a-row type="flex">
          <div v-for="item in upStatus" :key="item.index"
            :class="currentStatus === item.index? 'status-btn active-btn': 'status-btn'"
            @click="changeStatus(item.index)">
            <span>{{item.name}}</span>
            <div class="bg-line"></div>
          </div>
        </a-row>
      </div>
      <div>
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
      </div>
    </a-row>
    <a-table :columns="tableColumns" :data-source="upList" ref="tableRef"
      class="table-list" :rowKey="record => record.onshelf_task_no"
      :loading="isFetchUpList" :pagination="pagination">
      <a slot="onshelf_task_no" slot-scope="text, record"
        @click="showTaskOrderInfo(record)">{{text}}</a>
      <a slot="already_onshelf_cnt" slot-scope="text, record"
        @click="showUpDetail(record)">{{text}}</a>
      <span slot="personIdList" slot-scope="list">
        {{ list && list.join(",") }}
      </span>
      <span slot="personNameList" slot-scope="list">
        {{ list && list.join(",") }}
      </span>
      <span slot="onshelf_task_status" slot-scope="onshelf_task_status">
        <a-tag v-if="onshelf_task_status === 0" color="red">
          待上架
        </a-tag>
        <a-tag v-else-if="onshelf_task_status === 1" color="blue">
          上架中
        </a-tag>
        <a-tag v-else color="green">
          已上架
        </a-tag>
      </span>
      <!-- <template slot="action" slot-scope="record">
        <a-button v-if="record.onshelf_task_status === '已上架'" type="link" size="small" @click="showUpDetail(record.onshelf_task_no)">
          上架详情
        </a-button>
      </template> -->
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky ? 'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed">
    </a-table>
    <a-drawer title="上架任务单明细" width="500" :visible="isShowTaskOrderInfo"
      @close="closeTaskOrderInfo">
      <upOrderDetail></upOrderDetail>
      <!-- <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1
        }">
        <a-button :style="{ marginRight: '8px' }" @click="closeTaskOrderInfo">
          关闭
        </a-button>
      </div> -->
    </a-drawer>
    <!-- <codeList ref="codeListRef"></codeList> -->
    <a-modal title="上架详情" :visible="isShowUpDetailModal" :footer="false"
      @cancel="upDetailCancel" :width="500">
      <a-table :columns="detailColumns"
        :data-source="upInfo.OnshelfTaskDetailsList" ref="tableRef"
        class="table-list" :rowKey="record => record.box_code"
        :pagination="false">
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import columnSelect from '@/components/columnSelect.vue'
import upOrderDetail from '@/components/entry/detail/upOrderDetail'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    pagination: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    const columns = [
      {
        title: '上架任务单号',
        dataIndex: 'onshelf_task_no',
        value: 'onshelf_task_no',
        width: 150,
        key: 'onshelf_task_no',
        scopedSlots: { customRender: 'onshelf_task_no' }
      },
      {
        title: '订单时间',
        dataIndex: 'create_time',
        value: 'create_time',
        width: 180,
        ellipsis: true
      },
      {
        title: '任务单状态',
        dataIndex: 'onshelf_task_status',
        value: 'onshelf_task_status',
        // width: 100,
        key: 'onshelf_task_status',
        scopedSlots: { customRender: 'onshelf_task_status' }
      },
      {
        title: '装箱人工号',
        dataIndex: 'personIdList',
        value: 'personIdList',
        // width: 100,
        ellipsis: true,
        key: 'personIdList',
        scopedSlots: { customRender: 'personIdList' }
      },
      {
        title: '装箱人姓名',
        dataIndex: 'personNameList',
        value: 'personNameList',
        // width: 100,
        ellipsis: true,
        key: 'personNameList',
        scopedSlots: { customRender: 'personNameList' }
      },
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        value: 'drug_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '药品批号',
        dataIndex: 'batch_no',
        value: 'batch_no',
        width: 150,
        ellipsis: true
      },
      {
        title: '入库仓库',
        dataIndex: 'house_id',
        value: 'house_id',
        // width: 100,
        ellipsis: true
      },
      {
        title: '上架数量',
        dataIndex: 'onshelf_cnt',
        value: 'onshelf_cnt'
      },
      {
        title: '已上架数量',
        dataIndex: 'already_onshelf_cnt',
        value: 'already_onshelf_cnt',
        // width: 100,
        // ellipsis: true,
        scopedSlots: { customRender: 'already_onshelf_cnt' }
      }
    ]
    const detailColumns = [
      {
        title: '药品箱物料条码',
        dataIndex: 'mat_code',
        value: 'mat_code'
      },
      {
        title: '药品箱条码',
        dataIndex: 'box_code',
        value: 'box_code'
      },
      {
        title: '货位号',
        dataIndex: 'shelf_cell_id',
        value: 'shelf_cell_id'
      }
    ]
    return {
      columns,
      tableColumns: columns,
      showSticky: false,
      stickyWidth: 0,
      isShowTaskOrderInfo: false,
      detailColumns,
      isShowUpDetailModal: false
    }
  },
  components: {
    columnSelect,
    upOrderDetail
  },
  computed: {
    ...mapGetters({
      isFetchUpList: 'inhouse/isFetchUpList',
      upList: 'inhouse/upList',
      currentStatus: 'inhouse/currentUpStatus',
      upStatus: 'inhouse/upStatus',
      upInfo: 'inhouse/upInfo'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
  },
  methods: {
    ...mapMutations({
      setCurrentStatus: 'inhouse/setCurrentUpStatus'
    }),
    ...mapActions({
      fetchUpInfo: 'inhouse/fetchUpInfo'
    }),
    showDrug () {
      this.$refs.codeListRef.showDrugDrawer()
    },
    showTaskOrderInfo (record) {
      this.fetchUpInfo({ onshelf_task_id: record.onshelf_task_id })
      this.isShowTaskOrderInfo = true
    },
    closeTaskOrderInfo () {
      this.isShowTaskOrderInfo = false
    },
    showUpDetail (record) {
      this.fetchUpInfo({ onshelf_task_id: record.onshelf_task_id })
      this.isShowUpDetailModal = true
    },
    upDetailCancel () {
      this.isShowUpDetailModal = false
    },
    changeStatus (index) {
      this.setCurrentStatus(index)
      this.$emit('handleStatusChange')
    },
    reloadList () {
      this.$emit('resetPagination')
    },
    changeColumns (columns) {
      this.tableColumns = columns
    },
    changeShowSticky (status) {
      this.showSticky = status
    },
    handleTableScroll () {
      this.stickyTable = this.$refs.stickyTableRef.$el
      const scrollLeft = this.tableList.querySelector('.ant-table-body').scrollLeft
      this.stickyTable.querySelector('.ant-table-body').scrollLeft = scrollLeft
    }
  },
  beforeDestroy () {
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.pack-list {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  .toolRow {
    height: 60px;
    align-items: center;
    .status-btn {
      cursor: pointer;
      margin-left: 10px;
      span {
        padding: 0 5px;
      }
      .bg-line {
        margin-top: 5px;
        height: 2px;
      }
    }
    .active-btn {
      span {
        color: #1890ff;
      }
      .bg-line {
        background-color: #1890ff;
      }
    }
    .toolsBtn {
      .ant-btn {
        margin-right: 10px;
      }
    }
  }
}
.table-row {
  height: 32px;
  line-height: 32px;
}
.code-drawer {
  /deep/ .ant-drawer-body {
    padding: 0;
    height: calc(100% - 62px);
  }
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