<template>
  <!-- 装箱上架任务单明细 -->
  <div v-if="!packUpInfo.drug_name">
    <a-empty :image="simpleImage" />
  </div>
  <div class="packUpDetail" v-else>
    <a-descriptions :column="2">
      <a-descriptions-item label="药品名称" :span="2">
        {{packUpInfo.drug_name}}
      </a-descriptions-item>
      <a-descriptions-item label="药品批次号">
        {{packUpInfo.batch_no}}
      </a-descriptions-item>
      <a-descriptions-item label="是否编盲">
        <a-tag color="red" v-if="packUpInfo.op_type === 1">
          编盲药
        </a-tag>
        <a-tag color="red" v-if="packUpInfo.op_type === 0">
          非编盲药
        </a-tag>
        <!-- <a-badge v-if="packUpInfo.op_type === 0" status="error" text="非编盲药" />
        <a-badge v-else status="success" text="编盲药" /> -->
      </a-descriptions-item>
      <a-descriptions-item label="装箱状态">
        <a-badge v-if="packUpInfo.packing_status === 0" status="error" text="未分配" />
        <a-badge v-else status="success" text="已分配" />
      </a-descriptions-item>
      <a-descriptions-item label="上架状态">
        <a-badge v-if="packUpInfo.onshelf_status === 0" status="error" text="未分配" />
        <a-badge v-else status="success" text="已分配" />
      </a-descriptions-item>
      <a-descriptions-item label="药品规格">
        {{packUpInfo.spec}}
      </a-descriptions-item>
      <a-descriptions-item label="药品包装">
        {{packUpInfo.pck_unit}}
      </a-descriptions-item>
      <a-descriptions-item label="存储条件">
        {{packUpInfo.env}}
      </a-descriptions-item>
      <a-descriptions-item label="温度区间">
        {{packUpInfo.temp_range}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{packUpInfo.exp_date}}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <a-descriptions :column="2">
      <a-descriptions-item label="药品箱名称">
        {{packUpInfo.box_kind_name}}
      </a-descriptions-item>
      <a-descriptions-item label="所需药品箱个数">
        {{packUpInfo.box_cnt}}
      </a-descriptions-item>
      <a-descriptions-item label="确认收货数量">
        {{packUpInfo.receive_cnt}}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <a-descriptions :column="2">
      <a-descriptions-item label="入库订单号">
        {{packUpInfo.drug_in_no}}
      </a-descriptions-item>
      <a-descriptions-item label="入库仓库">
        {{packUpInfo.house_name}}
      </a-descriptions-item>
      <a-descriptions-item label="项目号">
        {{packUpInfo.proj_no}}
      </a-descriptions-item>
      <a-descriptions-item label="项目名称">
        {{packUpInfo.proj_name}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方">
        {{packUpInfo.client_name}}
      </a-descriptions-item>
      <a-descriptions-item label="付费账号">
        {{packUpInfo.paid_name}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方联系人">
        {{packUpInfo.linkman}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方联系电话">
        {{packUpInfo.phone}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Empty } from 'ant-design-vue'
export default {
  beforeCreate () {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  computed: {
    ...mapGetters({
      packUpInfo: 'inhouse/packUpInfo'
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