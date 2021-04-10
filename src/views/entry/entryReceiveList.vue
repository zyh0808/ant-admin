<template>
  <div class="entry-receive-list" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-receive-content">
      <orderSearch></orderSearch>
      <orderList pageType="receive" ref="orderListRef"></orderList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import orderSearch from '@/components/entry/search/orderSearch.vue'
import orderList from '@/components/entry/list/orderList.vue'
export default {
  data () {
    return {
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
      pageHeaderRoutes: 'common/pageHeaderRoutes'
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
}
</style>