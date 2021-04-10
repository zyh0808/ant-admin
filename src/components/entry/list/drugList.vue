<template>
  <div class="drug-List">
    <a-table :columns="listType === 'show'?showColumns: actionColumns"
      class="added-drug-table" :data-source="drugList"
      :rowKey="record => record.key" :pagination="false"
      :scroll="{ x:tableWidth }">
      <template slot="drugDetail" slot-scope="drugDetail">
        <a-button v-if="listType === 'edit' && drugDetail" type="link"
          size="small" @click="showDrugDetail(drugDetail)">
          查看明细</a-button>
        <a-button v-if="listType === 'edit' && !drugDetail" type="link"
          size="small" @click="showImportDrugCodeModal()">
          导入</a-button>
        <a-button v-if="listType !== 'edit'" type="link" size="small"
          @click="showDrugDetail(drugDetail)">
          查看明细</a-button>
      </template>
      <template v-if="listType !== 'show'" slot="action"
        slot-scope="text, record, index">
        <div v-if="listType === 'edit'">
          <a-button type="link" size="small" @click="showParentDrawer">
            修改
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm v-if="drugList.length" title="确认删除吗?" cancelText="取消"
            okText="确认" @confirm="() => deleteDrug(index)">
            <a-button type="link" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </div>
        <a-button v-else-if="listType === 'check'" type="link" size="small"
          @click="checkDrug">
          审核
        </a-button>
        <a-button v-else-if="listType === 'receive'" type="link" size="small"
          @click="receiveDrug">
          收货
        </a-button>
      </template>
    </a-table>
    <a-drawer title="药品条形码" width="250px" :visible="detailDrawerVisible"
      @close="onClose">
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          关闭
        </a-button>
      </div>
    </a-drawer>
    <a-modal title="导入药品条形码" :visible="importModalVisiable"
      :confirm-loading="confirmLoading" @ok="handleDrugCode"
      @cancel="handleCancel">
      <a-row type="flex" justify="space-between">
        <a-upload name="file"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :file-list="fileList" @change="importDrugCode">
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { drug_show_columns, drug_action_columns } from '@/js/common.js'
import codeList from '@/components/entry/codeList.vue'
const codeColumns = [
  {
    title: '药品条形码',
    dataIndex: 'code',
  }
]
export default {
  // directives: { infiniteScroll },
  components: {
    // RecycleScroller,
    codeList
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
      // haveCode: false,
      detailDrawerVisible: false,
      importModalVisiable: false,
      fileList: [],
      codeColumns,
      confirmLoading: false
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
    showParentDrawer () {
      this.$emit('showDrawer')
    },
    checkDrug () {
      this.$emit('showCellApply')
    },
    receiveDrug () {
      this.$emit('showReceive')
    },
    showDrugDetail (status) {
      // this.haveCode = status
      this.detailDrawerVisible = true
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
    onClose () {
      this.detailDrawerVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
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