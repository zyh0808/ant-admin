<template>
  <!-- 上架任务单明细 -->
  <div v-if="!upInfo.onshelf_task_no">
    <a-empty :image="simpleImage" />
  </div>
  <div class="packUpDetail" v-else>
    <a-descriptions :column="2">
      <a-descriptions-item label="上架任务号"
        :span="2">
        {{upInfo.onshelf_task_no}}
      </a-descriptions-item>
      <a-descriptions-item label="上架任务状态"
        :span="2">
        <a-badge
          v-if="upInfo.onshelf_task_status === 0"
          status="error" text="未上架" />
        <a-badge
          v-else-if="upInfo.onshelf_task_status === 1"
          status="error" text="上架中" />
        <a-badge v-else status="success"
          text="已上架" />
      </a-descriptions-item>
      <a-descriptions-item label="需上架数量"
        v-if="upInfo.onshelf_cnt">
        {{upInfo.onshelf_cnt}}
      </a-descriptions-item>
      <a-descriptions-item label="已装数量"
        v-if="upInfo.already_onshelf_cnt">
        {{upInfo.already_onshelf_cnt}}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <a-descriptions :column="2">
      <a-descriptions-item label="药品名称" :span="2">
        {{upInfo.drug_name}}
      </a-descriptions-item>
      <a-descriptions-item label="药品批次号"
        :span="2">
        {{upInfo.batch_no}}
      </a-descriptions-item>
      <a-descriptions-item label="是否编盲">
        <a-tag color="red"
          v-if="upInfo.op_type === 1">
          编盲药
        </a-tag>
        <a-tag color="red"
          v-if="upInfo.op_type === 0">
          非编盲药
        </a-tag>
        <!-- <a-badge v-if="packUpInfo.op_type === 0" status="error" text="非编盲药" />
        <a-badge v-else status="success" text="编盲药" /> -->
      </a-descriptions-item>
      <a-descriptions-item label="药品规格">
        {{upInfo.spec}}
      </a-descriptions-item>
      <a-descriptions-item label="药品包装">
        {{upInfo.pck_unit}}
      </a-descriptions-item>
      <a-descriptions-item label="存储条件">
        {{upInfo.env}}
      </a-descriptions-item>
      <a-descriptions-item label="温度区间">
        {{upInfo.temp_range}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{upInfo.exp_date}}
      </a-descriptions-item>
      <a-descriptions-item label="所需药品箱种类">
        {{upInfo.box_kind_name}}
      </a-descriptions-item>
      <!-- <a-descriptions-item label="所需药品箱个数">
        {{upInfo.box_cnt}}
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
      upInfo: 'inhouse/upInfo'
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