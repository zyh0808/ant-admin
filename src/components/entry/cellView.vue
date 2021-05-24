<template>
  <div class="cell-choose">
    <a-row type="flex" justify="space-between" class="cell-choose-header">
      <p>
        <span class="cell-choose-title">货位选择</span>
        <span class="cell-selected" v-if="checkedList.length > 0">已选：</span>
        <span class="cell-selected cell-selected-value" v-if="checkedList.length > 0">{{checkedList.length}}</span>
      </p>
      <a-row type="flex">
        <div v-for="item in statusList" :key="item.index" :class="active=== item.index? 'status-btn active-btn': 'status-btn'" @click="changeActive(item.index)">
          <span>{{item.name}}</span>
          <div class="bg-line"></div>
        </div>
      </a-row>
    </a-row>
    <a-divider></a-divider>
    <div class="cell-detail">
      <!-- <a-row type="flex" justify="space-between">
        <a-col :span="6" v-for="(shelf,index) in cellList" :key="index" class="shelf-box">
          <p style="margin-left:10px" class="header-text">货架号:<span class="header-text">{{' ' + shelf.shelf_code}}</span></p>
          
        </a-col>
      </a-row> -->
      <a-row v-if="cellList.length !== 0">
        <a-col :span="3" v-for="(cell,index) in cellList" :key="index">
          <div :class="cell.checked ? 'cell-item cell-checked': 'cell-item'" @click="changeChecked(cell)">
            <!-- <a-icon type="check-circle" class="checked-icon"
              v-if="cell.checked" /> -->
            {{ cell.shelf_cell_id.slice(10, 14) }}
          </div>
        </a-col>
      </a-row>
      <a-empty v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  // props: {
  //   statusList: {
  //     type: Array,
  //     default: () => []
  //   },
  //   activeStatus: {
  //     type: Number,
  //     default: 0
  //   },
  //   max: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  data () {
    return {
      active: 0,
      checkedList: []
    }
  },
  computed: {
    ...mapGetters({
      statusList: 'house/cellStatusArray',
      cellListStore: 'house/cellList'
    }),
    cellList () {
      return this.cellListStore ? this.cellListStore.map(item => {
        let cell = { ...item }
        cell.checked = false
        return cell
      }) : []
    }
  },
  methods: {
    changeActive (value) {
      this.active = value
      this.$emit('handleCellStatusChange', value)
    },
    changeChecked (cell) {
      cell = Object.assign(cell, { checked: !cell.checked })
      this.$forceUpdate()
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
  // .cell-detail {
  //   max-height: 250px;
  //   overflow: auto;
  // }
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
  width: calc(100%-10px);
  height: 40px;
  border: 1px solid #f0f0f0;
  color: #262626;
  border-radius: 5px;
  margin: 5px;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
}
.cell-checked {
  background-color: #40a9ff;
  color: #fff;
  border: none;
}
.shelf-box {
  padding: 10px;
}
.ant-divider-horizontal {
  margin: 5px 0 24px 0;
}
</style>