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
  },
  created () {
    //在页面加载时读取sessionStorage里的状态信息
    let store = sessionStorage.getItem('store')
    if (store) {
      let storeObj = JSON.parse(store)
      this.$store.replaceState(Object.assign({}, this.$store.state, storeObj))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('pagehide', () => {
      this.$store.commit('resetFetching')
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  font-size: 13px;
}
#app {
  position: relative;
  flex: 1;
  overflow: hidden;
  font-family: Microsoft YaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.routerIndex {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
