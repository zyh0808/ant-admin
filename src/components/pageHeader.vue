<template>
  <div style="backgroundColor:#fff">
    <a-breadcrumb :routes="routes">
      <template slot="itemRender" slot-scope="{ route,routes }">
        <span v-if="route.path.length === 0 || routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="{ path: `/${basePath}/${route.path}` }">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
    <a-page-header :title="title" />
  </div>
</template>
<script>
export default {
  props: {
    routes: {
      type: Array,
      default: () => []
    },
    basePath: {
      type: String,
      default: ''
    },
    headerTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      if (this.headerTitle) {
        return this.headerTitle
      } else {
        const len = this.routes ? this.routes.length : 0
        return len > 0 ? this.routes[len - 1].breadcrumbName : ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-breadcrumb {
  padding: 16px 20px 0;
}
.ant-page-header {
  padding: 16px 20px;
}
</style>
