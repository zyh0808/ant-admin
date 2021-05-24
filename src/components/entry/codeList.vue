<template>
  <a-drawer title="药品条形码" width="250" :visible="showDrawer" @close="closeDrug" class="code-drawer">
    <a-list>
      <RecycleScroller v-infinite-scroll="appendMore" class="code-list" :items="codeList" :item-size="40" key-field="drug_code" :infinite-scroll-disabled="busy" :infinite-scroll-distance="20">
        <a-list-item slot-scope="{item}">
          {{item.drug_code}}
        </a-list-item>
      </RecycleScroller>
      <div v-if="loading && !busy" class="loading-container">
        <a-spin />
      </div>
    </a-list>
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
      <a-button :style="{ marginRight: '8px' }" @click="closeDrug">
        关闭
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { mapGetters } from 'vuex'
export default {
  directives: { infiniteScroll },
  components: {
    RecycleScroller
  },
  data () {
    return {
      loading: false,
      busy: false,
      showDrawer: false
    }
  },
  computed: {
    ...mapGetters({
      codeList: 'order/codeList'
    })
  },
  methods: {
    appendMore: function () {
      // this.loading = true
      // this.busy = true
      // setTimeout(() => {
      //   const list = getCodeList(20, this.codeList.length)
      //   this.codeList.concat(list)
      //   this.loading = false
      // }, 500);
    },
    showDrugDrawer () {
      this.showDrawer = true
    },
    closeDrug () {
      this.showDrawer = false
    }
  }
}
</script>

<style lang="less" scoped>
.code-list {
  height: calc(100vh - 108px);
  // overflow: auto;
  // border-radius: 4px;
  padding: 8px 24px;
}
.loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
/deep/ .ant-list-item {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8 !important;
}
</style>