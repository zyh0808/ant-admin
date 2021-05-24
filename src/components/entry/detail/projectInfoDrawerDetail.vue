<template>
  <div class="detail-item">
    <a-descriptions title="项目信息" :column="2">
      <a-descriptions-item label="项目号" :span="2">
        {{orderInfo.proj_no}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方名称">
        {{orderInfo.client_name}}
      </a-descriptions-item>
      <a-descriptions-item label="仓库名称">
        {{orderInfo.house_name}}
      </a-descriptions-item>
      <!-- <a-descriptions-item label="来源">
        {{orderInfo.source_name}}
      </a-descriptions-item> -->
      <a-descriptions-item label="药品总数量" :span="2">
        {{orderInfo.in_sumcnt}}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{orderInfo.memo}}
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions v-for="drug in orderDrugList" :key="drug.drug_in_detail_id"
      :title="drug.drug_name" :column="2">
      <a-descriptions-item label="批次号">
        {{drug.batch_no}}
      </a-descriptions-item>
      <a-descriptions-item label="药品规格">
        {{drug.spec}}
      </a-descriptions-item>
      <a-descriptions-item label="是否编盲">
        <a-tag color="red" v-if="drug.op_type === 1">
          编盲药
        </a-tag>
        <a-tag color="red" v-if="drug.op_type === 0">
          非编盲药
        </a-tag>
        <!-- <a-badge v-if="drug.op_type === 0" status="success" text="非编盲药" />
        <a-badge v-else status="error" text="编盲药" /> -->
      </a-descriptions-item>
      <a-descriptions-item label="药品包装">
        {{drug.unit}}
      </a-descriptions-item>
      <a-descriptions-item label="保存条件">
        {{drug.env}}
      </a-descriptions-item>
      <a-descriptions-item label="温度区间">
        {{drug.temp_range}}
      </a-descriptions-item>
      <a-descriptions-item label="药品数量">
        {{drug.in_cnt}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{drug.exp_date}}
      </a-descriptions-item>
      <a-descriptions-item label="收货数量" v-if="drug.receive_cnt">
        {{drug.receive_cnt}}
      </a-descriptions-item>
      <a-descriptions-item label="收货包装" v-if="drug.receive_unit">
        {{drug.receive_unit}}
      </a-descriptions-item>
      <a-descriptions-item label="收货承运单号" v-if="drug.carrierno" :span="2">
        {{drug.carrierno}}
      </a-descriptions-item>
      <a-descriptions-item label="收货温度计" v-if="drug.temp_id" :span="2">
        {{drug.temp_id}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      orderInfo: 'order/orderInfo',
      orderDrugList: 'order/orderDrugList'
    })
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  margin: 10px;
  background-color: #fff;
}
</style>