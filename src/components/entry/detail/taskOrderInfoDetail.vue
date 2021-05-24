<template>
  <div class="detail-item">
    <a-descriptions title="任务单信息" :column="4">
      <a-descriptions-item label="入库任务单号">
        {{order_info.order_no}}
      </a-descriptions-item>
      <a-descriptions-item label="订单状态">
        {{order_info.order_status}}
      </a-descriptions-item>
      <a-descriptions-item label="入库仓库">
        {{order_info.house}}
      </a-descriptions-item>
      <a-descriptions-item label="订单时间">
        {{order_info.order_time}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      order_info: 'allot/order_info'
    })
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  margin: 10px;
  background-color: #fff;
  // /deep/ .ant-descriptions-row > td {
  //   padding-bottom: 5px;
  // }
  // /deep/ .ant-descriptions-row > th {
  //   padding-bottom: 5px;
  // }
}
</style>