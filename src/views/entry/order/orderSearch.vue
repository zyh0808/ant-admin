<template>
  <div class="entry-search" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-search-content">
      <orderSearch ref="orderSearchRef" :pagination="pagination" @changePagination="changePagination"></orderSearch>
      <orderList pageType="search" ref="orderListRef" :pagination="pagination" @handlePageChange="handlePageChange" @handlePageSizeChange="handlePageSizeChange"></orderList>
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
      path: 'entry_search',
      breadcrumbName: '入库订单查询'
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
      this.$refs.orderSearchRef.getOrderList()
    },
    handlePageSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.orderSearchRef.getOrderList()
    }
  },
  beforeDestroy () {
    // this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-search {
  padding: 5px;
  /deep/ .ant-card-body {
    padding: 10px;
  }
  .entry-search-content {
    margin: 10px;
  }
}
</style>