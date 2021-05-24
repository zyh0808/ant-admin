<template>
  <div class="entry-import">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <a-card class="entry-import-deail" :bordered="false">
      <a-row class="import-content">
        <a-col :span="12">
          <a-form :form="addOrderForm" :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }" @submit="handleSubmit">
            <a-form-item label="申办方">
              <a-select v-decorator="[
          'client_id',
          { rules: [{ required: true, message: '请选择申办方' }] }
        ]" placeholder="请选择" @change="handleClient">
                <a-select-option v-for="client in clientList"
                  :key='client.client_id' :value="client.client_id">
                  {{ client.client_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="项目号">
              <a-select v-decorator="[
          'proj_id',
          { rules: [{ required: true, message: '请选择项目号' }] }
        ]" placeholder="请选择" @change="handlePro">
                <a-select-option v-for="pro in projectList" :key='pro.proj_id'
                  :value="pro.proj_id">
                  {{ pro.proj_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="药品名称">
              <a-select v-decorator="[
          'drug_id',
          { rules: [{ required: true, message: '请选择药品名称' }] }
        ]" placeholder="请选择" @change="handleDrug">
                <a-select-option v-for="drug in projectDrugList"
                  :key="drug.drug_id" :value="drug.drug_id">
                  {{ drug.drug_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="规格" v-if="drugInfo.drug_specification">
              <span>{{ drugInfo.drug_specification }}</span>
            </a-form-item>
            <a-form-item label="药品批次号">
              <a-input v-decorator="[
          'batch_no',
          { rules: [{ required: true, message: '请输入药品批次号' }] }
        ]" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="是否编盲" v-if="drugInfo.op_type">
              <a-radio-group :value="drugInfo.op_type">
                <a-radio :value="0" v-if="drugInfo.op_type === 0">
                  非编盲药
                </a-radio>
                <a-radio :value="1" v-else>
                  编盲药
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="编码前缀" v-if="drugInfo.op_type === 1">
              <a-input v-decorator="[
          'prefix',
          { rules: [{ required: true, message: '请输入编码前缀' }] }
        ]" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="号段" v-if="drugInfo.op_type === 1">
              <span slot="extra"
                style="color:red">*如只添加1个药品，则开始号段和结束号段一致即可</span>
              <a-form-item
                :style="{ display: 'inline-block', marginBottom:'0' }">
                <a-input-number
                  v-decorator="['drugCode_start', { rules: [{ required: true, message: '请输入编码开始号段' }] }]"
                  :min="1" @change="startCodeChange" placeholder="请输入" />
              </a-form-item>
              <span>{{` 至 `}}</span>
              <a-form-item
                :style="{ display: 'inline-block', marginBottom:'0' }">
                <a-input-number
                  v-decorator="['drugCode_end', { rules: [{ required: true, message: '请输入编码结束号段' }] }]"
                  :min="1" @change="endCodeChange" placeholder="请输入" />
              </a-form-item>
            </a-form-item>
            <a-form-item label="编码后缀" v-if="drugInfo.op_type === 1">
              <a-input v-decorator="[
          'suffix',
          { rules: [{ required: true, message: '请输入编码后缀' }] }
        ]" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="数量" v-if="drugInfo.op_type === 1">
              <span>{{ drug_number }}</span>
            </a-form-item>
            <a-form-item label="数量" v-if="drugInfo.op_type === 0">
              <a-input-number
                v-decorator="['in_cnt', { rules: [{ required: true, message: '请输入药品数量' }] }]"
                :min="1" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="包装单位">
              <a-select v-decorator="[
          'unit',
          { rules: [{ required: true, message: '请选择包装单位' }], initialValue: '盒' }
        ]" placeholder="请选择">
                <a-select-option value="盒">
                  盒
                </a-select-option>
                <a-select-option value="瓶">
                  瓶
                </a-select-option>
                <a-select-option value="个">
                  个
                </a-select-option>
                <a-select-option value="套">
                  套
                </a-select-option>
                <a-select-option value="袋">
                  袋
                </a-select-option>
                <a-select-option value="箱">
                  箱
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="有效期至">
              <a-date-picker v-decorator="['exp_date', {
        rules: [{  required: true, message: '请选择有效期至日期' }],
      }]" />
            </a-form-item>
            <a-form-item label="备注">
              <a-input v-decorator="['memo']" type="textarea"
                :auto-size="{ minRows: 3, maxRows: 5 }" />
            </a-form-item>
            <a-form-item label="其他事项">
              <a-input v-decorator="['otherMemo']" type="textarea"
                :auto-size="{ minRows: 3, maxRows: 5 }" />
            </a-form-item>
            <a-form-item :wrapper-col=" { span: 18, offset: 6 }">
              <a-button type="primary" html-type="submit" :loading="isAdding">
                保存
              </a-button>
              <a-button style="margin-left: 10px" @click="resetForm">
                重置
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="12">
          <div style="width: 100%; text-align: end">
            <a-button icon="import" @click="showImportModal"
              style="margin-left: 10px" type="primary">
              导入
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-modal title="入库订单导入" :visible="isShowImportModal"
      :confirm-loading="isImporting" @ok="confirmImport" @cancel="importCancel"
      :width="500">
      <div class="import-content">
        <a-form-model ref="importFormRef" :model="importForm"
          :rules="importFormRule">
          <a-form-model-item label="申办方" prop="client_id"
            :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-select v-model="importForm.client_id" placeholder="请选择">
              <a-select-option v-for="item in clientList" :key="item.client_id"
                :value="item.client_id">{{ item.client_name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item style="text-align: center">
            <a-upload name="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              :file-list="fileList" :remove="handleRemove"
              :before-upload="beforeUpload">
              <a-button>
                <a-icon type="upload" />
                {{ fileList.length === 0 ? '上传': '重新上传' }}
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import { addDrugOrder, importOrderFile } from '@/api/order'
export default {
  data () {
    return {
      drugInfo: {},
      drug_number: 0,
      addOrderForm: this.$form.createForm(this, { name: 'drugInfo' }),
      isAdding: false,
      isShowImportModal: false,
      isImporting: false,
      fileList: [],
      importForm: {
        client_id: undefined
      },
      importFormRule: {
        client_id: [
          { required: true, message: '请选择申办方', trigger: 'blur' }
        ]
      },
      system: 'entry'
    }
  },
  components: {
    pageHeader
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_import',
      breadcrumbName: '入库前置订单录入'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.fetchClientList({
      client_code: ''
    })
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      clientList: 'client/clientList',
      projectList: 'client/projectList',
      projectDrugList: 'drug/projectDrugList'
    })
  },
  methods: {
    ...mapActions({
      fetchClientList: 'client/fetchClientList',
      fetchProjectList: 'client/fetchProjectList',
      fetchProjectDrugList: 'drug/fetchProjectDrugList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'input/resetAllData'
    }),
    handleClient (client_id) {
      this.fetchProjectList({ client_id })
    },
    handlePro (proj_id) {
      const project = this.projectList.find(item => item.proj_id === proj_id)
      this.proj_no = project ? project.proj_no : ''
      this.fetchProjectDrugList({ proj_id })
    },
    handleDrug (drug_id) {
      this.drugInfo = this.projectDrugList.find(item => item.drug_id === drug_id)
      console.log(this.drugInfo)
      // if (drug) {
      //   this.drugInfo = Object.assign(this.drugInfo, drug)
      // }
    },
    startCodeChange (start) {
      const end = this.addOrderForm.getFieldValue("drugCode_end")
      if (start && end) {
        if (start === end) {
          this.drug_number = 1
        } else if (start < end) {
          this.drug_number = end - start + 1
        } else {
          this.drug_number = '请确认药品号段'
        }
      }
    },
    endCodeChange (end) {
      const start = this.addOrderForm.getFieldValue("drugCode_start")
      if (start && end) {
        if (start === end) {
          this.drug_number = 1
        } else if (start < end) {
          this.drug_number = end - start + 1
        } else {
          this.drug_number = '请确认药品号段'
        }
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.addOrderForm.validateFields((err, values) => {
        if (!err) {
          this.isAdding = true
          const params = {
            proj_id: values['proj_id'],
            proj_no: this.proj_no,
            client_id: values['client_id'],
            memo: values['otherMemo'],
            detailList: [
              {
                drug_id: values['drug_id'],
                batch_no: values['batch_no'],
                op_type: this.drugInfo.op_type,
                in_cnt: this.drugInfo.op_type === 1 ? this.drug_number : values['in_cnt'],
                memo: values['memo'],
                prefix: values['prefix'],
                suffix: values['suffix'],
                unit: values['unit'],
                drugCode_start: values['drugCode_start'],
                drugCode_end: values['drugCode_end'],
                exp_date: values['exp_date'].format('YYYY-MM-DD'),
              }
            ]
          }
          // params = Object.assign(params, { detailList: [].push(detail) })
          console.log(JSON.stringify(params))
          this.addDrug(params)
        }
      })
    },
    addDrug (params) {
      addDrugOrder(params).then(res => {
        this.$message.success('添加成功')
        this.addOrderForm.resetFields()
        this.drug_number = 0
        this.isAdding = false
      }).catch(err => {
        this.$message.error(err.msg)
        this.isAdding = false
      })
    },
    resetForm () {
      this.addOrderForm.resetFields()
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
      this.importForm.client_id = undefined
      this.fileList = []
      this.isShowImportModal = false
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-import {
  padding: 5px;
}
.entry-import-deail {
  margin: 10px;
}
/deep/ .ant-drawer-body {
  padding: 0;
}
/deep/ .ant-card-body {
  padding: 10px;
}
.import-content {
  padding: 0 30px;
}
</style>