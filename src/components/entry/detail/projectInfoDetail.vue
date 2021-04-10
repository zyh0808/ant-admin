<template>
  <div class="detail-item">
    <a-descriptions title="" :column="4">
      <a-descriptions-item label="申办方编码">
        {{projectForm.client_code}}
      </a-descriptions-item>
      <a-descriptions-item label="申办方名称" :span="2">
        {{projectForm.client_name}}
      </a-descriptions-item>
      <a-descriptions-item label="项目负责人">
        {{projectForm.proj_person}}
      </a-descriptions-item>
      <a-descriptions-item label="项目号">
        {{projectForm.proj_no}}
      </a-descriptions-item>
      <a-descriptions-item label="项目名称">
        {{projectForm.proj_name}}
      </a-descriptions-item>
      <a-descriptions-item label="付费账号">
        {{projectForm.paid_account_id}}
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        {{projectForm.proj_phone}}
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
      projectForm: 'input/projectForm'
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
  // padding: 10px;
  /deep/ .ant-descriptions-row > td {
    padding-bottom: 5px;
  }
  /deep/ .ant-descriptions-row > th {
    padding-bottom: 5px;
  }
}
</style>