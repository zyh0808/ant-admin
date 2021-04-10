<template>
  <div class="receive-confirm-list">
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
    <a-table :columns="tableColumns" :data-source="taskOrderList" ref="tableRef"
      class="table-list" :rowKey="record => record.order_no"
      :pagination="false">
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === '待确认'" color="red">
          待确认
        </a-tag>
        <a-tag v-else color="green">
          已确认
        </a-tag>
      </span>
      <template slot="action">
        <a-button type="link" size="small" @click="showDetail">
          明细
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="showConfirmModal">
          收货确认
        </a-button>
      </template>
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky ? 'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed">
      <div slot="expandedRowRender">
      </div>
    </a-table>
    <a-drawer title="任务单信息" width="520" :closable="false"
      :visible="detailVisible" @close="onDetailClose"
      class="task-order-detail-drawer">
      <taskOrderDetail @showDrug="showDrug(arguments)"></taskOrderDetail>
      <a-drawer :title="drugListTitle" width="250" :visible="drugDrawerVisible"
        @close="drugClose" class="drug-list-drawer">
        <a-list class="code-list">
          <RecycleScroller v-infinite-scroll="appendMore"
            class="infinite-drug-code" :items="codeList" :item-size="40"
            key-field="code" :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="1">
            <a-list-item slot-scope="{item}">
              {{item.code}}
            </a-list-item>
          </RecycleScroller>
          <div v-if="loading && !busy" class="loading-container">
            <a-spin />
          </div>
        </a-list>
      </a-drawer>
      <div :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }">
        <a-button style="marginRight: 8px" @click="onDetailClose">
          关闭
        </a-button>
        <a-button type="primary" @click="showConfirmModal">
          确认收货
        </a-button>
      </div>
    </a-drawer>
    <a-modal title="收货确认" :visible="confirmModalVisible"
      :confirm-loading="confirmLoading" okText="保存" @ok="handleConfirm"
      @cancel="confirmCancel" :width="700">

      <a-card title="任务单信息" style="width: 100%">
        <a-descriptions title="" :column="3">
          <a-descriptions-item label=" 任务单号">
            <span>{{taskOrderInfo.order_no}}</span>
          </a-descriptions-item>
          <a-descriptions-item label="任务单状态">
            <a-badge v-if="taskOrderInfo.order_status === '待确认'" status="error"
              text="待确认" />
            <a-badge v-else status="success" text="已确认" />
          </a-descriptions-item>
          <a-descriptions-item label="入库仓库">
            {{taskOrderInfo.house}}
          </a-descriptions-item>
          <a-descriptions-item label="药品名称" :span="2">
            {{taskOrderInfo.drug_name}}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="药品规格">
            {{taskOrderInfo.spec}}
          </a-descriptions-item> -->
          <a-descriptions-item label="药品批号">
            {{taskOrderInfo.drug_batch}}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card title="拆零信息" style="margin-top:10px; width: 100%">
        <a-form-model :model="confirmForm" :rules="confirmFormRules"
          :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }"
          class="confirm-form">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="原药品数量">
                <span>{{confirmForm.drug_count}}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="收货数量">
                <span>{{confirmForm.receiveCount}}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="2" class="form-icon">
              <a-icon type="swap-right"
                :style="{color: '#000',fontSize: '32px'}" />
            </a-col>
            <a-col :span="10">
              <a-form-model-item label="确认后药品数量" prop="confirmCount">
                <a-input-number v-model="confirmForm.confirmCount" :min="1" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="原药品包装">
                <span>{{confirmForm.drug_pack}}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="收货包装">
                <span>{{confirmForm.drug_pack}}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="2" class="form-icon">
              <a-icon type="swap-right"
                :style="{color: '#000',fontSize: '32px'}" />
            </a-col>
            <a-col :span="10">
              <a-form-model-item label="确认后包装" prop="confirmPacket">
                <a-input v-model="confirmForm.confirmPacket" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="备注" prop="mark" :label-col="{ span: 3}"
            :wrapper-col="{ span: 21 }">
            <a-input type="textarea" v-model="confirmForm.mark"
              placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import columnSelect from '@/components/columnSelect.vue'
import taskOrderDetail from '@/components/entry/detail/taskOrderDetail.vue'
import { mapGetters } from 'vuex'
import { PrefixInteger } from '@/js/utils.js'
function getCodeList (num, startIndex) {
  let list = []
  for (let i = startIndex; i < startIndex + num; i++) {
    const fixedNum = PrefixInteger(i, 5)
    const code = `code${fixedNum}`
    list.push({ key: i + '', code })
  }
  return list
}
const codeList = getCodeList(10000, 0)

export default {
  directives: { infiniteScroll },
  data () {
    const columns = [
      {
        title: '入库订单号',
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
        title: '订单状态',
        dataIndex: 'order_status',
        value: 'order_status',
        width: 100,
        key: 'status',
        scopedSlots: { customRender: 'status' }
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
        title: '操作',
        key: 'action',
        value: 'action',
        width: 200,
        scopedSlots: { customRender: 'action' }
      }
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
      detailVisible: false,
      drugDrawerVisible: false,
      confirmModalVisible: false,
      confirmLoading: false,
      confirmForm: {
        drug_pack: '盒',
        drug_count: 10000,
        receiveCount: 9999,
        confirmCount: 9998,
        confirmPacket: '盒',
        mark: ''
      },
      confirmFormRules: {
        confirmCount: [{ required: true, message: '请输入确认后药品数量', trigger: 'blur' }],
        confirmPacket: [{ required: true, message: '请输入确认后包装', trigger: 'blur' }]
      },
      drugListTitle: '',
      codeList,
      busy: false,
      loading: false,
      showSticky: false,
      stickyWidth: 0
    }
  },
  components: {
    columnSelect,
    RecycleScroller,
    taskOrderDetail
  },
  computed: {
    ...mapGetters({
      taskOrderList: 'input/taskOrderList',
      taskOrderInfo: 'input/taskOrderInfo'
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
    onDetailClose () {
      this.detailVisible = false
    },
    showConfirmModal () {
      this.confirmModalVisible = true
    },
    showDrug (e) {
      // console.log(e)
      const mode = e[0]
      this.drugDrawerVisible = true
      this.drugListTitle = mode === 'detail' ? '药品明细' : '收货明细'
    },
    showDetail () {
      this.detailVisible = true
    },
    appendMore () { },
    drugClose () {
      this.drugDrawerVisible = false
    },
    changeActive (value) {
      this.activeStatus = value
    },
    handleConfirm () {
      this.confirmCancel()
    },
    confirmCancel () {
      this.confirmModalVisible = false
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
.receive-confirm-list {
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