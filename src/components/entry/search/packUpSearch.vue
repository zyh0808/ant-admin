<template>
  <div class="pack-up-search-form">
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
        <!-- <a-col :span="6">
          <a-form-model-item label="入库任务单号">
            <a-input v-model="searchForm.task_order_no" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="6">
          <a-form-model-item label="装箱分配状态">
            <a-select v-model="searchForm.packing_status" placeholder="请选择"
              allowClear>
              <a-select-option :value="0">
                未分配
              </a-select-option>
              <a-select-option :value="1">
                已分配
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="上架分配状态">
            <a-select v-model="searchForm.onshelf_status" placeholder="请选择"
              allowClear>
              <a-select-option :value="0">
                未分配
              </a-select-option>
              <a-select-option :value="1">
                已分配
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="项目号">
            <a-input v-model="searchForm.proj_no" placeholder="请输入" allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="药品名称">
            <a-input v-model="searchForm.drug_name" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="任务单时间">
            <a-range-picker v-model="searchForm.task_order_time"
              :format="dateFormat" allowClear />
          </a-form-model-item>
        </a-col>
        <a-col :span="6" :offset="showMore ? 6 : 0">
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
  proj_no: '',
  task_order_time: [],
  drug_name: '',
  house_id: undefined,
  packing_status: undefined,
  onshelf_status: undefined
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
    this.getPackUpList()
  },
  computed: {
    ...mapGetters({
      houseList: 'house/houseList'
    })
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList',
      fetchPackUpList: 'inhouse/fetchPackUpList'
    }),
    getPackUpList () {
      const params = {
        proj_no: this.searchForm.proj_no,
        drug_name: this.searchForm.drug_name,
        house_id: this.searchForm.house_id,
        in_ts_start: this.searchForm.task_order_time[0] ? Math.round(new Date(this.searchForm.task_order_time[0]).getTime() / 1000) : 0,
        in_ts_end: this.searchForm.task_order_time[1] ? Math.round(new Date(this.searchForm.task_order_time[1]).getTime() / 1000) : 0,
        packing_status: this.searchForm.packing_status !== undefined ? this.searchForm.packing_status : -1,
        onshelf_status: this.searchForm.onshelf_status !== undefined ? this.searchForm.onshelf_status : -1,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.$emit('changePagination')
        }
      }
      this.fetchPackUpList(params)
    },
    handleSearch () {
      this.getPackUpList()
    },
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    }
  }
}
</script>

<style lang="less" scoped>
.pack-up-search-form {
  // btask-order-radius: 5px;
  // margin: 10px 5px 0;
  padding: 24px 10px 0 10px;
  background-color: #fff;
}
</style>