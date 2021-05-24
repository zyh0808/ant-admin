<template>
  <div class="detail-item">
    <a-descriptions :column="4" v-if="projectForm.client_code">
      <template slot="title">
        <a-row type="flex" justify="space-between">
          <span class="info-title">项目信息</span>
          <div v-if="listType === 'edit'">
            <a-button icon="edit" @click="showPro('edit')">
              修改
            </a-button>
            <a-button icon="import" type="primary" @click="showImportModal" style="margin-left: 10px">
              导入
            </a-button>
          </div>
        </a-row>
      </template>
      <a-descriptions-item label="申办方编码">
        {{projectForm.client_code}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方名称" :span="2">
        {{projectForm.client_name}}
      </a-descriptions-item>
      <a-descriptions-item label="项目负责人">
        {{projectForm.proj_person}}
      </a-descriptions-item>
      <a-descriptions-item label="项目号">
        {{projectForm.proj_no}}
      </a-descriptions-item>
      <a-descriptions-item label="项目名称">
        {{projectForm.proj_name}}
      </a-descriptions-item>
      <a-descriptions-item label="付费账号">
        {{projectForm.paid_account_id}}
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        {{projectForm.proj_phone}}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions v-else>
      <template slot="title">
        <a-row type="flex" justify="space-between">
          <span class="info-title">项目信息</span>
          <div v-if="listType === 'edit'">
            <a-button icon="plus" @click="showPro('add')">
              添加项目信息
            </a-button>
            <a-button icon="import" type="primary" @click="showImportModal" style="margin-left: 10px">
              导入
            </a-button>
          </div>
        </a-row>
      </template>
    </a-descriptions>
    <a-drawer :title="proTitle" width="400" :visible="drawerVisible" :body-style="{ paddingBottom: '80px' }" @close="hidePro">
      <projectInfoEdit></projectInfoEdit>
      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="hidePro">
          取消
        </a-button>
        <a-button type="primary" @click="savePro">
          保存
        </a-button>
      </div>
    </a-drawer>
    <a-modal title="入库订单导入" :visible="isShowImportModal" :confirm-loading="isImporting" @ok="confirmImport" @cancel="importCancel" :width="500">
      <div class="import-content">
        <a-form-model ref="importFormRef" :model="importForm" :rules="importFormRule">
          <a-form-model-item label="申办方" prop="client_id" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-select v-model="importForm.client_id" placeholder="请选择">
              <a-select-option v-for="item in clientList" :key="item.client_id" :value="item.client_id">{{ item.client_name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item style="text-align: center">
            <a-upload name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button>
                <a-icon type="upload" /> {{ fileList.length === 0 ? '上传': '重新上传' }}
              </a-button>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item style="text-align: center">
            <a @click="downloadModule">点击此处下载模版</a>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { importOrderFile } from '@/api/order'
import projectInfoEdit from '@/components/entry/edit/projectInfoEdit'
export default {
  props: {
    listType: {
      type: String,
      default: 'edit'
    }
  },
  data () {
    return {
      drawerVisible: false,
      proTitle: '',
      isShowImportModal: false,
      isImporting: false,
      fileList: [],
      importForm: {
        client_id: null
      },
      importFormRule: {
        client_id: [
          { required: true, message: '请选择申办方', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    projectInfoEdit
  },
  computed: {
    ...mapGetters({
      projectForm: 'input/projectForm',
      clientList: 'client/clientList'
    })
  },
  mounted () {
    this.fetchClientList({
      client_code: ''
    })
  },
  methods: {
    ...mapActions({
      fetchClientList: 'client/fetchClientList'
    }),
    showPro (mode) {
      this.proTitle = mode === 'edit' ? '编辑项目' : '添加项目'
      this.drawerVisible = true
    },
    hidePro () {
      this.drawerVisible = false
    },
    savePro () {
      this.hidePro()
    },
    showImportModal () {
      this.isShowImportModal = true
    },
    beforeUpload (file) {
      this.fileList = [file]
      return false
    },
    downloadModule () {
      window.location.href = `${window.location.protocol}//${window.location.host}/files/importOrderTemplate.xlsx`
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    confirmImport () {
      this.$refs.importFormRef.validate(valid => {
        if (valid) {
          if (this.fileList.length === 0) {
            this.$message.error('请选择要上传的文件')
            return false
          } else {
            this.handleImport()
          }
        } else {
          return false
        }
      })
    },
    handleImport () {
      const { fileList, importForm } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
        formData.append('client_id', importForm.client_id)
      })
      this.isImporting = true
      importOrderFile(formData)
        .then(res => {
          this.$message.success('导入成功')
          this.isImporting = false
          this.importCancel()
        }).catch(err => {
          this.$message.error(err.msg)
          this.isImporting = false
        })
    },
    importCancel () {
      this.isShowImportModal = false
    }
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  margin: 10px;
  background-color: #fff;
}
.import-content {
  width: 300px;
  margin: auto;
}
</style>