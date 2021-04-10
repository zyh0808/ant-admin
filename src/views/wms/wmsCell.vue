<template>
  <div class="employee-cell" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="货位管理"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <a-row class="content-row">
        <a-col :span="5">
          <a-card title="目录" class="left-card" :bordered="false">
            <a-tree v-if="cellTreeData && cellTreeData.length > 0"
              :load-data="onLoadChildrenData" :tree-data="cellTreeData"
              @select="onTreeSelect" :default-expanded-keys="['0']">
              <a-icon slot="switcherIcon" type="down" />
            </a-tree>
            <a-spin v-else size="small" />
          </a-card>
        </a-col>
        <a-col :span="19" style="height:100%">
          <a-card title="货位信息" class="right-card" :bordered="false"
            ref="contentRowRefs">
            <div class="employee-cell-table">
              <a-row class="toolRow" type="flex" justify="space-between">
                <div>
                  <h3 class="listTitle" v-if="currentCellName">
                    {{currentCellName}}
                  </h3>
                </div>
                <a-row class="toolsBtn">
                  <a-space :size="12">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>添加</span>
                      </template>
                      <a-button type="primary" icon="plus-circle"
                        @click="showEditModal()" :disabled="!isLeaf" />
                    </a-tooltip>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>刷新</span>
                      </template>
                      <a-button type="dashed" icon="reload"
                        @click="reloadList" />
                    </a-tooltip>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>设置</span>
                      </template>
                      <columnSelect :plainOptions="columns"
                        @changeColumns="changeColumns(arguments)">
                      </columnSelect>
                    </a-tooltip>
                  </a-space>
                </a-row>
              </a-row>
              <a-table :columns="tableColumns" ref="tableRef"
                :data-source="cellList" class="table-list"
                :rowKey="record => record.shelf_cell_id"
                :pagination="pagination" :loading="isfetchCellList"
                @change="handleTableChange" @showSizeChange="onShowSizeChange"
                :scroll="{x:1720}">
                <span slot="validate" slot-scope="validate">
                  <a-switch :checked="validate" disabled />
                </span>
                <span slot="state" slot-scope="state">
                  <a-tag v-if="state === 0" color="green">
                    空闲
                  </a-tag>
                  <a-tag v-else-if="state === 1" color="red">
                    占用
                  </a-tag>
                  <a-tag v-else>
                    锁定
                  </a-tag>
                </span>
                <template slot="action" slot-scope="record">
                  <a-button type="link" size="small"
                    @click="showEditModal(record)">
                    编辑
                  </a-button>
                  <a-divider type="vertical" />
                  <a-popconfirm v-if="cellList.length" title="确认删除吗?"
                    cancelText="取消" okText="确认"
                    @confirm="() => deleteCell(record.shelf_cell_id)">
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
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-modal :title="title" :visible="isShowEditModal"
      :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
      cancelText="取消" okText="确定" :width="900">
      <a-form-model ref="cellFormRef" :model="cellForm" :rules="cellFormRules"
        :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="货位名称" prop="shelf_cell_name"
              ref="shelf_cell_name">
              <a-input v-model="cellForm.shelf_cell_name" placeholder="请输入"
                @blur="
          () => {
            $refs.shelf_cell_name.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="货位编码">
              <a-input v-model="cellForm.shelf_cell_id" placeholder="自动生成"
                :disabled="inputDisabled" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="仓库编码">
              <a-input v-model="cellForm.house_id" :disabled="inputDisabled" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="温区编码">
              <a-input v-model="cellForm.temp_range_id"
                :disabled="inputDisabled" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="楼层编码">
              <a-input v-model="cellForm.floor_id" :disabled="inputDisabled" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="货架编码">
              <a-input v-model="cellForm.house_shelf_id"
                :disabled="inputDisabled" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="货架内部编码">
              <a-input v-model="cellForm.shelf_code"
                :disabled="inputDisabled" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="货架层号" prop="shelf_row_code"
              ref="shelf_row_code">
              <a-input v-model="cellForm.shelf_row_code" placeholder="请输入"
                @blur="
          () => {
            $refs.shelf_row_code.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="货位内部编码" prop="shelf_cell_code"
              ref="shelf_cell_code">
              <a-input v-model="cellForm.shelf_cell_code" placeholder="请输入"
                @blur="
          () => {
            $refs.shelf_cell_code.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="货位类型" prop="category" ref="category">
              <a-select v-model="cellForm.category" placeholder="请选择">
                <a-select-option :value=0>
                  药品
                </a-select-option>
                <a-select-option :value=1>
                  样本
                </a-select-option>
                <a-select-option :value=2>
                  器械（设备）
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="长（cm）" prop="cell_length"
              ref="cell_length">
              <a-input-number v-model="cellForm.cell_length" placeholder="请输入"
                @blur="
          () => {
            $refs.cell_length.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="宽（cm）" prop="cell_width" ref="cell_width">
              <a-input-number v-model="cellForm.cell_width" placeholder="请输入"
                @blur="
          () => {
            $refs.cell_width.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="高（cm）" prop="cell_height"
              ref="cell_height">
              <a-input-number v-model="cellForm.cell_height" placeholder="请输入"
                @blur="
          () => {
            $refs.cell_height.onFieldBlur()
          }" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="状态">
              <a-radio-group v-model="cellForm.state" :options="stateOptions" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效">
              <a-switch v-model="cellForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="备注" :label-col="{ span: 3 }"
          :wrapper-col="{ span: 21 }">
          <a-input v-model="cellForm.memo" type="textcell" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { getHouseList, getSetTempList, getShelfList, addCell, editCell, deleteCell } from '@/api/wms.js'
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
  house_id: '',
  temp_range_id: '',
  floor_id: '',
  shelf_cell_id: '',
  shelf_cell_name: '',
  state: -1
}
const cellForm = {
  shelf_cell_name: '',
  shelf_cell_id: '',
  house_id: '',
  temp_range_id: '',
  floor_id: '',
  house_shelf_id: '',
  shelf_code: '',
  shelf_row_code: '',
  shelf_cell_code: '',
  category: undefined,
  cell_length: 0,
  cell_width: 0,
  cell_height: 0,
  state: 0,
  validate: true,
  memo: ''
}
const saveForm = {
  house_id: '',
  temp_range_id: '',
  floor_id: '',
  house_shelf_id: '',
  shelf_code: ''
}
export default {
  data () {
    const columns = [
      {
        title: '货位编码',
        dataIndex: 'shelf_cell_id',
        value: 'shelf_cell_id',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '货位名称',
        dataIndex: 'shelf_cell_name',
        value: 'shelf_cell_name',
        width: 150,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '仓库编码',
        dataIndex: 'house_id',
        value: 'house_id',
        width: 120,
        ellipsis: true
      },
      {
        title: '温区编码',
        dataIndex: 'temp_range_id',
        value: 'temp_range_id',
        width: 120,
        ellipsis: true
      },
      {
        title: '楼层编码',
        dataIndex: 'floor_id',
        value: 'floor_id',
        width: 120,
        ellipsis: true
      },
      {
        title: '货架内部编码',
        dataIndex: 'shelf_code',
        value: 'shelf_code',
        width: 120,
        ellipsis: true
      },
      {
        title: '货架层号',
        dataIndex: 'shelf_row_code',
        value: 'shelf_row_code',
        width: 120,
        ellipsis: true
      },
      {
        title: '货位内部编码',
        dataIndex: 'shelf_cell_code',
        value: 'shelf_cell_code',
        width: 120,
        ellipsis: true
      },
      {
        title: '货位类型',
        dataIndex: 'categoryName',
        value: 'categoryName',
        width: 120,
        ellipsis: true
      },
      {
        title: '长（cm）',
        dataIndex: 'cell_length',
        value: 'cell_length',
        width: 120,
        ellipsis: true
      },
      {
        title: '宽（cm）',
        dataIndex: 'cell_width',
        value: 'cell_width',
        width: 120,
        ellipsis: true
      },
      {
        title: '高（cm）',
        dataIndex: 'cell_height',
        value: 'cell_height',
        width: 120,
        ellipsis: true
      },
      {
        title: '状态',
        dataIndex: 'state',
        value: 'state',
        width: 100,
        key: 'state',
        scopedSlots: { customRender: 'state' }
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' }
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      title: '添加货位',
      currentCellName: '',
      cellTreeData: [],
      isShowEditModal: false,
      confirmLoading: false,
      searchForm: { ...searchForm },
      cellForm: { ...cellForm },
      saveForm: { ...saveForm },
      isSubmit: false,
      cellFormRules: {
        shelf_cell_name: [{ required: true, message: '请输入货位名称', trigger: 'blur' }],
        shelf_cell_id: [{ required: true, message: '请输入货位编码', trigger: 'blur' }],
        // house_id: [{ required: true, message: '请输入仓库编码', trigger: 'blur' }],
        // temp_range_id: [{ required: true, message: '请输入温区编码', trigger: 'blur' }],
        // floor_id: [{ required: true, message: '请输入楼层编码', trigger: 'blur' }],
        // house_shelf_id: [{ required: true, message: '请输入货架编码', trigger: 'blur' }],
        // shelf_code: [{ required: true, message: '请输入货架内部编号', trigger: 'blur' }],
        shelf_row_code: [{ required: true, message: '请输入货架层号', trigger: 'blur' }],
        shelf_cell_code: [{ required: true, message: '请输入货位编码', trigger: 'blur' }],
        category: [{ required: true, message: '请选择货位类型', trigger: 'blur' }],
        cell_length: [{ required: true, message: '请输入货位长', trigger: 'blur' }],
        cell_width: [{ required: true, message: '请输入货位宽', trigger: 'blur' }],
        cell_height: [{ required: true, message: '请输入货位高', trigger: 'blur' }]
      },
      isEdit: false,
      pagination: { ...pagination },
      stateOptions: [
        { label: '空闲', value: 0 },
        { label: '占用', value: 1 },
        { label: '锁定', value: 2 }
      ],
      inputDisabled: true,
      isLeaf: false,
      system: 'wms',
      showSticky: false,
      stickyWidth: 0
    }
  },
  components: {
    columnSelect,
    pageHeader
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      cellList: 'house/cellList',
      cellTotal: 'house/cellTotal',
      isfetchCellList: 'house/isfetchCellList'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '仓库管理',
    },
    {
      path: 'wms_cell',
      breadcrumbName: '货位管理'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    getHouseList({ house_id: '', house_name: '' }).then(data => {
      this.cellTreeData = [{
        key: '0',
        title: '全部仓库',
        type: 'TOP',
        children: data.map(item => {
          let temp = {}
          temp['key'] = item.house_id
          temp['title'] = item.house_name
          temp['value'] = item.house_id
          temp['type'] = 'house'
          return temp
        })
      }]
    }).catch(err => {
      this.$message.error(err.msg)
    })
  },
  methods: {
    ...mapActions({
      fetchCellPageList: 'house/fetchCellPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetCellData: 'house/resetCellData'
    }),
    getCellList () {
      this.fetchCellPageList({
        ...this.searchForm,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.cellTotal
        }
      })
    },
    onLoadChildrenData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.changeSearchForm(treeNode.dataRef.type, treeNode.dataRef.value)
        if (treeNode.dataRef.type === 'house') {
          //获取仓库温区
          getSetTempList({ house_id: treeNode.dataRef.value }).then(data => {
            treeNode.dataRef.children = data.map(item => {
              let temp = {}
              temp['key'] = treeNode.dataRef.value + item.temp_range_id + ''
              temp['title'] = item.temp_range_name
              temp['value'] = item.temp_range_id
              temp['type'] = 'temp'
              return temp
            })
            this.cellTreeData = [...this.cellTreeData]
            resolve()
          })
        } else if (treeNode.dataRef.type === 'temp') {
          const params = {
            house_id: this.searchForm.house_id,
            temp_range_id: treeNode.dataRef.value,
            floor_id: '',
            house_shelf_id: '',
            house_shelf_name: ''
          }
          //获取温区货架
          getShelfList(params).then(data => {
            treeNode.dataRef.children = data.map(item => {
              let temp = {}
              temp['key'] = treeNode.dataRef.value + item.house_shelf_id + ''
              temp['title'] = item.house_shelf_name
              temp['value'] = item.house_shelf_id
              temp['type'] = 'shelf'
              temp['isLeaf'] = true
              return temp
            })
            this.cellTreeData = [...this.cellTreeData]
            // console.log(this.cellTreeData)
            resolve()
          })
        }
      })
    },
    changeSearchForm (type, key, event = 0) {
      if (event === 1) {
        this.isLeaf = false
      }
      if (type === 'TOP') {
        this.searchForm = Object.assign({}, searchForm)
      } else if (type === 'house') {
        this.searchForm = Object.assign({}, searchForm, { house_id: key })
      } else if (type === 'temp') {
        this.searchForm = Object.assign({}, searchForm, {
          house_id: this.searchForm.house_id,
          temp_range_id: key
        })
      } else if (type === 'shelf') {
        this.searchForm = Object.assign({}, searchForm, {
          house_id: this.searchForm.house_id,
          temp_range_id: this.searchForm.temp_range_id,
          shelf_cell_id: key
        })
        if (event === 1) {
          this.isLeaf = true
          const floor = key.substring(5, 7)
          const code = key.substring(7, 10)
          this.saveForm = Object.assign(this.saveForm, {
            house_id: this.searchForm.house_id,
            temp_range_id: this.searchForm.temp_range_id,
            house_shelf_id: key,
            floor_id: floor,
            shelf_code: code
          })
        }
      }
    },
    onTreeSelect (selectedKeys, e) {
      const { selected, selectedNodes, node, event } = e
      this.changeSearchForm(node.$options.propsData.dataRef.type, node.$options.propsData.dataRef.value, 1)
      this.currentCellName = node.title
      this.getCellList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCellList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCellList()
    },
    showEditModal (cellInfo) {
      this.isShowEditModal = true
      this.title = '添加货位'
      this.isEdit = false
      //自动获取货位信息
      this.cellForm = Object.assign(this.cellForm, {
        house_id: this.saveForm.house_id,
        temp_range_id: this.saveForm.temp_range_id,
        house_shelf_id: this.saveForm.house_shelf_id,
        floor_id: this.saveForm.floor_id,
        shelf_code: this.saveForm.shelf_code
      })
      if (cellInfo) {
        this.isEdit = true
        this.title = '编辑货位'
        this.cellForm = Object.assign(this.cellForm, cellInfo, {})
      }
    },
    editOk () {
      this.$refs.cellFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editCell()
          } else {
            this.addCell()
          }
        } else {
          return false
        }
      })
    },
    addCell () {
      this.confirmLoading = true
      const shelf_cell_id = this.cellForm.house_shelf_id + this.cellForm.shelf_row_code + this.cellForm.shelf_cell_code
      const cellForm = Object.assign(this.cellForm, {
        is_disabled: this.cellForm.validate ? 0 : 1,
        shelf_cell_id: shelf_cell_id
      })
      addCell(cellForm).then(res => {
        this.$message.success('操作成功')
        this.getCellList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCell () {
      this.confirmLoading = true
      const shelf_cell_id = this.cellForm.house_shelf_id + this.cellForm.shelf_row_code + this.cellForm.shelf_cell_code
      const params = Object.assign(this.cellForm, {
        is_disabled: this.cellForm.validate ? 0 : 1,
        shelf_cell_id: shelf_cell_id
      })
      editCell(params).then(res => {
        this.$message.success('修改成功')
        this.getCellList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteCell (shelf_cell_id) {
      const params = {
        shelf_cell_id: shelf_cell_id
      }
      deleteCell(params).then(res => {
        this.$message.success('删除成功')
        this.getCellList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.cellFormRef.resetFields()
      this.cellForm = Object.assign({}, cellForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getCellList()
    },
    changeColumns (e) {
      this.tableColumns = e[0]
    },
    handleScroll (e) {
      const top = this.$refs.tableRef.$el.offsetTop + 106 - e.target.scrollTop
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
    this.resetCellData()
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.employee-cell {
  padding: 5px;
}
.content {
  margin: 10px;
  .left-card {
    border-right: 1px solid #e8e8e8;
  }
  .right-card {
    margin-left: -1px;
    border-left: 1px solid #e8e8e8;
  }
}
.employee-cell-table {
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
/deep/ .table-list > tr > th {
  padding: 10px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 10px 8px;
}

/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  height: auto;
  word-break: break-word;
  white-space: pre-wrap;
}
.content-row {
  background-color: #fff;
}
.sticky-table {
  display: block !important;
  position: fixed;
  top: 48px;
  overflow: hidden;
  z-index: 10;
  /deep/ .ant-table-placeholder {
    display: none;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
}
</style>