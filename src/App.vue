<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  name: "app",
  data () {
    return {
      zh_CN
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
  position: relative;
  flex: 1;
  overflow: hidden;
  font-family: Microsoft YaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
