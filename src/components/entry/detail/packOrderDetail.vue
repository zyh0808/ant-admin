<template>
  <!-- 装箱任务单明细 -->
  <div v-if="!packInfo.packing_task_no">
    <a-empty :image="simpleImage" />
  </div>
  <div class="packUpDetail" v-else>
    <a-descriptions :column="2">
      <a-descriptions-item label="装箱任务号" :span="2">
        {{packInfo.packing_task_no}}
      </a-descriptions-item>
      <a-descriptions-item label="装箱任务状态" :span="2">
        <a-badge v-if="packInfo.packing_task_status === 0" status="error"
          text="未装箱" />
        <a-badge v-else-if="packInfo.packing_task_status === 1" status="error"
          text="装箱中" />
        <a-badge v-else status="success" text="已装箱" />
      </a-descriptions-item>
      <a-descriptions-item label="需装箱数量" v-if="packInfo.packing_cnt">
        {{packInfo.packing_cnt}}
      </a-descriptions-item>
      <a-descriptions-item label="已装数量" v-if="packInfo.already_packing_cnt">
        {{packInfo.already_packing_cnt}}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <a-descriptions :column="2">
      <a-descriptions-item label="药品名称" :span="2">
        {{packInfo.drug_name}}
      </a-descriptions-item>
      <a-descriptions-item label="药品批次号" :span="2">
        {{packInfo.batch_no}}
      </a-descriptions-item>
      <a-descriptions-item label="是否编盲">
        <a-tag color="red" v-if="packInfo.op_type === 1">
          编盲药
        </a-tag>
        <a-tag color="red" v-if="packInfo.op_type === 0">
          非编盲药
        </a-tag>
        <!-- <a-badge v-if="packUpInfo.op_type === 0" status="error" text="非编盲药" />
        <a-badge v-else status="success" text="编盲药" /> -->
      </a-descriptions-item>
      <a-descriptions-item label="药品规格">
        {{packInfo.spec}}
      </a-descriptions-item>
      <a-descriptions-item label="药品包装">
        {{packInfo.pck_unit}}
      </a-descriptions-item>
      <a-descriptions-item label="存储条件">
        {{packInfo.env}}
      </a-descriptions-item>
      <a-descriptions-item label="温度区间">
        {{packInfo.temp_range}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{packInfo.exp_date}}
      </a-descriptions-item>
      <a-descriptions-item label="所需药品箱种类">
        {{packInfo.box_kind_name}}
      </a-descriptions-item>
      <!-- <a-descriptions-item label="所需药品箱个数">
        {{packInfo.box_cnt}}
      </a-descriptions-item> -->
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
      packInfo: 'inhouse/packInfo'
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