<template>
  <div class="wms-client">
    <div class="title">
      <!-- <a-page-header :title="clientInfo.client_name"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
      <a-row class="row-common">
        <a-col :span="8">
          申办方编码: <span>{{clientInfo.client_code}}</span>
          <a-tag color="red" v-if="clientInfo.validate">
            有效
          </a-tag>
          <a-tag v-else>无效</a-tag>
        </a-col>
        <a-col :span="8">
          联系人: <span>{{clientInfo.linkman}}</span>
        </a-col>
        <a-col :span="8">
          联系电话: <span>{{clientInfo.phone}}</span>
        </a-col>
      </a-row>
      <a-row class="row-common">
        <a-col :span="8">
          所在城市: <span>{{clientInfo.city}}</span>
        </a-col>
        <a-col :span="8">
          营销类型: <span>{{clientInfo.marketing_type_name}}</span>
        </a-col>
        <a-col :span="8">
          合同编号: <span>{{clientInfo.contracts_code}}</span>
        </a-col>
      </a-row>
      <a-row class="row-common">
        <a-col :span="8">
          销售员: <span>{{clientInfo.salesman}}</span>
        </a-col>
        <a-col :span="8">
          发票类型: <span>{{clientInfo.invoice_type_name}}</span>
        </a-col>
        <a-col :span="8">
          发票抬头: <span>{{clientInfo.invoice_head}}</span>
        </a-col>
      </a-row>
    </div>
    <div class="content">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="申办方项目">
          <project />
        </a-tab-pane>
        <a-tab-pane key="2" tab="付费账号">
          <payAccount />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import project from '@/components/wms/client/project.vue'
import payAccount from '@/components/wms/client/payAccount.vue'
import pageHeader from '@/components/pageHeader.vue'
export default {
  data () {
    return {
      client_id: '',
      system: 'wms'
    }
  },
  components: {
    project,
    payAccount,
    pageHeader
  },
  created () {
    this.client_id = this.$route.params.id ? this.$route.params.id : 0
  },
  mounted () {
    this.fetchClientInfo({ client_id: this.client_id })
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      clientInfo: 'client/clientInfo'
    })
  },
  watch: {
    clientInfo: {
      handler (info) {
        const pageHeaderPoutes = [{
          path: '',
          breadcrumbName: '仓库管理',
        },
        {
          path: 'wms_client',
          breadcrumbName: '申办方列表'
        },
        {
          path: 'wms_client_detail',
          breadcrumbName: info.client_name ? info.client_name : ''
        }]
        this.setPageHeaderRoutes(pageHeaderPoutes)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      fetchClientInfo: 'client/fetchClientInfo',
      fetchPayAccountList: 'client/fetchPayAccountList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    })
  }
}
</script>

<style lang="less" scoped>
.wms-client {
  padding: 5px;
}
.title {
  background-color: #fff;
  .row-common {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
  }
}
.content {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}
</style>