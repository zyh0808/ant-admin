<template>
  <div class="entry-check">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <a-card class="entry-check-content" :bordered="false">
      <orderInfoDetail></orderInfoDetail>
      <a-divider />
      <projectInfoDetail listType="show"></projectInfoDetail>
      <a-divider />
      <drugList listType="show"></drugList>
    </a-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import orderInfoDetail from '@/components/entry/detail/orderInfoDetail.vue'
import projectInfoDetail from '@/components/entry/detail/projectInfoDetail.vue'
import drugList from '@/components/entry/list/drugList'
export default {
  data () {
    return {
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    orderInfoDetail,
    projectInfoDetail,
    drugList
  },
  created () {
    this.from = this.$route.params.from
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: this.from === 'check' ? 'entry_checklist' : this.from === 'receive' ? 'entry_receivelist' : 'entry_search',
      breadcrumbName: this.from === 'check' ? '入库订单审核列表' : this.from === 'receive' ? '入库订单收货' : '入库订单查询'
    },
    {
      path: 'entry_checkdetail',
      breadcrumbName: '入库订单详情'
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
    })
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-check {
  padding: 5px;
  .entry-check-content {
    margin: 10px;
  }
}
/deep/ .ant-card-body {
  padding: 10px;
}
</style>