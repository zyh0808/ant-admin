<template>
  <div class="pack-task-list" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="pack-task-list-content">
      <packTaskSearch ref="packSearchRef" :pagination="pagination"
        @changePagination="changePagination"></packTaskSearch>
      <packList t ref="packTaskListRef" pageType="task" :pagination="pagination"
        @handlePageChange="handlePageChange"
        @handlePageSizeChange="handlePageSizeChange"
        @handleStatusChange="handleStatusChange"></packList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import packTaskSearch from '@/components/entry/search/packTaskSearch.vue'
import packList from '@/components/entry/list/packList.vue'
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
    packTaskSearch,
    packList
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'pack_task_list',
      breadcrumbName: '装箱任务单'
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
      const top = this.$refs.packTaskListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.packTaskListRef.changeShowSticky(true)
      } else {
        this.$refs.packTaskListRef.changeShowSticky(false)
      }
    },
    changePagination () {
      this.pagination.total = this.orderListTotal
    },
    handlePageChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.packSearchRef.getPackList()
    },
    handlePageSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.packSearchRef.getPackList()
    },
    handleStatusChange () {
      this.pagination.current = 1
      this.$refs.packSearchRef.getPackList()
    }
  },
  beforeDestroy () {
    // this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.pack-task-list {
  padding: 5px;
  // /deep/ .ant-card-body {
  //   padding: 10px;
  // }
  .pack-task-list-content {
    margin: 10px;
  }
}
</style>