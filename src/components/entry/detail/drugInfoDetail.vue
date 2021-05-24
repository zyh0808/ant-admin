<template>
  <div class="detail-item">
    <a-descriptions title="药品信息" :column="2">
      <a-descriptions-item label="药品名称" :span="2">
        {{drug_info.drug_name}}
      </a-descriptions-item>
      <a-descriptions-item label="药品规格">
        {{drug_info.spec}}
      </a-descriptions-item>
      <a-descriptions-item label="药品包装">
        {{drug_info.pck_unit}}
      </a-descriptions-item>
      <a-descriptions-item label="温度区间">
        {{drug_info.temp_range}}
      </a-descriptions-item>
      <a-descriptions-item label="储存条件">
        {{drug_info.env}}
      </a-descriptions-item>
      <a-descriptions-item label="是否编盲">
        <a-tag color="red" v-if="drug_info.op_type === 1">
          编盲药
        </a-tag>
        <a-tag color="red" v-if="drug_info.op_type === 0">
          非编盲药
        </a-tag>
        <!-- <a-badge v-if="drug_info.op_type === 0" status="success" text="非编盲药" />
        <a-badge v-else status="error" text="编盲药" /> -->
      </a-descriptions-item>
      <a-descriptions-item label="药品批号">
        {{drug_info.batch_no}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{drug_info.exp_date}}
      </a-descriptions-item>
      <a-descriptions-item label="确认收货数量">
        <span class="info-text click-able" @click="showDrug(drug_info.drug_in_detail_id)">{{drug_info.receive_cnt}}</span>
      </a-descriptions-item>
      <a-descriptions-item label="预用药品箱">
        {{drug_info.box_kind_name}}
      </a-descriptions-item>
      <a-descriptions-item label="预用箱数">
        {{drug_info.box_cnt}}
      </a-descriptions-item>
    </a-descriptions>
    <p>预定货位:
      <span class="info-text" v-for="(item, index) in drug_info.shelfcelllist" :key="index" style="margin-right:10px">{{ item.shelf_cell }}</span>
    </p>
    <codeList ref="codeListRef"></codeList>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import codeList from '@/components/entry/codeList.vue'
export default {
  data () {
    return {
      drugDrawerVisible: false,
      drugListTitle: ''
    }
  },
  components: {
    codeList
  },
  computed: {
    ...mapGetters({
      packUpInfo: 'inhouse/packUpInfo'
    }),
    drug_info () {
      return this.packUpInfo ? this.packUpInfo : {}
    }
  },
  methods: {
    ...mapActions({
      fetchCodeList: 'order/fetchCodeList'
    }),
    showDrug () {
      this.fetchCodeList({ drug_in_detail_id })
      this.$refs.codeListRef.showDrugDrawer()
    }
  }
}
</script>

<style lang="less" scoped>
.detail-item {
  margin: 10px;
  background-color: #fff;
  .cell-tags {
    width: 370px;
    .cell-tag {
      margin-bottom: 10px;
      // font-size: 12px;
    }
  }
}
/deep/ .ant-drawer-body {
  padding: 0;
  height: calc(100% - 62px);
  // height: 100%;
}
</style>