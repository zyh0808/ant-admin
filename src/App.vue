<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  created () {
    if (this.$route.name !== 'login' && this.$route.name !== 'home') {
      this.$router.replace({ name: 'home' })
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
