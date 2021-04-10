<template>
  <div class="order-search-form">
    <a-form-model :model="orderSearchForm" ref="orderSearchFormRef"
      class="form-content" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="6">
          <a-form-model-item label="入库订单号">
            <a-input v-model="orderSearchForm.order_no" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="项目号">
            <a-input v-model="orderSearchForm.project_no" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="药品名称">
            <a-input v-model="orderSearchForm.drug_name" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" v-if="showMore">
          <a-form-model-item label="入库仓库">
            <a-input v-model="orderSearchForm.entry_house" placeholder="请输入">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="showMore">
          <a-form-model-item label="订单时间" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }">
            <a-range-picker v-model="orderSearchForm.orderTime"
              :format="dateFormat" />
          </a-form-model-item>
        </a-col>
        <a-col :span="6" :offset="showMore? '6': '0'">
          <a-row type="flex" justify="end" style="marginTop:4px">
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
          </a-row>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      moment,
      showMore: false,
      dateFormat: 'YYYY-MM-DD',
      orderSearchForm: {
        order_no: '',
        project_no: '',
        orderTime: [],
        drug_name: '',
        entry_house: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList'
    }),
    ...mapMutations({
      changeOrderSearchForm: 'check/changeOrderSearchForm'
    }),
    handleSearch () {
    },
    handleReset () { }
  }
}
</script>

<style lang="less" scoped>
.order-search-form {
  // border-radius: 5px;
  margin: 10px 5px 0;
  padding: 24px 10px 0 10px;
  background-color: #fff;
}
</style>