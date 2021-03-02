<template>
  <a-menu v-model="current" mode="inline" @click="subModuleHandle">
    <template v-for="(item) in subModuleList">
      <a-sub-menu :key="item.id" v-if="item.hasChild">
        <span slot="title">
          <a-icon :type="item.icon" :rotate="item.rotate" />
          <span>{{item.name}}</span>
        </span>
        <a-menu-item v-for="(it) in item.children" :key="it.key">{{it.name}}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item :key="item.id" v-else>
        <!-- <a-icon :type="item.icon" :rotate="item.rotate" /> -->
        <span>{{item.name}}</span>
      </a-menu-item>
    </template>
  </a-menu>

</template>
<script>
// import { myMenu } from "@/js/menu.js"
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      subModuleList: 'userInfo/subModuleList',
      pageAuthList: 'userInfo/pageAuthList',
      currentSubModule: 'userInfo/currentSubModule',
    }),
    current: {
      get () {
        return this.currentSubModule ? this.currentSubModule : []
      },
      set (value) {
        this.setCurrentSubModule(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentSubModule: 'userInfo/setCurrentSubModule',
      setCurrentRouter: 'userInfo/setCurrentRouter',
      setAuthList: 'userInfo/setAuthList'
    }),
    subModuleHandle (e) {
      const pageAuth = this.pageAuthList.find(item => item.module_id === e.key)
      const currentRouter = pageAuth ? pageAuth.url_addr : ''
      const authList = pageAuth ? pageAuth.auth_list : []
      this.setCurrentRouter(currentRouter)
      this.setAuthList(authList)
      this.$router.push({ name: currentRouter })
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-menu {
  border-right: none;
}
</style>