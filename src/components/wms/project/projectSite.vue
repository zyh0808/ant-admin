<template>
  <div>
    <div class="project-site-search">
      <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
        class="search-form" :label-col="{ span: 10 }"
        :wrapper-col="{ span: 14 }">
        <a-row class="searchRow">
          <a-col :span="6">
            <a-form-model-item label="实验中心编号">
              <a-input v-model="searchForm.site_code" placeholder="请输入"
                allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="实验中心名称">
              <a-input v-model="searchForm.site_name" placeholder="请输入"
                allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="6" :offset="6">
            <a-row type="flex" justify="end" style="marginTop:4px">
              <a-button type="primary" @click="handleSearch">
                查询
              </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                重置
              </a-button>
            </a-row>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="project-site-table">
      <a-row class="toolRow" type="flex" justify="end">
        <a-row class="toolsBtn">
          <a-space :size="12">
            <a-tooltip placement="top">
              <template slot="title">
                <span>新建</span>
              </template>
              <a-button type="primary" icon="plus-circle"
                @click="showEditModal()" />
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>刷新</span>
              </template>
              <a-button type="dashed" icon="reload" @click="reloadList" />
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>设置</span>
              </template>
              <columnSelect :plainOptions="columns"
                @changeColumns="changeColumns(arguments)"></columnSelect>
            </a-tooltip>
          </a-space>
        </a-row>
      </a-row>
      <a-table :columns="tableColumns" :data-source="projectSiteList"
        class="table-one" :rowKey="record => record.proj_site_id"
        :loading="isfetchProjectSiteList" :pagination="false">
        <span slot="validate" slot-scope="validate">
          <a-switch :checked="validate" disabled />
        </span>
        <template slot="action" slot-scope="record">
          <a-button type="link" size="small" @click="showEditModal(record)">
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm v-if="projectSiteList.length" title="确认删除吗?"
            cancelText="取消" okText="确认"
            @confirm="() => deleteProjectSite(record.proj_site_id)">
            <a-button type="link" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="800">
      <a-form-model ref="projectSiteFormRef" :model="projectSiteForm"
        :rules="projectSiteFormRules" :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="实验中心编码" prop="site_id">
              <a-auto-complete v-model="projectSiteForm.site_code"
                placeholder="请输入" @select="onSiteSelect" @search="onSiteSearch"
                @change="onSiteChange">
                <template slot="dataSource">
                  <a-select-option v-for="item in dataSource"
                    :key="item.site_id" :value="item.site_id">
                    {{item.site_code}}
                  </a-select-option>
                </template>
              </a-auto-complete>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否有效" prop="validate">
              <a-switch v-model="projectSiteForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addProjectSite, editProjectSite, deleteProjectSite } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
const searchForm = {
  client_id: '',
  client_code: '',
  client_name: '',
  proj_id: '',
  proj_name: '',
  proj_no: '',
  site_code: '',
  site_name: ''
}
const projectSiteForm = {
  proj_id: '',
  client_id: '',
  site_id: '',
  site_code: '',
  version: '',
  validate: ''
}
export default {
  data () {
    const columns = [
      {
        title: '实验中心编号',
        dataIndex: 'site_code',
        value: 'site_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '实验中心名称',
        dataIndex: 'site_name',
        value: 'site_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '项目名称',
        dataIndex: 'proj_name',
        value: 'proj_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '申办方名称',
        dataIndex: 'client_name',
        value: 'client_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 150,
        key: 'validate',
        scopedSlots: { customRender: 'validate' },
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 140,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: {
        ...searchForm
      },
      title: '添加相关实验中心',
      isShowEditModal: false,
      confirmLoading: false,
      projectSiteForm: {
        ...projectSiteForm
      },
      projectSiteFormRules: {
        site_id: [{ required: true, message: '请输入实验中心编码', trigger: 'blur' }]
      },
      isEdit: false
    }
  },
  components: {
    columnSelect
  },
  computed: {
    ...mapGetters({
      clientInfo: 'client/clientInfo',
      projectInfo: 'client/projectInfo',
      projectSiteList: 'site/projectSiteList',
      siteList: 'site/siteList',
      isfetchProjectSiteList: 'site/isfetchProjectSiteList'
    }),
    dataSource () {
      return this.siteList ? this.siteList : []
    }
  },
  created () {
    this.searchForm = Object.assign(this.searchForm, {
      client_id: this.clientInfo.client_id,
      proj_id: this.projectInfo.proj_id
    })
    this.projectSiteForm = Object.assign(this.projectSiteForm, {
      client_id: this.clientInfo.client_id,
      proj_id: this.projectInfo.proj_id
    })
  },
  mounted () {
    this.getProjectSiteList()
  },
  methods: {
    ...mapActions({
      fetchProjectSiteList: 'site/fetchProjectSiteList',
      fetchSiteList: 'site/fetchSiteList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getProjectSiteList () {
      this.fetchProjectSiteList(this.searchForm)
    },
    getSiteList (site_code) {
      const params = {
        site_id: '',
        site_code: site_code,
        site_name: '',
        site_city: ''
      }
      this.fetchSiteList(params)
    },
    handleSearch: debounce(function () {
      this.getProjectSiteList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
      this.searchForm = Object.assign(this.searchForm, {
        client_id: this.clientInfo.client_id,
        proj_id: this.projectInfo.proj_id
      })
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加相关实验中心'
      if (info) {
        this.isEdit = true
        this.title = '编辑相关实验中心'
        this.projectSiteForm = Object.assign(this.projectSiteForm, info, {})
      }
    },
    onSiteSelect (value) {
      this.projectSiteForm.site_id = value
    },
    onSiteSearch (site_code) {
      this.getSiteList(site_code)
    },
    onSiteChange (value) {
      console.log('change', value)
    },
    editOk () {
      this.$refs.projectSiteFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editProjectSite()
          } else {
            this.addProjectSite()
          }
        } else {
          return false
        }
      });
    },
    addProjectSite () {
      this.confirmLoading = true
      let params = Object.assign(this.projectSiteForm,
        { is_disabled: this.projectSiteForm.validate ? 0 : 1 }
      )
      delete params.site_code
      addProjectSite(params).then(res => {
        this.$message.success('操作成功')
        this.getProjectSiteList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editProjectSite () {
      this.confirmLoading = true
      let params = Object.assign(this.projectSiteForm,
        { is_disabled: this.projectSiteForm.validate ? 0 : 1 }
      )
      delete params.site_code
      editProjectSite(params).then(res => {
        this.$message.success('修改成功')
        this.getProjectSiteList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteProjectSite (proj_site_id) {
      const params = {
        proj_site_id: proj_site_id
      }
      deleteProjectSite(params).then(res => {
        this.$message.success('删除成功')
        this.getProjectSiteList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.projectSiteFormRef.resetFields()
      this.projectSiteForm = Object.assign({}, projectSiteForm)
      this.projectSiteForm = Object.assign(this.projectSiteForm, {
        client_id: this.clientInfo.client_id,
        proj_id: this.projectInfo.proj_id
      })
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.getProjectSiteList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    }
  }
}
</script>

<style lang="less" scoped>
.project-site-search {
  background-color: #f5f5f5;
  padding: 10px 0;
  border-radius: 5px;
  .search-form {
    margin: 10px 20px;
    .searchRow {
      height: 40px;
      line-height: 40px;
      align-items: center;
      padding: 0 20px;
      .ant-form-item {
        width: 100%;
        margin-bottom: 0;
      }
    }
  }
}
.project-site-table {
  background-color: white;
  padding: 5px 10px;
  .toolRow {
    height: 60px;
    align-items: center;
    .listTitle {
      padding: 0 10px;
      // font-weight: 600;
    }
    .toolsBtn {
      .ant-btn {
        margin-right: 10px;
      }
    }
  }
}
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
}
</style>