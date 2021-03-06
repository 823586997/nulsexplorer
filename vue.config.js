const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));
      // config.externals = {
      //   'vue': 'Vue',
      //   'vue-router': 'VueRouter',
      //   'moment': 'moment',
      //   /*'element-ui': 'ELEMENT',*/
      // }
    }
  },

  baseUrl: './',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],

  css: {
    sourceMap: true
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    proxy: {// 配置跨域处理
      '/api': {
        target: 'http://192.168.1.127:8080/',
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/nodes':{   // 获取所有节点
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,  
      },
      '/node':{  // 获取单个
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,  
      },
      '/passport/login':{  //  登录
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,
      },
      '/admin/updateNodeInfo':{  // 修改节点
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,
      },
      '/admin/nodeReject':{  // 审核节点
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,
      },
      '/admin/nodePass':{  // 审核节点- 通过
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,
      },
      '/passport/logout':{  // 退出
        target:'http://172.21.75.140:8080/',
        changeOrigin:true,
      }
    }
  }

};
