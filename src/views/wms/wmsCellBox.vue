<template>
  <div class="wms-cell-box" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="箱型药品配置"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="cell-box-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="仓库编码">
                <a-select v-model="searchForm.house_id" placeholder="请选择"
                  allowClear>
                  <a-select-option v-for="item in houseList"
                    :key="item.house_id" :value='item.house_id'>
                    {{ item.house_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="货位编码">
                <a-input v-model="searchForm.shelf_cell_id" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="药品箱条码">
                <a-input v-model="searchForm.box_barcode" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-row type="flex" justify="end" style="marginTop:4px">
                <a-button type="primary" @click="handleSearch">
                  查询
                </a-button>
                <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                  重置
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="cell-box-table">
        <a-row class="toolRow" type="flex" justify="end">
          <a-row class="toolsBtn">
            <a-space :size="12">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新建</span>
                </template>
                <a-button type="primary" icon="plus-circle"
                  @click="showEditModal()" />
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>刷新</span>
                </template>
                <a-button type="dashed" icon="reload" @click="reloadList" />
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>设置</span>
                </template>
                <columnSelect :plainOptions="columns"
                  @changeColumns="changeColumns(arguments)"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef"
          :data-source="cellBoxList" class="table-list"
          :rowKey="record => record.shelfcell_box_id"
          :loading="isfetchCellBoxList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange"
          :scroll="{x:830}">
          <span slot="validate" slot-scope="validate">
            <a-switch :checked="validate" disabled />
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="cellBoxList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteCellBox(record.shelfcell_box_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
        <a-table :columns="tableColumns"
          :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef"
          :style="{display: 'none',width: stickyWidth + 'px'}"
          table-layout="fixed">
        </a-table>
      </div>
      <a-modal :title="title" :visible="isShowEditModal"
        :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
        cancelText="取消" okText="确定" :width="700">
        <a-form-model ref="cellBoxFormRef" :model="cellBoxForm"
          :rules="cellBoxFormRules" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="仓库编码" prop="house_id">
                <a-select v-model="cellBoxForm.house_id" placeholder="请选择"
                  :disabled="houseList.length === 0" allowClear
                  @select="getTempRangeList">
                  <a-select-option v-for="item in houseList"
                    :key="item.house_id" :value='item.house_id'>
                    {{ item.house_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="温区编码" prop="temp_range_id"
                ref="temp_range_id">
                <a-select v-model="cellBoxForm.temp_range_id" placeholder="请选择"
                  :disabled="tempRangeList.length === 0" @select="getFloorList"
                  allowClear>
                  <a-select-option v-for="item in tempRangeList"
                    :key="item.temp_range_id" :value='item.temp_range_id'>
                    {{ item.temp_range_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="楼层" ref="floor_id" prop="floor_id">
                <a-select v-model="cellBoxForm.floor_id" placeholder="请选择"
                  :disabled="floorList.length === 0" @select="getShelfList"
                  allowClear>
                  <a-select-option v-for="item in floorList"
                    :key="item.item_name" :value='item.item_name'>
                    {{ item.item_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货架编码" ref="house_shelf_id"
                prop="house_shelf_id">
                <a-select v-model="cellBoxForm.house_shelf_id" placeholder="请选择"
                  :disabled="shelfList.length === 0" @select="getShelfRowList"
                  allowClear>
                  <a-select-option v-for="item in shelfList"
                    :key="item.house_shelf_id" :value='item.house_shelf_id'>
                    {{ item.house_shelf_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="货层编码" ref="shelf_row_id"
                prop="shelf_row_id">
                <a-select v-model="cellBoxForm.shelf_row_id" placeholder="请选择"
                  :disabled="shelfRowList.length === 0" @select="getCellList"
                  allowClear>
                  <a-select-option v-for="item in shelfRowList"
                    :key="item.item_name" :value='item.item_name'>
                    {{ item.item_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货位编码" ref="shelf_cell_id"
                prop="shelf_cell_id">
                <a-select v-model="cellBoxForm.shelf_cell_id" placeholder="请选择"
                  :disabled="cellList.length === 0" allowClear>
                  <a-select-option v-for="item in cellList"
                    :key="item.shelf_cell_id" :value='item.shelf_cell_id'>
                    {{ item.shelf_cell_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药品箱条码" ref="box_barcode"
                prop="box_barcode">
                <a-auto-complete v-model="cellBoxForm.box_barcode"
                  placeholder="请输入" :data-source="barCodeList"
                  @select="onBoxSelect" @search="onBoxSearch">
                </a-auto-complete>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药品箱编号" ref="box_id" prop="box_id">
                <a-input v-model="cellBoxForm.box_id" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addCellBox, editCellBox, deleteCellBox, getSetTempList, getFloorList, getShelfList, getShelfRowList, getCellList } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
const pagination = {
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'small'
}
const searchForm = {
  house_id: undefined,
  shelf_cell_id: '',
  box_barcode: ''
}
const cellBoxForm = {
  house_id: undefined,
  temp_range_id: undefined,
  floor_id: undefined,
  house_shelf_id: undefined,
  shelf_row_id: undefined,
  shelf_cell_id: undefined,
  box_id: '',
  box_barcode: ''
}
const lists = {
  tempRangeList: [],
  floorList: [],
  shelfList: [],
  shelfRowList: [],
  cellList: [],
}
export default {
  data () {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'shelfcell_box_id',
        value: 'shelfcell_box_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '货位编码',
        dataIndex: 'shelf_cell_id',
        value: 'shelf_cell_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '药品箱编码',
        dataIndex: 'box_id',
        value: 'box_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '药品箱条码',
        dataIndex: 'box_barcode',
        value: 'box_barcode',
        width: 150,
        ellipsis: true
      },
      {
        title: '仓库编码',
        dataIndex: 'house_id',
        value: 'house_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 80,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: { ...searchForm },
      title: '添加箱型药品配置',
      isShowEditModal: false,
      confirmLoading: false,
      cellBoxForm: { ...cellBoxForm },
      ...lists,
      cellBoxFormRules: {
        house_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        temp_range_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        floor_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        house_shelf_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        shelf_row_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        shelf_cell_id: [{ required: true, message: '请选择箱型名称', trigger: 'blur' }],
        box_id: [{ required: true, message: '请输入箱型名称', trigger: 'blur' }],
        box_barcode: [{ required: true, message: '请输入药品箱条码', trigger: 'blur' }]
      },
      isEdit: false,
      pagination: { ...pagination },
      system: 'wms',
      showSticky: false,
      stickyWidth: 0
    }
  },
  components: {
    columnSelect,
    pageHeader
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '仓库管理',
    },
    {
      path: 'wms_cellbox',
      breadcrumbName: '货位药品箱'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      houseList: 'house/houseList',
      cellBoxList: 'box/cellBoxList',
      boxList: 'box/boxList',
      isfetchCellBoxList: 'box/isfetchCellBoxList',
      cellBoxTotal: 'box/cellBoxTotal'
    }),
    barCodeList () {
      return this.boxList ? this.boxList.map(item => item.box_barcode) : []
    }
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.fetchHouseList({
      house_id: '',
      house_name: ''
    })
    this.getCellBoxList()
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList',
      fetchCellBoxPageList: 'box/fetchCellBoxPageList',
      fetchBoxList: 'box/fetchBoxList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetBoxData: 'box/resetBoxData'
    }),
    getCellBoxList () {
      this.fetchCellBoxPageList({
        house_id: this.searchForm.house_id ? this.searchForm.house_id : '',
        shelf_cell_id: this.searchForm.shelf_cell_id,
        box_barcode: this.searchForm.box_barcode,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.cellBoxTotal
        }
      })
    },
    getTempRangeList (house_id, type) {
      if (type !== '1') {
        this.cellBoxForm = Object.assign(this.cellBoxForm, {
          temp_range_id: undefined,
          floor_id: undefined,
          house_shelf_id: undefined,
          shelf_row_id: undefined,
          shelf_cell_id: undefined
        })
      }
      getSetTempList({ house_id }).then(res => {
        this.tempRangeList = res
      }).catch(err => {
        this.tempRangeList = []
        this.$message.error(err.msg)
      })
    },
    getFloorList (temp_range_id, type) {
      if (type !== '1') {
        this.cellBoxForm = Object.assign(this.cellBoxForm, {
          floor_id: undefined,
          house_shelf_id: undefined,
          shelf_row_id: undefined,
          shelf_cell_id: undefined
        })
      }
      const params = {
        house_id: this.cellBoxForm.house_id,
        temp_range_id
      }
      getFloorList(params).then(res => {
        this.floorList = res
      }).catch(err => {
        this.floorList = []
        this.$message.error(err.msg)
      })
    },
    getShelfList (floor_id, type) {
      if (type !== '1') {
        this.cellBoxForm = Object.assign(this.cellBoxForm, {
          house_shelf_id: undefined,
          shelf_row_id: undefined,
          shelf_cell_id: undefined
        })
      }
      const params = {
        house_id: this.cellBoxForm.house_id,
        temp_range_id: this.cellBoxForm.temp_range_id,
        floor_id,
        house_shelf_id: '',
        house_shelf_name: ''
      }
      getShelfList(params).then(res => {
        this.shelfList = res
      }).catch(err => {
        this.shelfList = []
        this.$message.error(err.msg)
      })
    },
    getShelfRowList (house_shelf_id, type) {
      if (type !== '1') {
        this.cellBoxForm = Object.assign(this.cellBoxForm, {
          shelf_row_id: undefined,
          shelf_cell_id: undefined
        })
      }
      getShelfRowList({ house_shelf_id }).then(res => {
        this.shelfRowList = res
      }).catch(err => {
        this.shelfRowList = []
        this.$message.error(err.msg)
      })
    },
    getCellList (shelf_row_id, type) {
      if (type !== '1') {
        this.cellBoxForm = Object.assign(this.cellBoxForm, {
          shelf_cell_id: undefined
        })
      }
      const params = {
        shelf_row_id: this.cellBoxForm.house_shelf_id
          + shelf_row_id
      }
      getCellList(params).then(res => {
        this.cellList = res
      }).catch(err => {
        this.cellList = []
        this.$message.error(err.msg)
      })
    },
    onBoxSearch (value) {
      this.fetchBoxList({ box_barcode: value, box_name: '' })
    },
    onBoxSelect (box_barcode) {
      const box = this.boxList.find(item => item.box_barcode === box_barcode)
      this.fetchBoxList({ box_barcode, box_name: '' })
      this.cellBoxForm = Object.assign(this.cellBoxForm, { box_id: box.box_id })
    },
    handleSearch: debounce(function () {
      this.getCellBoxList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCellBoxList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCellBoxList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加货位药品箱'
      this.fetchHouseList({
        house_id: '',
        house_name: ''
      })
      if (info) {
        this.isEdit = true
        this.title = '编辑货位药品箱'
        this.cellBoxForm = Object.assign(this.cellBoxForm, info, {})
        this.getTempRangeList(info.house_id, '1')
        this.getCellInfo(info.shelf_cell_id)
      }
    },
    getCellInfo (shelf_cell_id) {
      const temp_range_id = shelf_cell_id.substring(4, 5)
      const floor_id = shelf_cell_id.substring(5, 7)
      const house_shelf_id = shelf_cell_id.substring(0, 10)
      const shelf_row_id = shelf_cell_id.substring(10, 12)
      this.cellBoxForm = Object.assign(this.cellBoxForm, {
        temp_range_id,
        floor_id,
        house_shelf_id,
        shelf_row_id
      })
      this.getFloorList(temp_range_id, '1')
      this.getShelfList(floor_id, '1')
      this.getShelfRowList(house_shelf_id, '1')
      this.getCellList(shelf_row_id, '1')
    },
    editOk () {
      this.$refs.cellBoxFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editCellBox()
          } else {
            this.addCellBox()
          }
        } else {
          return false
        }
      });
    },
    addCellBox () {
      this.confirmLoading = true
      let params = Object.assign(this.cellBoxForm,
        { is_disabled: this.cellBoxForm.validate ? 0 : 1 }
      )
      addCellBox(params).then(res => {
        this.$message.success('操作成功')
        this.getCellBoxList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    editCellBox () {
      this.confirmLoading = true
      const params = Object.assign(this.cellBoxForm,
        { is_disabled: this.cellBoxForm.validate ? 0 : 1 }
      )
      editCellBox(params).then(res => {
        this.$message.success('修改成功')
        this.getCellBoxList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
        this.confirmLoading = false
      })
    },
    deleteCellBox (shelfcell_box_id) {
      const params = {
        shelfcell_box_id: shelfcell_box_id
      }
      deleteCellBox(params).then(res => {
        this.$message.success('删除成功')
        this.getCellBoxList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.resetBoxData()
      this.resetLists()
      this.cellBoxForm = Object.assign({}, cellBoxForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    resetLists () {
      this.tempRangeList = []
      this.floorList = []
      this.shelfList = []
      this.shelfRowList = []
      this.cellList = []
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getCellBoxList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    },
    handleScroll (e) {
      const top = this.$refs.tableRef.$el.offsetTop - e.target.scrollTop
      if (top < 0) {
        this.showSticky = true
      } else {
        this.showSticky = false
      }
    },
    handleTableScroll () {
      this.table = this.$refs.tableRef
      this.stickyTable = this.$refs.stickyTableRef
      const scrollLeft = this.table.$el.querySelector('.ant-table-body').scrollLeft
      this.stickyTable.$el.querySelector('.ant-table-body').scrollLeft = scrollLeft
    }
  },
  beforeDestroy () {
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.wms-cell-box {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .cell-box-search {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px 0;
    .search-form {
      margin: 10px 20px;
      .searchRow {
        // height: 40px;
        // line-height: 40px;
        align-items: center;
        padding: 0 20px;
        .ant-form-item {
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }
  .cell-box-table {
    background-color: white;
    padding: 5px 10px;
    .toolRow {
      height: 60px;
      align-items: center;
      .listTitle {
        padding: 0 10px;
        // font-weight: 600;
      }
      .toolsBtn {
        .ant-btn {
          margin-right: 10px;
        }
      }
    }
  }
}
.table-row {
  height: 32px;
  line-height: 32px;
}
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
}
</style>