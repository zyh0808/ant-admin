<template>
  <div class="pack-up-allot">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="pack-up-allot-content">
      <a-card title="任务单信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <taskOrderInfoDetail></taskOrderInfoDetail>
      </a-card>
      <a-card title="项目信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <projectInfoDetail></projectInfoDetail>
      </a-card>
      <a-card title="药品信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <drugInfoDetail />
      </a-card>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import taskOrderInfoDetail from '@/components/entry/detail/taskOrderInfoDetail.vue'
import projectInfoDetail from '@/components/entry/detail/projectInfoDetail.vue'
import drugInfoDetail from '@/components/entry/detail/drugInfoDetail.vue'
export default {
  data () {
    return {
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    taskOrderInfoDetail,
    projectInfoDetail,
    drugInfoDetail
  },
  created () {
    this.from = this.$route.params.from
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'pack_up_allot_list',
      breadcrumbName: '装箱上架分配列表'
    },
    {
      path: 'pack_up_allot',
      breadcrumbName: '装箱上架分配'
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
.pack-up-allot {
  padding: 5px;
  .pack-up-allot-content {
    margin: 0 10px;
  }
}
/deep/ .ant-card-body {
  padding: 10px;
}
</style>