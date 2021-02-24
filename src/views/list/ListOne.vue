<template>
  <div>
    <a-form class="search-form" :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }" :form="searchForm" @submit="handleSearch">
      <a-row class="searchRow">
        <a-col :span="6">
          <a-form-item label="药品名称">
            <a-input v-decorator="['dragName']" placeholder="请输入药品名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="项目号">
            <a-input v-decorator="['proNo']" placeholder="请输入项目号" />
          </a-form-item>
        </a-col>
        <a-col :span=" 12" :style="{ textAlign: 'right' }">
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
    <div class="main">
      <a-row class="btnRow" type="flex" justify="end">
        <a-button icon="search">
          重置
        </a-button>
        <a-button icon="search">
          新增
        </a-button>
        <a-button type="primary" icon="search">
          导出
        </a-button>
        <a-button icon="search">
          导入
        </a-button>
        <a-space :size="12">
          <a-icon type="reload" />
          <a-icon type="setting" />
        </a-space>
      </a-row>
      <a-table :columns="columns" :data-source="list" class="table-one">
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {},
  };
  if (index === 3) {
    obj.attrs.colSpan = 0;
  }
  return obj;
};
export default {
  data () {
    // const columns = [
    //   {
    //     title: 'Name',
    //     dataIndex: 'name',
    //     customRender: (text, row, index) => {
    //       if (index === 3) {
    //         return {
    //           children: <a href="javascript:;">{text}</a>,
    //           attrs: {
    //             colSpan: 5
    //           }
    //         }
    //       } else {
    //         return <a href="javascript:;" > {text}</a>
    //       }
    //     }
    //   },
    //   {
    //     title: 'Age',
    //     dataIndex: 'age',
    //     customRender: renderContent,
    //     sorter: (a, b) => a.age - b.age,
    //   },
    //   {
    //     title: 'Home phone',
    //     colSpan: 2,
    //     dataIndex: 'tel',
    //     customRender: (value, row, index) => {
    //       const obj = {
    //         children: value,
    //         attrs: {},
    //       };
    //       if (index === 1) {
    //         obj.attrs.rowSpan = 2;
    //       }
    //       if (index === 2) {
    //         obj.attrs.rowSpan = 0;
    //       }
    //       if (index === 3) {
    //         obj.attrs.colSpan = 0;
    //       }
    //       return obj;
    //     },
    //   },
    //   {
    //     title: 'Phone',
    //     colSpan: 0,
    //     dataIndex: 'phone',
    //     customRender: renderContent,
    //   },
    //   {
    //     title: 'Address',
    //     dataIndex: 'address',
    //     customRender: renderContent,
    //   }
    // ]
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: 100,
        fixed: 'left'
      },
      {
        title: '药品名称',
        dataIndex: 'name',
        width: 150,
        fixed: 'left'
      },
      {
        title: '项目号',
        dataIndex: 'proKey',
        width: 150
      },
      {
        title: '规格',
        dataIndex: 'standard',
        width: 150
      },
      {
        title: '药品批次号',
        dataIndex: 'draBatch',
        width: 150
      },
      {
        title: '药品编号',
        dataIndex: 'dragNumber',
        width: 150
      },
      {
        title: '入库数量',
        dataIndex: 'inNumber',
        width: 150
      },
      {
        title: '包装',
        dataIndex: 'park',
        width: 150
      },
      {
        title: '保存条件',
        dataIndex: 'saveCondition',
        width: 150
      },
      {
        title: '温度',
        dataIndex: 'temperature',
        width: 150,
        fixed: 'right'
      }
    ]
    return {
      columns
    }
  },
  computed: {
    ...mapGetters({
      list: 'list/list'
    })
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.table-one {
  background-color: white;
}
.search-form {
  margin: 10px 0;
  background-color: #fff;
  .searchRow {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    .ant-form-item {
      margin-bottom: 0;
      margin-top: 10px;
    }
  }
}
.main {
  background-color: white;
  padding: 5px 10px;
  .btnRow {
    height: 60px;
    // line-height: 60px;
    align-items: center;
    .ant-btn {
      margin-right: 10px;
    }
  }
}
</style>