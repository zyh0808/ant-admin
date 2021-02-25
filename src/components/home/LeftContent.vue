<template>
  <a-menu :default-selected-keys="['drugDetail']" :default-open-keys="['drug']"
    mode="inline" theme="dark" :inline-collapsed="collapsed"
    @click="menuClicked">
    <template v-for="(item) in menu">
      <a-sub-menu :key="item.key" v-if="item.hasChild">
        <span slot="title">
          <a-icon :type="item.icon" /><span>{{item.name}}</span>
        </span>
        <a-menu-item v-for="(it) in item.children" :key="it.key">{{it.name}}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item :key="item.key" v-else>
        <a-icon :type="item.icon" />
        <span>{{item.name}}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>
<script>
import { myMenu } from "@/js/menu.js"
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      menu: myMenu,
      collapsed: true
    }
  },
  methods: {
    ...mapActions({
      clickMenuItem: 'menu/clickMenuItem'
    }),
    menuClicked (item) {
      this.clickMenuItem(item.key)
      this.$router.push({ name: item.key })
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
      console.log(this.collapsed)
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-menu {
  border-right: none;
}
</style>