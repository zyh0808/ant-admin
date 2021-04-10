<template>
  <div class="detail-item">
    <a-descriptions title="" :column="4">
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
      <a-descriptions-item label="储存条件" :span="2">
        {{drug_info.env}}
      </a-descriptions-item>
      <a-descriptions-item label="是否编盲">
        <a-badge v-if="drug_info.op_type === 0" status="error" text="编盲" />
        <a-badge v-else status="success" text="未编盲" />
      </a-descriptions-item>
      <a-descriptions-item label="药品批号">
        {{drug_info.drug_batch}}
      </a-descriptions-item>
      <a-descriptions-item label="有效期至">
        {{drug_info.drug_date}}
      </a-descriptions-item>
      <a-descriptions-item label="任务单数量">
        <span class="info-text click-able"
          @click="showDrug('detail')">{{drug_info.drug_count}}</span>
      </a-descriptions-item>
      <a-descriptions-item label="收货数量">
        <span class="info-text click-able"
          @click="showDrug('detail')">{{drug_info.receive_count}}</span>
      </a-descriptions-item>
      <a-descriptions-item label="预用药品箱">
        {{drug_info.box_kind}}
      </a-descriptions-item>
      <a-descriptions-item label="预用箱数" :span="3">
        {{drug_info.box_count}}
      </a-descriptions-item>
      <a-descriptions-item label="预定货位">
        <span v-for="(item, index) in drug_info.apply_cells" :key="index"
          class="info-text apply-cell">{{item}}</span>
      </a-descriptions-item>
    </a-descriptions>
    <a-drawer :title="drugListTitle" width="250px" :visible="drugDrawerVisible"
      @close="onClose">
      <codeList></codeList>
      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          关闭
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      drug_info: 'allot/drug_info'
    })
  },
  methods: {
    showDrug (mode) {
      this.drugDrawerVisible = true
      this.drugListTitle = mode === 'drug' ? '药品明细' : '收货明细'
    },
    onClose () {
      this.drugDrawerVisible = false
    }
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
    font-size: 12px;
  }
}
/deep/ .ant-drawer-body {
  padding: 0;
  height: calc(100% - 62px);
}
</style>