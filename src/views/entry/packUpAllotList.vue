<template>
  <div class="pack-up-allot-list" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="pack-up-allot-list-content">
      <packUpSearch></packUpSearch>
      <packUpList ref="packUpListRef"></packUpList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import packUpSearch from '@/components/entry/search/packUpSearch.vue'
import packUpList from '@/components/entry/list/packUpList.vue'
export default {
  data () {
    return {
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
      pageHeaderRoutes: 'common/pageHeaderRoutes'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'input/resetAllData'
    }),
    handleScroll (e) {
      const top = this.$refs.packUpListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.packUpListRef.changeShowSticky(true)
      } else {
        this.$refs.packUpListRef.changeShowSticky(false)
      }
    }
  },
  beforeDestroy () {
    // this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.pack-up-allot-list {
  padding: 5px;
  /deep/ .ant-card-body {
    padding: 10px;
  }
}
</style>