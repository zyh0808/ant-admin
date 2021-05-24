<template>
  <div class="detail-item">
    <a-form-model :model="projectForm" ref="projectFormRef" class="form-content" :rules="projectFormRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-form-model-item label="申办方编码" prop="client_code">
        <a-auto-complete v-model="client_code" placeholder="请输入" :data-source="clientList" @search="getClientList" @select="handleClientSelect">
        </a-auto-complete>
      </a-form-model-item>
      <a-form-model-item label="申办方名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-input v-model="projectForm.client_name" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="项目号" prop="proj_no">
        <a-auto-complete v-model="proj_no" placeholder="请输入" :data-source="projectList" @search="getProjectList" @select="handleProjectSelect">
        </a-auto-complete>
      </a-form-model-item>
      <a-form-model-item label="项目名称">
        <a-input v-model="projectForm.proj_name" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="项目负责人">
        <a-input v-model="projectForm.proj_person" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="联系电话">
        <a-input v-model="projectForm.proj_phone" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="付费账号">
        <a-input v-model="projectForm.paid_account_id" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
// import { ENTRY_PAGE_TYPE } from '@/js/global.js'

export default {
  data () {
    return {
      projectFormRules: {
        client_code: [{ required: true, message: '请输入申办方编码', trigger: 'blur' }],
        proj_no: [{ required: true, message: '请输入项目号', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      clientListStore: 'client/clientList',
      projectListStore: 'client/projectList',
      projectForm: 'input/projectForm'
    }),
    // showStatus () {
    //   return this.pageType !== ENTRY_PAGE_TYPE.INPUT
    // },
    clientList () {
      return this.clientListStore ? this.clientListStore.map(item => item.client_code) : []
    },
    projectList () {
      return this.projectListStore ? this.projectListStore.map(item => item.proj_no) : []
    },
    client_code: {
      get () {
        return this.projectForm.client_code
      },
      set (val) {
        this.changeProjectForm({ client_code: val })
      }
    },
    proj_no: {
      get () {
        return this.projectForm.proj_no
      },
      set (val) {
        this.changeProjectForm({ proj_no: val })
      }
    }
  },
  mounted () {
    this.getClientList()
  },
  methods: {
    ...mapActions({
      fetchClientList: 'client/fetchClientList',
      fetchProjectList: 'client/fetchProjectList'
    }),
    ...mapMutations({
      changeProjectForm: 'input/changeProjectForm'
    }),
    getClientList (client_code = '') {
      this.fetchClientList({
        client_code: client_code,
        client_name: '',
        city: ''
      })
    },
    getProjectList (proj_no = '') {
      const searchForm = {
        client_id: '',
        client_code: this.projectForm.client_code,
        client_name: '',
        paid_account_id: '',
        paid_name: '',
        proj_no: proj_no,
        proj_name: ''
      }
      this.fetchProjectList(searchForm)
    },
    handleClientSelect (client_code) {
      const client = this.clientListStore.find(item => item.client_code === client_code)
      this.changeProjectForm({ client_name: client.client_name })
      this.getProjectList(client_code)
    },
    handleProjectSelect (proj_no) {
      const project = this.projectListStore.find(item => item.proj_no === proj_no)
      this.changeProjectForm({
        proj_name: project.proj_name,
        proj_person: project.proj_person,
        proj_phone: project.proj_phone,
        paid_account_id: project.paid_account_id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  // border-radius: 5px;
  margin: 10px 5px 0;
  background-color: #fff;
  .ant-page-header {
    padding: 5px 20px;
  }
  /deep/ .ant-page-header-heading-title {
    font-size: 14px;
  }
  .form-content {
    padding: 0 20px;
    // .ant-form-item {
    //   margin-bottom: 10px;
    // }
  }
}
</style>