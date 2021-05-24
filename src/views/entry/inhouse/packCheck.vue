<template>
  <div class="entry-pack">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system" :headerTitle="taskNo"></pageHeader>
    </div>
    <div class="entry-pack-content">
      <a-card :bordered="false">
        <packDrugInfo></packDrugInfo>
        <a-row type="flex">
          <a-statistic title="已装箱数量" :value="packInfo.pack_count" style="margin-right:100px" :value-style="{ color: 'rgba(0,0,0,.85)'}">
            <template #suffix>
              <span>个药品箱</span>
            </template>
          </a-statistic>
          <a-divider type="vertical" class="statistic-divider" />
          <a-statistic title="操作人数" :value="packInfo.packers.length" style="margin-left:30px" :value-style="{ color: 'rgba(0,0,0,.85)'}">
            <template #suffix>
              <span>人</span>
            </template>
          </a-statistic>
        </a-row>
      </a-card>
      <a-card :bordered="false" style="margin-top: 10px">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="有条码">
            <a-row>
              <a-col :span="12">
                <a-table :columns="boxColumns" class="box-table" :data-source="boxList" :rowKey="record => record.box_no" :pagination="false" size="middle">
                  <template slot="action" slot-scope="text, record, index">
                    <a-button type="link" size="small" @click="showBoxModal('edit')">
                      修改
                    </a-button>
                    <a-divider type="vertical" />
                    <a-popconfirm v-if="boxList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteBox(index)">
                      <a-button type="link" size="small">
                        删除
                      </a-button>
                    </a-popconfirm>
                  </template>
                  <a slot="drug_codes" slot-scope="text">{{ text }}</a>
                </a-table>
              </a-col>
              <a-col :span="12" class="check-content">
                <a-tabs>
                  <a-tab-pane key="1" tab="审核通过">
                    <a-form-model :model="passForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                      <a-form-model-item label="通过说明">
                        <a-input v-model="passForm.mark" placeholder="请输入" type="textarea">
                        </a-input>
                      </a-form-model-item>
                    </a-form-model>
                  </a-tab-pane>
                  <a-tab-pane key="2" tab="审核不通过">
                    <a-form-model :model="passForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                      <a-form-model-item label="驳回说明">
                        <a-input v-model="passForm.backMark" placeholder="请输入" type="textarea">
                        </a-input>
                      </a-form-model-item>
                    </a-form-model>
                  </a-tab-pane>
                </a-tabs>
                <div class="commit-btns">
                  <a-button type="primary" class="commit-btn">提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="无条码">
            <a-row>
              <a-col :span="12">
                <a-table :columns="noCodeBoxColumns" class="box-table" :data-source="boxList" :rowKey="record => record.box_no" :pagination="false" size="middle">
                  <template slot="action" slot-scope="text, record, index">
                    <a-button type="link" size="small" @click="showBoxModal('edit')">
                      修改
                    </a-button>
                    <a-divider type="vertical" />
                    <a-popconfirm v-if="boxList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteBox(index)">
                      <a-button type="link" size="small">
                        删除
                      </a-button>
                    </a-popconfirm>
                  </template>
                  <a slot="drug_codes" slot-scope="text">{{ text }}</a>
                </a-table>
              </a-col>
              <a-col :span="12" class="check-content">
                <a-tabs>
                  <a-tab-pane key="1" tab="审核通过">
                    <a-form-model :model="passForm" :label-col="{ span: 2 }" :wrapper-col="{ span: 16 }">
                      <a-form-model-item label="通过说明">
                        <a-input v-model="passForm.mark" placeholder="请输入" type="textarea">
                        </a-input>
                      </a-form-model-item>
                    </a-form-model>
                  </a-tab-pane>
                  <a-tab-pane key="2" tab="审核不通过">
                    <a-form-model :model="passForm" :label-col="{ span: 2 }" :wrapper-col="{ span: 16 }">
                      <a-form-model-item label="驳回说明">
                        <a-input v-model="passForm.backMark" placeholder="请输入" type="textarea">
                        </a-input>
                      </a-form-model-item>
                    </a-form-model>
                  </a-tab-pane>
                </a-tabs>
                <div class="commit-btns">
                  <a-button class="commit-btn" @click="$router.go(-1)">返回</a-button>
                  <a-button type="primary" class="commit-btn" style="margin-left:10px">提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    <a-modal title="药品箱审核" :visible="isShowBoxCheckModal" :confirm-loading="isPacking" @ok="handlePack" @cancel="packCancel" :width="800">
      <a-row type="flex" justify="space-between">
        <div class="left-enter" style="width: 300px">
          <h3>药品录入</h3>
          <a-form-model :model="packForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-model-item label="药品箱条码" prop="box_code">
              <a-input v-model="packForm.box_code" ref="box_code" placeholder="请扫描" readOnly>
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="墨水屏条码">
              <a-input v-model="packForm.inkscreen_code" ref="inkscreen_code" placeholder="请扫描" readOnly>
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="药品编码">
              <a-input v-model="packForm.drug_code" @pressEnter="handleDrugEnter" ref="drug_code" placeholder="请扫描">
              </a-input>
            </a-form-model-item>
          </a-form-model>
          <a-button type="primary" block icon="plus" @click="showBoxModal('add')">
            添加
          </a-button>
        </div>
        <div class="right-table" style="width: 400px">
          <h3>药品展示</h3>
          <a-table :columns="drugColumns" :data-source="codeList" :rowKey="record => record.key" :pagination="false" size="small" :scroll="{y:500}">
            <template slot="action" slot-scope="text, record, index">
              <a-button type="link" size="small" @click="deleteCode(index)">
                删除
              </a-button>
            </template>
          </a-table>
        </div>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import packDrugInfo from '@/components/entry/detail/packDrugInfo.vue'
const boxColumns = [
  {
    title: '药品箱编号',
    dataIndex: 'box_no',
    value: 'box_no',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品数量',
    dataIndex: 'drug_count',
    value: 'drug_count',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品明细',
    dataIndex: 'drug_codes',
    value: 'drug_codes',
    // width: 100,
    key: 'drug_codes',
    scopedSlots: { customRender: 'drug_codes' }
  }
]
const noCodeBoxColumns = [
  {
    title: '药品箱编号',
    dataIndex: 'box_no',
    value: 'box_no',
    // width: 150,
    ellipsis: true
  },
  {
    title: '药品数量',
    dataIndex: 'drug_count',
    value: 'drug_count',
    // width: 150,
    ellipsis: true
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
      isShowBoxCheckModal: false,
      isPacking: false,
      packForm: {
        box_code: 'YPX001',
        inkscreen_code: 'MSP0001',
        drug_code: ''
      },
      drugColumns,
      passForm: {
        mark: '',
        backMark: ''
      }
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
      path: 'pack_task_list',
      breadcrumbName: '装箱任务单'
    },
    {
      path: '',
      breadcrumbName: '装箱审核'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      boxList: 'pack/boxList',
      packInfo: 'pack/packInfo',
      codeList: 'pack/codeList'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      addCodeList: 'pack/addCodeList',
      deleteCode: 'pack/deleteCode',
      resetAllData: 'input/resetAllData'
    }),
    showBoxModal (type) {
      this.isShowBoxCheckModal = true
    },
    deleteBox (index) { },
    handleDrugEnter () {
      if (!this.packForm.drug_code) {
        return
      }
      if (this.codeList.find(item => item.drug_code === this.packForm.drug_code)) {
        this.$message.error('重复条形码，请重新扫描')
        return
      }
      const drug_code = { key: this.packForm.drug_code, drug_code: this.packForm.drug_code }
      this.addCodeList(drug_code)
      this.$nextTick(() => {
        this.packForm.drug_code = ''
        this.$refs.drug_code.focus()
      })
    },
    handlePack () {
      this.packCancel()
    },
    packCancel () {
      this.isShowBoxCheckModal = false
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
      margin: 10px;
    }
  }
}
.check-content {
  padding: 0 20px;
  border-left: 1px solid #f0f0f0;
}
</style>