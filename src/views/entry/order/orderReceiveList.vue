<template>
  <div class="entry-receive-list" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-receive-content">
      <orderSearch ref="orderSearchRef" :pagination="pagination" @changePagination="changePagination"></orderSearch>
      <orderList ref="orderListRef" pageType="receive" :pagination="pagination" @handlePageChange="handlePageChange" @handlePageSizeChange="handlePageSizeChange"></orderList>
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
      path: 'entry_receive',
      breadcrumbName: '入库订单收货'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isFetchOrderCheckList: 'order/isFetchOrderCheckList',
      orderCheckList: 'order/orderCheckList',
      orderCheckListTotal: 'order/orderCheckListTotal'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'input/resetAllData'
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
      this.pagination.total = this.orderCheckListTotal
    },
    handlePageChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.orderSearchRef.getOrderCheckList()
    },
    handlePageSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.orderSearchRef.getOrderCheckList()
    }
  },
  beforeDestroy () {
    // this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-receive-list {
  padding: 5px;
  .entry-receive-content {
    margin: 10px;
  }
}
</style>