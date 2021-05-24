<template>
  <a-descriptions title="药品信息" :column="4">
    <a-descriptions-item label="药品名称">
      {{packInfo.drug_name}}
    </a-descriptions-item>
    <a-descriptions-item label="药品批次">
      {{packInfo.batch_no}}
    </a-descriptions-item>
    <a-descriptions-item label="药品规格">
      {{packInfo.spec}}
    </a-descriptions-item>
    <a-descriptions-item label="任务单状态">
      <a-badge v-if="packInfo.packing_task_status === 0" status="error"
        text="待装箱" />
      <a-badge v-else-if="packInfo.packing_task_status === 1" status="error"
        text="装箱中" />
      <a-badge v-else status="success" text="已装箱" />
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      packInfo: 'inhouse/packInfo'
    })
  },
}
</script>

<style>
</style>