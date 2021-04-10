<template>
  <div id="rightMain">
    <keep-alive>
      <router-view class="routerIndex" v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <router-view class="routerIndex" v-if="!$route.meta.keepAlive">
    </router-view>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
#rightMain {
  height: 100%;
  // .routerIndex {
  //   min-height: calc(100% - 40px);
  // }
}
// .login-footer {
//   text-align: center;
//   position: absolute;
//   width: 100%;
//   height: 40px;
//   line-height: 40px;
//   margin: 0 auto;
//   // bottom: 0;
// }
</style>
<style lang="less">
// .ant-modal-body {
//   &::-webkit-scrollbar {
//     width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
//     height: 1px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 6px;
//     // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     background: rgba(144, 147, 153, 0.5);
//   }
//   &::-webkit-scrollbar-track {
//     // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     border-radius: 5px;
//     background: transparent;
//   }
// }
// .ant-table-body,
// .ant-table-header {
//   word-break: break-all;
//   &::-webkit-scrollbar {
//     width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
//     height: 6px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 6px;
//     // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     background: rgba(144, 147, 153, 0.5);
//   }
//   &::-webkit-scrollbar-track {
//     // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     border-radius: 5px;
//     background: transparent;
//   }
// }
</style>