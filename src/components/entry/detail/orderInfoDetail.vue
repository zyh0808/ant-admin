<template>
  <div class="detail-item">
    <a-descriptions title="订单信息" :column="2">
      <a-descriptions-item label="入库订单号" :span="2">
        {{orderInfo.drug_in_no}}
      </a-descriptions-item>
      <a-descriptions-item label="订单状态">
        <a-badge v-if="orderInfo.status === 1" status="error" text="待审核" />
        <a-badge v-else-if="orderInfo.status === 2" status="error" text="待收货" />
        <a-badge v-else-if="orderInfo.status === 4" status="error" text="待收货确认" />
        <a-badge v-else-if="orderInfo.status === 5" status="success" text="已收货" />
      </a-descriptions-item>
      <a-descriptions-item label="订单时间">
        {{ moment(orderInfo.in_ts * 1000).format('YYYY-MM-DD HH:mm:ss')}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data () {
    return {
      moment
    }
  },
  computed: {
    ...mapGetters({
      orderInfo: 'order/orderInfo'
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