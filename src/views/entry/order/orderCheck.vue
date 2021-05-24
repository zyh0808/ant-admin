<template>
  <div class="entry-check">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes"
        :basePath="system" :headerTitle="orderId">
      </pageHeader>
    </div>
    <div class="entry-check-content">
      <a-card
        v-for="(item, index) in orderDrugList"
        :key="item.batch_no" :bordered="false">
        <p slot="title" class="reset-style">
          药品名称：<span class="info-text"
            style="margin-right: 20px">{{ item.drug_name }}</span>
          药品批次号：<span
            class="info-text">{{ item.batch_no }}</span>
        </p>
        <a-button v-if="!item.box_kind_id"
          slot="extra" icon="plus"
          @click="showCheckModal(item, index)" />
        <a-button v-else slot="extra" icon="edit"
          @click="showCheckModal(item, index)" />
        <a-empty v-if="!item.box_kind_id"
          description="暂无审核记录" />
        <a-descriptions :column="5" v-else>
          <a-descriptions-item label="药品箱种类">
            {{ item.box_kind_name }}
          </a-descriptions-item>
          <a-descriptions-item label="药品箱数量">
            {{ item.box_cnt }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card style="margin-top: 10px"
        :bordered="false">
        <a-tabs v-model="tabKey">
          <a-tab-pane key="1" tab="同意">
            <a-form-model :model="cellsForm"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 22 }">
              <a-form-model-item label="温度区间">
                <a-radio-group
                  v-model="cellsForm.temp_rang"
                  @change="tempChange"
                  v-if="setTempList.length !== 0">
                  <a-radio-button
                    v-for="item in setTempList"
                    :key="item.temp_range_id"
                    :value="item.temp_range_id">
                    {{ item.temp_range_name }}
                  </a-radio-button>
                </a-radio-group>
                <span v-else>暂无温区</span>
              </a-form-model-item>
              <a-form-model-item label="货架号">
                <a-radio-group
                  v-model="cellsForm.shelf_id"
                  @change="ShelfChange"
                  v-if="shelfList.length !== 0">
                  <a-radio-button
                    v-for="item in shelfList"
                    :key="item.house_shelf_id"
                    :value="item.house_shelf_id">
                    {{ item.house_shelf_id }}
                  </a-radio-button>
                </a-radio-group>
                <span v-else>暂无货架</span>
              </a-form-model-item>
            </a-form-model>
            <cellView ref="cellViewRef"
              @handleCellStatusChange="handleCellStatusChange">
            </cellView>
          </a-tab-pane>
          <a-tab-pane key="2" tab="不同意">
            <a-form-model :model="failForm"
              :rules="failFormRules"
              :label-col="{ span: 2  }"
              :wrapper-col="{ span: 16 }">
              <a-form-model-item label="驳回原因"
                prop="check_memo">
                <a-input
                  v-model="failForm.check_memo"
                  type="textarea"
                  placeholder="请输入" />
              </a-form-model-item>
            </a-form-model>
          </a-tab-pane>
        </a-tabs>
        <div class="commit-btns">
          <a-button class="commit-btn"
            @click="$router.go(-1)">返回</a-button>
          <a-button type="primary"
            class="commit-btn"
            @click="checkCommit"
            style="margin-left: 10px"
            :loading="isChecking"
            :disabled="!enableCommit">提交
          </a-button>
        </div>
      </a-card>
    </div>
    <a-modal :title="checkTitle"
      :visible="isShowCheckForm"
      @ok="handleConfirm" @cancel="handleCancel"
      :width="500">
      <a-form-model :model="boxForm"
        :rules="boxFormRules" ref="checkRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }">
        <a-form-model-item label="箱型"
          prop="box_kind_id">
          <a-select v-model="boxForm.box_kind_id"
            placeholder="请选择">
            <a-select-option
              v-for="item in boxKindList"
              :key="item.box_kind_id"
              :value="item.box_kind_id">
              {{ item.box_kind_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数量"
          prop="box_cnt">
          <a-input-number
            v-model="boxForm.box_cnt" :mix="0"
            placeholder="请输入">
          </a-input-number>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import pageHeader from '@/components/pageHeader.vue'
import cellView from '@/components/entry/cellView'
import { checkPass } from '@/api/order'
export default {
  data () {
    return {
      moment,
      system: 'entry',
      cellsForm: {
        temp_rang: undefined,
        shelf_id: undefined,
        check_memo: ''
      },
      failForm: {
        check_memo: ''
      },
      boxForm: {
        box_kind_id: undefined,
        box_cnt: null
      },
      tabKey: '1',
      cellViewShow: false,
      failFormRules: {
        check_memo: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
      },
      boxFormRules: {
        box_kind_id: [{ required: true, message: '请选择箱型', trigger: 'blur' }],
        box_cnt: [{ required: true, message: '请输入需要的药品箱数量', trigger: 'blur' }]
      },
      checkTitle: '添加审核记录',
      isShowCheckForm: false,
      isChecking: false,
      enableCommit: false
    }
  },
  components: {
    pageHeader,
    cellView
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
      breadcrumbName: '订单审核'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.fetchSetTempList({ house_id: this.orderInfo.house_id })
    this.fetchBoxKindList({ box_kind_name: '' })
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      userInfo: 'userInfo/userInfo',
      setTempList: 'house/setTempList',
      shelfList: 'house/shelfList',
      boxKindList: 'box/boxKindList',
      orderInfo: 'order/orderInfo',
      cellStatusArray: 'house/cellStatusArray',
      orderDrugList: 'order/orderDrugList'
    })
  },
  watch: {
    setTempList: {
      handler (list) {
        if (list && list.length !== 0) {
          const temp_range_id = list[0].temp_range_id
          this.cellsForm = Object.assign(this.cellsForm, { temp_rang: temp_range_id })
          this.getShelfList()
        }
      },
      deep: true
    },
    shelfList: {
      handler (list) {
        if (list && list.length !== 0) {
          const house_shelf_id = list[0].house_shelf_id
          this.cellsForm = Object.assign(this.cellsForm, { shelf_id: house_shelf_id })
          this.getCellList()
        }
      },
      deep: true
    },
    orderDrugList: {
      handler (list) {
        list.forEach(drug => {
          if (drug.box_kind_id && this.tabKey === '1') {
            this.enableCommit = true
          }
        })
      },
      deep: true
    },
    tabKey (key) {
      this.enableCommit = false
      if (key === '1') {
        this.orderDrugList.forEach(drug => {
          if (drug.box_kind_id) {
            this.enableCommit = true
          }
        })
      } else {
        this.enableCommit = true
      }
    }
  },
  methods: {
    ...mapActions({
      fetchSetTempList: 'house/fetchSetTempList',
      fetchShelfList: 'house/fetchShelfList',
      fetchCellList: 'house/fetchCellList',
      fetchBoxKindList: 'box/fetchBoxKindList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetCellData: 'house/resetCellData',
      setOrderDrugList: 'order/setOrderDrugList',
      resetAllData: 'input/resetAllData'
    }),
    handleCellStatusChange (state) {
      this.state = state
      this.getCells()
    },
    getCells () {
      const cellParams = {
        shelf_cell_id: this.cellsForm.shelf_id,
        state: this.state
      }
      this.fetchCellList(cellParams)
    },
    checkCommit () {
      if (this.tabKey === '1') {
        this.passCommit()
      } else {
        this.failCommit()
      }
    },
    passCommit () {
      if (this.$refs.cellViewRef.checkedList.length === 0) {
        this.$message.error('请选择要预约的货位')
        return
      }
      this.isChecking = true
      const commitData = {
        drug_in_id: this.orderInfo.drug_in_id,
        checker_id: this.userInfo.user_id,
        checker: this.userInfo.username,
        check_date: Math.round(new Date().getTime() / 1000),
        status: '2', // 通过
        ver: this.orderInfo.ver,
        shelf_cells: this.$refs.cellViewRef.checkedList.map(item => item.shelf_cell_id),
        DetailsAuditDTOList: this.orderDrugList.map(item => {
          return {
            box_kind_id: item.box_kind_id,
            box_cnt: item.box_cnt,
            ver: item.ver,
            drug_in_detail_id: item.drug_in_detail_id
          }
        })
      }
      checkPass(commitData).then(res => {
        this.$message.success('审核信息保存成功')
        this.isChecking = false
        this.$router.go(-1)
      }).catch(err => {
        this.$message.error(err.msg)
        this.isChecking = false
      })
    },
    failCommit () {
      this.isChecking = true
      const commitData = {
        drug_in_id: this.orderInfo.drug_in_id,
        checker_id: this.userInfo.user_id,
        checker: this.userInfo.username,
        check_date: Math.round(new Date().getTime() / 1000),
        status: '3', // 不通过
        ver: this.orderInfo.ver,
        shelf_cells: [],
        DetailsAuditDTOList: []
      }
      console.log(JSON.stringify(commitData))
      checkPass(commitData).then(res => {
        this.$message.success('提交成功')
        this.isChecking = false
        this.$router.go(-1)
      }).catch(err => {
        this.$message.error(err.msg)
        this.isChecking = false
      })
    },
    tempChange (e) {
      this.cellsForm = Object.assign(this.cellsForm, { temp_rang: e.target.value })
      this.getShelfList()
    },
    ShelfChange (e) {
      this.cellsForm = Object.assign(this.cellsForm, { shelf_id: e.target.value })
      this.getCellList()
    },
    getShelfList () {
      this.resetCellData()
      //获取货架list
      const shelfParams = {
        house_id: this.orderInfo.house_id,
        temp_range_id: this.cellsForm.temp_rang
      }
      this.fetchShelfList(shelfParams)
    },
    getCellList () {
      this.resetCellData()
      //获取货位list
      const cellParams = {
        shelf_cell_id: this.cellsForm.shelf_id,
        state: 0
      }
      this.fetchCellList(cellParams)
    },
    showCheckModal (drug, index) {
      this.detail_id = drug.drug_in_detail_id
      this.index = index
      this.checkTitle = '添加收货记录'
      if (drug.box_kind_id) {
        this.checkTitle = '编辑收货记录'
        this.boxForm = Object.assign(this.boxForm, {
          box_kind_id: drug.box_kind_id,
          box_cnt: drug.box_cnt
        })
      }
      this.isShowCheckForm = true
    },
    handleConfirm () {
      this.$refs.checkRef.validate(valid => {
        if (valid) {
          const box = this.boxKindList.find(item => item.box_kind_id === this.boxForm.box_kind_id)
          let drug = { ...this.orderDrugList[this.index] }
          drug = Object.assign(drug, { ...this.boxForm, box_kind_name: box.box_kind_name })
          let list = [...this.orderDrugList]
          list = list.map(item => item.drug_in_detail_id === drug.drug_in_detail_id ? drug : item)
          this.setOrderDrugList(list)
          this.isShowCheckForm = false
          this.$forceUpdate()
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.isShowCheckForm = false
    },
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-check {
  padding: 5px;
  .entry-check-content {
    margin: 10px;
  }
}
.box-count-text {
  color: red;
  font-size: 16px;
  font-weight: 600;
}
</style>