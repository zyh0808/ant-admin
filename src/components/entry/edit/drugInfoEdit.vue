<template>
  <div class="detail-item">
    <!-- <a-page-header title="药品信息" /> -->
    <a-form-model :model="drugForm" ref="drugFormRef" class="form-content"
      :rules="drugFormRules" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">
      <a-form-model-item label="药品名称" prop="drug_name" ref="drug_name">
        <!-- <a-auto-complete v-model="drugForm.order1" placeholder="请输入"
                @search="onDrugSearch">
                <template slot="dataSource">
                  <a-table :columns="drugColumns" :data-source="dataSource"
                    size="small" />
                </template>
              </a-auto-complete> -->
        <a-popover placement="bottomLeft" :visible="showDrug" trigger="click"
          @visibleChange="handleClickChange">
          <template slot="content">
            <a-table :columns="drugColumns" :data-source="drugList" size="small"
              :rowKey="record => record.drug_id" class="drug-table"
              :pagination="false" :loading="isfetchDrugList" :custom-row="
            (record) => ({
              on: {
                dblclick: () => {
                  selectRow(record)
                  $refs.drug_name.onFieldBlur()
                }
              }
            })
          " />
          </template>
          <a-input v-model="drug_name" placeholder="请输入" @change="searchDrug" />
        </a-popover>
      </a-form-model-item>
      <a-form-model-item label="药品规格">
        <a-input v-model="drugForm.spec" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="药品包装">
        <a-input v-model="drugForm.pck_unit" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="作业模式">
        <a-select v-model="drugForm.op_type" placeholder="请选择" disabled>
          <a-select-option :value=0>
            编盲药
          </a-select-option>
          <a-select-option :value=1>
            非编盲药
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="温度区间">
        <a-input v-model="drugForm.temp_range" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="储存条件">
        <a-input v-model="drugForm.env" placeholder="请输入" disabled>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="药品批号" prop="drug_batch" ref="area_id">
        <a-input v-model="drug_batch" placeholder="请输入">
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="有效期至" prop="drug_date">
        <a-input v-model="drug_date" placeholder="请输入">
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="入库数量" prop="count">
        <a-input-number v-model="count" placeholder="请输入" :min="0">
        </a-input-number>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
const drugColumns = [
  {
    title: '药品名称',
    dataIndex: 'drug_name',
    width: 100,
    ellipsis: true
  }, {
    title: '药品规格',
    dataIndex: 'spec',
    width: 100,
    ellipsis: true
  }, {
    title: '药品包装',
    dataIndex: 'pck_unit',
    width: 100,
    ellipsis: true
  }, {
    title: '作业模式',
    dataIndex: 'op_type_desc',
    width: 100,
    ellipsis: true
  }
]
export default {
  props: {
    pageType: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      // columns,
      drugColumns,
      drugFormRules: {
        drug_name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        drug_batch: [{ required: true, message: '请输入药品批号', trigger: 'blur' }],
        drug_date: [{ required: true, message: '请输入生产日期', trigger: 'blur' }],
        count: [{ required: true, message: '请输入入库数量', trigger: 'blur' }]
      },
      showDrug: false
    }
  },
  computed: {
    ...mapGetters({
      drugList: 'drug/drugList',
      isfetchDrugList: 'drug/isfetchDrugList',
      drugForm: 'input/drugForm'
    }),
    drug_name: {
      get () {
        return this.drugForm.drug_name
      },
      set (val) {
        this.changeDrugForm({ drug_name: val })
      }
    },
    drug_batch: {
      get () {
        return this.drugForm.drug_batch
      },
      set (val) {
        this.changeDrugForm({ drug_batch: val })
      }
    },
    drug_date: {
      get () {
        return this.drugForm.drug_date
      },
      set (val) {
        this.changeDrugForm({ drug_date: val })
      }
    },
    count: {
      get () {
        return this.drugForm.count
      },
      set (val) {
        this.changeDrugForm({ count: val })
      }
    }
  },
  methods: {
    ...mapActions({
      fetchDrugList: 'drug/fetchDrugList'
    }),
    ...mapMutations({
      changeDrugForm: 'input/changeDrugForm'
    }),
    handleClickChange (visible) {
      if (this.drugList.length > 0) {
        this.showDrug = visible
      }
    },
    searchDrug (e) {
      this.fetchDrugList({
        drug_name: this.drugForm.drug_name,
        op_type: -1
      })
    },
    selectRow (info) {
      this.fetchDrugList({
        drug_name: info.drug_name,
        op_type: -1
      })
      this.changeDrugInfo(info)
      this.showDrug = false
    },
    changeDrugInfo (info) {
      const form = {
        drug_name: info.drug_name,
        spec: info.spec,
        pck_unit: info.pck_unit,
        op_type: info.op_type,
        temp_range: info.temp_range,
        env: info.env
      }
      this.changeDrugForm(form)
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
.drug-table {
  width: 500px;
}
.added-drug-table {
  padding: 10px;
}
</style>