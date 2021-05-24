<template>
  <div class="entry-pack">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"
        :headerTitle="taskNo"></pageHeader>
    </div>
    <div class="entry-pack-content">
      <a-card :bordered="false">
        <packDrugInfo></packDrugInfo>
        <a-row type="flex">
          <a-statistic title="已装箱药品数量" :value="packInfo.already_packing_cnt"
            style="margin-right:100px"
            :value-style="{ color: 'rgba(0,0,0,.85)'}">
            <template #suffix>
              <span>个药品</span>
            </template>
          </a-statistic>
          <a-divider type="vertical" class="statistic-divider" />
          <a-statistic title="需装箱数量" :value="packInfo.packing_cnt"
            style="margin-left:30px" :value-style="{ color: 'rgba(0,0,0,.85)'}">
            <template #suffix>
              <span>个药品箱</span>
            </template>
          </a-statistic>
        </a-row>
      </a-card>
      <a-card :bordered="false" style="margin-top: 10px">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="有条码" v-if="packInfo.op_type === 1">
            <a-row>
              <a-col :span="8">
                <a-button type="dashed" block icon="plus"
                  @click="showCodeBoxModal('add')" style="height: 200px">
                  添加药品箱
                </a-button>
              </a-col>
              <a-col :span="16">
                <a-table :columns="boxColumns" class="box-table"
                  :data-source="packBoxList"
                  :rowKey="record => record.drug_code" :pagination="false"
                  size="middle" :scroll="{y: 400}">
                  <template slot="action" slot-scope="text, record, index">
                    <!-- <a-button type="link" size="small" @click="showCodeBoxModal('edit')">
                      修改
                    </a-button>
                    <a-divider type="vertical" /> -->
                    <a-popconfirm v-if="packBoxList.length" title="确认删除吗?"
                      cancelText="取消" okText="确认"
                      @confirm="() => deleteBox(index)">
                      <a-button type="link" size="small">
                        删除
                      </a-button>
                    </a-popconfirm>
                  </template>
                  <!-- <a slot="drug_codes" slot-scope="text">{{ text }}</a> -->
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="无条码" v-else-if="packInfo.op_type === 0">
            <a-row>
              <a-col :span="8">
                <a-button type="dashed" block icon="plus"
                  @click="showNoCodeBoxModal('add')" style="height: 200px">
                  添加
                </a-button>
              </a-col>
              <a-col :span="16">
                <a-table :columns="noCodeBoxColumns" class="box-table"
                  :data-source="packBoxList"
                  :rowKey="record => record.drug_code" :pagination="false"
                  size="middle" :scroll="{y: 400}">
                  <template slot="action" slot-scope="text, record, index">
                    <!-- <a-button type="link" size="small" @click="showNoCodeBoxModal('edit')">
                      修改
                    </a-button>
                    <a-divider type="vertical" /> -->
                    <a-popconfirm v-if="packBoxList.length" title="确认删除吗?"
                      cancelText="取消" okText="确认"
                      @confirm="() => deleteBox(index)">
                      <a-button type="link" size="small">
                        删除
                      </a-button>
                    </a-popconfirm>
                  </template>
                  <a slot="drug_codes" slot-scope="text">{{ text }}</a>
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
        <div class="commit-btns">
          <a-button class="commit-btn" @click="$router.go(-1)">返回</a-button>
          <a-button class="commit-btn" style="margin-left: 10px"
            @click="handleCommit('save')" :disabled="!enableCommit"
            :loading="isSaving">保存</a-button>
          <a-button type="primary" class="commit-btn" style="margin-left: 10px"
            @click="handleCommit('commit')" :disabled="!enableCommit"
            :loading="isCommitting">提交</a-button>
        </div>
      </a-card>
    </div>
    <a-modal title="药品装箱" :visible="isShowCodeBoxModal" @ok="handlePack"
      @cancel="codeBoxCancel" :width="800">
      <a-row type="flex" justify="space-between">
        <div class="left-enter" style="width: 300px">
          <h3>药品录入</h3>
          <a-form-model :model="packForm" :rules="packFormRules"
            ref="codeBoxRef" :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }">
            <a-form-model-item label="药品箱物料条码" prop="mat_code">
              <a-input v-model="packForm.mat_code" placeholder="请扫描">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="药品箱条码" prop="box_code">
              <a-input v-model="packForm.box_code" placeholder="请扫描">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="药品编码" prop="drug_code">
              <a-input v-model="packForm.drug_code" ref="drug_code"
                @pressEnter="handleDrugEnter" placeholder="请扫描">
              </a-input>
            </a-form-model-item>
          </a-form-model>
          <a-button type="primary" block icon="plus" @click="handleDrugEnter">
            添加
          </a-button>
        </div>
        <div class="right-table" style="width: 400px">
          <h3>药品展示</h3>
          <a-table :columns="drugColumns" ref="drugTableRef"
            :data-source="codeList" :rowKey="record => record.drug_code"
            :pagination="false" size="small" :scroll="{ y:500 }">
            <template slot="action" slot-scope="text, record, index">
              <a-button type="link" size="small" @click="deleteCode(index)">
                删除
              </a-button>
            </template>
          </a-table>
        </div>
      </a-row>
    </a-modal>
    <a-modal title="药品装箱" :visible="isShowNoCodeBoxModal"
      :confirm-loading="isNoCodePacking" @ok="handleNoCodePack"
      @cancel="noCodeBoxCancel" :width="500">
      <a-form-model :model="noCodePackForm" :rules="noCodePackFormRules"
        ref="noCodeBoxRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="药品箱物料条码" prop="mat_code">
          <a-input v-model="noCodePackForm.mat_code" placeholder="请扫描">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="药品箱条码" prop="box_code">
          <a-input v-model="noCodePackForm.box_code" placeholder="请扫描">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="药品数量" prop="drug_cnt">
          <a-input v-model="noCodePackForm.drug_cnt" placeholder="请输入">
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { taskPack } from '@/api/order'
import pageHeader from '@/components/pageHeader.vue'
import packDrugInfo from '@/components/entry/detail/packDrugInfo.vue'
const boxColumns = [
  {
    title: '药品箱物料条码',
    dataIndex: 'mat_code',
    value: 'mat_code',
    // width: 150,
    ellipsis: true
  },
  {
    title: '药品箱条码',
    dataIndex: 'box_code',
    value: 'box_code',
    // width: 150,
    ellipsis: true
  },
  {
    title: '药品条码',
    dataIndex: 'drug_code',
    value: 'drug_code',
    // width: 100,
    key: 'drug_code',
    scopedSlots: { customRender: 'drug_code' }
  },
  {
    title: '操作',
    key: 'action',
    value: 'action',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
const noCodeBoxColumns = [
  {
    title: '药品箱物料条码',
    dataIndex: 'mat_code',
    value: 'mat_code',
    // width: 150,
    ellipsis: true
  },
  {
    title: '药品箱条码',
    dataIndex: 'box_code',
    value: 'box_code',
    // width: 150,
    ellipsis: true
  },
  {
    title: '药品数量',
    dataIndex: 'drug_cnt',
    value: 'drug_cnt',
    // width: 150,
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    value: 'action',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
const drugColumns = [
  {
    title: '药品条形码',
    dataIndex: 'drug_code',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      system: 'entry',
      boxColumns,
      noCodeBoxColumns,
      isShowCodeBoxModal: false,
      isShowNoCodeBoxModal: false,
      isCommitting: false,
      isSaving: false,
      packForm: {
        mat_code: '',
        box_code: '',
        drug_code: ''
      },
      packFormRules: {
        mat_code: [{ required: true, message: '请扫描药品箱条码', trigger: 'blur' }],
        box_code: [{ required: true, message: '请扫描墨水屏条码', trigger: 'blur' }],
        drug_code: [{ required: true, message: '请扫描药品编码', trigger: 'blur' }]
      },
      noCodePackForm: {
        mat_code: '',
        box_code: '',
        drug_cnt: ''
      },
      noCodePackFormRules: {
        mat_code: [{ required: true, message: '请扫描药品箱条码', trigger: 'blur' }],
        box_code: [{ required: true, message: '请扫描墨水屏条码', trigger: 'blur' }],
        drug_cnt: [{ required: true, message: '请输入药品数量', trigger: 'blur' }]
      },
      drugColumns,
      isShowNoCodeBoxModal: false,
      isNoCodePacking: false,
      packBoxList: [],
      codeList: [],
      enableCommit: false
    }
  },
  components: {
    pageHeader,
    packDrugInfo
  },
  created () {
    this.taskNo = this.$route.params.taskNo ? this.$route.params.taskNo : ''
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理'
    },
    {
      path: 'pack_task_order',
      breadcrumbName: '装箱任务单'
    },
    {
      path: '',
      breadcrumbName: '入库装箱'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      packInfo: 'inhouse/packInfo',
      // codeList: 'pack/codeList'
    })
  },
  watch: {
    packBoxList: {
      handler (list) {
        if (list.length !== 0) {
          this.enableCommit = true
        }
      },
      deep: true
    },
    packInfo: {
      handler (info) {
        if (info.detailsBarcodeList && info.detailsBarcodeList.length !== 0) {
          this.packBoxList = info.detailsBarcodeList
        } else if (info.detailsNocodeList && info.detailsNocodeList.length !== 0) {
          this.packBoxList = info.detailsNocodeList
        } else {
          this.packBoxList = []
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'input/resetAllData'
    }),
    showCodeBoxModal () {
      this.isShowCodeBoxModal = true
    },
    deleteBox (index) {
      this.packBoxList.splice(index, 1)
    },
    handleDrugEnter () {
      // this.$refs.drug_code.onFieldBlur()
      if (!this.packForm.drug_code) {
        return
      }
      if (this.codeList.find(item => item.drug_code === this.packForm.drug_code)) {
        this.$message.error('重复条形码，请重新扫描')
        return
      }
      const drug_code = { key: this.packForm.drug_code, drug_code: this.packForm.drug_code }
      this.codeList.push(drug_code)
      this.$nextTick(() => {
        const drugTableBody = this.$refs.drugTableRef.$el.querySelector('.ant-table-body')
        const scrollHeight = drugTableBody.scrollHeight
        const clientHeight = drugTableBody.clientHeight
        const scrollTop = scrollHeight - clientHeight
        drugTableBody.scrollTop = scrollTop
        this.packForm.drug_code = ''
        this.$refs.drug_code.focus()

      })
    },
    handlePack () {
      const list = this.codeList.map(item => {
        return {
          packing_task_id: this.packInfo.packing_task_id,
          mat_code: this.packForm.mat_code,
          box_code: this.packForm.box_code,
          drug_code: item.drug_code
        }
      })
      this.packBoxList = this.packBoxList.concat(list)
      this.codeList = []
      this.codeBoxCancel()
    },
    codeBoxCancel () {
      this.$refs.codeBoxRef.resetFields()
      this.isShowCodeBoxModal = false
    },
    showNoCodeBoxModal () {
      this.isShowNoCodeBoxModal = true
    },
    handleNoCodePack () {
      const packBox = {
        packing_task_id: this.packInfo.packing_task_id,
        mat_code: this.noCodePackForm.mat_code,
        box_code: this.noCodePackForm.box_code,
        drug_cnt: this.noCodePackForm.drug_cnt
      }
      this.packBoxList.push(packBox)
      this.noCodeBoxCancel()
    },
    noCodeBoxCancel () {
      this.$refs.noCodeBoxRef.resetFields()
      this.isShowNoCodeBoxModal = false
    },
    handleCommit (type) {
      if (type === 'save') {
        this.isSaving = true
      } else {
        this.isCommitting = true
      }
      const params = {
        packing_task_id: this.packInfo.packing_task_id,
        packing_task_status: type === 'save' ? '1' : '2',
        ver: this.packInfo.ver,
        already_packing_cnt: this.packBoxList.length + '',
        DetailsBarcodeList: this.packInfo.op_type === 1 ? this.packBoxList.filter(item => !item.packing_task_details_barcode_id) : [],
        DetailsNocodeList: this.packInfo.op_type === 0 ? this.packBoxList.filter(item => !item.packing_task_details_barcode_id) : []
      }
      console.log(JSON.stringify(params))
      const successMsg = type === 'save' ? '保存成功' : '提交成功'
      taskPack(params).then(res => {
        this.$message.success(successMsg)
        if (type === 'save') {
          this.isSaving = false
        } else {
          this.isCommitting = false
        }
        this.$router.go(-1)
      }).catch(err => {
        this.$message.error(err.msg)
        if (type === 'save') {
          this.isSaving = false
        } else {
          this.isCommitting = false
        }
      })
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-pack {
  padding: 5px;
  .entry-pack-content {
    margin: 10px;
    /deep/ .ant-statistic-title {
      font-size: 14px;
    }
    .statistic-divider {
      height: 64px;
    }
    /deep/ .ant-statistic-content {
      span {
        font-size: 24px;
      }
    }
    .box-table {
      margin-left: 10px;
    }
  }
}
</style>