<template>
  <div class="wms-shelf" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="货架列表"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="shelf-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef" class="search-form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="仓库编码">
                <a-select v-model="searchForm.house_id" placeholder="请选择" @select="fetchSetTempList" allowClear>
                  <a-select-option v-for="item in houseList" :key="item.house_id" :value='item.house_id'>
                    {{ item.house_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="温区编码">
                <a-select v-model="searchForm.temp_range_id" placeholder="请选择" allowClear>
                  <a-select-option v-for="item in setTempList" :key="item.temp_range_id" :value='item.temp_range_id'>
                    {{ item.temp_range_id }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="货架编码">
                <a-input v-model="searchForm.house_shelf_id" placeholder="请选择" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" v-if="showMoreSearchOptions">
              <a-form-model-item label="货架名称">
                <a-input v-model="searchForm.house_shelf_name" placeholder="请选择" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" v-if="showMoreSearchOptions">
              <a-form-model-item label="楼层编码">
                <a-input v-model="searchForm.floor_id" placeholder="请选择" allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="showMoreSearchOptions? 12: 0">
              <a-form-model-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <div class="search-btns">
                  <a-button type="primary" @click="handleSearch">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                  <a-button type="link" :style="{ marginLeft: '8px' }" v-if="!showMoreSearchOptions" @click="showMoreSearchOptions = true">
                    更多
                  </a-button>
                  <a-button type="link" :style="{ marginLeft: '8px' }" v-else @click="showMoreSearchOptions = false">
                    收起
                  </a-button>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="shelf-table">
        <a-row class="toolRow" type="flex" justify="end">
          <a-row class="toolsBtn">
            <a-space :size="12">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新建</span>
                </template>
                <a-button type="primary" icon="plus-circle" @click="showEditModal()" />
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
                <columnSelect :plainOptions="columns" @changeColumns="changeColumns"></columnSelect>
              </a-tooltip>
            </a-space>
          </a-row>
        </a-row>
        <a-table :columns="tableColumns" ref="tableRef" :data-source="shelfList" class="table-list" :rowKey="record => record.house_shelf_id" :loading="isfetchShelfList" :pagination="pagination" @change="handleTableChange" @showSizeChange="onShowSizeChange" :scroll="{x:1550}">
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
            <a-popconfirm v-if="shelfList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteShelf(record.house_shelf_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
        <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
        </a-table>
      </div>
      <a-modal :title="title" :visible="isShowEditModal" :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel" cancelText="取消" okText="确定" :width="700">
        <a-form-model ref="shelfFormRef" :model="shelfForm" :rules="shelfFormRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="仓库编码" prop="house_id" ref="house_id">
                <a-select v-model="shelfForm.house_id" placeholder="请选择" @select="fetchSetTempList" allowClear>
                  <a-select-option v-for="item in houseList" :key="item.house_id" :value='item.house_id'>
                    {{ item.house_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="温区编码" prop="temp_range_id" ref="temp_range_id">
                <a-select v-model="shelfForm.temp_range_id" placeholder="请选择" @select="handleSelect" allowClear>
                  <a-select-option v-for="item in setTempList" :key="item.temp_range_id" :value='item.temp_range_id'>
                    {{ item.temp_range_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="货架编码" prop="house_shelf_id" ref="house_shelf_id">
                <a-input v-model="shelfForm.house_shelf_id" placeholder="请输入" @blur="
          () => {
            $refs.house_shelf_id.onFieldBlur()
            getShelfDetail()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货架名称" prop="house_shelf_name" ref="house_shelf_name">
                <a-input v-model="shelfForm.house_shelf_name" placeholder="请输入" @blur="
          () => {
            $refs.house_shelf_name.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="楼层" prop="floor_id" ref="floor_id">
                <a-input v-model="shelfForm.floor_id" placeholder="请输入" @blur="
          () => {
            $refs.floor_id.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货架内部编码" prop="shelf_code" ref="shelf_code">
                <a-input v-model="shelfForm.shelf_code" placeholder="请输入" @blur="
          () => {
            $refs.shelf_code.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="货架种类" prop="shelf_kind" ref="shelf_kind">
                <a-select v-model="shelfForm.shelf_kind" placeholder="请选择" @select="getShelfKindInfo" allowClear>
                  <a-select-option v-for="item in shelfKindList" :key="item.shelf_kind_id" :value='item.shelf_kind_id'>
                    {{ item.shelf_kind_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货架类型" prop="category">
                <!-- <a-select v-model="shelfForm.category" placeholder="请选择">
                  <a-select-option :value=0>
                    轻型
                  </a-select-option>
                  <a-select-option :value=1>
                    重型
                  </a-select-option>
                  <a-select-option :value=2>
                    其他
                  </a-select-option>
                </a-select> -->
                <a-radio-group v-model="shelfForm.category">
                  <a-radio-button :value=0>
                    轻型
                  </a-radio-button>
                  <a-radio-button :value=1>
                    重型
                  </a-radio-button>
                  <a-radio-button :value=2>
                    其他
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="长（cm）" prop="shelf_length" ref="shelf_length">
                <a-input-number v-model="shelfForm.shelf_length" placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_length.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="宽（cm）" prop="shelf_width" ref="shelf_width">
                <a-input-number v-model="shelfForm.shelf_width" placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_width.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="高（cm）" prop="shelf_height" ref="shelf_height">
                <a-input-number v-model="shelfForm.shelf_height" placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_height.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货架层数" prop="shelf_rows" ref="shelf_rows">
                <a-input-number v-model="shelfForm.shelf_rows" placeholder="请输入" :min="0" @blur="
          () => {
            $refs.shelf_rows.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="有效" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-switch v-model="shelfForm.validate" />
          </a-form-model-item>
          <a-form-model-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-input v-model="shelfForm.memo" placeholder="请输入" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addShelf, editShelf, deleteShelf, getSetTempList, getShelfKindInfo } from '@/api/wms.js'
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
  house_id: null,
  temp_range_id: null,
  floor_id: '',
  house_shelf_id: '',
  house_shelf_name: '',
}
const shelfForm = {
  house_shelf_id: '',
  house_shelf_name: '',
  house_id: null,
  temp_range_id: null,
  floor_id: '',
  shelf_code: '',
  shelf_kind: null,
  category: 0,
  shelf_length: 0,
  shelf_width: 0,
  shelf_height: 0,
  shelf_rows: 1,
  x: '0',
  y: '0',
  memo: '',
  validate: true
}
export default {
  data () {
    const columns = [
      {
        title: '货架编码',
        dataIndex: 'house_shelf_id',
        value: 'house_shelf_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '货架名称',
        dataIndex: 'house_shelf_name',
        value: 'house_shelf_name',
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
        title: '温区编码',
        dataIndex: 'temp_range_id',
        value: 'temp_range_id',
        width: 150,
        ellipsis: true
      },
      {
        title: '货架内部编码',
        dataIndex: 'shelf_code',
        value: 'shelf_code',
        width: 150,
        ellipsis: true
      },
      {
        title: '货架类型',
        dataIndex: 'categoryName',
        value: 'categoryName',
        width: 150,
        ellipsis: true
      },
      {
        title: '长（cm）',
        dataIndex: 'shelf_length',
        value: 'shelf_length',
        width: 100,
        ellipsis: true
      },
      {
        title: '宽（cm）',
        dataIndex: 'shelf_width',
        value: 'shelf_width',
        width: 100,
        ellipsis: true
      },
      {
        title: '高（cm）',
        dataIndex: 'shelf_height',
        value: 'shelf_height',
        width: 100,
        ellipsis: true
      },
      {
        title: '货架层数',
        dataIndex: 'shelf_rows',
        value: 'shelf_rows',
        width: 100,
        ellipsis: true
      },
      {
        title: '是否有效',
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
      showMoreSearchOptions: false,
      title: '添加申办方信息',
      isShowEditModal: false,
      confirmLoading: false,
      shelfForm: { ...shelfForm },
      setTempList: [],
      shelfFormRules: {
        house_id: [{ required: true, message: '请选择仓库编码', trigger: 'blur' }],
        temp_range_id: [{ required: true, message: '请选择温区编码', trigger: 'blur' }],
        house_shelf_id: [{ required: true, message: '请输入货架编码', trigger: 'blur' }],
        house_shelf_name: [{ required: true, message: '请输入货架名称', trigger: 'blur' }],
        floor_id: [{ required: true, message: '请输入楼层', trigger: 'blur' }],
        shelf_code: [{ required: true, message: '请输入货架内部编码', trigger: 'blur' }],
        category: [{ required: true, message: '请选择货架类型', trigger: 'blur' }]
      },
      isEdit: false,
      shelfInfo: {},
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
      path: 'wms_shelf',
      breadcrumbName: '货架种类'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchShelfList: 'house/isfetchShelfList',
      shelfList: 'house/shelfList',
      houseList: 'house/houseList',
      shelfKindList: 'house/shelfKindList',
      shelfTotal: 'house/shelfTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getShelfList()
    this.fetchHouseList({ house_id: '', house_name: '' })
    this.fetchShelfKindList({ category: -1, shelf_kind_name: '' })
  },
  methods: {
    ...mapActions({
      fetchShelfPageList: 'house/fetchShelfPageList',
      fetchHouseList: 'house/fetchHouseList',
      fetchShelfKindList: 'house/fetchShelfKindList',
      fetchShelfKindInfo: 'house/fetchShelfKindInfo'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getShelfList () {
      const params = {
        house_id: this.searchForm.house_id,
        temp_range_id: this.searchForm.temp_range_id,
        floor_id: this.searchForm.floor_id,
        house_shelf_id: this.searchForm.house_shelf_id,
        house_shelf_name: this.searchForm.house_shelf_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.shelfTotal
        }
      }
      this.fetchShelfPageList(params)
    },
    getShelfDetail () {
      if (this.shelfForm.house_shelf_id.length !== 10) return
      const floor = this.shelfForm.house_shelf_id.substring(5, 7)
      const code = this.shelfForm.house_shelf_id.substring(7, 10)
      this.shelfForm = Object.assign(this.shelfForm, {
        floor_id: floor,
        shelf_code: code
      })
    },
    getShelfKindInfo (shelf_kind_id) {
      getShelfKindInfo({ shelf_kind_id }).then(res => {
        const shelfKindInfo = res
        this.shelfForm = Object.assign(this.shelfForm, {
          category: shelfKindInfo.category,
          shelf_length: shelfKindInfo.shelf_length,
          shelf_width: shelfKindInfo.shelf_width,
          shelf_height: shelfKindInfo.shelf_height,
          shelf_rows: shelfKindInfo.shelf_rows,
        })
      })
    },
    handleSearch: debounce(function () {
      this.getShelfList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getShelfList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getShelfList()
    },
    fetchSetTempList (house_id) {
      getSetTempList({ house_id: house_id }).then(res => {
        this.setTempList = res
      }).catch(err => {
        this.setTempList = []
        this.$message.error(err.msg)
      })
      this.shelfForm = Object.assign(this.shelfForm, { house_shelf_id: house_id })
    },
    handleSelect (temp_range_id) {
      this.shelfForm = Object.assign(this.shelfForm, {
        house_shelf_id: this.shelfForm.house_shelf_id + temp_range_id
      })
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加货架种类'
      if (info) {
        this.isEdit = true
        this.title = '编辑货架种类'
        this.shelfForm = Object.assign(this.shelfForm, info, {})
      }
    },
    editOk () {
      this.$refs.shelfFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editShelf()
          } else {
            this.addShelf()
          }
        } else {
          return false
        }
      });
    },
    addShelf () {
      this.confirmLoading = true
      let params = Object.assign(this.shelfForm,
        { is_disabled: this.shelfForm.validate ? 0 : 1 }
      )
      delete params.shelf_kind
      addShelf(params).then(res => {
        this.$message.success('操作成功')
        this.getShelfList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editShelf () {
      this.confirmLoading = true
      const params = Object.assign(this.shelfForm,
        { is_disabled: this.shelfForm.validate ? 0 : 1 }
      )
      editShelf(params).then(res => {
        this.$message.success('修改成功')
        this.getShelfList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteShelf (house_shelf_id) {
      const params = {
        house_shelf_id: house_shelf_id
      }
      deleteShelf(params).then(res => {
        this.$message.success('删除成功')
        this.getShelfList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.shelfFormRef.resetFields()
      this.shelfForm = Object.assign({}, shelfForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getShelfList()
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
.wms-shelf {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .shelf-search {
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
  .shelf-table {
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
/deep/ .ant-transfer {
  min-height: 400px;
  max-height: 640px;
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