<template>
  <div>
    <div class="project-drug-search">
      <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
        class="search-form" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }">
        <a-row class="searchRow">
          <a-col :span="6">
            <a-form-model-item label="药品编号">
              <a-input v-model="searchForm.proj_no" placeholder="请输入项目号"
                allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="药品名称">
              <a-input v-model="searchForm.proj_name" placeholder="请输入项目名称"
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
    <div class="project-drug-table">
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
                @changeColumns="changeColumns"></columnSelect>
            </a-tooltip>
          </a-space>
        </a-row>
      </a-row>
      <a-table :columns="tableColumns" :data-source="projectDrugList"
        class="table-one" :rowKey="record => record.drug_proj_id"
        :loading="isfetchProjectDrugList" :pagination="false"
        :scroll="{x:1900}">
        <template slot="action" slot-scope="record">
          <a-button type="link" size="small" @click="showEditModal(record)">
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm v-if="projectDrugList.length" title="确认删除吗?"
            cancelText="取消" okText="确认"
            @confirm="() => deleteProjectDrug(record.drug_proj_id)">
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
      <a-form-model ref="projectDrugFormRef" :model="projectDrugForm"
        :rules="projectDrugFormRules" :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-form-model-item label="药品名称" prop="drug_name" ref="drug_name"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <!-- <a-input v-model="projectDrugForm.drug_name" placeholder="请输入" @blur="
          () => {
            $refs.drug_name.onFieldBlur()
          }" /> -->
          <a-auto-complete v-model="projectDrugForm.drug_name" placeholder="请输入"
            @select="onDrugSelect" @search="onDrugSearch"
            :data-source="dataSource">
          </a-auto-complete>
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="药品规格" prop="spec" ref="spec">
              <a-input v-model="projectDrugForm.spec" placeholder="请输入" @blur="
          () => {
            $refs.spec.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效期" prop="exp_time" ref="exp_time">
              <a-input v-model="projectDrugForm.exp_time" placeholder="请输入"
                @blur="
          () => {
            $refs.exp_time.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="预警天数" prop="warning_days"
              ref="warning_days">
              <a-input-number v-model="projectDrugForm.warning_days"
                placeholder="请输入" @blur="
          () => {
            $refs.warning_days.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="包装单位" prop="pck_unit" ref="pck_unit">
              <a-input v-model="projectDrugForm.pck_unit" placeholder="请输入"
                @blur="
          () => {
            $refs.pck_unit.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="包装长(cm)" prop="pck_len" ref="pck_len">
              <a-input-number v-model="projectDrugForm.pck_len"
                placeholder="请输入" @blur="
          () => {
            $refs.pck_len.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="包装宽(cm)" prop="pck_width" ref="pck_width">
              <a-input-number v-model="projectDrugForm.pck_width"
                placeholder="请输入" @blur="
          () => {
            $refs.pck_width.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="包装高(cm)" prop="pck_height"
              ref="pck_height">
              <a-input-number v-model="projectDrugForm.pck_height"
                placeholder="请输入" @blur="
          () => {
            $refs.pck_height.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="最小包装数量" prop="min_pck_cnt"
              ref="min_pck_cnt">
              <a-input-number v-model="projectDrugForm.min_pck_cnt"
                placeholder="请输入" @blur="
          () => {
            $refs.min_pck_cnt.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="存储条件" prop="env" ref="env">
              <a-input v-model="projectDrugForm.env" placeholder="请输入" @blur="
          () => {
            $refs.env.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="温度区间" prop="temp_range" ref="temp_range">
              <a-input v-model="projectDrugForm.temp_range" placeholder="请输入"
                @blur="
          () => {
            $refs.temp_range.onFieldBlur()
          }" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="是否编盲" prop="op_type">
              <a-radio-group v-model="projectDrugForm.op_type" disabled>
                <a-radio-button :value=0>
                  编盲药
                </a-radio-button>
                <a-radio-button :value=1>
                  非编盲药
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否有效" prop="validate">
              <a-switch v-model="projectDrugForm.validate" disabled />
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
import { addProjectDrug, editProjectDrug, deleteProjectDrug, getDrugInfo } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
const projectDrugForm = {
  drug_proj_id: '',
  drug_id: '',
  drug_name: '',
  proj_id: '',
  spec: '',
  exp_time: '',
  warning_days: null,
  pck_unit: '',
  min_pck_cnt: null,
  pck_len: null,
  pck_width: null,
  pck_height: null,
  env: '',
  temp_range: '',
  op_type: 0,
  validate: true
}
const searchForm = {
  client_id: '',
  client_code: '',
  client_name: '',
  proj_id: '',
  proj_name: '',
  drug_name: ''
}
export default {
  data () {
    const columns = [
      {
        title: '药品名称',
        dataIndex: 'drug_name',
        value: 'drug_name',
        // width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '药品规格',
        dataIndex: 'spec',
        value: 'spec',
        // width: 150,
        ellipsis: true
      },
      {
        title: '有效期',
        dataIndex: 'exp_time',
        value: 'exp_time',
        width: 150,
        ellipsis: true
      },
      {
        title: '预警天数',
        dataIndex: 'warning_days',
        value: 'warning_days',
        width: 100,
        ellipsis: true
      },
      {
        title: '药品包装(单位)',
        dataIndex: 'pck_unit',
        value: 'pck_unit',
        width: 120,
        ellipsis: true
      },
      {
        title: '最小包装单位数量',
        dataIndex: 'min_pck_cnt',
        value: 'min_pck_cnt',
        width: 150,
        ellipsis: true
      },
      {
        title: '包装长(cm)',
        dataIndex: 'pck_len',
        value: 'pck_len',
        width: 150,
        ellipsis: true
      },
      {
        title: '包装宽(cm)',
        dataIndex: 'pck_width',
        value: 'pck_width',
        width: 150,
        ellipsis: true
      },
      {
        title: '包装高(cm)',
        dataIndex: 'pck_height',
        value: 'pck_height',
        width: 150,
        ellipsis: true
      },
      {
        title: '存储条件',
        dataIndex: 'env',
        value: 'env',
        width: 150,
        ellipsis: true
      },
      {
        title: '温度区间',
        dataIndex: 'temp_range',
        value: 'temp_range',
        width: 150,
        ellipsis: true
      },
      {
        title: '是否编盲',
        dataIndex: 'op_type_desc',
        value: 'op_type_desc',
        // width: 100,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
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
      title: '添加相关药品',
      isShowEditModal: false,
      confirmLoading: false,
      projectDrugForm: { ...projectDrugForm },
      projectDrugFormRules: {
        drug_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        spec: [{ required: true, message: '请输入药品规格', trigger: 'blur' }],
        exp_time: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
        warning_days: [{ required: true, message: '请输入预警天数', trigger: 'blur' }],
        pck_unit: [{ required: true, message: '请输入包装单位', trigger: 'blur' }],
        pck_len: [{ required: true, message: '请输入包装长', trigger: 'blur' }],
        pck_width: [{ required: true, message: '请输入包装宽', trigger: 'blur' }],
        pck_height: [{ required: true, message: '请输入包装高', trigger: 'blur' }],
        temp_range: [{ required: true, message: '请输入温度区间', trigger: 'blur' }],
        env: [{ required: true, message: '请输入存储条件', trigger: 'blur' }],
        min_pck_cnt: [{ required: true, message: '请输入最小包装数量', trigger: 'blur' }],
        op_type: [{ required: true, message: '请选择作业模式', trigger: 'blur' }]
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
      projectDrugList: 'drug/projectDrugList',
      isfetchProjectDrugList: 'drug/isfetchProjectDrugList',
      drugList: 'drug/drugList'
    }),
    dataSource () {
      return this.drugList ? this.drugList.map(item => item.drug_name) : []
    }
  },
  created () {
    this.searchForm = Object.assign(this.searchForm, {
      client_id: this.clientInfo.client_id,
      proj_id: this.projectInfo.proj_id
    })
    this.projectDrugForm = Object.assign(this.projectDrugForm, {
      proj_id: this.projectInfo.proj_id
    })
  },
  mounted () {
    this.getProjectDrugList()
    this.getDrugList()
  },
  methods: {
    ...mapActions({
      fetchProjectDrugList: 'drug/fetchProjectDrugList',
      fetchDrugList: 'drug/fetchDrugList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getProjectDrugList () {
      this.fetchProjectDrugList(this.searchForm)
    },
    getDrugList (drug_name) {
      const params = {
        drug_name: drug_name,
        op_type: '-1'
      }
      this.fetchDrugList(params)
    },
    handleSearch: debounce(function () {
      this.getProjectDrugList()
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
      this.title = '添加相关药品'
      if (info) {
        this.isEdit = true
        this.title = '编辑相关药品'
        this.projectDrugForm = Object.assign(this.projectDrugForm, info, {})
      }
    },
    onDrugSelect (value) {
      // console.log(value)
      this.drug = this.drugList.find(item => item.drug_name === value)
      //选中药品编号获取药品信息
      //药品信息填入输入框
      getDrugInfo({ drug_id: this.drug.drug_id }).then(res => {
        const drugInfo = res
        const unit = drugInfo.period_unit === 1 ? '天' : drugInfo.period_unit === 2 ? '月' : drugInfo.period_unit === 3 ? '年' : ''
        this.projectDrugForm = Object.assign(this.projectDrugForm, {
          drug_id: drugInfo.drug_id,
          // drug_code: drugInfo.drug_code,
          drug_name: drugInfo.drug_name,
          spec: drugInfo.spec,
          exp_time: drugInfo.valid_period + unit,
          warning_days: drugInfo.warning_days,
          pck_unit: drugInfo.pck_unit,
          min_pck_cnt: drugInfo.min_pck_cnt,
          pck_len: drugInfo.pck_len,
          pck_width: drugInfo.pck_width,
          pck_height: drugInfo.pck_height,
          env: drugInfo.env,
          temp_range: drugInfo.temp_range,
          op_type: drugInfo.op_type,
          validate: drugInfo.is_disabled === 0 ? true : false
        })
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    onDrugSearch (drug_name) {
      this.getDrugList(drug_name)
    },
    onDrugChange (value) {
      console.log('change', value)
    },
    editOk () {
      this.$refs.projectDrugFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editProjectDrug()
          } else {
            this.addProjectDrug()
          }
        } else {
          return false
        }
      });
    },
    addProjectDrug () {
      this.confirmLoading = true
      // const params = Object.assign(this.projectDrugForm,
      //   { is_disabled: this.projectDrugForm.validate ? 0 : 1 }
      // )
      const params = {
        drug_id: this.drug.drug_id,
        proj_id: this.projectInfo.proj_id
      }
      addProjectDrug(params).then(res => {
        this.$message.success('操作成功')
        this.getProjectDrugList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    editProjectDrug () {
      this.confirmLoading = true
      const params = Object.assign(this.projectDrugForm,
        { is_disabled: this.projectDrugForm.validate ? 0 : 1 }
      )
      editProjectDrug(params).then(res => {
        this.$message.success('修改成功')
        this.getProjectDrugList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    deleteProjectDrug (drug_proj_id) {
      const params = {
        drug_proj_id: drug_proj_id
      }
      deleteProjectDrug(params).then(res => {
        this.$message.success('删除成功')
        this.getProjectDrugList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.projectDrugFormRef.resetFields()
      this.projectDrugForm = Object.assign({}, projectDrugForm, {
        proj_id: this.projectInfo.proj_id
      })
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.getProjectDrugList()
    },
    changeColumns (columns) {
      this.tableColumns = columns
    },
  }
}
</script>

<style lang="less" scoped>
.project-drug-search {
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
.project-drug-table {
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