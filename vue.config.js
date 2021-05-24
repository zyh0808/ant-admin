const Timestamp = new Date().getTime()
// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
// 本地环境是否需要使用cdn
const devNeedCdn = false
// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
    'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
    'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js',
    'https://unpkg.com/axios/dist/axios.min.js'
  ]
}
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')


module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  chainWebpack: config => {
    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
    // ============注入cdn start============
  },
  configureWebpack: config => {
    // if (isProduction || devNeedCdn) {
    //   config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
    //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    //   config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
    //   config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
    //     "console.log"
    //   ];
    //   config.externals = cdn.externals
    // }

    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals

    config.output.filename = "js/[name].[hash:8]." + Timestamp + ".js";
    config.output.chunkFilename = "js/[name].[hash:8]" + Timestamp + ".js";

    //打包文件大小配置
    // config["performance"] = {
    //   "hints": 'warning',
    //   "maxEntrypointSize": 50000000,
    //   "maxAssetSize": 30000000,
    //   //只给出 js 文件的性能提示
    //   "assetFilter": function (assetFilename) {
    //     return assetFilename.endsWith('.js');
    //   }
    // }

    // 生产环境相关配置
    if (isProduction) {
      // 代码压缩
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              // warnings: false, // 若打包错误，则注释这行
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )

      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          // filename: '[path].gz[query]',
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
    }
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          // modifyVars: {
          //   'primary-color': '#13c2c2',
          //   'link-color': '#f759ab',
          //   'border-radius-base': '2px',
          // },
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: !isTest && !isProduction ? {
    inline: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_MEDICINEURL,
        changeOrigin: true
        // pathRewrite: {
        //   "^/api": ""
        // }
      }
    }
  } : {}
}
