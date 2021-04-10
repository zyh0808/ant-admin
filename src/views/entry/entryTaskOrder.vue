<template>
  <div class="entry-task-order" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-task-order-content">
      <taskOrderSearch></taskOrderSearch>
      <taskOrderList ref="taskOrderListRef"></taskOrderList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import taskOrderSearch from '@/components/entry/search/taskOrderSearch.vue'
import taskOrderList from '@/components/entry/list/taskOrderList.vue'
export default {
  data () {
    return {
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    taskOrderSearch,
    taskOrderList
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'entry_taskorder',
      breadcrumbName: '入库任务单查询'
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
      const top = this.$refs.taskOrderListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.taskOrderListRef.changeShowSticky(true)
      } else {
        this.$refs.taskOrderListRef.changeShowSticky(false)
      }
    }
  },
  beforeDestroy () {
    // this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-task-order {
  padding: 5px;
  /deep/ .ant-card-body {
    padding: 10px;
  }
}
</style>