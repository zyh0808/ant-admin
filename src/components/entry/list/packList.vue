<template>
  <div class="pack-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
        <a-row type="flex">
          <div v-for="item in packStatus" :key="item.index"
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
                @changeColumns="changeColumns">
              </columnSelect>
            </a-tooltip>
          </a-space>
        </a-row>
      </div>
    </a-row>
    <a-table :columns="tableColumns" :data-source="packList" ref="tableRef"
      class="table-list" :rowKey="record => record.packing_task_no"
      :loading="isFetchPackList" :pagination="pagination">
      <a slot="packing_task_no" slot-scope="text, record"
        @click="showTaskOrderInfo(record)">{{text}}</a>
      <a slot="already_packing_cnt" slot-scope="text, record"
        @click="showPackDetail(record)">{{text}}</a>
      <span slot="personIdList" slot-scope="list">
        {{ list && list.join(",") }}
      </span>
      <span slot="personNameList" slot-scope="list">
        {{ list && list.join(",") }}
      </span>
      <span slot="packing_task_status" slot-scope="packing_task_status">
        <a-tag v-if="packing_task_status === 0" color="red">
          待装箱
        </a-tag>
        <a-tag v-else-if="packing_task_status === 1" color="blue">
          装箱中
        </a-tag>
        <a-tag v-else color="green">
          已装箱
        </a-tag>
      </span>
      <template slot="action" slot-scope="text, record">
        <a-button v-if="record.packing_task_status !== 2" type="link"
          size="small" @click="goToPack(record)">
          装箱
        </a-button>
        <a-divider type="vertical" v-if="record.packing_task_status !== 2" />
        <a-button type="link" size="small" @click="showTaskOrderInfo(record)">
          查看
        </a-button>
      </template>
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky ? 'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed">
    </a-table>
    <a-drawer title="装箱任务单详情" width="500" :visible="isShowTaskOrderInfo"
      @close="closeTaskOrderInfo">
      <packOrderDetail></packOrderDetail>
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
    <a-modal title="装箱详情" :visible="isShowPackDetailModal" :footer="false"
      @cancel="packDeailCancel" :width="500">
      <a-table
        :columns="packInfo.op_type === 1? codeDetailColumns : nocodeDetailColumns"
        :data-source="packBoxDetailList" ref="tableRef" class="table-list"
        :rowKey="record => record.packing_task_details_barcode_id"
        :pagination="false" :scroll="{y: 400}">
        <a slot="drug_cnt" slot-scope="text" @click="showDrug">{{text}}</a>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import columnSelect from '@/components/columnSelect.vue'
import packOrderDetail from '@/components/entry/detail/packOrderDetail'
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
        title: '装箱任务单号',
        dataIndex: 'packing_task_no',
        value: 'packing_task_no',
        width: 150,
        key: 'packing_task_no',
        scopedSlots: { customRender: 'packing_task_no' }
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
        dataIndex: 'packing_task_status',
        value: 'packing_task_status',
        // width: 100,
        key: 'packing_task_status',
        scopedSlots: { customRender: 'packing_task_status' }
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
        title: '装箱数量',
        dataIndex: 'packing_cnt',
        value: 'packing_cnt'
      },
      {
        title: '已装药品数量',
        dataIndex: 'already_packing_cnt',
        value: 'already_packing_cnt',
        // width: 100,
        scopedSlots: { customRender: 'already_packing_cnt' }
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
    const codeDetailColumns = [
      {
        title: '物料条码',
        dataIndex: 'mat_code',
        value: 'mat_code'
      },
      {
        title: '药品箱条码',
        dataIndex: 'box_code',
        value: 'box_code'
      },
      {
        title: '药品编码',
        dataIndex: 'drug_code',
        value: 'drug_code'
      }
    ]
    const nocodeDetailColumns = [
      {
        title: '物料条码',
        dataIndex: 'mat_code',
        value: 'mat_code'
      },
      {
        title: '药品箱条码',
        dataIndex: 'box_code',
        value: 'box_code'
      },
      {
        title: '药品数量',
        dataIndex: 'drug_cnt',
        value: 'drug_cnt'
      }
    ]
    return {
      columns,
      tableColumns: columns,
      showSticky: false,
      stickyWidth: 0,
      isShowTaskOrderInfo: false,
      codeDetailColumns,
      nocodeDetailColumns,
      isShowPackDetailModal: false
      // packDetailList: []
    }
  },
  components: {
    columnSelect,
    // codeList,
    // taskOrderDetailNew,
    packOrderDetail
  },
  computed: {
    ...mapGetters({
      isFetchPackList: 'inhouse/isFetchPackList',
      packList: 'inhouse/packList',
      currentStatus: 'inhouse/currentPackStatus',
      packStatus: 'inhouse/packStatus',
      packInfo: 'inhouse/packInfo'
      // packBoxDetailList: 'pack/packBoxDetailList'
    }),
    packBoxDetailList () {
      return this.packInfo.op_type && this.packInfo.op_type === 1 ? this.packInfo.detailsBarcodeList : this.packInfo.detailsNocodeList
    }
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
  },
  methods: {
    ...mapMutations({
      setCurrentStatus: 'inhouse/setCurrentPackStatus'
    }),
    ...mapActions({
      fetchPackInfo: 'inhouse/fetchPackInfo'
    }),
    showDrug () {
      this.$refs.codeListRef.showDrugDrawer()
    },
    showTaskOrderInfo (record) {
      this.fetchPackInfo({ packing_task_id: record.packing_task_id })
      this.isShowTaskOrderInfo = true
    },
    closeTaskOrderInfo () {
      this.isShowTaskOrderInfo = false
    },
    goToPack (record) {
      this.fetchPackInfo({ packing_task_id: record.packing_task_id })
      this.$router.push({ name: 'entry_pack', params: { taskNo: record.packing_task_no } })
    },
    goToCheckPack (record) {
      this.fetchPackInfo({ packing_task_id: record.packing_task_id })
      this.$router.push({ name: 'entry_packcheck', params: { taskNo: record.packing_task_no } })
    },
    showPackDetail (record) {
      // this.packDetailList = record.DetailsBarcodeList.length !== 0 ? record.DetailsBarcodeList : record.DetailsNocodeList.length !== 0 ? record.DetailsNocodeList : []
      // this.packDetailList = this.packDetailList.map(item => {
      //   item.packing_task_details_id = item.packing_task_details_barcode_id ? item.packing_task_details_barcode_id : item.packing_task_details_nocode_id ? item.packing_task_details_nocode_id : ''
      //   return item
      // })
      this.fetchPackInfo({ packing_task_id: record.packing_task_id })
      this.isShowPackDetailModal = true
    },
    packDeailCancel () {
      this.isShowPackDetailModal = false
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