<template>
  <div class="pack-up-allot-list"
    @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes"
        :basePath="system"></pageHeader>
    </div>
    <div class="pack-up-allot-list-content">
      <packUpSearch ref="packUpSearchRef"
        :pagination="pagination"
        @changePagination="changePagination">
      </packUpSearch>
      <packUpList ref="packUpListRef"
        :pagination="pagination"
        @handlePageChange="handlePageChange"
        @handlePageSizeChange="handlePageSizeChange"
        @resetPagination="resetPagination">
      </packUpList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import packUpSearch from '@/components/entry/search/packUpSearch.vue'
import packUpList from '@/components/entry/list/packUpList.vue'
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
    packUpSearch,
    packUpList
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'pack_up_allot_list',
      breadcrumbName: '装箱上架分配列表'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      packUpListTotal: 'inhouse/packUpListTotal'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'inhouse/resetAllData'
    }),
    handleScroll (e) {
      const top = this.$refs.packUpListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.packUpListRef.changeShowSticky(true)
      } else {
        this.$refs.packUpListRef.changeShowSticky(false)
      }
    },
    changePagination () {
      this.pagination.total = this.packUpListTotal
    },
    handlePageChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.packUpSearchRef.getPackUpList()
    },
    handlePageSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.$refs.packUpSearchRef.getPackUpList()
    },
    resetPagination () {
      this.pagination = Object.assign({}, pagination)
      this.$refs.packUpSearchRef.getPackUpList()
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.pack-up-allot-list {
  padding: 5px;
  .pack-up-allot-list-content {
    margin: 10px;
  }
}
</style>