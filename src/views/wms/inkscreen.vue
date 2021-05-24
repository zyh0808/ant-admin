<template>
  <div class="wms-inkscreen" @scroll="handleScroll($event)">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="inkscreen-search">
        <a-form-model :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="仓库编码">
                <!-- <a-input v-model="searchForm.house_id" placeholder="请选择"
                  allowClear>
                </a-input> -->
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
              <a-form-model-item label="设备号">
                <a-input v-model="searchForm.device_id" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="6">
              <a-form-model-item label="墨水屏条码">
                <a-input v-model="searchForm.screen_barcode" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="6" :offset="6">
              <a-form-model-item :label-col="{ span: 0 }"
                :wrapper-col="{ span: 24 }">
                <div class="search-btns">
                  <a-button type="primary" @click="handleSearch">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="inkscreen-table">
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
                  @changeColumns="changeColumns"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef"
          :data-source="inkscreenList" class="table-list"
          :rowKey="record => record.inkscreen_id"
          :loading="isfetchInkscreenList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange">
          <span slot="validate" slot-scope="validate">
            <!-- <a-switch :checked="validate" disabled /> -->
            <a-tag v-if="validate" color="green">有效</a-tag>
            <a-tag v-else color="red">无效</a-tag>
          </span>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="inkscreenList.length" title="确认删除吗?"
              cancelText="取消" okText="确认"
              @confirm="() => deleteInkscreen(record.inkscreen_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
      <a-modal :title="title" :visible="isShowEditModal"
        :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel"
        cancelText="取消" okText="确定" :width="500">
        <a-form-model ref="inkscreenFormRef" :model="inkscreenForm"
          :rules="inkscreenFormRules" :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }">
          <a-form-model-item label="设备号" prop="device_id" ref="device_id">
            <a-input v-model="inkscreenForm.device_id" placeholder="请输入" @blur="
          () => {
            $refs.device_id.onFieldBlur()
          }" />
          </a-form-model-item>
          <!-- <a-form-model-item label="当前墨水屏条码" prop="screen_barcode" ref="screen_barcode">
            <a-input v-model="inkscreenForm.screen_barcode" placeholder="请输入" @blur="
          () => {
            $refs.screen_barcode.onFieldBlur()
          }" />
          </a-form-model-item> -->
          <a-form-model-item label="仓库编码" prop="house_id">
            <a-select v-model="inkscreenForm.house_id" placeholder="请选择"
              allowClear>
              <a-select-option v-for="item in houseList" :key="item.house_id"
                :value='item.house_id'>
                {{ item.house_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="排序码" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input-number v-model="inkscreenForm.sort_code" :min="1" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="有效" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-switch v-model="inkscreenForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="备注">
            <a-input v-model="inkscreenForm.memo" type="textarea"
              placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addInkscreen, editInkscreen, deleteInkscreen } from '@/api/wms.js'
import columnSelect from '@/components/columnSelect.vue'
import pageHeader from '@/components/pageHeader.vue'
const pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'small'
}
const searchForm = {
  house_id: undefined,
  device_id: '',
  screen_barcode: ''
}
const inkscreenForm = {
  device_id: '',
  // screen_barcode: '',
  house_id: undefined,
  sort_code: 1,
  memo: '',
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '墨水屏主键',
        dataIndex: 'inkscreen_id',
        value: 'inkscreen_id',
        ellipsis: true
      },
      {
        title: '设备号',
        dataIndex: 'device_id',
        value: 'device_id',
        ellipsis: true
      },
      // {
      //   title: '当前墨水屏条码',
      //   dataIndex: 'screen_barcode',
      //   value: 'screen_barcode',
      //   width: 150,
      //   ellipsis: true
      // },
      {
        title: '排序码',
        dataIndex: 'sort_code',
        // width: 100,
        value: 'sort_code'
      },
      {
        title: '是否有效',
        dataIndex: 'validate',
        value: 'validate',
        key: 'validate',
        scopedSlots: { customRender: 'validate' }
      },
      {
        title: '备注',
        dataIndex: 'memo',
        value: 'memo'
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        fixed: 'right',
        width: 140,
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      searchForm: {
        ...searchForm
      },
      title: '添加药品箱',
      isShowEditModal: false,
      confirmLoading: false,
      inkscreenForm: { ...inkscreenForm },
      inkscreenFormRules: {
        device_id: [{ required: true, message: '请输入设备号', trigger: 'blur' }],
        house_id: [{ required: true, message: '请选择仓库', trigger: 'blur' }]
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
      path: 'wms_inkscreen',
      breadcrumbName: '墨水屏管理'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchInkscreenList: 'inkscreen/isfetchInkscreenList',
      inkscreenList: 'inkscreen/inkscreenList',
      houseList: 'house/houseList',
      inkscreenTotal: 'inkscreen/inkscreenTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getInkscreenPageList()
    this.fetchHouseList({})
  },
  methods: {
    ...mapActions({
      fetchHouseList: 'house/fetchHouseList',
      fetchInkscreenPageList: 'inkscreen/fetchInkscreenPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getInkscreenPageList () {
      const params = {
        house_id: this.searchForm.house_id,
        device_id: this.searchForm.device_id,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.inkscreenTotal
        }
      }
      this.fetchInkscreenPageList(params)
    },
    handleSearch: debounce(function () {
      this.getInkscreenPageList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getInkscreenPageList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getInkscreenPageList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加墨水屏'
      if (info) {
        this.isEdit = true
        this.title = '编辑墨水屏'
        this.inkscreenForm = Object.assign(this.inkscreenForm, info, {})
      }
    },
    editOk () {
      this.confirmLoading = true
      this.$refs.inkscreenFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editInkscreen()
          } else {
            this.addInkscreen()
          }
        } else {
          return false
        }
      });
    },
    addInkscreen () {
      this.confirmLoading = true
      let params = Object.assign(this.inkscreenForm,
        { is_disabled: this.inkscreenForm.validate ? 0 : 1 }
      )
      addInkscreen(params).then(res => {
        this.$message.success('操作成功')
        this.getInkscreenPageList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editInkscreen () {
      this.confirmLoading = true
      const params = Object.assign(this.inkscreenForm,
        { is_disabled: this.inkscreenForm.validate ? 0 : 1 }
      )
      editInkscreen(params).then(res => {
        this.$message.success('修改成功')
        this.getInkscreenPageList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteInkscreen (inkscreen_id) {
      const params = {
        inkscreen_id: inkscreen_id
      }
      deleteInkscreen(params).then(res => {
        this.$message.success('删除成功')
        this.getInkscreenPageList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.inkscreenFormRef.resetFields()
      this.inkscreenForm = Object.assign({}, inkscreenForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getInkscreenPageList()
    },
    changeColumns (columns) {
      this.tableColumns = columns
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
.wms-inkscreen {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .inkscreen-search {
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
  .inkscreen-table {
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