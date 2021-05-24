<template>
  <div class="wms-box" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="药品箱管理"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="box-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef"
          class="search-form" :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="箱子条码">
                <a-input v-model="searchForm.box_barcode" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="箱子名称">
                <a-input v-model="searchForm.box_name" placeholder="请选择"
                  allowClear>
                </a-input>
              </a-form-model-item>
            </a-col>
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
      <div class="box-table">
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
        <a-table :columns="tableColumns" ref="tableRef" :data-source="boxList"
          class="table-list" :rowKey="record => record.box_id"
          :loading="isfetchBoxList" :pagination="pagination"
          @change="handleTableChange" @showSizeChange="onShowSizeChange"
          :scroll="{x:1700}">
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
          <!-- <span slot="locka_state" slot-scope="locka_state">
            <a-switch :checked="locka_state === 1" disabled />
          </span>
          <span slot="lockb_state" slot-scope="lockb_state">
            <a-switch :checked="lockb_state === 1" disabled />
          </span> -->
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
            <a-popconfirm v-if="boxList.length" title="确认删除吗?" cancelText="取消"
              okText="确认" @confirm="() => deleteBox(record.box_id)">
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
        <a-form-model ref="boxFormRef" :model="boxForm" :rules="boxFormRules"
          :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="箱子名称" prop="box_name" ref="box_name">
                <a-input v-model="boxForm.box_name" placeholder="请输入" @blur="
          () => {
            $refs.box_name.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="箱子条码" prop="box_barcode"
                ref="box_barcode">
                <a-input v-model="boxForm.box_barcode" placeholder="请输入" @blur="
          () => {
            $refs.box_barcode.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="箱型" prop="box_kind_id">
                <a-select v-model="boxForm.box_kind_id" placeholder="请选择"
                  @select="getBoxKindInfo" allowClear>
                  <a-select-option v-for="item in boxKindList"
                    :key="item.box_kind_id" :value='item.box_kind_id'>
                    {{ item.box_kind_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="箱型类别">
                <!-- <a-select v-model="boxForm.category" placeholder="请选择" disabled>
                  <a-select-option :value=0>
                    药品箱
                  </a-select-option>
                  <a-select-option :value=1>
                    拣药箱
                  </a-select-option>
                  <a-select-option :value=2>
                    其他
                  </a-select-option>
                </a-select> -->
                <a-radio-group v-model="boxForm.category" disabled>
                  <a-radio-button :value=0>
                    药品箱
                  </a-radio-button>
                  <a-radio-button :value=1>
                    拣药箱
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
              <a-form-model-item label="长（cm）">
                <a-input-number v-model="boxForm.box_length" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="宽（cm）">
                <a-input-number v-model="boxForm.box_width" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="高（cm）">
                <a-input-number v-model="boxForm.box_height" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="重（kg）">
                <a-input-number v-model="boxForm.box_weight" placeholder="请输入"
                  disabled />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="容积率（%）">
                <a-input-number v-model="boxForm.box_volume_rate"
                  placeholder="请输入" disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药品数量" prop="drug_count">
                <a-input-number v-model="boxForm.drug_count" placeholder="请输入"
                  :min="0" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row>
            <a-col :span="12">
              <a-form-model-item label="A锁状态">
                <a-switch v-model="boxForm.lockaState" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="B锁状态">
                <a-switch v-model="boxForm.lockbState" />
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="排序码">
                <a-input-number v-model="boxForm.sort_code" :min="1" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="有效">
                <a-switch v-model="boxForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="状态">
                <a-radio-group v-model="boxForm.state"
                  :options="stateOptions" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="备注" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }">
            <a-input v-model="boxForm.memo" type="textarea" placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addBox, editBox, deleteBox, getSetTempList, getBoxKindInfo } from '@/api/wms.js'
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
  box_barcode: '',
  box_name: ''
}
const boxForm = {
  box_id: '',
  box_name: '',
  box_barcode: '',
  category: 0,
  box_kind_id: undefined,
  box_kind_name: '',
  box_length: null,
  box_width: null,
  box_height: null,
  box_weight: null,
  box_volume_rate: null,
  drug_count: null,
  lockaState: true,
  lockbState: true,
  state: 0,
  sort_code: 1,
  validate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '箱子名称',
        dataIndex: 'box_name',
        value: 'box_name',
        fixed: 'left',
        width: 150,
        ellipsis: true
      },
      {
        title: '箱子条码',
        dataIndex: 'box_barcode',
        value: 'box_barcode',
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
        title: '箱型名称',
        dataIndex: 'box_kind_name',
        value: 'box_kind_name',
        width: 150,
        ellipsis: true
      },
      {
        title: '长（cm）',
        dataIndex: 'box_length',
        value: 'box_length',
        width: 150,
        ellipsis: true
      },
      {
        title: '宽（cm）',
        dataIndex: 'box_width',
        value: 'box_width',
        width: 100,
        ellipsis: true
      },
      {
        title: '高（cm）',
        dataIndex: 'box_height',
        value: 'box_height',
        width: 100,
        ellipsis: true
      },
      {
        title: '重（kg）',
        dataIndex: 'box_weight',
        value: 'box_weight',
        width: 100,
        ellipsis: true
      },
      {
        title: '容积率（%）',
        dataIndex: 'box_volume_rate',
        value: 'box_volume_rate',
        width: 100,
        ellipsis: true
      },
      {
        title: '药品数量',
        dataIndex: 'drug_count',
        value: 'drug_count',
        width: 100,
        ellipsis: true
      },
      // {
      //   title: 'A锁状态',
      //   dataIndex: 'locka_state',
      //   value: 'locka_state',
      //   width: 100,
      //   key: 'locka_state',
      //   scopedSlots: { customRender: 'locka_state' }
      // },
      // {
      //   title: 'B锁状态',
      //   dataIndex: 'lockb_state',
      //   value: 'lockb_state',
      //   width: 100,
      //   key: 'lockb_state',
      //   scopedSlots: { customRender: 'lockb_state' }
      // },
      {
        title: '状态',
        dataIndex: 'state',
        width: 100,
        value: 'state',
        key: 'state',
        scopedSlots: { customRender: 'state' }
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
      title: '添加药品箱',
      isShowEditModal: false,
      confirmLoading: false,
      boxForm: { ...boxForm },
      // setTempList: [],
      boxFormRules: {
        box_name: [{ required: true, message: '请输入箱子名称', trigger: 'blur' }],
        box_barcode: [{ required: true, message: '请输入箱子条码', trigger: 'blur' }],
        box_kind_id: [{ required: true, message: '请选择箱型', trigger: 'blur' }],
        drug_count: [{ required: true, message: '请输入药品数量', trigger: 'blur' }]
      },
      isEdit: false,
      boxInfo: {},
      pagination: { ...pagination },
      stateOptions: [
        { label: '空闲', value: 0 },
        { label: '占用', value: 1 },
        { label: '锁定', value: 2 }
      ],
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
      path: 'wms_box',
      breadcrumbName: '药品箱管理'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchBoxList: 'box/isfetchBoxList',
      boxList: 'box/boxList',
      boxKindList: 'box/boxKindList',
      boxTotal: 'box/boxTotal'
    })
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getBoxPageList()
    this.fetchBoxKindList({ box_kind_name: '' })
  },
  methods: {
    ...mapActions({
      fetchBoxPageList: 'box/fetchBoxPageList',
      fetchBoxKindList: 'box/fetchBoxKindList',
      fetchBoxKindInfo: 'box/fetchBoxKindInfo'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes'
    }),
    getBoxPageList () {
      const params = {
        box_barcode: this.searchForm.box_barcode,
        box_name: this.searchForm.box_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.boxTotal
        }
      }
      this.fetchBoxPageList(params)
    },
    getBoxKindInfo (box_kind_id) {
      getBoxKindInfo({ box_kind_id }).then(res => {
        const boxKindInfo = res
        this.boxForm = Object.assign(this.boxForm, {
          box_kind_id: boxKindInfo.box_kind_id,
          box_kind_name: boxKindInfo.box_kind_name,
          category: boxKindInfo.category,
          box_length: boxKindInfo.box_length,
          box_width: boxKindInfo.box_width,
          box_height: boxKindInfo.box_height,
          box_weight: boxKindInfo.box_weight,
          box_volume_rate: boxKindInfo.box_volume_rate
        })
      })
    },
    handleSearch: debounce(function () {
      this.getBoxPageList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxPageList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getBoxPageList()
    },
    // fetchSetTempList (house_id) {
    //   getSetTempList({ house_id: house_id }).then(res => {
    //     this.setTempList = res
    //   }).catch(err => {
    //     this.setTempList = []
    //     this.$message.error(err.msg)
    //   })
    //   this.boxForm = Object.assign(this.boxForm, { box_id: house_id })
    // },
    handleSelect (temp_range_id) {
      this.boxForm = Object.assign(this.boxForm, {
        box_id: this.boxForm.box_id + temp_range_id
      })
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加药品箱'
      if (info) {
        this.isEdit = true
        this.title = '编辑药品箱'
        this.boxForm = Object.assign(this.boxForm, info, {})
      }
    },
    editOk () {
      this.$refs.boxFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editBox()
          } else {
            this.addBox()
          }
        } else {
          return false
        }
      });
    },
    addBox () {
      this.confirmLoading = true
      let params = Object.assign(this.boxForm,
        {
          is_disabled: this.boxForm.validate ? 0 : 1,
          locka_state: this.boxForm.lockaState ? 1 : 0,
          lockb_state: this.boxForm.lockbState ? 1 : 0
        }
      )
      addBox(params).then(res => {
        this.$message.success('操作成功')
        this.getBoxPageList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editBox () {
      this.confirmLoading = true
      const params = Object.assign(this.boxForm,
        {
          is_disabled: this.boxForm.validate ? 0 : 1,
          locka_state: this.boxForm.locka_state ? 1 : 0,
          lockb_state: this.boxForm.lockb_state ? 1 : 0
        }
      )
      editBox(params).then(res => {
        this.$message.success('修改成功')
        this.getBoxPageList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteBox (box_id) {
      const params = {
        box_id: box_id
      }
      deleteBox(params).then(res => {
        this.$message.success('删除成功')
        this.getBoxPageList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.boxFormRef.resetFields()
      this.boxForm = Object.assign({}, boxForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getBoxPageList()
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
.wms-box {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .box-search {
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
  .box-table {
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