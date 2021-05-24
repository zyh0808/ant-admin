<template>
  <div class="employee-area" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header title="行政区域"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <a-row class="content-row">
        <a-col :span="5">
          <a-card title="行政区域目录" class="left-card" :bordered="false">
            <a-tree v-if="areaTreeData && areaTreeData.length > 0" :load-data="onLoadChildrenData" :tree-data="areaTreeData" @select="onTreeSelect" :default-expanded-keys="['0']">
              <a-icon slot="switcherIcon" type="down" />
            </a-tree>
            <a-spin v-else size="small" />
          </a-card>
        </a-col>
        <a-col :span="19" style="height:100%">
          <a-card title="区域信息" class="right-card" :bordered="false" ref="contentRowRefs">
            <div class="employee-area-table">
              <a-row class="toolRow" type="flex" justify="space-between">
                <div>
                  <h3 class="listTitle" v-if="currentAreaName">
                    {{currentAreaName}}
                  </h3>
                </div>
                <a-row class="toolsBtn">
                  <a-space :size="12">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>添加</span>
                      </template>
                      <a-button type="primary" icon="plus-circle" @click="showEditModal()" :disabled="currentAreaId === ''" />
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
                      <columnSelect :plainOptions="columns" @changeColumns="changeColumns">
                      </columnSelect>
                    </a-tooltip>
                  </a-space>
                </a-row>
              </a-row>
              <a-table :columns="tableColumns" ref="tableRef" :data-source="areaPageList" class="table-list" :rowKey="record => record.area_id" :pagination="pagination" :loading="isfetchAreaPageList" @change="handleTableChange" @showSizeChange="onShowSizeChange">
                <!-- :scroll="{x:900}" -->
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
                  <a-popconfirm v-if="areaPageList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteArea(record.area_id)">
                    <a-button type="link" size="small">
                      删除
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-table>
              <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
              </a-table>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-modal :title="title" :visible="isShowEditModal" :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel" cancelText="取消" okText="确定" :width="600">
      <a-form-model ref="areaFormRef" :model="areaForm" :rules="areaFormRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="上级区域名称">
          <a-input :value="areaForm.top_area_name" disabled />
        </a-form-model-item>
        <a-form-model-item label="行政区类型">
          <a-select v-model="areaForm.layer" disabled>
            <a-select-option :value=1>
              省、直辖市
            </a-select-option>
            <a-select-option :value=2>
              地级市
            </a-select-option>
            <a-select-option :value=3>
              县区
            </a-select-option>
            <a-select-option :value=4>
              乡、镇、街道办
            </a-select-option>
            <a-select-option :value=5>
              村、社区
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="区域编码" prop="area_id" ref="area_id">
          <a-input v-model="areaForm.area_id" placeholder="请输入" :max-length="10" @blur="
          () => {
            $refs.area_id.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-form-model-item label="区域名称" prop="area_name" ref="area_name">
          <a-input v-model="areaForm.area_name" placeholder="请输入" :max-length="50" @blur="
          () => {
            $refs.area_name.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-form-model-item label="简称" prop="simple_spell" ref="simple_spell">
          <a-input v-model="areaForm.simple_spell" placeholder="请输入" :max-length="100" @blur="
          () => {
            $refs.simple_spell.onFieldBlur()
          }" />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="排序码" prop="sort_code" :label-col="{ span: 10}" :wrapper-col="{ span: 14 }">
              <a-input-number v-model="areaForm.sort_code" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="有效" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
              <a-switch v-model="areaForm.validate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="备注">
          <a-input v-model="areaForm.memo" type="textarea" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { getProvinceList, getAreaList, addArea, editArea, deleteArea } from '@/api/system.js'
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
const areaForm = {
  area_id: '',
  area_name: '',
  simple_spell: '',
  sort_code: 1,
  validate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '区域编码',
        dataIndex: 'area_id',
        value: 'area_id',
        // width: 150,
        ellipsis: true
      },
      {
        title: '区域名称',
        dataIndex: 'area_name',
        value: 'area_name',
        // width: 100,
        ellipsis: true
      },
      {
        title: '简拼',
        dataIndex: 'simple_spell',
        value: 'simple_spell',
        // width: 100,
        ellipsis: true
      },
      {
        title: '层级',
        dataIndex: 'layerName',
        value: 'layerName',
        // width: 100,
        ellipsis: true
      },
      {
        title: '有效',
        dataIndex: 'validate',
        value: 'validate',
        // width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' }
      },
      {
        title: '备注',
        dataIndex: 'meno',
        value: 'meno',
        // width: 200,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        width: 150,
        fixed: 'right',
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      tableColumns: columns,
      title: '添加区域',
      currentAreaId: '',
      currentAreaName: '',
      // isGetAreaTree: false,
      areaTreeData: [],
      isShowEditModal: false,
      confirmLoading: false,
      areaForm: {
        pid: '',
        top_area_name: '',
        layer: '',
        ...areaForm
      },
      isSubmit: false,
      areaFormRules: {
        area_id: [{ required: true, message: '请输入区域编码', trigger: 'blur' }],
        area_name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        simple_spell: [{ required: true, message: '请输入简称', trigger: 'blur' }]
      },
      isEdit: false,
      pagination: { ...pagination },
      system: 'employee',
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
      areaPageList: 'area/areaPageList',
      total: 'area/total',
      isfetchAreaPageList: 'area/isfetchAreaPageList'
    })
  },
  created () {
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '系统管理',
    },
    {
      path: 'employee_area',
      breadcrumbName: '行政区域'
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
    getProvinceList({}).then(data => {
      this.areaTreeData = [{
        key: '0',
        title: '全部区域',
        layer: 0,
        children: data.map(item => {
          item['key'] = item.item_value
          item['title'] = item.item_name
          item['layer'] = 1
          return item
        })
      }]
    }).catch(err => {
      this.$message.error(err.msg)
    })
  },
  methods: {
    ...mapActions({
      fetchAreaPageList: 'area/fetchAreaPageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'area/resetAllData'
    }),
    getAreaList () {
      this.fetchAreaPageList({
        area_id: this.currentAreaId,
        area_name: '',
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.total
        }
      })
    },
    onLoadChildrenData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        getAreaList({ area_id: treeNode.dataRef.key, area_name: '' })
          .then(data => {
            treeNode.dataRef.children = data.map(item => {
              let temp = {}
              temp['key'] = item.area_id
              temp['title'] = item.area_name
              temp['layer'] = item.layer
              return temp
            })
            this.areaTreeData = [...this.areaTreeData]
            resolve()
          })
      })
    },
    onTreeSelect (selectedKeys, e) {
      const { selected, selectedNodes, node, event } = e
      // console.log(node)
      this.currentAreaId = selectedKeys[0]
      this.currentAreaName = node.title
      this.areaForm = Object.assign({}, this.areaForm, {
        pid: this.currentAreaId,
        top_area_name: this.currentAreaName,
        layer: node.$options.propsData.dataRef.layer + 1
      })
      this.getAreaList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAreaList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAreaList()
    },
    showEditModal (areaInfo) {
      this.isShowEditModal = true
      this.isEdit = false
      if (areaInfo) {
        this.isEdit = true
        this.title = '编辑区域'
        this.areaForm = Object.assign(this.areaForm, areaInfo, {})
      }
    },
    editOk () {
      this.$refs.areaFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editArea()
          } else {
            this.addArea()
          }
        } else {
          return false
        }
      })
    },
    addArea () {
      this.confirmLoading = true
      const areaForm = Object.assign(this.areaForm, { is_disabled: this.areaForm.validate ? 0 : 1 })
      addArea(areaForm).then(res => {
        this.$message.success('操作成功')
        this.getAreaList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editArea () {
      this.confirmLoading = true
      const params = Object.assign(this.areaForm, { is_disabled: this.areaForm.validate ? 0 : 1 })
      editArea(params).then(res => {
        this.$message.success('修改成功')
        this.getAreaList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteArea (area_id) {
      const params = {
        area_id: area_id
      }
      deleteArea(params).then(res => {
        this.$message.success('删除成功')
        this.getAreaList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.areaFormRef.resetFields()
      this.areaForm = Object.assign(this.areaForm, areaForm)
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getAreaList()
    },
    changeColumns (columns) {
      this.tableColumns = columns
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
    this.resetAllData()
    this.tableList.removeEventListener('scroll', this.handleTableScroll)
  }
}
</script>

<style lang="less" scoped>
.employee-area {
  padding: 5px;
  overflow: scroll;
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
.employee-area-table {
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