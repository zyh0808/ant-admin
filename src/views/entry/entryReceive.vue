<template>
  <div class="entry-receive">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-receive-content">
      <a-card title="订单信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <orderInfoDetail></orderInfoDetail>
      </a-card>
      <a-card title="项目信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <projectInfoDetail></projectInfoDetail>
      </a-card>
      <a-card title="审核信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <checkInfoDetail></checkInfoDetail>
      </a-card>
      <a-card title="药品信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <drugList style="margin-top:10px; width: 100%" listType="receive"
          @showReceive="showReceive">
        </drugList>
      </a-card>
    </div>
    <a-modal title="药品验收" :visible="isShowReceiveModal"
      :confirm-loading="confirmLoading" :footer="null" @cancel="receiveCancel"
      :width="800">
      <a-form-model :model="receives" :label-col="{ span: 8 }"
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
      </a-card>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { PrefixInteger } from '@/js/utils.js'
import pageHeader from '@/components/pageHeader.vue'
import orderInfoDetail from '@/components/entry/detail/orderInfoDetail.vue'
import projectInfoDetail from '@/components/entry/detail/projectInfoDetail.vue'
import checkInfoDetail from '@/components/entry/detail/checkInfoDetail.vue'
import drugList from '@/components/entry/list/drugList'
function getCodeList (num) {
  let list = []
  for (let i = 0; i < num; i++) {
    const fixedNum = PrefixInteger(i, 3)
    const code = `code${fixedNum}`
    list.push({ code })
  }
  return list
}
const codeList = getCodeList(100)
const receivedColumns = [
  {
    title: '药品条形码',
    dataIndex: 'code',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const wrongColumns = [
  {
    title: '药品条形码',
    dataIndex: 'code',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  }
]
export default {
  data () {
    return {
      isShowReceiveModal: false,
      confirmLoading: false,
      receiveConfirmable: false,
      receives: {
        code: ''
      },
      receivedList: [],
      codeList,
      wrongList: [],
      // receivesRules: {
      //   code: [{ required: true, message: '请扫描药品条码', trigger: 'blur' }]
      // },
      receivedColumns,
      wrongColumns,
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    orderInfoDetail,
    projectInfoDetail,
    checkInfoDetail,
    drugList
  },
  created () {
    // this.type = this.$route.params.type
    // this.type === 'receive' && this.showCellApply()
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_receivelist',
      breadcrumbName: '入库订单收货列表'
    },
    {
      path: 'entry_receive',
      breadcrumbName: '入库订单收货'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'input/resetAllData'
    }),
    handleEnter () {
      if (!this.receives.code) {
        return
      }
      if (this.receivedList.find(item => item.code === this.receives.code)) {
        this.$message.error('重复条形码，请重新扫描')
        return
      }
      const enter = this.codeList.find(item => item.code === this.receives.code)
      if (!enter) {
        const enterObj = {
          code: this.receives.code,
          status: '不存在'
        }
        this.wrongList.push(enterObj)
      }
      const code = { code: this.receives.code }
      this.receivedList.push(code)
      this.$nextTick(() => {
        this.receives.code = ''
        this.$refs.code.focus()
      })
    },
    showCellApply () {
      this.isShowCellApplyModal = true
    },
    showReceive () {
      this.isShowReceiveModal = true
    },
    handleApply () { },
    applyCancel () {
      this.isShowCellApplyModal = false
    },
    deleteCode (index) {
      const code = this.receivedList[index].code
      this.receivedList.splice(index, 1)
      if (this.wrongList.length >= 1) {
        let wIndex = undefined
        this.wrongList.forEach((item, i) => {
          if (item.code === code) {
            wIndex = i + 1
          }
        })
        wIndex && this.wrongList.splice(wIndex - 1, 1)
      }
    },
    handleReceive () { },
    receiveCancel () {
      this.isShowReceiveModal = false
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-receive {
  padding: 5px;
  .entry-receive-content {
    margin: 0 10px;
  }
}
.box-count-text {
  color: red;
  font-size: 16px;
  font-weight: 600;
}
/deep/ .ant-card-body {
  padding: 10px;
}
.received-table {
  width: 350px;
  max-height: 400px;
  .scaned-count {
    margin-left: 10px;
    color: #0050b3;
    font-weight: 600;
  }
}
.wrong-table {
  width: 350px;
  max-height: 400px;
  .wrong-count {
    margin-left: 10px;
    color: red;
    font-weight: 600;
  }
}
.ant-btn-sm {
  height: 21px;
  padding: 0 7px;
  font-size: 14px;
  border-radius: 4px;
}
</style>