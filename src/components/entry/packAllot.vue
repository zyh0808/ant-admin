<template>
  <div class="pack-allot">
    <a-button icon="plus" type="dashed" @click="showAddModal" block
      style=" margin-bottom:10px">新增装箱流水线</a-button>
    <a-table :columns="packTableColumns" ref="tableRef" :data-source="packList"
      :rowKey="record => record.index" :pagination="false" class="pack-table">
      <template slot="idList" slot-scope="list">
        <span>
          {{ list && list.join(",") }}
        </span>
      </template>
      <template slot="nameList" slot-scope="list">
        <span>
          {{ list && list.join(",") }}
        </span>
      </template>
      <template slot="roleList" slot-scope="list">
        <span>
          {{ list && list.join(",") }}
        </span>
      </template>
      <template slot="action" slot-scope="text, record, index">
        <a-button type="link" size="small" @click="deleteAllot(index)">
          删除
        </a-button>
      </template>
    </a-table>
    <a-modal title="作业员工选择" :visible="isShowEmpSelectModal" @ok="empSelectSave"
      @cancel="empSelectCancel" :bodyStyle="{ height: '600px'}" :width="800">
      <a-form :form="packForm" layout="inline">
        <a-form-item label="装箱数量">
          <a-input-number :min="0"
            v-decorator="['packing_cnt', { rules: [{ required: true, message: '请输入装箱数量' }] }]"
            placeholder="请输入" />
        </a-form-item>
        <a-form-item label="员工姓名">
          <a-input v-decorator="['username']" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="员工角色">
          <a-select v-decorator="['role_id']" placeholder="请选择"
            style="width:150px">
            <a-select-option v-for="item in roleList" :key="item.role_id"
              :value="item.role_id">
              {{ item.role_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="small" @click="getEmpList">
            查询
          </a-button>
        </a-form-item>
      </a-form>
      <a-divider />
      <!-- <a-form-model layout="inline" :model="searchForm"
        :style="{ marginBottom: '10px' }">
        <a-form-model-item label="员工工号">
          <a-input v-model="searchForm.empId" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="员工姓名">
          <a-input v-model="searchForm.username" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="员工角色">
          <a-select v-model="searchForm.role_id" placeholder="请选择"
            style="width:150px">
            <a-select-option v-for="item in roleList" :key="item.role_id"
              :value="item.role_id">
              {{ item.role_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="search-btn-item">
          <a-button type="primary" size="small" @click="getEmpList">
            查询
          </a-button>
        </a-form-model-item>
      </a-form-model> -->
      <a-transfer :data-source="empList" :filter-option="(inputValue, item) => item.title.indexOf(inputValue)
          !== -1" :titles="['员工列表（未选）', '员工列表（已选）']"
        :target-keys="selectedList" :show-select-all="false"
        @change="transferChange">
        <template slot="children" slot-scope="{
          props: { filteredItems, selectedKeys},
          on: { itemSelectAll, itemSelect },
        }">
          <a-table :row-selection="
            getRowSelection({ selectedKeys, itemSelectAll, itemSelect })
          " :columns="empColumns" :data-source="filteredItems" size="small"
            :pagination="false" />
          <!-- :scroll="{y:350}" -->
        </template>
      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import difference from 'lodash/difference'
import { getRoleEmpList } from '@/api/system'
export default {
  data () {
    return {
      isfetchPackList: false,
      packTableColumns: [
        {
          title: '流水线',
          dataIndex: 'line_name',
          key: 'line_name'
        },
        {
          title: '操作人id',
          dataIndex: 'idList',
          key: 'idList',
          scopedSlots: { customRender: 'idList' },
          ellipsis: true
        },
        {
          title: '操作人名称',
          dataIndex: 'nameList',
          key: 'nameList',
          scopedSlots: { customRender: 'nameList' },
          ellipsis: true
        },
        {
          title: '操作人角色',
          dataIndex: 'roleList',
          key: 'roleList',
          scopedSlots: { customRender: 'roleList' },
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          value: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      isShowEmpSelectModal: false,
      // searchForm: {
      //   role_id: undefined,
      //   username: '',
      //   login_name: ''
      // },
      packForm: this.$form.createForm(this, { name: 'packForm' }),
      empColumns: [
        {
          title: '员工工号',
          dataIndex: 'title'
        },
        {
          title: '员工姓名',
          dataIndex: 'username'
        },
        {
          title: '角色名',
          dataIndex: 'roleName'
        }
      ],
      selectedList: [],
      empList: []
    }
  },
  computed: {
    ...mapGetters({
      packList: 'inhouse/packList',
      roleList: 'role/roleList',
      packUpInfo: 'inhouse/packUpInfo'
    })
  },
  created () {
    this.index = 1
  },
  methods: {
    ...mapMutations({
      addPackList: 'inhouse/addPackList',
      deletePackList: 'inhouse/deletePackList',
      resetPackList: 'inhouse/resetPackList'
    }),
    showAddModal () {
      // this.getEmpList()
      this.isShowEmpSelectModal = true
    },
    getEmpList () {
      const role_id = this.packForm.getFieldValue('role_id')
      const username = this.packForm.getFieldValue('username')
      const params = {
        role_id,
        username,
        login_name: ''
      }
      getRoleEmpList(params).then(res => {
        const role = this.roleList.find(item => item.role_id === role_id)
        // console.log(role)
        const list = res.map(item => {
          return {
            key: item.user_id,
            title: item.user_id,
            username: item.username,
            roleName: role.role_name
          }
        })
        this.empList = list
        // console.log(this.empList)
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    getRowSelection ({ selectedKeys, itemSelectAll, itemSelect }) {
      return {
        onSelectAll (selected, selectedRows) {
          // console.log(selectedRows, selected)
          const allKeys = selectedRows.map(item => item.key)
          const diffKeys = selected ? difference(allKeys, selectedKeys)
            : difference(selectedKeys, allKeys);
          itemSelectAll(diffKeys, selected)
        },
        onSelect ({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys
      }
    },
    empSelectSave () {
      if (this.selectedList.length === 0) {
        this.$message.error('请选择作业员工')
        return
      }
      this.packForm.validateFields((err, values) => {
        if (!err) {
          const persons = this.selectedList.map(item => {
            const person = this.empList.find(emp => item === emp.key)
            // console.log(person)
            return {
              drug_in_detail_id: this.packUpInfo.drug_in_detail_id,
              person_id: person.key,
              person_name: person.username,
              person_role: person.roleName
            }
          })
          const pack = {
            index: this.index++,
            line_name: '装箱流水线',
            drug_in_detail_id: this.packUpInfo.drug_in_detail_id,
            packing_task_no: '',
            packing_cnt: this.packForm.getFieldValue('packing_cnt'),
            packingtaskpersonllist: persons,
            idList: persons.map(item => item.person_id),
            nameList: persons.map(item => item.person_name),
            roleList: persons.map(item => item.person_role)
          }
          this.addPackList(pack)
          this.empSelectCancel()
        }
      })
    },
    empSelectCancel () {
      this.isShowEmpSelectModal = false
    },
    transferChange (targetKeys) {
      this.selectedList = targetKeys
    },
    deleteAllot (index) {
      this.deletePackList(index)
    }
  },
  beforeDestroy () {
    this.resetPackList()
  }
}
</script>

<style lang="less" scoped>
// .pack-table {
//   margin: 0 20px;
// }
/deep/ .ant-transfer {
  height: 430px;
}
/deep/ .ant-transfer-list-body {
  overflow: auto;
}
.search-btn-item {
  margin-right: 0;
}
</style>