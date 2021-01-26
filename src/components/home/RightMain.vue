<template>
  <div id="rightMain">
    <a-tabs v-model="activeName" type="editable-card" @tabClick="tabClick"
      @edit="editTab">
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>