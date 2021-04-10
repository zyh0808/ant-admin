<template>
  <div id="rightContent">
    <keep-alive>
      <router-view class="routerIndex" v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <router-view class="routerIndex" v-if="!$route.meta.keepAlive">
    </router-view>
  </div>
</template>

<script>
export default {
}
</script>
<style lang="less" scoped>
</style>