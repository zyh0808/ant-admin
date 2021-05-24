<template>
  <div class="task-order-detail">
    <a-descriptions title="任务单信息" :column="2">
      <a-descriptions-item label="任务单号">
        {{taskOrderInfo.order_no}}
      </a-descriptions-item>
      <a-descriptions-item label="任务单状态">
        <a-badge v-if="taskOrderInfo.order_status === '待确认'" status="error" text="待确认" />
        <a-badge v-else status="success" text="已确认" />
      </a-descriptions-item>
      <a-descriptions-item label="任务单时间">
        {{taskOrderInfo.order_time}}
      </a-descriptions-item>
      <a-descriptions-item label="入库仓库">
        {{taskOrderInfo.house}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方编码">
        {{taskOrderInfo.client_code}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方名称">
        {{taskOrderInfo.client_name}}
      </a-descriptions-item>
      <a-descriptions-item label="项目名称" :span="2">
        {{taskOrderInfo.pro_name}}
      </a-descriptions-item>
      <a-descriptions-item label="项目号">
        {{taskOrderInfo.pro_no}}
      </a-descriptions-item>
      <a-descriptions-item label="付费账号">
        {{taskOrderInfo.pay_count}}
      </a-descriptions-item>
      <a-descriptions-item label="药品名称" :span="2">
        {{taskOrderInfo.drug_name}}
      </a-descriptions-item>
      <a-descriptions-item label="药品规格">
        {{taskOrderInfo.spec}}
      </a-descriptions-item>
      <a-descriptions-item label="药品批号">
        {{taskOrderInfo.drug_batch}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{taskOrderInfo.drug_date}}
      </a-descriptions-item>
      <a-descriptions-item label="原药品包装">
        {{taskOrderInfo.drug_pack}}
      </a-descriptions-item>
      <a-descriptions-item label="原药品数量">
        <span class="info-text click-able" @click="showDrug('detail')">{{taskOrderInfo.drug_count}}</span>
      </a-descriptions-item>
      <a-descriptions-item label="收货数量">
        <span class="info-text click-able" @click="showDrug('receive')">{{taskOrderInfo.receiveCount}}</span>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <a-descriptions title="确认收货信息" :column="2" class="confirm-info">
      <a-descriptions-item label="确认后数量">
        <span class="important-text">{{taskOrderInfo.confirmCount}}</span>
      </a-descriptions-item>
      <a-descriptions-item label="确认后包装">
        <span class="important-text">{{taskOrderInfo.confirmPacket}}</span>
      </a-descriptions-item>
      <a-descriptions-item label="确认人工号">
        {{taskOrderInfo.confirm_user_id}}
      </a-descriptions-item>
      <a-descriptions-item label="确认人姓名">
        {{taskOrderInfo.confirm_user_name}}
      </a-descriptions-item>
      <a-descriptions-item label="确认时间">
        {{taskOrderInfo.confirm_time}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      taskOrderInfo: 'input/taskOrderInfo'
    })
  },
  mounted () {
  },
  methods: {
    showDrug (mode) {
      this.$emit("showDrug", mode)
    }
  }
}
</script>

<style lang="less" scoped>
.task-order-detail {
  margin: 10px;
  background-color: #fff;
  // /deep/ .ant-descriptions-row > td {
  //   padding-bottom: 0;
  // }
  // /deep/ .ant-descriptions-row > th {
  //   padding-bottom: 0;
  // }
}
</style>