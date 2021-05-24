<template>
  <div class="entry-receive">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system" :headerTitle="orderId"></pageHeader>
    </div>
    <div class="entry-receive-content">
      <a-card v-for="(item, index) in orderDrugList" :key="item.batch_no" :bordered="false">
        <p slot="title" class="reset-style">
          药品名称：<span class="info-text" style="margin-right: 20px">{{ item.drug_name }}</span>
          药品批次号：<span class="info-text">{{ item.batch_no }}</span>
        </p>
        <a-button v-if="!item.carrierno" slot="extra" icon="plus" @click="showReceiveModal(item, index)" />
        <a-button v-else slot="extra" icon="edit" @click="showReceiveModal(item, index)" />
        <a-empty v-if="!item.carrierno" description="暂无收货记录" />
        <a-descriptions :column="5" v-else>
          <a-descriptions-item label="承运单号">
            {{ item.carrierno }}
          </a-descriptions-item>
          <a-descriptions-item label="温度计编号">
            {{ item.temp_id }}
          </a-descriptions-item>
          <a-descriptions-item label="收货包装">
            {{ item.receive_unit }}
          </a-descriptions-item>
          <a-descriptions-item label="收货数量">
            {{ item.receive_cnt }}
          </a-descriptions-item>
          <a-descriptions-item label="破损数量">
            {{ item.breakageb_cnt }}
          </a-descriptions-item>
          <a-descriptions-item label="收货备注" :span="5">
            {{ item.receive_remark }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <div class="commit-btns">
        <a-button class="commit-btn" @click="$router.go(-1)">返回</a-button>
        <a-button class="commit-btn" style="margin-left: 10px" @click="handleCommit('save')" :disabled="enableCommit" :loading="isSaving">保存</a-button>
        <a-button type="primary" class="commit-btn" style="margin-left: 10px" @click="handleCommit('commit')" :disabled="enableCommit" :loading="isCommitting">提交</a-button>
      </div>
      <a-modal :title="receiveTitle" :visible="isShowReceiveForm" @ok="handleConfirm" @cancel="handleCancel" :width="500">
        <a-form-model :model="receives" ref="receiveRef" :rules="receivesRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item label="承运单号" prop="carrierno">
            <a-input v-model="receives.carrierno" placeholder="请输入">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="温度计号" prop="temp_id">
            <a-input v-model="receives.temp_id" placeholder="请输入">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="收货包装" prop="receive_unit">
            <a-input v-model="receives.receive_unit" placeholder="请输入">
            </a-input>
          </a-form-model-item>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="收货数量" prop="receive_cnt" :label-col="{ span: 12 }" :wrapper-col="{ span: 8 }">
                <a-input-number v-model="receives.receive_cnt" :mix="0" placeholder="请输入">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="破损数量" prop="breakageb_cnt" :label-col="{ span: 10 }" :wrapper-col="{ span: 8 }">
                <a-input-number v-model="receives.breakageb_cnt" :mix="0" placeholder="请输入">
                </a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="收货备注">
            <a-input v-model="receives.receive_remark" placeholder="请输入" type="textarea">
            </a-input>
          </a-form-model-item>
          <!-- <a-form-model-item label="附件">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="receives.fileList" @preview="handlePreview" name="image" multiple>
              <div v-if="receives.fileList.length < 4">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
          </a-form-model-item> -->
        </a-form-model>
      </a-modal>
    </div>
    <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal> -->
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { receiveSave, orderReceive } from '@/api/order'
import pageHeader from '@/components/pageHeader.vue'

export default {
  data () {
    return {
      system: 'entry',
      receiveTitle: '',
      receives: {
        carrierno: '',
        temp_id: '',
        receive_unit: '',
        receive_cnt: null,
        breakageb_cnt: null,
        receive_remark: ''
      },
      receivesRules: {
        carrierno: [{ required: true, message: '请输入承运单号', trigger: 'blur' }],
        temp_id: [{ required: true, message: '请输入温度计号', trigger: 'blur' }],
        receive_unit: [{ required: true, message: '请输入收货包装', trigger: 'blur' }],
        receive_cnt: [{ required: true, message: '请输入收货数量', trigger: 'blur' }],
        breakageb_cnt: [{ required: true, message: '请输入破损数量', trigger: 'blur' }]
      },
      // previewVisible: false,
      // previewImage: '',
      isShowReceiveForm: false,
      enableCommit: true,
      isSaving: false,
      isCommitting: false
    }
  },
  components: {
    pageHeader
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      orderInfo: 'order/orderInfo',
      orderDrugList: 'order/orderDrugList'
    })
  },
  watch: {
    orderDrugList: {
      handler (list) {
        const drug = list.filter(drug => drug.carrierno !== '')
        // console.log(drug)
        if (drug.length !== 0) {
          this.enableCommit = false
        } else {
          this.enableCommit = true
        }
      }
    }
  },
  created () {
    this.orderId = this.$route.params.orderId ? this.$route.params.orderId : ''
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_order',
      breadcrumbName: '入库订单'
    },
    {
      path: '',
      breadcrumbName: '订单收货'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  // mounted () {
  //   this.fetchOrderReceiveInfo({ drug_in_id: this.orderInfo.drug_in_id })
  // },
  methods: {
    ...mapActions({
      fetchOrderReceiveInfo: 'order/fetchOrderReceiveInfo'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      setOrderDrugList: 'order/setOrderDrugList',
      resetAllData: 'input/resetAllData'
    }),
    // async handlePreview (file) {
    //   if (!file.url && !file.preview) {
    //     file.preview = await getBase64(file.originFileObj)
    //   }
    //   this.previewImage = file.url || file.preview
    //   this.previewVisible = true
    // },
    // previewCancel () {
    //   this.previewVisible = false
    // },
    showReceiveModal (drug, index) {
      this.detail_id = drug.drug_in_detail_id
      this.index = index
      this.receiveTitle = '添加收货记录'
      if (drug.carrierno) {
        this.receiveTitle = '编辑收货记录'
        this.receives = Object.assign(this.receives, {
          carrierno: drug.carrierno,
          temp_id: drug.temp_id,
          receive_unit: drug.receive_unit,
          receive_cnt: drug.receive_cnt,
          breakageb_cnt: drug.breakageb_cnt,
          receive_remark: drug.receive_remark
        })
      }
      this.isShowReceiveForm = true
    },
    handleConfirm () {
      this.$refs.receiveRef.validate(valid => {
        if (valid) {
          let list = [...this.orderDrugList]
          let drug = { ...list[this.index] }
          drug = Object.assign(drug, { ...this.receives })
          list[this.index] = drug
          this.setOrderDrugList(list)
          this.isShowReceiveForm = false
          this.$forceUpdate()
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.isShowReceiveForm = false
    },
    handleCommit (type) {
      const details = this.orderDrugList.map(item => {
        return {
          drug_in_detail_id: item.drug_in_detail_id + '',
          carrierno: item.carrierno,
          temp_id: item.temp_id,
          ver: item.ver,
          receive_cnt: item.receive_cnt,
          receive_unit: item.receive_unit,
          breakageb_cnt: item.breakageb_cnt,
          receive_remark: item.receive_remark
        }
      })
      const params = {
        drug_in_id: this.orderInfo.drug_in_id,
        status: type === 'save' ? '4' : '5',
        ver: this.orderInfo.ver,
        ReceiveDetailss: details
      }
      console.log(JSON.stringify(params))
      type === 'save' && this.receiveSave(params)
      type === 'commit' && this.orderReceive(params)
    },
    receiveSave (params) {
      this.isSaving = true
      receiveSave(params).then(res => {
        this.fetchOrderReceiveInfo({ drug_in_id: this.orderInfo.drug_in_id })
        this.$message.success('保存成功')
        this.isSaving = false
      }).catch(err => {
        this.$message.error(err.msg)
        this.isSaving = false
      })
    },
    orderReceive (params) {
      this.isCommitting = true
      orderReceive(params).then(res => {
        this.$message.success('收货成功')
        this.isCommitting = false
        this.$router.go(-1)
      }).catch(err => {
        this.$message.error(err.msg)
        this.isCommitting = false
      })
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
    margin: 10px;
    padding-bottom: 20px;
    background-color: #fff;
  }
}
</style>