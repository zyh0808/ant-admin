<template>
  <div class="entry-order" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-order-content">
      <orderSearch ref="orderSearchRef" :pagination="pagination"
        @changePagination="changePagination"></orderSearch>
      <orderList ref="orderListRef" :pagination="pagination"
        @handlePageChange="handlePageChange"
        @handlePageSizeChange="handlePageSizeChange"
        @handleStatusChange="handleStatusChange"
        @resetPagination="resetPagination"></orderList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import orderSearch from '@/components/entry/search/orderSearch.vue'
import orderList from '@/components/entry/list/orderList.vue'
const pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条/总共${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'small'
}
export default {
  data () {
    return {
      pagination: { ...pagination },
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    orderSearch,
    orderList
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'entry_order',
      breadcrumbName: '入库订单'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isFetchOrderList: 'order/isFetchOrderList',
      orderListTotal: 'order/orderListTotal'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'order/resetAllData'
    }),
    handleScroll (e) {
      const top = this.$refs.orderListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.orderListRef.changeShowSticky(true)
      } else {
        this.$refs.orderListRef.changeShowSticky(false)
      }
    },
    changePagination () {
      this.pagination.total = this.orderListTotal
    },
    handlePageChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.orderSearchRef.getOrderList()
    },
    handlePageSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.orderSearchRef.getOrderList()
    },
    handleStatusChange () {
      this.pagination.current = 1
      this.$refs.orderSearchRef.getOrderList()
    },
    resetPagination () {
      this.pagination = Object.assign({}, pagination)
      this.$refs.orderSearchRef.getOrderList()
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-order {
  padding: 5px;
  /deep/ .ant-card-body {
    padding: 10px;
  }
  .entry-order-content {
    margin: 10px;
  }
}
</style>