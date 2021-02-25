<template>
  <div id="rightMain">
    <a-row class="tabRow">
      <a-col :span="20">
        <a-tabs v-model="activeName" hide-add type="editable-card"
          @tabClick="tabClick" @edit="editTab">
          <a-tab-pane v-for="item in tabs" :key="item.key"
            :closable="item.closable">
            <span slot="tab">
              <a-icon :type="item.icon" />
              {{item.title}}
            </span>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="4">
        <a-dropdown class="avaterName">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-avatar style="backgroundColor:#87d068" icon="user"
              size="small" />
            jiayingzi
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">
                <a-icon type="logout" /><span class="logoutText">退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>

    <keep-alive>
      <router-view class="routerIndex" v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <router-view class="routerIndex" v-if="!$route.meta.keepAlive">
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
#rightMain {
  // padding: 5px;
  .routerIndex {
    margin: 5px 10px;
  }
  ::v-deep .ant-tabs-bar {
    margin: 0;
  }
  .tabRow {
    height: 45px;
    line-height: 45px;
    background-color: #fff;
    // padding-right: 10px;
    // padding-top: 5px;
    padding: 5px 10px 0 5px;
  }
  .avaterName {
    float: right;
    padding-right: 10px;
  }
}
.logoutText {
  margin-left: 10px;
}
</style>