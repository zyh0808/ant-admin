<template>
  <div class="task-order-search-form">
    <a-form-model :model="searchForm" ref="searchFormRef" class="form-content"
      :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="6">
          <a-form-model-item label="入库仓库">
            <a-select v-model="searchForm.house_id" placeholder="请选择"
              allowClear>
              <a-select-option v-for="item in houseList" :key="item.house_id"
                :value="item.house_id">
                {{ item.house_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="上架任务单号">
            <a-input v-model="searchForm.onshelf_task_no" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="药品名称">
            <a-input v-model="searchForm.drug_name" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="上架人工号">
            <a-input v-model="searchForm.person_id" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="上架人姓名">
            <a-input v-model="searchForm.person_name" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="showMore">
          <a-form-model-item label="任务单时间" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }">
            <a-range-picker v-model="searchForm.task_order_time"
              :format="dateFormat" allowClear />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }">
            <div class="search-btns">
              <a-button type="primary" @click="handleSearch">
                查询
              </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                重置
              </a-button>
              <a-button type="link" :style="{ marginLeft: '8px' }"
                v-if="!showMore" @click="showMore = true">
                更多
              </a-button>
              <a-button type="link" :style="{ marginLeft: '8px' }" v-else
                @click="showMore = false">
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
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
const searchForm = {
  onshelf_task_no: '',
  house_id: undefined,
  onshelf_task_status: -1,
  person_id: null,
  person_name: '',
  drug_name: '',
  task_order_time: []
}
export default {
  props: {
    pagination: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      moment,
      showMore: false,
      dateFormat: 'YYYY-MM-DD',
      searchForm: {
        ...searchForm
      }
    }
  },
  mounted () {
    this.fetchHouseList({
      house_id: ''
    })
    this.getUpList()
  },
  computed: {
    ...mapGetters({
      houseList: 'house/houseList',
      currentStatus: 'inhouse/currentUpStatus'
    })
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList',
      fetchUpList: 'inhouse/fetchUpList'
    }),
    getUpList () {
      const params = {
        drug_name: this.searchForm.drug_name,
        house_id: this.searchForm.house_id,
        create_time_start: this.searchForm.task_order_time[0] ? Math.round(new Date(this.searchForm.task_order_time[0]).getTime() / 1000) : 0,
        create_time_end: this.searchForm.task_order_time[1] ? Math.round(new Date(this.searchForm.task_order_time[1]).getTime() / 1000) : 0,
        onshelf_task_no: this.searchForm.onshelf_task_no,
        onshelf_task_status: this.currentStatus,
        person_id: this.searchForm.person_id ? parseInt(this.searchForm.person_id) : 0,
        person_name: this.searchForm.person_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.$emit('changePagination')
        }
      }
      this.fetchUpList(params)
    },
    handleSearch () {
      this.getUpList()
    },
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    }
  }
}
</script>

<style lang="less" scoped>
.task-order-search-form {
  // btask-order-radius: 5px;
  // margin: 10px 5px 0;
  padding: 24px 10px 0 10px;
  background-color: #fff;
}
</style>