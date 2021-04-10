<template>
  <div class="entry-input">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"></pageHeader>
    </div>
    <div class="entry-input-deail">
      <!-- <a-card title="订单信息" :bordered="false" style="width: 100%">
        <template slot="extra">
          <a-button type="primary" icon="edit" @click="showDrawer('order')">
            修改
          </a-button>
        </template>
        <orderInfoDetail v-if="cards[0]"></orderInfoDetail>
        <a-button v-else icon="plus" @click="showDrawer('order')">创建订单信息
        </a-button>
      </a-card> -->
      <a-card title="项目信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <template slot="extra">
          <a-button v-if="cards[1]" type="primary" icon="edit"
            @click="showDrawer('project')">
            修改
          </a-button>
        </template>
        <projectInfoDetail v-if="cards[1]"></projectInfoDetail>
        <a-button v-else icon="plus" @click="showDrawer('project')">
          创建项目信息
        </a-button>
      </a-card>
      <a-card title="药品信息" :bordered="false"
        style="margin-top:10px; width: 100%">
        <template slot="extra">
          <a-button icon="plus" @click="showDrawer('drug')"
            :disabled="!cards[1]">
            添加
          </a-button>
          <a-button type="primary" icon="save" :disabled="!drugList.length"
            style="margin-left: 10px">
            保存
          </a-button>
        </template>
        <drugList style="margin-top:10px; width: 100%" @showDrawer="showDrawer"
          listType="edit">
        </drugList>
      </a-card>
    </div>
    <a-drawer :title="drawerTitle" :width="drawerWidth" :visible="drawerVisible"
      :body-style="{ paddingBottom: '80px' }" @close="onClose">
      <orderInfoEdit v-if="drawerType === 'order'" :mode="mode"></orderInfoEdit>
      <projectInfoEdit v-else-if="drawerType === 'project'" :mode="mode">
      </projectInfoEdit>
      <drugInfoEdit v-else :mode="mode"></drugInfoEdit>
      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="onSave">
          保存
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import pageHeader from '@/components/pageHeader.vue'
import projectInfoEdit from '@/components/entry/edit/projectInfoEdit'
import drugInfoEdit from '@/components/entry/edit/drugInfoEdit'
import projectInfoDetail from '@/components/entry/detail/projectInfoDetail.vue'
import drugList from '@/components/entry/list/drugList'
export default {
  data () {
    return {
      system: 'entry',
      drawerType: 'order',
      drawerTitle: '',
      drawerWidth: 300,
      cards: [false, false, false],
      drawerVisible: false
    }
  },
  components: {
    pageHeader,
    projectInfoEdit,
    drugInfoEdit,
    projectInfoDetail,
    drugList
  },
  created () {
    this.mode = this.$route.params.mode || 'input'
    const pageHeaderPoutes = this.mode === 'edit' ? [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_search',
      breadcrumbName: '入库订单查询'
    },
    {
      path: 'entry_input',
      breadcrumbName: '入库订单修改'
    }] : [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'entry_input',
      breadcrumbName: '入库订单录入'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      drugForm: 'input/drugForm',
      drugList: 'input/drugList'
    })
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      setDrugList: 'input/setDrugList',
      resetAllData: 'input/resetAllData'
    }),
    showDrawer (type = 'drug') {
      this.drawerVisible = true
      this.drawerType = type
      this.drawerTitle = type === 'order' ? '添加订单信息' : type === 'project' ? '添加项目信息' : type === 'drug' ? '添加药品信息' : ''
      this.drawerWidth = type === 'drug' ? 700 : 300
    },
    onClose () {
      this.drawerVisible = false
    },
    onSave () {
      const saves = {
        order: this.saveOrder,
        project: this.saveProject,
        drug: this.saveDrug
      }
      const save = saves[this.drawerType]
      save()
    },
    saveOrder () {
      this.cards[0] = true
      this.drawerVisible = false
    },
    saveProject () {
      this.cards[1] = true
      this.drawerVisible = false
    },
    saveDrug () {
      this.drawerVisible = false
      this.setDrugList(this.drugForm)
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.entry-input {
  padding: 5px;
}
.entry-input-deail {
  // background-color: #fff;
  // margin-top: 10px;
  padding: 10px 5px;
}
/deep/ .ant-drawer-body {
  padding: 0;
}
/deep/ .ant-card-body {
  padding: 10px;
}
</style>