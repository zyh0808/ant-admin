<template>
  <div class="detail-item">
    <a-form-model :model="orderForm" ref="orderFormRef" class="form-content"
      :rules="orderFormRules" :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
      <a-form-model-item label="入库订单号">
        <a-input v-model="orderForm.order_no" placeholder="自动生成" disabled>
        </a-input>
      </a-form-model-item>
      <!-- <a-form-model-item label="订单状态">
        <a-select v-model="orderForm.order_status" disabled>
          <a-select-option v-for="item in entryOrderStatusList"
            :value="item.item_value" :key="item.item_value">
            {{item.item_name}}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
      <a-form-model-item label="入库仓库" prop="house">
        <a-auto-complete v-model="house" placeholder="请输入"
          :data-source="selectHouseList" @select="onHouseSelect"
          @search="onHouseSearch">
        </a-auto-complete>
      </a-form-model-item>
      <!-- <a-form-model-item label="订单时间">
        <a-input v-model="orderForm.order_time" placeholder="请选择" disabled>
        </a-input>
      </a-form-model-item> -->
    </a-form-model>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
// import { ENTRY_PAGE_TYPE } from '@/js/global.js'
export default {
  props: {
    mode: {
      type: String,
      default: 'input'
    }
  },
  data () {
    return {
      orderFormRules: {
        house: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      houseList: 'house/houseList',
      entryOrderStatusList: 'dictionary/entryOrderStatusList',
      orderForm: 'input/orderForm'
    }),
    selectHouseList () {
      return this.houseList ? this.houseList.map(item => item.house_name) : []
    },
    house: {
      get () {
        return this.orderForm.house
      },
      set (val) {
        this.changeOrderForm({ house: val })
      }
    }
  },
  mounted () {
    // this.fetchEntryOrderStatusList({
    //   parent_value: '1000',
    //   kind_code: '',
    //   is_disabled: -1,
    // })
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList',
      // fetchEntryOrderStatusList: 'dictionary/fetchEntryOrderStatusList'
    }),
    ...mapMutations({
      changeOrderForm: 'input/changeOrderForm'
    }),
    onHouseSelect (value) {
      this.orderForm.order3 = value
      this.fetchHouseList({
        house_id: '',
        house_name: value
      })
      this.$emit('changeCommit', { value })
    },
    onHouseSearch (value) {
      this.fetchHouseList({
        house_id: '',
        house_name: value
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  // border-radius: 5px;
  margin: 10px 5px 0;
  background-color: #fff;
  .ant-page-header {
    padding: 5px 20px;
  }
  /deep/ .ant-page-header-heading-title {
    font-size: 14px;
  }
  .form-content {
    padding: 0 20px;
    // .ant-form-item {
    //   margin-bottom: 10px;
    // }
  }
}
</style>