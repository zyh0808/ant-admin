<template>
  <div class="pack-up-allot">
    <div class="title">
      <pageHeader :routes="pageHeaderRoutes" :basePath="system"
        :headerTitle="drugName"></pageHeader>
    </div>
    <a-card class="pack-up-allot-content" :bordered="false">
      <a-row>
        <a-col :span="12">
          <a-tabs class="allot-tabs">
            <a-tab-pane tab="装箱分配">
              <packAllot></packAllot>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col :span="12">
          <a-tabs class="allot-tabs">
            <a-tab-pane tab="上架分配">
              <upAllot></upAllot>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
      <div class="commit-btns">
        <a-button class="commit-btn" @click="$router.go(-1)">返回</a-button>
        <a-button type="primary" class="commit-btn" @click="handleCommit"
          style="margin-left: 10px" :disabled="!enableCommit"
          :loading="isSaving">保存</a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { packUpAllot } from '@/api/order'
import pageHeader from '@/components/pageHeader.vue'
import packAllot from '@/components/entry/packAllot.vue'
import upAllot from '@/components/entry/upAllot.vue'
export default {
  data () {
    return {
      isSaving: false,
      enableCommit: false,
      system: 'entry'
    }
  },
  components: {
    pageHeader,
    packAllot,
    upAllot
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes',
      packUpInfo: 'inhouse/packUpInfo',
      packList: 'inhouse/packList',
      upList: 'inhouse/upList'
    })
  },
  watch: {
    packList: {
      handler (list) {
        if (list.length !== 0 && this.upList.length !== 0) {
          this.enableCommit = true
        } else {
          this.enableCommit = false
        }
      },
      deep: true
    },
    upList: {
      handler (list) {
        if (list.length !== 0 && this.packList.length !== 0) {
          this.enableCommit = true
        } else {
          this.enableCommit = false
        }
      },
      deep: true
    }
  },
  created () {
    this.drugName = this.$route.params.drugName ? this.$route.params.drugName : ''
    const pageHeaderPoutes = [{
      path: '',
      breadcrumbName: '入库管理',
    },
    {
      path: 'pack_up_allot_list',
      breadcrumbName: '装箱上架分配列表'
    },
    {
      path: '',
      breadcrumbName: '装箱上架分配'
    }]
    this.setPageHeaderRoutes(pageHeaderPoutes)
  },
  mounted () {
    this.fetchRoleList({})
  },
  methods: {
    ...mapMutations({
      setPageHeaderRoutes: 'common/setPageHeaderRoutes',
      resetAllData: 'inhouse/resetAllData'
    }),
    ...mapActions({
      fetchRoleList: 'role/fetchRoleList'
    }),
    handleCommit () {
      const params = {
        drug_in_detail_id: this.packUpInfo.drug_in_detail_id,
        ver: this.packUpInfo.ver,
        packingtasklist: this.packList.map(item => {
          return {
            drug_in_detail_id: item.drug_in_detail_id,
            packing_task_no: item.packing_task_no,
            packing_cnt: item.packing_cnt,
            packingtaskpersonllist: item.packingtaskpersonllist
          }
        }),
        onshelftasklist: this.upList.map(item => {
          return {
            drug_in_detail_id: item.drug_in_detail_id,
            onshelf_task_no: item.onshelf_task_no,
            onshelf_cnt: item.onshelf_cnt,
            onshelftaskpersonlist: item.onshelftaskpersonlist
          }
        })
      }
      packUpAllot(params).then(res => {
        this.$message.success('分配成功')
        this.$router.go(-1)
      }).catch(err => {
        this.$message.error(err.msg)
      })
    }
  },
  beforeDestroy () {
    this.resetAllData()
  }
}
</script>

<style lang="less" scoped>
.pack-up-allot {
  padding: 5px;
  .pack-up-allot-content {
    margin: 10px;
  }
}
/deep/ .ant-card-body {
  padding: 10px;
}
.allot-tabs {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}
</style>