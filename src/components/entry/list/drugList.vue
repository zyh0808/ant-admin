<template>
  <div class="drug-List">
    <a-table :columns="listType === 'show'?showColumns: actionColumns" class="added-drug-table" :data-source="drugList" :rowKey="record => record.key" :pagination="false" :scroll="{ x:tableWidth }">
      <template slot="title">
        <a-row type="flex" justify="space-between">
          <span class="info-title">药品信息</span>
          <div v-if="listType === 'edit'">
            <a-button icon="plus" @click="showDrawer('add')">
              添加
            </a-button>
            <a-button type="primary" icon="save" :disabled="!drugList.length" style="margin-left: 10px">
              保存
            </a-button>
          </div>
        </a-row>
      </template>
      <template slot="drugDetail" slot-scope="drugDetail">
        <a-button v-if="listType === 'edit' && drugDetail" type="link" size="small" @click="showDrugDetail(drugDetail)">
          查看明细</a-button>
        <a-button v-if="listType === 'edit' && !drugDetail" type="link" size="small" @click="showImportDrugCodeModal()">
          导入</a-button>
        <a-button v-if="listType !== 'edit'" type="link" size="small" @click="showDrugDetail(drugDetail)">
          查看明细</a-button>
      </template>
      <template v-if="listType !== 'show'" slot="action" slot-scope="text, record, index">
        <div v-if="listType === 'edit'">
          <a-button type="link" size="small" @click="showDrawer('edit')">
            修改
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm v-if="drugList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteDrug(index)">
            <a-button type="link" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </div>
        <a-button v-else-if="listType === 'check'" type="link" size="small" @click="showCellModal">
          审核
        </a-button>
        <a-button v-else-if="listType === 'receive'" type="link" size="small" @click="showReceiveModal">
          收货
        </a-button>
      </template>
    </a-table>
    <!-- <a-drawer title="药品条形码" width="250px" :visible="detailDrawerVisible" @close="hideCodeList">
      <codeList></codeList>
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
        <a-button :style="{ marginRight: '8px' }" @click="hideCodeList">
          关闭
        </a-button>
      </div>
    </a-drawer> -->
    <codeList ref="codeListRef"></codeList>
    <a-drawer :title="drawerTitle" :width="drawerWidth" :visible="drawerVisible" :body-style="{ paddingBottom: '80px' }" @close="hideDrugInfo">
      <drugInfoEdit></drugInfoEdit>
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
        <a-button :style="{ marginRight: '8px' }" @click="hideDrugInfo">
          取消
        </a-button>
        <a-button type="primary" @click="saveDrugInfo">
          保存
        </a-button>
      </div>
    </a-drawer>
    <a-modal title="导入药品条形码" :visible="importModalVisiable" :confirm-loading="isImporting" @ok="handleDrugCode" @cancel="handleCancel">
      <a-row type="flex" justify="space-between">
        <a-upload name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :file-list="fileList" @change="importDrugCode">
          <!-- <a-button v-if="codeList.length < 1">
            <a-icon type="import" /> 导入
          </a-button> -->
          <a-button>
            <a-icon type="import" /> 重新导入
          </a-button>
        </a-upload>
        <a @click="downloadModule">点击此处下载模版</a>
      </a-row>
      <!-- <RecycleScroller v-infinite-scroll="appendMore" class="check-code-list"
        :items="codeList" :item-size="40" key-field="code"
        :infinite-scroll-disabled="busy" :infinite-scroll-distance="1">
        <a-list-item slot-scope="{item}">
          条形码: <span style="color: #409EFF">{{item.code}}</span>
        </a-list-item>
      </RecycleScroller> -->
      <!-- <codeList class="check-code-list"></codeList> -->
    </a-modal>
    <!-- <a-modal title="货位预约" :visible="isShowCellModal" :confirm-loading="isAppling" @ok="handleApply" @cancel="applyCancel" :width="700">
      <a-form-model :model="boxInfo" :rules="boxInfoRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="箱型" prop="boxKind">
              <a-select v-model="boxInfo.boxKind" placeholder="请选择">
                <a-select-option :value=1>
                  箱型A
                </a-select-option>
                <a-select-option :value=2>
                  箱型B
                </a-select-option>
                <a-select-option :value=3>
                  箱型C
                </a-select-option>
                <a-select-option :value=4>
                  箱型D
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="数量" v-if="boxInfo.boxKind">
              <span class="box-count-text">{{boxInfo.count}}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <cellView :statusList="statusList" :activeStatus="0" :max="boxInfo.count" v-if="boxInfo.boxKind">
      </cellView>
    </a-modal> -->
    <!-- <a-modal title="药品验收" :visible="isShowReceiveModal" :confirm-loading="isReceiving" @ok="handleReceive" @cancel="receiveCancel" :width="500">
      <a-form-model :model="receives" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="承运单号">
          <a-input v-model="receives.carrier_order_no" placeholder="请输入">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="温度计号">
          <a-input v-model="receives.thermometer_no" placeholder="请输入">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="药品数量">
          <a-input-number v-model="receives.drug_count" :mix="0">
          </a-input-number>
        </a-form-model-item>
        <a-form-model-item label="是否破损">
          <a-radio-group v-model="receives.isDamage">
            <a-radio-button :value="0">
              否
            </a-radio-button>
            <a-radio-button :value="1">
              是
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="附件">
          <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="receives.fileList" @preview="handlePreview" name="image" multiple>
            <div v-if="receives.fileList.length < 4">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-model-item>
      </a-form-model> -->
    <!-- <a-form-model :model="receives" :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row type="flex" justify="space-between">
          <a-form-model-item label="药品条码">
            <a-input v-model="receives.code" @pressEnter="handleEnter"
              ref="code" placeholder="请扫描">
            </a-input>
          </a-form-model-item>
          <a-row>
            <a-button type="primary" :disabled="!receivedList.length"
              style="margin-left: 10px">
              对比
            </a-button>
            <a-button icon="save" :disabled="!receivedList.length"
              style="margin-left: 10px">
              保存
            </a-button>
            <a-button type="primary" style="margin-left: 10px"
              :disabled="!receiveConfirmable">
              确认收货
            </a-button>
          </a-row>
        </a-row>
      </a-form-model>
      <a-row type="flex" justify="space-between">
        <div class="received-table">
          <p>已扫描<span class="scaned-count">{{receivedList.length}}</span></p>
          <a-table :columns="receivedColumns" :data-source="receivedList"
            :rowKey="record => record.code" :pagination="false" size="small"
            style="width: 100%;height: 100%" :scroll="{ y: 320 }">
            <template slot="action" slot-scope="text, record, index">
              <a-button type="link" size="small" @click="deleteCode(index)">
                删除
              </a-button>
            </template>
          </a-table>
        </div>
        <div class="wrong-table">
          <p>扫描异常<span class="wrong-count">{{wrongList.length}}</span></p>
          <a-table :columns="wrongColumns" :data-source="wrongList" size="small"
            :rowKey="record => record.code" :pagination="false"
            style="width: 100%;height: 100%" :scroll="{ y: 320 }">
            <template slot="status" slot-scope="status">
              <a-badge status="error" :text="status" />
            </template>
          </a-table>
        </div>
      </a-row>
      <a-card title="对比结果" style="margin-top:10px; width: 100%">
        <span>暂无数据</span>
      </a-card> -->
    <!-- </a-modal> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { drug_show_columns, drug_action_columns } from '@/js/common.js'
import codeList from '@/components/entry/codeList.vue'
import drugInfoEdit from '@/components/entry/edit/drugInfoEdit'
const codeColumns = [
  {
    title: '药品条形码',
    dataIndex: 'code',
  }
]
// const receivedColumns = [
//   {
//     title: '药品条形码',
//     dataIndex: 'code',
//   },
//   {
//     title: '操作',
//     key: 'action',
//     scopedSlots: { customRender: 'action' }
//   }
// ]
// const wrongColumns = [
//   {
//     title: '药品条形码',
//     dataIndex: 'code',
//   },
//   {
//     title: '状态',
//     dataIndex: 'status',
//     key: 'status',
//     scopedSlots: { customRender: 'status' }
//   }
// ]
export default {
  // directives: { infiniteScroll },
  components: {
    // RecycleScroller,
    codeList,
    drugInfoEdit
    // cellView
  },
  props: {
    listType: {
      type: String,
      default: 'edit'
    }
  },
  data () {
    return {
      actionColumns: drug_action_columns,
      showColumns: drug_show_columns,
      tableWidth: 0,
      // detailDrawerVisible: false,
      importModalVisiable: false,
      fileList: [],
      codeColumns,
      isImporting: false,
      drawerTitle: '',
      drawerWidth: 700,
      drawerVisible: false,
      isShowCellModal: false,
      isAppling: false,
      // boxInfo: {
      //   boxKind: null,
      //   count: 5
      // },
      // boxInfoRules: {
      //   boxKind: [{ required: true, message: '请选择箱型', trigger: 'blur' }]
      // },
      // statusList: [
      //   {
      //     index: 0,
      //     name: '空闲'
      //   },
      //   {
      //     index: 1,
      //     name: '占用'
      //   },
      //   {
      //     index: 2,
      //     name: '锁定'
      //   }
      // ],
      // isShowReceiveModal: false,
      // isReceiving: false,
      // receiveConfirmable: false,
      // receives: {
      //   carrier_order_no: '',
      //   thermometer_no: '',
      //   drug_count: 0,
      //   isDamage: 0,
      //   fileList: []
      // },
      // previewVisible: false,
      // previewImage: ''
    }
  },
  computed: {
    ...mapGetters({
      drugList: 'input/drugList'
    })
  },
  created () {
    this.tableWidth = this.listType === 'edit' ? 1250 : 1100
  },
  methods: {
    ...mapMutations({
      deleteDrug: 'input/deleteDrug'
    }),
    showDrawer (type) {
      this.drawerTitle = type === 'add' ? '添加药品' : '修改药品'
      this.drawerVisible = true
    },
    hideDrugInfo () {
      this.drawerVisible = false
    },
    saveDrugInfo () {
      this.hideDrugInfo()
    },
    showDrugDetail () {
      this.$refs.codeListRef.showDrugDrawer()
    },
    showImportDrugCodeModal () {
      this.importModalVisiable = true
    },
    importDrugCode (info) {
      console.log(info)
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传完成`)
      }
    },
    downloadModule () {
      window.location.href = `${window.location.protocol}//${window.location.host}/files/test.xlsx`
    },
    handleDrugCode () {
      this.handleCancel()
    },
    handleCancel () {
      this.importModalVisiable = false
    },
    hideCodeList () {
      this.detailDrawerVisible = false
    },
    showCellModal () {
      this.isShowCellModal = true
    },
    handleApply () {
      this.applyCancel()
    },
    applyCancel () {
      this.isShowCellModal = false
    },
    showReceiveModal () {
      this.isShowReceiveModal = true
    },
    // handleEnter () {
    //   if (!this.receives.code) {
    //     return
    //   }
    //   if (this.receivedList.find(item => item.code === this.receives.code)) {
    //     this.$message.error('重复条形码，请重新扫描')
    //     return
    //   }
    //   const enter = this.codeList.find(item => item.code === this.receives.code)
    //   if (!enter) {
    //     const enterObj = {
    //       code: this.receives.code,
    //       status: '不存在'
    //     }
    //     this.wrongList.push(enterObj)
    //   }
    //   const code = { code: this.receives.code }
    //   this.receivedList.push(code)
    //   this.$nextTick(() => {
    //     this.receives.code = ''
    //     this.$refs.code.focus()
    //   })
    // },
    // deleteCode (index) {
    //   const code = this.receivedList[index].code
    //   this.receivedList.splice(index, 1)
    //   if (this.wrongList.length >= 1) {
    //     let wIndex = null
    //     this.wrongList.forEach((item, i) => {
    //       if (item.code === code) {
    //         wIndex = i + 1
    //       }
    //     })
    //     wIndex && this.wrongList.splice(wIndex - 1, 1)
    //   }
    // },
    handleReceive () {
      this.receiveCancel()
    },
    receiveCancel () {
      this.isShowReceiveModal = false
    },
    // async handlePreview (file) {
    //   if (!file.url && !file.preview) {
    //     file.preview = await getBase64(file.originFileObj)
    //   }
    //   this.previewImage = file.url || file.preview
    //   this.previewVisible = true
    // }
  }
}
</script>

<style lang="less" scoped>
.drug-List {
  margin: 0 10px;
}
.table-row {
  height: 32px;
  line-height: 32px;
}
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
}
/deep/ .ant-drawer-body {
  padding: 0;
  height: calc(100% - 62px);
}
/deep/ .ant-list-item {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8 !important;
}
.check-code-list {
  // border: 1px solid #e8e8e8;
  // border-radius: 4px;
  height: 400px;
  // padding: 4px 16px;
  // margin-top: 10px;
}
</style>