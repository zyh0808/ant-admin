<template>
  <div class="order-search-form">
    <a-form-model :model="searchForm" ref="searchFormRef" class="form-content"
      :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="6">
          <a-form-model-item label="入库订单号">
            <a-input v-model="searchForm.drug_in_no" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="项目号">
            <a-input v-model="searchForm.proj_no" placeholder="请输入" allowClear>
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
          <a-form-model-item label="入库仓库">
            <a-input v-model="searchForm.entry_house" placeholder="请输入"
              allowClear>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="showMore">
          <a-form-model-item label="订单时间" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }">
            <a-range-picker v-model="searchForm.orderTime" :format="dateFormat"
              allowClear />
          </a-form-model-item>
        </a-col>
        <a-col :span="6" :offset="showMore? '6': '0'">
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
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex'
const searchForm = {
  drug_in_no: '',
  proj_no: '',
  orderTime: [],
  drug_name: '',
  house_id: ''
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
  computed: {
    ...mapGetters({
      currentStatus: 'order/currentStatus'
    })
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    ...mapActions({
      fetchOrderList: 'order/fetchOrderList'
    }),
    handleSearch () {
      this.getOrderList()
    },
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    getOrderList () {
      const params = {
        drug_in_no: this.searchForm.drug_in_no,
        proj_no: this.searchForm.proj_no,
        drug_name: this.searchForm.drug_name,
        house_id: this.searchForm.house_id,
        start_create_time: this.searchForm.orderTime[0] ? Math.round(new Date(this.searchForm.orderTime[0]).getTime() / 1000) : 0,
        end_create_time: this.searchForm.orderTime[1] ? Math.round(new Date(this.searchForm.orderTime[1]).getTime() / 1000) : 0,
        status: this.currentStatus,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.$emit('changePagination')
        }
      }
      this.fetchOrderList(params)
    }
  }
}
</script>

<style lang="less" scoped>
.order-search-form {
  // border-radius: 5px;
  // margin: 10px 5px 0;
  padding: 10px;
  background-color: #fff;
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>