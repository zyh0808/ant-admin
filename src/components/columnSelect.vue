<template>
  <a-popover trigger="click" placement="bottomRight">
    <template slot="title">
      <a-row type="flex" justify="space-between">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll"
          @change="onCheckAllChange">
          列选项
        </a-checkbox>
        <a-button type="link" size="small" @click="resetColumns">
          重置
        </a-button>
      </a-row>
    </template>
    <template slot="content">
      <a-checkbox-group v-model="checkedList" @change="onChange">
        <!-- <span slot="label" slot-scope="{ title }">{{ title }}</span> -->
        <a-row v-for="item in plainOptions" :key="item.value"
          class="checkbox-row">
          <a-checkbox :value="item.value" name="columnSelect">
            {{ item.title }}
          </a-checkbox>
        </a-row>
      </a-checkbox-group>
    </template>
    <a-button type="dashed" icon="setting" />
  </a-popover>
</template>
<script>
export default {
  props: {
    plainOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      indeterminate: false,
      checkAll: true,
      checkedList: []
    }
  },
  created () {
    this.checkedList = this.plainOptions.map(item => item.value)
  },
  methods: {
    resetColumns () {
      this.checkedList = this.plainOptions.map(item => item.value)
      this.$emit('changeColumns', this.plainOptions)
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
      let checkedColumns = []
      this.plainOptions.forEach(option => {
        checkedList.forEach(item => {
          option.value === item && checkedColumns.push(option)
        })
      })
      this.$emit('changeColumns', checkedColumns)
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        indeterminate: false,
        checkedList: e.target.checked ? this.plainOptions.map(item => item.value) : [],
        checkAll: e.target.checked
      })
      let checkedColumns = []
      this.plainOptions.forEach(option => {
        this.checkedList.forEach(item => {
          option.value === item && checkedColumns.push(option)
        })
      })
      this.$emit('changeColumns', checkedColumns)
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/ .checkbox-row {
//   height: 30px;
//   line-height: 30px;
// }
</style>
