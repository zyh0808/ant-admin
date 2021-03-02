<template>
  <a-menu :default-selected-keys="['001']" theme="dark" mode="horizontal"
    @click="moduleHandle">
    <template v-for="item in moduleList">
      <a-menu-item :key="item.id">
        {{item.name}}
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      moduleList: 'userInfo/moduleList',
      currentModule: 'userInfo/currentModule'
    })
  },
  methods: {
    ...mapMutations({
      setCurrentModule: 'userInfo/setCurrentModule'
    }),
    moduleHandle (e) {
      this.setCurrentModule(e.key)
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-menu-item-selected {
  height: 48px;
}
</style>