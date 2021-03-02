<template>
  <div class="companyInfo">
    <div class="title">
      <a-page-header style="backgroundColor:#fff" title="公司信息"
        :breadcrumb="{props: {routes :pageHeaderRoutes }}" />
    </div>
    <div class="content">

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      pageHeaderRoutes: 'common/pageHeaderRoutes'
    })
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin: 10px;
  background-color: #fff;
}
</style>