<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <img class="logo" src="../assets/logo.png" alt="logo" />
      <left-menu></left-menu>
    </a-layout-sider>
    <a-layout class="home-main">
      <!-- <a-layout-header class="headerBox"
        :style="{background: '#fff', height: '40px', lineHeight: '40px'}">
        <a-dropdown class="avaterName">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-avatar style="backgroundColor:#87d068" icon="user" />
            zzz
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header> -->
      <a-layout-content>
        <right-main></right-main>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import LeftMenu from "@/components/home/LeftMenu.vue"
import RightMain from "@/components/home/RightMain.vue"
export default {
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    LeftMenu,
    RightMain
  },
  methods: {
    logout () {
      let that = this
      this.$confirm({
        title: '注销',
        content: '您确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk () {
          that.$router.replace({ name: 'login' })
        },
        onCancel () { }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  height: 32px;
  // background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.ant-layout-header {
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.home-main {
  height: 100%;
}
</style>