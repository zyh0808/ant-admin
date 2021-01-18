<template>
  <a-layout style="height: 100%">
    <a-layout-header class="header-text">Header
    </a-layout-header>
    <a-layout class="home-main">
      <a-layout-sider>
        <left-menu></left-menu>
      </a-layout-sider>
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
  components: {
    LeftMenu,
    RightMain
  }
}
</script>
<style lang="scss" scoped>
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
</style>