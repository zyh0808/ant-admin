<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible class="left-menu">
      <div class="logo-box">
        <img class="logo" src="../assets/main/logo.png" alt="logo" />
      </div>
      <left-menu></left-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="height:48px;lineHeight:48px">
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
                <a href="javascript:;" @click="logoutHandle">
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
  </a-layout>
</template>
<script>
import { logout } from '@/api/user.js'
import HeadMenu from "@/components/home/HeadMenu.vue"
import LeftMenu from "@/components/home/LeftMenu.vue"
import RightMain from "@/components/home/RightMain.vue"
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    HeadMenu,
    LeftMenu,
    RightMain
  },
  methods: {
    ...mapMutations({
      resetAllData: 'userInfo/resetAllData'
    }),
    logoutHandle () {
      let that = this
      this.$confirm({
        title: '注销',
        content: '您确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk () {
          that.logout()
          // that.$router.replace({ name: 'login' })
        },
        onCancel () { }
      })
    },
    logout () {
      logout({}).then(res => {
        this.resetAllData()
        this.$router.replace({ name: 'login' })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo-box {
  height: 48px;
  line-height: 48px;
  width: 200px;
  background: #001529;
  .logo {
    float: left;
    height: 32px;
    margin: 8px;
  }
}
.head-menu {
  flex: 1;
}
.ant-layout-header {
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.left-menu {
  background-color: #fff;
  ::v-deep .ant-layout-sider-trigger {
    background-color: #fff;
    border: 1px solid #fafafa;
    i {
      color: #c0c0c0;
    }
  }
}
.login-footer {
  text-align: center;
}
</style>