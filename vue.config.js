
const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  assetsDir: 'assets',
  devServer: {
    open: false,  //是否自动在浏览器打开
    host: '127.0.0.1', //真机测试 0.0.0.0
    port: 8081, //配置端口号
    https: false, //是否配置https
    hotOnly: true, //是否热更新
    // proxy: { //配置跨域
    //   '/index.php': {
    //     target: 'http://tiantianxsg.com:39888/index.php/',
    //     ws: true,
    //     changOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  chainWebpack: () => { },
  productionSourceMap: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}