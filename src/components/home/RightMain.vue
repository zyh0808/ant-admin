<template>
  <div id="rightMain">
    <div class="person-info">
      <a-row type="flex" justify="end" style="height: 50px">
        <p>您好，<span class="user-name" @click="logout">张三三</span>
        </p>
      </a-row>
    </div>
    <a-tabs v-model="activeName" hide-add type="editable-card"
      @tabClick="tabClick" @edit="editTab">
      <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.title"
        :closable="item.closable">
      </a-tab-pane>
    </a-tabs>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
    </router-view>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      activeKey: 'menu/activeName',
      tabs: 'menu/tabs'
    }),
    activeName: {
      get () {
        return this.activeKey ? this.activeKey : ''
      },
      set (val) {
        this.switchTab(val)
      }
    }
  },
  methods: {
    ...mapMutations({
      switchTab: 'menu/switchTab',
      changeTabs: 'menu/changeTabs'
    }),
    tabClick (key) {
      this.$router.replace({ name: key })
    },
    editTab (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      let activeKey = this.activeName
      let lastIndex;
      this.tabs.forEach((tab, i) => {
        if (tab.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.tabs.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key
        } else {
          activeKey = panes[0].key
        }
      }
      this.changeTabs(panes)
      this.switchTab(activeKey)
      this.$router.replace({ name: activeKey })
    },
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
.person-info {
  height: 50px;
  line-height: 50px;
  margin: 0 30px;
  .user-name {
    color: #1890ff;
  }
}
</style>