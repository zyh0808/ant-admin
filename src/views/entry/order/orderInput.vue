<template>
  <div class="entry-input">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system" :headerTitle="orderId"></pageHeader>
    </div>
    <a-card class="entry-input-deail" :bordered="false">
      <projectInfoDetail></projectInfoDetail>
      <a-divider />
      <drugList listType="edit">
      </drugList>
    </a-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
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
    projectInfoDetail,
    drugList
  },
  created () {
    this.mode = this.$route.params.mode || 'input'
    this.orderId = this.$route.params.orderId || ''
    const pageHeaderPoutes = this.mode === 'edit' ? [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_order',
      breadcrumbName: '入库订单'
    },
    {
      path: 'entry_input',
      breadcrumbName: '入库订单修改'
    }] : [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_input',
      breadcrumbName: '入库订单录入'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      drugForm: 'input/drugForm',
      drugList: 'input/drugList'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      setDrugList: 'input/setDrugList',
      resetAllData: 'input/resetAllData'
    })
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-input {
  padding: 5px;
}
.entry-input-deail {
  margin: 10px;
}
/deep/ .ant-drawer-body {
  padding: 0;
}
/deep/ .ant-card-body {
  padding: 10px;
}
</style>