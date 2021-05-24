<template>
  <div class="order-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
        <a-row type="flex">
          <div v-for="item in orderStatus" :key="item.index"
            :class="currentStatus === item.index ? 'status-btn active-btn': 'status-btn'"
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
    <a-table :columns="tableColumns" :data-source="orderList" ref="tableRef"
      class="table-list" :rowKey="record => record.drug_in_no"
      :loading="isFetchOrderList" :pagination="pagination" @change="changePage"
      @showSizeChange="changePageSize">
      <a slot="drug_in_no" slot-scope="text, record"
        @click="showOrderDetail(record)">{{text}}</a>
      <span slot="status" slot-scope="text">
        <a-tag v-if="text === 1" color="red">
          待审核
        </a-tag>
        <a-tag v-else-if="text === 2" color="red">
          待收货
        </a-tag>
        <a-tag v-else-if="text === 4" color="red">
          待确认
        </a-tag>
        <a-tag v-else-if="text === 5" color="green">
          已收货
        </a-tag>
      </span>
      <template slot="action" slot-scope="record">
        <!-- <a-button v-if="record.status === 1" type="link" size="small" @click="goToEdit(record)">
          订单编辑
        </a-button>
        <a-divider type="vertical" v-if="record.status === 1" /> -->
        <a-button v-if="record.status === 1" type="link" size="small"
          @click="goToCheck(record)">
          订单审核
        </a-button>
        <a-button v-else-if="record.status === 2" type="link" size="small"
          @click="goToReceive(record)">
          订单收货
        </a-button>
        <a-button v-else-if="record.status === 4" type="link" size="small"
          @click="goToReceive(record)">
          收货确认
        </a-button>
        <a-divider type="vertical" v-if="record.status === 4" />
        <a-button type="link" size="small" @click="showOrderDetail(record)">
          查看
        </a-button>
      </template>
      <div slot="expandedRowRender" slot-scope="record">
        <a-table :columns="innerColumns" :data-source="record.drugInDetails"
          :rowKey="record => record.batch_no" :pagination="false">
          <a slot="in_cnt" slot-scope="text, record"
            @click="showCodeDetail(record.drug_in_detail_id)">{{text}}</a>
        </a-table>
      </div>
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed">
      <div slot="expandedRowRender">
      </div>
    </a-table>
    <a-drawer title="订单详情" width="500" :visible="orderDetailDrawerVisible"
      @close="hideOrderDetail">
      <orderInfoDetail></orderInfoDetail>
      <a-divider></a-divider>
      <projectInfoDrawerDetail></projectInfoDrawerDetail>
      <!-- <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="hideOrderDetail">
          关闭
        </a-button>
      </div> -->
    </a-drawer>
    <codeList ref="codeListRef"></codeList>
  </div>
</template>

<script>
import columnSelect from '@/components/columnSelect.vue'
import codeList from '@/components/entry/codeList.vue'
import orderInfoDetail from '@/components/entry/detail/orderInfoDetail.vue'
import projectInfoDrawerDetail from '@/components/entry/detail/projectInfoDrawerDetail.vue'
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
        title: '入库订单号',
        dataIndex: 'drug_in_no',
        value: 'drug_in_no',
        width: 150,
        key: 'drug_in_no',
        scopedSlots: { customRender: 'drug_in_no' }
      },
      {
        title: '订单时间',
        dataIndex: 'in_ts',
        value: 'in_ts',
        width: 180,
        ellipsis: true
      },
      {
        title: '申办方名称',
        dataIndex: 'client_name',
        value: 'client_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '项目号',
        dataIndex: 'proj_no',
        value: 'proj_no',
        // width: 150,
        ellipsis: true
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        value: 'status',
        // width: 100,
        key: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '入库仓库',
        dataIndex: 'house_name',
        value: 'house_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '药品总数',
        dataIndex: 'in_sumcnt',
        value: 'in_sumcnt',
        // width: 100,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 200,
        scopedSlots: { customRender: 'action' }
      }
    ]
    const innerColumns = [
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        key: 'drug_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '药品批次号',
        dataIndex: 'batch_no',
        key: 'batch_no',
        // width: 150,
        ellipsis: true
      },
      {
        title: '有效期至',
        dataIndex: 'exp_date',
        key: 'exp_date',
        ellipsis: true
      },
      {
        title: '药品规格',
        dataIndex: 'spec',
        key: 'spec',
        ellipsis: true
      },
      {
        title: '药品数量',
        dataIndex: 'in_cnt',
        ellipsis: true,
        key: 'in_cnt',
        scopedSlots: { customRender: 'in_cnt' }
      },
      // {
      //   title: '药品包装',
      //   dataIndex: 'pck_unit',
      //   key: 'pck_unit',
      //   ellipsis: true
      // },
      {
        title: '是否编盲',
        dataIndex: 'op_type_desc',
        key: 'op_type_desc',
        ellipsis: true
      },
      {
        title: '存储条件',
        dataIndex: 'env',
        key: 'env',
        ellipsis: true
      },
      {
        title: '温度区间',
        dataIndex: 'temp_range',
        key: 'temp_range',
        ellipsis: true
      },
      // {
      //   title: '湿度区间',
      //   dataIndex: 'humidity_range',
      //   key: 'humidity_range',
      //   ellipsis: true
      // },
      // {
      //   title: '操作',
      //   key: 'action',
      //   value: 'action',
      //   width: 100,
      //   scopedSlots: { customRender: 'action' }
      // }
    ]
    return {
      columns,
      tableColumns: columns,
      innerColumns,
      activeStatus: 0,
      showSticky: false,
      stickyWidth: 0,
      orderDetailDrawerVisible: false,
      drugCodeVisible: false
    }
  },
  components: {
    columnSelect,
    codeList,
    orderInfoDetail,
    projectInfoDrawerDetail
  },
  computed: {
    ...mapGetters({
      isFetchOrderList: 'order/isFetchOrderList',
      orderList: 'order/orderList',
      orderStatus: 'order/orderStatus',
      currentStatus: 'order/currentStatus'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.querySelector('.ant-table-thead').clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
  },
  methods: {
    ...mapActions({
      fetchOrderInfo: 'order/fetchOrderInfo',
      fetchCodeList: 'order/fetchCodeList',
      fetchOrderReceiveInfo: 'order/fetchOrderReceiveInfo'
    }),
    ...mapMutations({
      setCurrentStatus: 'order/setCurrentStatus',
      setOrderInfo: 'order/setOrderInfo',
      setOrderDrugList: 'order/setOrderDrugList'
    }),
    changeStatus (index) {
      this.setCurrentStatus(index)
      this.$emit('handleStatusChange')
    },
    changePage (pagination) {
      this.$emit('handlePageChange', pagination)
    },
    changePageSize (pagination) {
      this.$emit('handlePageSizeChange', pagination)
    },
    showOrderDetail (order) {
      if (order.status === 1) {// 未审核
        this.fetchOrderInfo({ drug_in_id: order.drug_in_id })
      } else {
        this.fetchOrderReceiveInfo({ drug_in_id: order.drug_in_id })
      }
      this.orderDetailDrawerVisible = true
    },
    showCodeDetail (drug_in_detail_id) {
      this.fetchCodeList({ drug_in_detail_id })
      this.$refs.codeListRef.showDrugDrawer()
    },
    goToEdit (order) {
      this.fetchOrderInfo({ drug_in_id: order.drug_in_id })
      const drug_in_no = order.drug_in_no
      this.$router.push({ name: 'entry_input', params: { mode: 'edit', orderId: drug_in_no } })
    },
    goToCheck (order) {
      this.fetchOrderInfo({ drug_in_id: order.drug_in_id })
      const drug_in_no = order.drug_in_no
      this.$router.push({ name: 'entry_check', params: { orderId: drug_in_no } })
    },
    goToReceive (order) {
      this.fetchOrderReceiveInfo({ drug_in_id: order.drug_in_id })
      const drug_in_no = order.drug_in_no
      this.$router.push({ name: 'entry_receive', params: { orderId: drug_in_no } })
    },
    hideOrderDetail () {
      this.orderDetailDrawerVisible = false
    },
    hideCodeList () {
      this.drugCodeVisible = false
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
      const scrollLeft = this.table.querySelector('.ant-table-body').scrollLeft
      this.stickyTable.querySelector('.ant-table-body').scrollLeft = scrollLeft
    }
  },
  beforeDestroy () {
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.order-list {
  margin: 10px 0;
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
.code-drawer {
  /deep/ .ant-drawer-body {
    padding: 0;
    height: calc(100% - 62px);
  }
}
</style>