<template>
  <div class="pack-up-list">
    <a-row class="toolRow" type="flex" justify="space-between">
      <div>
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
    <a-table :columns="tableColumns" :data-source="packUpList" ref="tableRef"
      class="table-list" :rowKey="record => record.drug_in_detail_id"
      :loading="isFetchPackUpList" :pagination="pagination" :scroll="{x:1500}"
      @change="changePage" @showSizeChange="changePageSize">
      <!-- <a slot="drug_in_detail_id" slot-scope="text, record" @click="showTaskOrderInfo(record)">{{text}}</a> -->
      <!-- <a slot="receive_cnt" slot-scope="text" @click="showDrug">{{text}}</a> -->
      <span slot="packing_status" slot-scope="packing_status">
        <a-tag v-if="packing_status === 0" color="red">
          未分配
        </a-tag>
        <a-tag v-else color="green">
          已分配
        </a-tag>
      </span>
      <span slot="onshelf_status" slot-scope="onshelf_status">
        <a-tag v-if="onshelf_status === 0" color="red">
          未分配
        </a-tag>
        <a-tag v-else color="green">
          已分配
        </a-tag>
      </span>
      <template slot="action" slot-scope="record">
        <a-button
          v-if="record.packing_status === 0 || record.onshelf_status === 0"
          type="link" size="small" @click="goToAllot(record)">
          分配
        </a-button>
        <a-divider type="vertical"
          v-if="record.packing_status === 0 || record.onshelf_status === 0" />
        <a-button type="link" size="small"
          @click="showTaskOrderInfo(record.drug_in_detail_id)">
          查看详情
        </a-button>
      </template>
    </a-table>
    <a-table :columns="tableColumns" :class="showSticky ? 'sticky-table'  : ''"
      ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}"
      table-layout="fixed" :scroll="{x:1500}">
    </a-table>
    <a-drawer title=" 装箱上架任务详情" width="500" :visible="isShowTaskOrderInfo"
      @close="closeTaskOrderInfo">
      <packUpDetail></packUpDetail>
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
        <a-button :style="{ marginRight: '8px' }" @click="closeTaskOrderInfo">
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
import packUpDetail from '@/components/entry/detail/packUpDetail'
import drugInfoDetail from '@/components/entry/detail/drugInfoDetail'
import { mapActions, mapGetters } from 'vuex'
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
        title: '入库仓库',
        dataIndex: 'house_name',
        value: 'house_name',
        // width: 150,
        ellipsis: true
      },
      {
        title: '确认收货数量',
        dataIndex: 'receive_cnt',
        value: 'receive_cnt',
        width: 120,
        ellipsis: true,
        scopedSlots: { customRender: 'receive_cnt' }
      },
      {
        title: '预用药品箱',
        dataIndex: 'box_kind_name',
        value: 'box_kind_name',
        // width: 100,
        ellipsis: true
      },
      {
        title: '预用数量',
        dataIndex: 'box_cnt',
        value: 'box_cnt',
        // width: 100,
        ellipsis: true
      },
      {
        title: '装箱分配状态',
        dataIndex: 'packing_status',
        value: 'packing_status',
        // width: 100,
        scopedSlots: { customRender: 'packing_status' }
      },
      {
        title: '上架分配状态',
        dataIndex: 'onshelf_status',
        value: 'onshelf_status',
        // width: 100,
        scopedSlots: { customRender: 'onshelf_status' }
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      showSticky: false,
      stickyWidth: 0,
      drugDrawerVisible: false,
      isShowTaskOrderInfo: false
    }
  },
  components: {
    columnSelect,
    codeList,
    packUpDetail,
    drugInfoDetail
  },
  computed: {
    ...mapGetters({
      packUpList: 'inhouse/packUpList',
      isFetchPackUpList: 'inhouse/isFetchPackUpList'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
  },
  methods: {
    ...mapActions({
      fetchPackUpInfo: 'inhouse/fetchPackUpInfo'
    }),
    changePage (pagination) {
      this.$emit('handlePageChange', pagination)
    },
    changePageSize (pagination) {
      thsi.$emit('handlePageSizeChange', pagination)
    },
    goToAllot (drug) {
      this.fetchPackUpInfo({ drug_in_detail_id: drug.drug_in_detail_id })
      this.$router.push({ name: 'pack_up_allot', params: { drugName: drug.drug_name } })
    },
    showDrug () {
      this.drugDrawerVisible = true
      this.$refs.codeListRef.showDrugDrawer()
    },
    showTaskOrderInfo (drug_in_detail_id) {
      this.fetchPackUpInfo({ drug_in_detail_id })
      this.isShowTaskOrderInfo = true
    },
    closeTaskOrderInfo () {
      this.isShowTaskOrderInfo = false
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
.pack-up-list {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  .toolRow {
    height: 60px;
    align-items: center;
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