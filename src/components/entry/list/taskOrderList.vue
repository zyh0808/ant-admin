<template>
  <div class="task-order-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
        <a-row type="flex">
          <div v-for="item in status" :key="item.index" :class="activeStatus=== item.index? 'status-btn active-btn': 'status-btn'" @click="changeActive(item.index)">
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
              <columnSelect :plainOptions="columns" @changeColumns="changeColumns"></columnSelect>
            </a-tooltip>
          </a-space>
        </a-row>
      </div>
    </a-row>
    <a-table :columns="tableColumns" :data-source="taskOrderList" ref="tableRef" class="table-list" :rowKey="record => record.order_no" :pagination="false">
      <a slot="order_no" slot-scope="text" @click="showTaskOrderInfo">{{text}}</a>
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === '待确认'" color="red">
          待确认
        </a-tag>
        <a-tag v-else color="green">
          已确认
        </a-tag>
      </span>
      <a slot="drug_count" slot-scope="text" @click="showDrug">{{text}}</a>
      <!-- <div slot="expandedRowRender" slot-scope="record">
        <a-row class="table-row">
          <a-col :span="8">入库仓库: <span>{{record.house}}</span></a-col>
          <a-col :span="8">申办方编码: <span>{{record.client_code}}</span></a-col>
          <a-col :span="8">申办方名称: <span>{{record.client_name}}</span></a-col>
        </a-row>
        <a-row class="table-row">
          <a-col :span="8">项目号: <span>{{record.pro_no}}</span></a-col>
          <a-col :span="8">项目名称: <span>{{record.pro_name}}</span></a-col>
          <a-col :span="8">付费账号: <span>{{record.pay_count}}</span></a-col>
        </a-row>
        <a-row class="table-row">
          <a-col :span="8">药品规格: <span>{{record.spec}}</span></a-col>
          <a-col :span="8">有效期至: <span>{{record.drug_date}}</span></a-col>
        </a-row>
      </div> -->
      <!-- <template slot="action">
        <a-button type="link" size="small" @click="showDrug('drug')">
          药品明细
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="showDrug('receive')">
          收货明细
        </a-button>
      </template> -->
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky ? 'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
      <div slot="expandedRowRender">
      </div>
    </a-table>
    <a-drawer title="任务单详情" width="500" :visible="isShowTaskOrderInfo" @close="closeTaskOrderInfo">
      <!-- <taskOrderDetailNew></taskOrderDetailNew> -->
      <a-divider></a-divider>
      <drugInfoDetail></drugInfoDetail>
      <div :style="{
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
        <a-button :style="{ marginRight: '8px' }" @click="closeTaskOrderInfo">
          关闭
        </a-button>
      </div>
    </a-drawer>
    <a-drawer title="药品条形码" width="250" :visible="drugDrawerVisible" @close="closeDrug" class="code-drawer">
      <codeList></codeList>
      <div :style="{
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
        <a-button :style="{ marginRight: '8px' }" @click="closeDrug">
          关闭
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import columnSelect from '@/components/columnSelect.vue'
import codeList from '@/components/entry/codeList.vue'
// import taskOrderDetailNew from '@/components/entry/detail/taskOrderDetailNew'
import drugInfoDetail from '@/components/entry/detail/drugInfoDetail'
import { mapGetters } from 'vuex'

export default {
  data () {
    const columns = [
      {
        title: '入库订单号',
        dataIndex: 'order_no',
        value: 'order_no',
        width: 150,
        ellipsis: true,
        scopedSlots: { customRender: 'order_no' }
      },
      {
        title: '订单时间',
        dataIndex: 'order_time',
        value: 'order_time',
        width: 150,
        ellipsis: true
      },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        value: 'order_status',
        // width: 100,
        key: 'status',
        scopedSlots: { customRender: 'status' }
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
        dataIndex: 'drug_batch',
        value: 'drug_batch',
        // width: 150,
        ellipsis: true
      },
      {
        title: '入库仓库',
        dataIndex: 'house',
        value: 'house',
        // width: 100,
        ellipsis: true
      },
      {
        title: '申办方名称',
        dataIndex: 'client_name',
        value: 'client_name',
        // width: 100,
        ellipsis: true
      },
      {
        title: '项目名称',
        dataIndex: 'pro_name',
        value: 'pro_name',
        // width: 100,
        ellipsis: true
      },
      {
        title: '药品总数',
        dataIndex: 'drug_count',
        value: 'drug_count',
        width: 100,
        // ellipsis: true,
        scopedSlots: { customRender: 'drug_count' }
      }
      // {
      //   title: '操作',
      //   key: 'action',
      //   value: 'action',
      //   width: 200,
      //   scopedSlots: { customRender: 'action' }
      // }
    ]
    return {
      columns,
      tableColumns: columns,
      status: [
        {
          index: 0,
          name: '待确认'
        },
        {
          index: 1,
          name: '已确认'
        }
      ],
      activeStatus: 0,
      drugDrawerVisible: false,
      codeList,
      showSticky: false,
      stickyWidth: 0,
      isShowTaskOrderInfo: false
    }
  },
  components: {
    columnSelect,
    codeList,
    taskOrderDetailNew,
    drugInfoDetail
  },
  computed: {
    ...mapGetters({
      taskOrderList: 'input/taskOrderList'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
  },
  methods: {
    showDrug () {
      this.drugDrawerVisible = true
    },
    closeDrug () {
      this.drugDrawerVisible = false
    },
    showTaskOrderInfo () {
      this.isShowTaskOrderInfo = true
    },
    closeTaskOrderInfo () {
      this.isShowTaskOrderInfo = false
    },
    changeActive (value) {
      this.activeStatus = value
    },
    reloadList () {
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
.task-order-list {
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