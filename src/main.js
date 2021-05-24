import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/ant.js'

import 'ant-design-vue/dist/antd.less'
import '@/assets/style/common.less'; // 用于覆盖上面定义的变量

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  window.document.title =
    to.meta.title == null ? "MMC药品管理中心" : to.meta.title;
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
