<template>
  <div class="wms-project">
    <div class="title">
      <!-- <a-page-header :title="projectInfo.proj_name"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
      <a-row class="row-common">
        <a-col :span="8">
          项目号: <span>{{projectInfo.proj_no}}</span>
          <a-tag color="red" v-if="projectInfo.validate">
            有效
          </a-tag>
          <a-tag v-else>无效</a-tag>
        </a-col>
        <a-col :span="8">
          联系人: <span>{{projectInfo.proj_person}}</span>
        </a-col>
        <a-col :span="8">
          联系电话: <span>{{projectInfo.proj_phone}}</span>
        </a-col>
      </a-row>
      <a-row class="row-common">
        <a-col :span="8">
          付费账号: <span>{{projectInfo.paid_name}}</span>
        </a-col>
        <a-col :span="8">
          合同编号: <span>{{projectInfo.contracts_code}}</span>
        </a-col>
        <a-col :span="8">
          项目客服: <span>{{projectInfo.proj_pm}}</span>
        </a-col>
      </a-row>
      <a-row class="row-common">
        <a-col :span="8">
          业务类型: <span>{{projectInfo.oper_type_name}}</span>
        </a-col>
      </a-row>
    </div>
    <div class="content">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="项目药品">
          <projectDrug />
        </a-tab-pane>
        <a-tab-pane key="2" tab="关联实验中心">
          <projectSite />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import projectDrug from '@/components/wms/project/projectDrug.vue'
import projectSite from '@/components/wms/project/projectSite.vue'
import pageHeader from '@/components/pageHeader.vue'
export default {
  data () {
    return {
      proj_id: '',
      system: 'wms'
    }
  },
  components: {
    projectDrug,
    projectSite,
    pageHeader
  },
  created () {
    this.proj_id = this.$route.params.id ? this.$route.params.id : 0
    this.fetchProjectInfo({ proj_id: this.proj_id })
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      clientInfo: 'client/clientInfo',
      projectInfo: 'client/projectInfo'
    })
  },
  watch: {
    projectInfo: {
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
          path: `wms_client_detail/${this.clientInfo.client_id}`,
          breadcrumbName: this.clientInfo.client_name
        },
        {
          path: 'wms_project_detail',
          breadcrumbName: info.proj_name ? info.proj_name : ''
        }]
        this.setPageHeaderRoutes(pageHeaderPoutes)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      fetchProjectInfo: 'client/fetchProjectInfo'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    })
  }
}
</script>

<style lang="less" scoped>
.wms-project {
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