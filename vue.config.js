// function resolve (dir) {
//   return path.join(__dirname, dir)
// }
// const path = require('path')
const Timestamp = new Date().getTime()

module.exports = {
  publicPath: "/",
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
        "console.log"
      ];
    }
    config.output.filename = "js/[name].[hash:8]." + Timestamp + ".js";
    config.output.chunkFilename = "js/[name].[hash:8]" + Timestamp + ".js";
  },
  css: {
    requireModuleExtension: true,
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
      },
      '/UpLoadFiles': {
        target: process.env.VUE_APP_URL,
        changeOrigin: true
      }
    }
  }
}
