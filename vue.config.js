const port = 8088
function resolve (dir) {
  return path.join(__dirname, dir)
}
const path = require('path')

module.exports = {
  publicPath: "/",
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        prependData: `@import "@/assets/style/global.scss";`
      }
    }
  },
  devServer: {
    // host: 'http://192.168.200.61',
    port: 8088,
    inline: true,
    proxy: {
      '/user': {
        target: process.env.VUE_APP_URL,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
};
