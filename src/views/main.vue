<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo" />
      <left-menu></left-menu>
    </a-layout-sider>
    <a-layout class="home-main">
      <a-layout-header :style="{background: 'rgb(190, 200, 200)'}">
        <div class="person-info">
          <a-row type="flex" align="middle" class="row-common">
            <p><span class="user-name" @click="logout">张三三</span>，您好！
            </p>
            <a-button type="link" href="http://localhost:8080/" target="_blank"
              ghost>
              大屏
            </a-button>
          </a-row>
        </div>
      </a-layout-header>
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
  // created () {
  //   console.log(this.$router)
  // },
  methods: {
    logout () {
      let that = this
      this.$confirm({
        title: '注销',
        content: '您确定要退出登录吗？',
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
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.header-text {
  text-align: center;
  border-bottom: solid 2px #ffffff;
  font-size: 16px;
  line-height: 60px;
  color: $white;
}
.home-main {
  height: 100%;
}

p {
  margin: 0;
}
.person-info {
  .user-name {
    color: #1890ff;
    font-size: 13px;
    cursor: pointer;
  }
}
</style>