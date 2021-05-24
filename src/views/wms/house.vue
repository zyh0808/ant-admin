<template>
  <div class="wms-house" @scroll="handleScroll($event)">
    <div class="title">
      <!-- <a-page-header style="backgroundColor:#fff" title="仓库列表"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" /> -->
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="content">
      <div class="house-search">
        <a-form-model layout="inline" :model="searchForm" ref="searchFormRef" class="search-form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row class="searchRow">
            <a-col :span="6">
              <a-form-model-item label="仓库编码">
                <a-input v-model="searchForm.house_id" placeholder="请输入" allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="仓库名称">
                <a-input v-model="searchForm.house_name" placeholder="请输入" allowClear />
              </a-form-model-item>
            </a-col>
            <a-col :span="6" :offset="6">
              <a-form-model-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
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
      <div class="house-table">
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
        <a-table :columns="tableColumns" ref="tableRef" :data-source="houseList" class="table-list" :rowKey="record => record.house_id" :loading="isfetchHouseList" :pagination="pagination" @change="handleTableChange" @showSizeChange="onShowSizeChange">
          <!-- :scroll="{x:1070}" -->
          <span slot="validate" slot-scope="validate">
            <!-- <a-switch :checked="validate" disabled /> -->
            <a-tag v-if="validate" color="green">有效</a-tag>
            <a-tag v-else color="red">无效</a-tag>
          </span>
          <div slot="expandedRowRender" slot-scope="record">
            <a-row class="table-row">
              <a-col :span="8">面积: <span>{{record.area_size}}</span></a-col>
              <a-col :span="8">楼层数: <span>{{record.floors}}</span></a-col>
              <a-col :span="8">传真: <span>{{record.fax}}</span></a-col>
            </a-row>
            <a-row class="table-row">
              <a-col :span="8">省: <span>{{record.province_name}}</span></a-col>
              <a-col :span="8">市: <span>{{record.city_name}}</span></a-col>
              <a-col :span="8">区/县: <span>{{record.county_name}}</span></a-col>
            </a-row>
            <a-row class="table-row">
              <a-col :span="8">街道/镇: <span>{{record.town_name}}</span></a-col>
              <a-col :span="8">社区/村: <span>{{record.village_name}}</span>
              </a-col>
              <a-col :span="8">邮编: <span>{{record.postcode}}</span></a-col>
            </a-row>
            <a-row class="table-row">
              详细地址: <span>{{record.addr}}</span>
            </a-row>
          </div>
          <template slot="action" slot-scope="record">
            <a-button type="link" size="small" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="showSettingModal(record)">
              设置温区
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm v-if="houseList.length" title="确认删除吗?" cancelText="取消" okText="确认" @confirm="() => deleteHouse(record.house_id)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
        <a-table :columns="tableColumns" :class="showSticky?'sticky-table'  : ''" ref="stickyTableRef" :style="{display: 'none',width: stickyWidth + 'px'}" table-layout="fixed">
        </a-table>
      </div>
      <a-modal :title="title" :visible="isShowEditModal" :confirm-loading="confirmLoading" @ok="editOk" @cancel="editCancel" cancelText="取消" okText="确定" :width="1000">
        <a-form-model ref="houseFormRef" :model="houseForm" :rules="houseFormRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="仓库编码" prop="house_id" ref="house_id">
                <a-input v-model="houseForm.house_id" placeholder="请输入" @blur="
          () => {
            $refs.house_id.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="仓库名称" prop="house_name" ref="house_name">
                <a-input v-model="houseForm.house_name" placeholder="请输入" @blur="
          () => {
            $refs.house_name.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="仓库分类" prop="category">
                <!-- <a-select v-model="houseForm.category" placeholder="请选择">
                  <a-select-option :value=0>
                    自有
                  </a-select-option>
                  <a-select-option :value=1>
                    租赁
                  </a-select-option>
                </a-select> -->
                <a-radio-group v-model="houseForm.category">
                  <a-radio-button :value=0>
                    自有
                  </a-radio-button>
                  <a-radio-button :value=1>
                    租赁
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="面积" prop="area_size" ref="area_size">
                <a-input v-model="houseForm.area_size" placeholder="请输入" @blur="
          () => {
            $refs.area_size.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="楼层数" prop="floors" ref="floors">
                <a-input-number v-model="houseForm.floors" placeholder="请输入" :min="0" @blur="
          () => {
            $refs.floors.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="负责人" prop="manager" ref="manager">
                <a-input v-model="houseForm.manager" placeholder="请输入" @blur="
          () => {
            $refs.manager.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="联系电话" prop="telephone" ref="telephone">
                <a-input v-model="houseForm.telephone" placeholder="请输入" @blur="
          () => {
            $refs.telephone.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="传真" prop="fax" ref="fax">
                <a-input v-model="houseForm.fax" placeholder="请输入" @blur="
          () => {
            $refs.fax.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="省份" prop="province_id" ref="province_id">
                <a-select v-model="houseForm.province_id" @select="selectProvince" :loading="isfetchProvinceList" placeholder="请选择">
                  <a-select-option v-for="item in provinceList" :value="item.item_value" :key="item.item_value">
                    {{item.item_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="市区" prop="city_id" ref="city_id">
                <a-select v-model="houseForm.city_id" @select="selectCity" :loading="isfetchCityList" :disabled="cityList.length === 0" placeholder="请选择">
                  <a-select-option v-for="item in cityList" :value="item.item_value" :key="item.item_value">
                    {{item.item_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="县/区" prop="county_id" ref="county_id">
                <a-select v-model="houseForm.county_id" @select="selectCounty" :loading="isfetchCountyList" :disabled="countyList.length === 0" placeholder="请选择">
                  <a-select-option v-for="item in countyList" :value="item.item_value" :key="item.item_value">
                    {{item.item_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="街道/镇" prop="town_id" ref="town_id">
                <a-select v-model="houseForm.town_id" @select="selectTown" :loading="isfetchTownList" :disabled="townList.length === 0" placeholder="请选择">
                  <a-select-option v-for="item in townList" :value="item.item_value" :key="item.item_value">
                    {{item.item_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="社区/村" prop="village_id" ref="village_id">
                <a-select v-model="houseForm.village_id" @select="selectVillage" :loading="isfetchVillageList" :disabled="villageList.length === 0" placeholder="请选择">
                  <a-select-option v-for="item in villageList" :value="item.item_value" :key="item.item_value">
                    {{item.item_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="邮编" prop="postcode" ref="postcode">
                <a-input v-model="houseForm.postcode" placeholder="请输入" @blur="
          () => {
            $refs.postcode.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="详细地址" prop="addr" ref="addr" :label-col="{ span: 2 }" :wrapper-col="{ span: 16 }">
            <a-input v-model="houseForm.addr" prop="addr" @blur="
          () => {
            $refs.addr.onFieldBlur()
          }" />
          </a-form-model-item>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="经度" prop="lng" ref="lng">
                <a-input v-model="houseForm.lng" placeholder="请输入" @blur="
          () => {
            $refs.lng.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="纬度" prop="lat" ref="lat">
                <a-input v-model="houseForm.lat" placeholder="请输入" @blur="
          () => {
            $refs.lat.onFieldBlur()
          }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="排序码" prop="sort_code">
                <a-input-number v-model="houseForm.sort_code" :min="1" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效">
                <a-switch v-model="houseForm.validate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="备注" :label-col="{ span: 2 }" :wrapper-col="{ span: 16 }">
            <a-input v-model="houseForm.memo" placeholder="请输入" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal :title="setTitle" :visible="showTempSettingModal" @cancel="showTempSettingModal = false" :footer="null" :width="1000">
        <a-transfer :data-source="tempRangeList" :filter-option="(inputValue, item) => item.title.indexOf(inputValue)
          !== -1" :titles="['温区列表（未选）', '温区列表（已选）']" :target-keys="tempList" :show-select-all="false" @change="onSetChange">
          <template slot="children" slot-scope="{
          props: { filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }">
            <a-table :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          " :columns="selecTableColumns" :data-source="filteredItems" size="small" :pagination="false" class="table-one" :rowKey="record => record.temp_range_id" />
          </template>
        </a-transfer>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import debounce from '@/js/debounce.js'
import { addHouse, editHouse, deleteHouse, removeHouseTempRange, addHouseTempRange } from '@/api/wms.js'
import difference from 'lodash/difference';
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
  house_name: ''
}

const houseForm = {
  house_id: '',
  house_name: '',
  category: 0,
  area_size: '',
  floors: 0,
  manager: '',
  telephone: '',
  fax: '',
  province_id: null,
  city_id: null,
  county_id: null,
  town_id: null,
  village_id: null,
  province_name: '',
  city_name: '',
  county_name: '',
  town_name: '',
  village_name: '',
  addr: '',
  postcode: '',
  lng: '',
  lat: '',
  sort_code: 1,
  validate: true,
  memo: ''
}
export default {
  data () {
    const columns = [
      {
        title: '仓库编码',
        dataIndex: 'house_id',
        value: 'house_id',
        // width: 150,
        // fixed: 'left',
        ellipsis: true
      },
      {
        title: '仓库名称',
        dataIndex: 'house_name',
        value: 'house_name',
        // width: 150,
        // fixed: 'left',
        ellipsis: true
      },
      {
        title: '仓库分类',
        dataIndex: 'categoryName',
        value: 'categoryName',
        // width: 150,
        ellipsis: true
      },
      {
        title: '负责人',
        dataIndex: 'manager',
        value: 'manager',
        // width: 150,
        ellipsis: true
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        value: 'telephone',
        // width: 150,
        ellipsis: true
      },
      {
        title: '是否有效',
        dataIndex: 'validate',
        value: 'validate',
        // width: 100,
        key: 'validate',
        scopedSlots: { customRender: 'validate' }
      },
      {
        title: '操作',
        key: 'action',
        value: 'action',
        // fixed: 'right',
        width: 220,
        scopedSlots: { customRender: 'action' }
      }
    ]
    const selecTableColumns = [
      {
        title: '温区编码',
        dataIndex: 'temp_range_id',
        ellipsis: true
      },
      {
        title: '温区名称',
        dataIndex: 'temp_range_name',
        ellipsis: true
      }
    ]
    return {
      columns,
      tableColumns: columns,
      selecTableColumns,
      searchForm: {
        ...searchForm
      },
      title: '添加申办方信息',
      isShowEditModal: false,
      confirmLoading: false,
      houseForm: { ...houseForm },
      houseFormRules: {
        house_id: [{ required: true, message: '请输入仓库编码', trigger: 'blur' }],
        house_name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择仓库分类', trigger: 'blur' }],
        area_size: [{ required: true, message: '请输入面积', trigger: 'blur' }],
        floors: [{ required: true, message: '请输入楼层数', trigger: 'blur' }],
        manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        province_id: [{ required: true, message: '请选择省', trigger: 'blur' }],
        city_id: [{ required: true, message: '请选择市', trigger: 'blur' }],
        county_id: [{ required: true, message: '请选择区/县', trigger: 'blur' }],
        town_id: [{ required: true, message: '请选择街道/镇', trigger: 'blur' }],
        village_id: [{ required: true, message: '请选择社区/村', trigger: 'blur' }],
        addr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        postcode: [{ required: true, message: '请输入邮编', trigger: 'blur' }]
      },
      isEdit: false,
      houseInfo: {},
      pagination: { ...pagination },
      showTempSettingModal: false,
      setTitle: '设置温区',
      transferCheckedKeys: [],
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
      path: 'wms_house',
      breadcrumbName: '仓库列表'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      isfetchHouseList: 'house/isfetchHouseList',
      houseList: 'house/houseList',
      tempRangeList: 'house/tempRangeList',
      setTempList: 'house/setTempList',
      houseTotal: 'house/houseTotal',
      isfetchProvinceList: 'area/isfetchProvinceList',
      isfetchCityList: 'area/isfetchCityList',
      isfetchCountyList: 'area/isfetchCountyList',
      isfetchTownList: 'area/isfetchTownList',
      isfetchVillageList: 'area/isfetchVillageList',
      provinceList: 'area/provinceList',
      cityList: 'area/cityList',
      countyList: 'area/countyList',
      townList: 'area/townList',
      villageList: 'area/villageList'
    }),
    tempList () {
      return this.setTempList ? this.setTempList.map(item => item.temp_range_id) : []
    }
  },
  mounted () {
    this.tableList = this.$refs.tableRef.$el
    this.stickyWidth = this.tableList.clientWidth
    this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    // this.stickyWidth = this.$refs.tableRef.$el.querySelector('.table-list').clientWidth
    // this.tableList = document.querySelector(".table-list")
    // this.tableList.addEventListener('scroll', this.handleTableScroll, true)
    this.getHouseList()
  },
  methods: {
    ...mapActions({
      fetchHousePageList: 'house/fetchHousePageList',
      fetchTempRangeList: 'house/fetchTempRangeList',
      fetchSetTempList: 'house/fetchSetTempList',
      fetchProvinceList: 'area/fetchProvinceList',
      fetchCityList: 'area/fetchCityList',
      fetchCityList: 'area/fetchCityList',
      fetchCountyList: 'area/fetchCountyList',
      fetchTownList: 'area/fetchTownList',
      fetchVillageList: 'area/fetchVillageList'
    }),
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAreaData: 'area/resetAllData'
    }),
    getHouseList () {
      const params = {
        house_id: this.searchForm.house_id,
        house_name: this.searchForm.house_name,
        page_num: this.pagination.current,
        page_size: this.pagination.pageSize,
        success: () => {
          this.pagination.total = this.houseTotal
        }
      }
      this.fetchHousePageList(params)
    },
    handleSearch: debounce(function () {
      this.getHouseList()
    }),
    handleReset () {
      this.searchForm = Object.assign({}, searchForm)
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getHouseList()
    },
    onShowSizeChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getHouseList()
    },
    showEditModal (info) {
      this.isShowEditModal = true
      this.isEdit = false
      this.title = '添加仓库'
      this.fetchProvinceList({})
      if (info) {
        this.isEdit = true
        this.title = '编辑仓库'
        this.fetchCityList(info.province_id)
        this.fetchCountyList(info.city_id)
        this.fetchTownList(info.county_id)
        this.fetchVillageList(info.town_id)
        this.houseForm = Object.assign(this.houseForm, info, {})
      }
    },
    selectProvince (value) {
      const province = this.provinceList.find(item => item.item_value === value)
      this.houseForm = Object.assign(this.houseForm,
        { province_name: province ? province.item_name : '' })
      this.fetchCityList(value)
    },
    selectCity (value) {
      const city = this.cityList.find(item => item.item_value === value)
      this.houseForm = Object.assign(this.houseForm,
        { city_name: city ? city.item_name : '' })
      this.fetchCountyList(value)
    },
    selectCounty (value) {
      const county = this.countyList.find(item => item.item_value === value)
      this.houseForm = Object.assign(this.houseForm,
        { county_name: county ? county.item_name : '' })
      this.fetchTownList(value)
    },
    selectTown (value) {
      const town = this.townList.find(item => item.item_value === value)
      this.houseForm = Object.assign(this.houseForm,
        { town_name: town ? town.item_name : '' })
      this.fetchVillageList(value)
    },
    selectVillage (value) {
      const village = this.villageList.find(item => item.item_value === value)
      this.houseForm = Object.assign(this.houseForm,
        { village_name: village ? village.item_name : '' })
    },
    editOk () {
      this.$refs.houseFormRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.editHouse()
          } else {
            this.addHouse()
          }
        } else {
          return false
        }
      });
    },
    addHouse () {
      this.confirmLoading = true
      const params = Object.assign(this.houseForm,
        { is_disabled: this.houseForm.validate ? 0 : 1 }
      )
      addHouse(params).then(res => {
        this.$message.success('操作成功')
        this.getHouseList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editHouse () {
      this.confirmLoading = true
      const params = Object.assign(this.houseForm,
        { is_disabled: this.houseForm.validate ? 0 : 1 }
      )
      editHouse(params).then(res => {
        this.$message.success('修改成功')
        this.getHouseList()
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    deleteHouse (house_id) {
      const params = {
        house_id: house_id
      }
      deleteHouse(params).then(res => {
        this.$message.success('删除成功')
        this.getHouseList()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.$refs.houseFormRef.resetFields()
      this.houseForm = Object.assign({}, houseForm)
      this.resetAreaData()
      this.isShowEditModal = false
      this.confirmLoading = false
    },
    showSettingModal (info) {
      this.showTempSettingModal = true
      this.houseInfo = info
      this.fetchTempRangeList({
        temp_range_id: '',
        temp_range_name: ''
      })
      this.fetchSetTempList({
        house_id: info.house_id
      })
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      const that = this
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          if (selected) {
            that.transferCheckedKeys = selectedRows.map(item => {
              return item.key
            })
          } else {
            that.transferCheckedKeys = []
          }
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect ({ key }, selected) {
          if (selected) {
            that.transferCheckedKeys.push(key)
          } else {
            const index = that.transferCheckedKeys.findIndex(item => item === key)
            that.transferCheckedKeys.splice(index, 1)
          }
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      }
    },
    onSetChange (targetKeys, direction) {
      if (direction === 'left') {
        removeHouseTempRange({
          house_id: this.houseInfo.house_id,
          temp_range_ids: this.transferCheckedKeys
        }).then(res => {
          this.$message.success('操作成功')
          this.fetchSetTempList({
            house_id: this.houseInfo.house_id
          })
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        addHouseTempRange({
          house_id: this.houseInfo.house_id,
          temp_range_ids: this.transferCheckedKeys
        }).then(res => {
          this.$message.success('操作成功')
          this.fetchSetTempList({
            house_id: this.houseInfo.house_id
          })
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    reloadList () {
      this.pagination = Object.assign({}, pagination)
      this.getHouseList()
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
.wms-house {
  padding: 5px;
}
.content {
  margin-top: 10px;
  padding: 5px;
  .house-search {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px 0;
    .search-form {
      margin: 10px 20px;
      .searchRow {
        height: 40px;
        line-height: 40px;
        align-items: center;
        padding: 0 20px;
        .ant-form-item {
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }
  .house-table {
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