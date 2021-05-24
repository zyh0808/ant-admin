<template>
  <div class="up-task-order" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="up-task-order-content">
      <upTaskSearch ref="upSearchRef" :pagination="pagination" @changePagination="changePagination"></upTaskSearch>
      <upList ref="upTaskListRef" :pagination="pagination" @handlePageChange="handlePageChange" @handlePageSizeChange="handlePageSizeChange" @handleStatusChange="handleStatusChange" @resetPagination="resetPagination"></upList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import upTaskSearch from '@/components/entry/search/upTaskSearch.vue'
import upList from '@/components/entry/list/upList.vue'
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
    upTaskSearch,
    upList
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'up_task_order',
      breadcrumbName: '上架任务单'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      upListTotal: 'inhouse/upListTotal'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'inhouse/resetAllData'
    }),
    handleScroll (e) {
      const top = this.$refs.upTaskListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.upTaskListRef.changeShowSticky(true)
      } else {
        this.$refs.upTaskListRef.changeShowSticky(false)
      }
    },
    changePagination () {
      this.pagination.total = this.upListTotal
    },
    handlePageChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.upSearchRef.getUpList()
    },
    handlePageSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.upSearchRef.getUpList()
    },
    handleStatusChange () {
      this.pagination.current = 1
      this.$refs.upSearchRef.getUpList()
    },
    resetPagination () {
      this.pagination = Object.assign({}, pagination)
      this.$refs.upSearchRef.getUpList()
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.up-task-order {
  padding: 5px;
  // /deep/ .ant-card-body {
  //   padding: 10px;
  // }
  .up-task-order-content {
    margin: 10px;
  }
}
</style>