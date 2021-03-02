<template>
  <!-- <a-layout style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible class="left-menu">
      <div class="logo-box">
        <img class="logo" src="../assets/main/logo.png" alt="logo" />
      </div>
      <left-menu></left-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <a-row type="flex">
          <head-menu class="head-menu" />
          <a-dropdown class="avaterName">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              <a-avatar style="backgroundColor:#87d068" icon="user"
                size="small" />
              jiayingzi
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="logout">
                  <a-icon type="logout" /><span class="logoutText">退出登录</span>
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <right-main></right-main>
      </a-layout-content>
      <a-layout-footer class="login-footer">
        <div>
          Copyright
          <a-icon type="copyright" />
          城市映急
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout> -->
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <img class="logo" src="../assets/main/logo.png" alt="logo" />
      <left-content></left-content>
    </a-layout-sider>
    <a-layout class="home-main">
      <a-layout-header>
        <a-row type="flex" justify="end">
          <a-dropdown class="avaterName">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              <a-avatar style="backgroundColor:#87d068" icon="user"
                size="small" />
              jiayingzi
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="logout">
                  <a-icon type="logout" /><span class="logoutText">退出登录</span>
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <right-content></right-content>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import LeftContent from "@/components/home/LeftContent.vue"
import RightContent from "@/components/home/RightContent.vue"
export default {
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    LeftContent,
    RightContent
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
  margin: 16px;
}
.ant-layout-header {
  height: 46px;
  line-height: 46px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 19;
  .avaterName {
    padding-right: 10px;
  }
}
.logoutText {
  margin-left: 10px;
}
</style>