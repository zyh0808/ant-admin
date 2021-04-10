<template>
  <div class="entry-check">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-check-content">
      <a-card title="订单信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <orderInfoDetail></orderInfoDetail>
      </a-card>
      <a-card title="项目信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <projectInfoDetail></projectInfoDetail>
      </a-card>
      <a-card title="药品信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <drugList style="margin-top:10px; width: 100%" listType="check"
          @showCellApply="showCellApply">
        </drugList>
      </a-card>
    </div>
    <a-modal title="货位预约" :visible="isShowCellApplyModal"
      :confirm-loading="confirmLoading" @ok="handleApply" @cancel="applyCancel"
      :width="700">
      <a-form-model :model="boxInfo" :rules="boxInfoRules"
        :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
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
      <cellView :statusList="statusList" :activeStatus="0" :max="boxInfo.count"
        v-if="boxInfo.boxKind">
      </cellView>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import orderInfoDetail from '@/components/entry/detail/orderInfoDetail.vue'
import projectInfoDetail from '@/components/entry/detail/projectInfoDetail.vue'
import drugList from '@/components/entry/list/drugList'
import cellView from '@/components/entry/cellView'
export default {
  data () {
    return {
      isShowCellApplyModal: false,
      confirmLoading: false,
      boxInfo: {
        boxKind: undefined,
        count: 5
      },
      boxInfoRules: {
        boxKind: [{ required: true, message: '请选择箱型', trigger: 'blur' }]
      },
      statusList: [
        {
          index: 0,
          name: '空闲'
        },
        {
          index: 1,
          name: '占用'
        },
        {
          index: 2,
          name: '锁定'
        }
      ],
      type: '',
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    orderInfoDetail,
    projectInfoDetail,
    drugList,
    cellView
  },
  created () {
    // this.type = this.$route.params.type
    // this.type === 'check' && this.showCellApply()
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_checklist',
      breadcrumbName: '入库订单审核列表'
    },
    {
      path: 'entry_check',
      breadcrumbName: '入库订单审核'
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
    showCellApply () {
      this.isShowCellApplyModal = true
    },
    handleApply () { },
    applyCancel () {
      this.isShowCellApplyModal = false
    }
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
    margin: 0 10px;
  }
}
.box-count-text {
  color: red;
  font-size: 16px;
  font-weight: 600;
}
</style>