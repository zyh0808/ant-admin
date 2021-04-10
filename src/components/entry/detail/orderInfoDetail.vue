<template>
  <div class="detail-item">
    <a-descriptions title="" :column="4">
      <a-descriptions-item label="入库订单号">
        {{orderForm.order_no}}
      </a-descriptions-item>
      <a-descriptions-item label="订单状态">
        {{orderForm.order_status}}
      </a-descriptions-item>
      <a-descriptions-item label="入库仓库">
        {{orderForm.house}}
      </a-descriptions-item>
      <a-descriptions-item label="订单时间">
        {{orderForm.order_time}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      orderForm: 'input/orderForm'
    })
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  margin: 10px;
  background-color: #fff;
  /deep/ .ant-descriptions-row > td {
    padding-bottom: 5px;
  }
  /deep/ .ant-descriptions-row > th {
    padding-bottom: 5px;
  }
}
</style>