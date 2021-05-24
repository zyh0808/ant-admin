<template>
  <div class="task-order-search-form">
    <a-form-model :model="searchForm" ref="searchFormRef" class="form-content" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="6">
          <a-form-model-item label="入库任务单号">
            <a-input v-model="searchForm.task_order_no" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="项目号">
            <a-input v-model="searchForm.project_no" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="药品名称">
            <a-input v-model="searchForm.drug_name" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="入库仓库">
            <a-input v-model="searchForm.entry_house" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="showMore">
          <a-form-model-item label="任务单时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
            <a-range-picker v-model="searchForm.task_order_time" :format="dateFormat" />
          </a-form-model-item>
        </a-col>
        <a-col :span="6" :offset="showMore? '6': '0'">
          <a-form-model-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <div class="search-btns">
              <a-button type="primary" @click="handleSearch">
                查询
              </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                重置
              </a-button>
              <a-button type="link" :style="{ marginLeft: '8px' }" v-if="!showMore" @click="showMore = true">
                更多
              </a-button>
              <a-button type="link" :style="{ marginLeft: '8px' }" v-else @click="showMore = false">
                收起
              </a-button>
            </div>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  data () {
    return {
      moment,
      showMore: false,
      dateFormat: 'YYYY-MM-DD',
      searchForm: {
        task_order_no: '',
        project_no: '',
        task_order_time: [],
        drug_name: '',
        entry_house: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    handleSearch () { },
    handleReset () { }
  }
}
</script>

<style lang="less" scoped>
.task-order-search-form {
  // btask-order-radius: 5px;
  margin: 10px 5px 0;
  padding: 24px 10px 0 10px;
  background-color: #fff;
}
</style>