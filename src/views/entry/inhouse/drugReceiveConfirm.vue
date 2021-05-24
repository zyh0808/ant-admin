<template>
  <div class="entry-receive-confirm" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-receive-confirm-content">
      <taskOrderSearch></taskOrderSearch>
      <receiveConfirmList ref="receiveConfirmListRef"></receiveConfirmList>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import taskOrderSearch from '@/components/entry/search/taskOrderSearch.vue'
import receiveConfirmList from '@/components/entry/list/receiveConfirmList.vue'
export default {
  data () {
    return {
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    taskOrderSearch,
    receiveConfirmList
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'drug_receive_confirm',
      breadcrumbName: '药品收货确认'
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
      const top = this.$refs.receiveConfirmListRef.$el.offsetTop + 70 - e.target.scrollTop
      if (top < 0) {
        this.$refs.receiveConfirmListRef.changeShowSticky(true)
      } else {
        this.$refs.receiveConfirmListRef.changeShowSticky(false)
      }
    }
  },
  beforeDestroy () {
    // this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-receive-confirm {
  padding: 5px;
  /deep/ .ant-card-body {
    padding: 10px;
  }
}
</style>