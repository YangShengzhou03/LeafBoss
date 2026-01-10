const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src')
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all'
          }
        }
      }
    }
  },
  devServer: {
    // 这里实际上没被使用，先留着吧。因为用了环境变量 VUE_APP_API_BASE_URL
    port: 8080,
    host: 'localhost',
    open: true,
    hot: true,
    compress: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        },
        logLevel: 'debug'
      }
    },
    // 添加静态资源服务配置
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    }
  },
  // 启用ESLint检查，保存时检查
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 生产环境配置
  productionSourceMap: false,
  // 配置CSS
  css: {
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/styles/variables.scss";'
      }
    }
  },
  // 配置PWA（可选）
  pwa: {
    name: 'LEAF-BOSS 业务运营支撑系统',
    themeColor: '#409EFF',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
})
