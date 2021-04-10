<template>
  <div class="pack-up-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
        <a-row type="flex">
          <!-- <div v-for="item in status" :key="item.index"
            :class="activeStatus=== item.index? 'status-btn active-btn': 'status-btn'"
            @click="changeActive(item.index)">
            <span>{{item.name}}</span>
            <div class="bg-line"></div>
          </div> -->
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
    <a-table :columns="tableColumns" :data-source="pack_up_list" ref="tableRef"
      class="table-list" :rowKey="record => record.order_no" :pagination="false"
      :scroll="{x:1450}">
      <span slot="pack_status" slot-scope="pack_status">
        <a-tag v-if="pack_status === '未分配'" color="red">
          未分配
        </a-tag>
        <a-tag v-else color="green">
          已分配
        </a-tag>
      </span>
      <span slot="up_status" slot-scope="up_status">
        <a-tag v-if="up_status === '未分配'" color="red">
          未分配
        </a-tag>
        <a-tag v-else color="green">
          已分配
        </a-tag>
      </span>
      <template slot="action">
        <a-button type="link" size="small" @click="goToAllot">
          分配
        </a-button>
      </template>
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky ? 'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed" :scroll="{x:1450}">
    </a-table>
  </div>
</template>

<script>
import columnSelect from '@/components/columnSelect.vue'
import { mapGetters } from 'vuex'
export default {
  data () {
    const columns = [
      {
        title: '入库任务单号',
        dataIndex: 'order_no',
        value: 'order_no',
        width: 150,
        ellipsis: true
      },
      {
        title: '订单时间',
        dataIndex: 'order_time',
        value: 'order_time',
        width: 150,
        ellipsis: true
      },
      {
        title: '装箱分配状态',
        dataIndex: 'pack_status',
        value: 'pack_status',
        width: 100,
        key: '',
        scopedSlots: { customRender: 'pack_status' }
      },
      {
        title: '上架分配状态',
        dataIndex: 'up_status',
        value: 'up_status',
        width: 100,
        key: 'up_status',
        scopedSlots: { customRender: 'up_status' }
      },
      {
        title: '入库仓库',
        dataIndex: 'house',
        value: 'house',
        width: 150,
        ellipsis: true
      },
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        value: 'drug_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '药品批号',
        dataIndex: 'drug_batch',
        value: 'drug_batch',
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
        title: '收货数量',
        dataIndex: 'receiveCount',
        value: 'receiveCount',
        width: 100,
        ellipsis: true
      },
      {
        title: '预用药品箱',
        dataIndex: 'box_kind',
        value: 'box_kind',
        width: 100,
        ellipsis: true
      },
      {
        title: '预用数量',
        dataIndex: 'box_count',
        value: 'box_count',
        width: 100,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      showSticky: false,
      stickyWidth: 0
    }
  },
  components: {
    columnSelect
  },
  computed: {
    ...mapGetters({
      pack_up_list: 'allot/pack_up_list'
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
    goToAllot () {
      this.$router.push({ name: 'pack_up_allot' })
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
.pack-up-list {
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
.task-order-detail-drawer {
  /deep/ .ant-drawer-body {
    padding: 16px;
  }
}
.drug-list-drawer {
  .code-list {
    height: 100%;
    .infinite-drug-code {
      // border: 1px solid #e8e8e8;
      border-radius: 4px;
      overflow: auto;
      padding: 8px 24px;
      height: calc(100vh - 55px);
    }
    .loading-container {
      position: absolute;
      bottom: 40px;
      width: 100%;
      text-align: center;
    }
  }
  /deep/ .ant-drawer-body {
    padding: 0;
    height: calc(100% - 62px);
  }
  /deep/ .ant-list-item {
    padding: 8px 16px;
    border-bottom: 1px solid #e8e8e8 !important;
  }
}
.confirm-form {
  /deep/ .ant-input-number {
    input {
      color: red;
      font-weight: 600;
    }
  }
  /deep/ .ant-input {
    color: red;
    font-weight: 600;
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