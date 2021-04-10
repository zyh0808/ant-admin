<template>
  <div class="cell-choose">
    <a-row type="flex" justify="space-between" class="cell-choose-header">
      <p>
        <span class="cell-choose-title">货位选择</span>
        <span class="cell-selected" v-if="checkedList.length > 0">已选：</span>
        <span class="cell-selected cell-selected-value"
          v-if="checkedList.length > 0">{{checkedList.length}}</span>
      </p>
      <a-row type="flex">
        <div v-for="item in statusList" :key="item.index"
          :class="active=== item.index? 'status-btn active-btn': 'status-btn'"
          @click="changeActive(item.index)">
          <span>{{item.name}}</span>
          <div class="bg-line"></div>
        </div>
      </a-row>
    </a-row>
    <div class="cell-detail">
      <a-row type="flex" justify="space-between">
        <a-col :span="4" v-for="(cell,index) in cellList" :key="index">
          <div :class="cell.checked? 'cell-item cell-checked': 'cell-item'"
            @click="changeChecked(cell)">
            <!-- <a-icon type="check-circle" class="checked-icon"
              v-if="cell.checked" /> -->
            {{cell.cell_code}}
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
const cellList = [
  { cell_code: 'BJ01010010101', checked: false }, { cell_code: 'BJ01010010102', checked: false },
  { cell_code: 'BJ01010010103', checked: false }, { cell_code: 'BJ01010010104', checked: false },
  { cell_code: 'BJ01010010105', checked: false }, { cell_code: 'BJ01010010106', checked: false },
  { cell_code: 'BJ01010010107', checked: false }, { cell_code: 'BJ01010010108', checked: false },
  { cell_code: 'BJ01010010109', checked: false }, { cell_code: 'BJ01010010110', checked: false },
  { cell_code: 'BJ01010010111', checked: false }, { cell_code: 'BJ01010010112', checked: false },
  { cell_code: 'BJ01010010113', checked: false }, { cell_code: 'BJ01010010114', checked: false },
  { cell_code: 'BJ01010010115', checked: false }, { cell_code: 'BJ01010010116', checked: false },
  { cell_code: 'BJ01010010117', checked: false }, { cell_code: 'BJ01010010118', checked: false },
  { cell_code: 'BJ01010010119', checked: false }, { cell_code: 'BJ01010010120', checked: false },
  { cell_code: 'BJ01010010121', checked: false }, { cell_code: 'BJ01010010122', checked: false },
  { cell_code: 'BJ01010010123', checked: false }, { cell_code: 'BJ01010010124', checked: false },
  { cell_code: 'BJ01010010125', checked: false }
]
export default {
  props: {
    statusList: {
      type: Array,
      default: () => []
    },
    activeStatus: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      active: this.activeStatus,
      cellList: cellList,
      checkedList: []
    }
  },
  // computed: {
  //   active: {
  //     get () {
  //       return this.activeStatus
  //     },
  //     set (value) {
  //     }
  //   }
  // },
  methods: {
    changeActive (value) {
      this.active = value
    },
    changeChecked (cell) {
      // if (!cell.checked && this.checkedList.length >= this.max) {
      //   this.$message.error(`最多可选${this.max}个货位`)
      //   return
      // }
      cell = Object.assign(cell, { checked: !cell.checked })
      const index = this.cellList.forEach((item, index) => {
        if (item.cell_code === cell.cell_code) {
          return index
        }
      })
      this.$set(this.cellList, index, cell)
      this.checkedList = this.cellList.filter(item => item.checked === true)
    }
  }
}
</script>

<style lang="less" scoped>
.cell-choose {
  .cell-choose-header {
    padding: 0 10px;
    .cell-choose-title {
      color: #141414;
      font-size: 14px;
      font-weight: 600;
      margin-right: 10px;
    }
    .cell-selected {
      color: red;
      font-size: 14px;
    }
    .cell-selected-value {
      font-weight: 600;
    }
  }
  .cell-detail {
    max-height: 250px;
    overflow: auto;
  }
}
.status-btn {
  cursor: pointer;
  margin-left: 10px;
  span {
    padding: 0 5px;
  }
  .bg-line {
    margin-top: 5px;
    height: 2px;
  }
}
.active-btn {
  span {
    color: #1890ff;
  }
  .bg-line {
    background-color: #1890ff;
  }
}
.checked-icon {
  position: absolute;
  left: 7px;
  top: 7px;
}
.cell-item {
  cursor: pointer;
  width: 100px;
  height: 40px;
  border: 1px solid #f0f0f0;
  color: #262626;
  border-radius: 5px;
  margin: 5px;
  font-size: 12px;
  line-height: 40px;
  text-align: center;
}
.cell-checked {
  background-color: #40a9ff;
  color: #fff;
  border: none;
}
</style>