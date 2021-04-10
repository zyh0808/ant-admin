<template>
  <div class="entry-check">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-check-content">
      <a-card title="订单信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <orderInfoDetail></orderInfoDetail>
      </a-card>
      <a-card title="项目信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <projectInfoDetail></projectInfoDetail>
      </a-card>
      <a-card title="药品信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <drugList style="margin-top:10px; width: 100%" listType="show">
        </drugList>
      </a-card>
    </div>
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
    margin: 0 10px;
  }
}
/deep/ .ant-card-body {
  padding: 10px;
}
</style>