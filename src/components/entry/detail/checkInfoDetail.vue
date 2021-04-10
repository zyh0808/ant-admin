<template>
  <div class="detail-item">
    <a-descriptions title="" :column="4">
      <a-descriptions-item label="审核结果">
        {{checkForm.check_result}}
      </a-descriptions-item>
      <a-descriptions-item label="审核人工号">
        {{checkForm.checker_id}}
      </a-descriptions-item>
      <a-descriptions-item label="审核人">
        {{checkForm.checker_name}}
      </a-descriptions-item>
      <a-descriptions-item label="审核时间">
        {{checkForm.check_time}}
      </a-descriptions-item>
      <a-descriptions-item label="预约货位" :span="4">
        <span v-for="(cell,index) in checkForm.apply_cells" :key="index"
          class="apply-cell">{{cell}}</span>
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
      checkForm: 'input/checkForm'
    })
  },
  mounted () {
  },
  methods: {
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
  .apply-cell {
    margin-right: 10px;
    color: #69c0ff;
    cursor: pointer;
  }
}
</style>