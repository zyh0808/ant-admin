<template>
  <div>
    <a-form class="search-form" :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }" :form="searchForm" @submit="handleSearch">
      <a-row type="flex" justify="space-between">
        <a-col :span="6">
          <a-form-item label="选择1">
            <a-tree-select v-model="value" show-search
              :dropdown-style=" { maxHeight: '400px' , overflow: 'auto' }"
              placeholder="请选择" allow-clear tree-default-expand-all>
              <a-tree-select-node key="0-1" value="parent 1" title="parent 1">
                <a-tree-select-node key="0-1-1" value="parent 1-0"
                  title="parent 1-0">
                  <a-tree-select-node key="random" :selectable="false"
                    value="leaf1" title="my leaf" />
                  <a-tree-select-node key="random1" value="leaf2"
                    title="your leaf" />
                </a-tree-select-node>
                <a-tree-select-node key="random2" value="parent 1-1"
                  title="parent 1-1">
                  <a-tree-select-node key="random3" value="sss">
                    <b slot="title" style="color: #08c">sss</b>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="查询项">
            <a-input v-decorator="['note']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="日期">
            <a-range-picker v-decorator="['range-picker']"
              :placeholder="['开始日期', '结束日期' ]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span=" 24" :style="{ textAlign: 'right' }">
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
          <!-- <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
            更多
            <a-icon :type="expand ? 'up' : 'down'" />
          </a> -->
        </a-col>
      </a-row>
    </a-form>
    <!-- 多层表头 -->
    <!-- <a-table :columns="columns" :data-source="data" bordered size="middle"
    :scroll="{ x: 'calc(700px + 50%)', y: 440 }" /> -->
    <!-- 表格伸缩 -->
    <!-- <a-table bordered :columns="columns" :components="components"
    :data-source="data">
    <template v-slot:action>
      <a href="javascript:;">Delete</a>
    </template>
  </a-table> -->
    <!-- 可编辑表格 -->
    <a-table :columns="columns" :data-source="data" bordered>
      <template v-for="col in ['name', 'age', 'address']" :slot="col"
        slot-scope="text, record">
        <div :key="col">
          <a-input v-if="record.editable" style="margin: -5px 0" :value="text"
            @change="e => handleChange(e.target.value, record.key, col)" />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm title="确定取消?" @confirm="() => cancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''"
              @click="() => edit(record.key)">Edit</a>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
// import Vue from 'vue'
// import VueDraggableResizable from 'vue-draggable-resizable'

// Vue.component('vue-draggable-resizable', VueDraggableResizable)

// const columns = [
//   {
//     title: 'Date',
//     dataIndex: 'date',
//     width: 200
//   },
//   {
//     title: 'Amount',
//     dataIndex: 'amount',
//     width: 100
//   },
//   {
//     title: 'Type',
//     dataIndex: 'type',
//     width: 100
//   },
//   {
//     title: 'Note',
//     dataIndex: 'note',
//     width: 100
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     scopedSlots: { customRender: 'action' }
//   }
// ]


// const data = [
//   {
//     key: 0,
//     date: '2018-02-11',
//     amount: 120,
//     type: 'income',
//     note: 'transfer'
//   },
//   {
//     key: 1,
//     date: '2018-03-11',
//     amount: 243,
//     type: 'income',
//     note: 'transfer'
//   },
//   {
//     key: 2,
//     date: '2018-04-11',
//     amount: 98,
//     type: 'income',
//     note: 'transfer'
//   }
// ]
// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//     width: 100,
//     fixed: 'left',
//     filters: [
//       {
//         text: 'Joe',
//         value: 'Joe'
//       },
//       {
//         text: 'John',
//         value: 'John'
//       }
//     ],
//     onFilter: (value, record) => record.name.indexOf(value) === 0
//   },
//   {
//     title: 'Other',
//     children: [
//       {
//         title: 'Age',
//         dataIndex: 'age',
//         key: 'age',
//         width: 200,
//         sorter: (a, b) => a.age - b.age
//       },
//       {
//         title: 'Address',
//         children: [
//           {
//             title: 'Street',
//             dataIndex: 'street',
//             key: 'street',
//             width: 200
//           },
//           {
//             title: 'Block',
//             children: [
//               {
//                 title: 'Building',
//                 dataIndex: 'building',
//                 key: 'building',
//                 width: 100
//               },
//               {
//                 title: 'Door No.',
//                 dataIndex: 'number',
//                 key: 'number',
//                 width: 100
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     title: 'Company',
//     children: [
//       {
//         title: 'Company Address',
//         dataIndex: 'companyAddress',
//         key: 'companyAddress',
//         width: 200
//       },
//       {
//         title: 'Company Name',
//         dataIndex: 'companyName',
//         key: 'companyName'
//       }
//     ]
//   },
//   {
//     title: 'Gender',
//     dataIndex: 'gender',
//     key: 'gender',
//     width: 80,
//     fixed: 'right'
//   }
// ]
// const data = []
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     name: 'John Brown',
//     age: i + 1,
//     street: 'Lake Park',
//     building: 'C',
//     number: 2035,
//     companyAddress: 'Lake Street 42',
//     companyName: 'SoftLake Co',
//     gender: 'M'
//   })
// }

//拖拽
// const draggingMap = {}
// columns.forEach(col => {
//   console.log(col)
//   draggingMap[col.key] = col.width
// })
// const draggingState = Vue.observable(draggingMap);
// const ResizeableTitle = (h1) => {
//   // const { props, children } = h1
//   const props = h1.props
//   const children = h1.children
//   let thDom = null;
//   const { key, ...restProps } = props;
//   const col = columns.find(col => {
//     const k = col.dataIndex || col.key;
//     return k === key;
//   });
//   if (!col.width) {
//     return <th {...restProps}>{children}</th>;
//   }
//   const onDrag = x => {
//     draggingState[key] = 0;
//     col.width = Math.max(x, 1);
//   };

//   const onDragstop = () => {
//     draggingState[key] = thDom.getBoundingClientRect().width;
//   };
//   return (
//     <th {...restProps} v-ant-ref={r => (thDom = r)} width={col.width} class="resize-table-th">
//       {children}
//       <vue-draggable-resizable
//         key={col.key}
//         class="table-draggable-handle"
//         w={10}
//         x={draggingState[key] || col.width}
//         z={1}
//         axis="x"
//         draggable={true}
//         resizable={false}
//         onDragging={onDrag}
//         onDragstop={onDragstop}
//       ></vue-draggable-resizable>
//     </th>
//   )
// }

//可编辑
const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'age',
    dataIndex: 'age',
    width: '15%',
    scopedSlots: { customRender: 'age' },
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '40%',
    scopedSlots: { customRender: 'address' },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default {
  data () {
    this.cacheData = data.map(item => ({ ...item }))
    return {
      data,
      columns,
      editingKey: '',
      treeExpandedKeys: [],
      value: undefined,
      searchForm: this.$form.createForm(this, { name: 'search_form' }),
      expand: false
    }
  },
  methods: {
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((err, fieldsValue) => {
        const rangePicker = fieldsValue['range-picker']
        console.log(rangePicker)
      })
    },
    handleReset () {
      this.searchForm.resetFields()
    },
    toggle () {
      this.expand = !this.expand
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      console.log(target)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save (key) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => key === item.key)[0]
      const targetCache = newCacheData.filter(item => key === item.key)[0]
      if (target && targetCache) {
        //delete 删除对象属性
        delete target.editable
        this.data = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    }
  }
  // data () {
  //   this.components = {
  //     header: {
  //       cell: ResizeableTitle
  //     }
  //   }
  //   return {
  //     data,
  //     columns
  //   }
  // }
}
</script>

<style lang="scss">
.resize-table-th {
  position: relative;
  .table-draggable-handle {
    transform: none !important;
    position: absolute;
    height: 100% !important;
    bottom: 0;
    left: auto !important;
    right: -5px;
    cursor: col-resize;
    touch-action: none;
  }
}

.editable-row-operations a {
  margin-right: 8px;
}

.search-form {
  padding: 10px !important;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  margin-bottom: 20px !important;
}

.search-form .ant-form-item {
  display: flex;
  margin-bottom: 0;
}
.search-form .ant-form-item-control-wrapper {
  width: 100%;
  .ant-form-item-children {
    width: 100%;
  }
}
</style>