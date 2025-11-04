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
    // 优化构建输出
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
    name: '枫叶卡管',
    themeColor: '#409EFF',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
})
