<template>
  <div id="rightMain">
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
<style lang="scss" scoped>
#rightMain {
  .routerIndex {
    margin: 0 0 0 2px;
  }
}
</style>