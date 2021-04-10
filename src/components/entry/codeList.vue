<template>
  <a-list>
    <RecycleScroller v-infinite-scroll="appendMore" class="code-list"
      :items="codeList" :item-size="40" key-field="code"
      :infinite-scroll-disabled="busy" :infinite-scroll-distance="20">
      <a-list-item slot-scope="{item}">
        {{item.code}}
      </a-list-item>
    </RecycleScroller>
    <div v-if="loading && !busy" class="loading-container">
      <a-spin />
    </div>
  </a-list>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { PrefixInteger } from '@/js/utils.js'
function getCodeList (num, startIndex) {
  let list = []
  for (let i = startIndex; i < startIndex + num; i++) {
    const fixedNum = PrefixInteger(i, 5)
    const code = `code${fixedNum}`
    list.push({ key: i + '', code })
  }
  return list
}
const codeList = getCodeList(10000, 0)
// console.log(codeList)
export default {
  directives: { infiniteScroll },
  components: {
    RecycleScroller
  },
  props: {
    codeType: {
      type: String,
      default: 'drug'
    }
  },
  data () {
    return {
      codeList,
      loading: false,
      busy: false
    }
  },
  methods: {
    appendMore: function () {
      this.loading = true
      this.busy = true
      setTimeout(() => {
        const list = getCodeList(20, this.codeList.length)
        this.codeList.concat(list)
        this.loading = false
      }, 500);
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