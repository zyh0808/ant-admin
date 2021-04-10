<template>
  <div class="order-check-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
        <a-row type="flex">
          <div v-for="item in status" :key="item.index"
            :class="activeStatus=== item.index? 'status-btn active-btn': 'status-btn'"
            @click="changeActive(item.index)">
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
                @changeColumns="changeColumns(arguments)"></columnSelect>
            </a-tooltip>
          </a-space>
        </a-row>
      </div>
    </a-row>
    <a-table :columns="tableColumns" :data-source="orderList" ref="tableRef"
      class="table-list" :rowKey="record => record.order_no"
      :pagination="false">
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === '待审核'" color="red">
          待审核
        </a-tag>
      </span>
      <div slot="expandedRowRender" slot-scope="record">
        <a-row class="table-row">
          <a-col :span="8">项目号: <span>{{record.pro_no}}</span></a-col>
          <a-col :span="8">项目名称: <span>{{record.pro_name}}</span></a-col>
        </a-row>
        <a-row class="table-row">
          <a-col :span="8">付费账号: <span>{{record.pay_count}}</span></a-col>
          <a-col :span="8">录单人账号: <span>{{record.enter_code}}</span></a-col>
          <a-col :span="8">录单人: <span>{{record.enter_name}}</span></a-col>
        </a-row>
        <a-table :columns="innerColumns" :data-source="record.drug_list"
          :pagination="false">
        </a-table>
      </div>
      <template slot="action" slot-scope="record">
        <a-button v-if="pageType === 'check'" type="link" size="small"
          @click="goToCheck(record)">
          审核
        </a-button>
        <a-button v-else-if="pageType === 'search'" type="link" size="small"
          @click="goToEdit(record)">
          编辑
        </a-button>
        <a-button v-else-if="pageType === 'receive'" type="link" size="small"
          @click="goToReceive(record)">
          收货
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="goToDetail(record)">
          详情
        </a-button>
      </template>
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed">
      <div slot="expandedRowRender">
      </div>
    </a-table>
  </div>
</template>

<script>
import columnSelect from '@/components/columnSelect.vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    pageType: {
      type: String,
      default: ''
    }
  },
  data () {
    const columns = [
      {
        title: '入库订单号',
        dataIndex: 'order_no',
        value: 'order_no',
        // fixed: 'left',
        width: 150,
        ellipsis: true
      },
      {
        title: '订单时间',
        dataIndex: 'order_time',
        value: 'order_time',
        // fixed: 'left',
        width: 150,
        ellipsis: true
      },
      {
        title: '申办方名称',
        dataIndex: 'client_name',
        value: 'client_name',
        // fixed: 'left',
        width: 150,
        ellipsis: true
      },
      {
        title: '申办方编码',
        dataIndex: 'client_code',
        value: 'client_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        value: 'order_status',
        width: 100,
        key: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '入库仓库',
        dataIndex: 'house',
        value: 'house',
        width: 150,
        ellipsis: true
      },
      {
        title: '药品总数',
        dataIndex: 'drug_count',
        value: 'drug_count',
        width: 100,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        // fixed: 'right',
        width: 150,
        scopedSlots: { customRender: 'action' }
      }
    ]
    const innerColumns = [
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        key: 'drug_name',
        ellipsis: true
      },
      {
        title: '药品批次号',
        dataIndex: 'drug_batch',
        key: 'drug_batch',
        ellipsis: true
      },
      {
        title: '有效期至',
        dataIndex: 'drug_date',
        key: 'drug_date',
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
        dataIndex: 'count',
        key: 'count',
        ellipsis: true
      }
    ]
    return {
      columns,
      tableColumns: columns,
      innerColumns,
      status: [
        {
          index: 0,
          name: '待审核'
        },
        {
          index: 1,
          name: '已审核'
        },
        {
          index: 2,
          name: '已入库'
        }
      ],
      activeStatus: 0,
      showSticky: false,
      stickyWidth: 0
    }
  },
  components: { columnSelect },
  computed: {
    ...mapGetters({
      orderList: 'input/orderList'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.table = this.$refs.tableRef.$el
    // this.stickyWidth = this.table.querySelector('.table-list').clientWidth
    // this.table.addEventListener('scroll', this.handleTableScroll, true)
  },
  methods: {
    goToEdit (order) {
      this.$router.push({ name: 'entry_input', params: { mode: 'edit' } })
    },
    goToCheck (order) {
      this.$router.push({ name: 'entry_check' })
    },
    goToDetail () {
      this.$router.push({ name: 'entry_checkdetail', params: { from: this.pageType } })
    },
    goToReceive (order) {
      this.$router.push({ name: 'entry_receive' })
    },
    changeActive (value) {
      this.activeStatus = value
    },
    reloadList () {
    },
    changeColumns (e) {
      this.tableColumns = e[0]
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
.order-check-list {
  margin: 10px 5px 0;
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