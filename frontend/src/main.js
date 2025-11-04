// main.js
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './route';
import App from './App.vue';
import store from './utils/store.js';
import { ElMessage, ElNotification } from 'element-plus';

// 引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 创建Vue应用实例
const app = createApp(App);

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, info);
  
  // 生产环境下不显示详细错误信息给用户
  if (process.env.NODE_ENV === 'production') {
    ElMessage.error('应用发生错误，请刷新页面重试');
  } else {
    ElMessage.error(`应用错误: ${err.message || '未知错误'}`);
  }
  
  // 发送错误报告（可选）
  if (process.env.NODE_ENV === 'production') {
    // 这里可以集成错误监控服务
    console.log('发送错误报告:', err.message);
  }
};

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('全局警告:', msg, trace);
  
  // 开发环境下显示警告通知
  if (process.env.NODE_ENV === 'development') {
    ElNotification({
      title: '开发警告',
      message: msg,
      type: 'warning',
      duration: 3000
    });
  }
};

// 全局性能监控
if (process.env.NODE_ENV === 'development') {
  // 开发环境下的性能监控
  const startTime = performance.now();
  
  app.config.performance = true;
  
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`应用加载时间: ${loadTime.toFixed(2)}ms`);
  });
}

// 使用插件
app.use(ElementPlus, {
  size: 'default', // 设置组件默认尺寸
  zIndex: 2000 // 设置弹框初始 z-index
});
app.use(router);

// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 将store添加到全局属性，方便在组件中使用
app.config.globalProperties.$store = store;

// 添加全局方法
app.config.globalProperties.$formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 挂载应用
try {
  app.mount('#app');
  
  // 挂载成功后的回调
  if (process.env.NODE_ENV === 'development') {
    console.log('Vue应用挂载成功');
  }
} catch (error) {
  console.error('应用挂载失败:', error);
  
  // 显示友好的错误页面
  document.getElementById('app').innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <h2 style="color: #f56c6c; margin-bottom: 20px;">应用加载失败</h2>
      <p style="color: #909399; margin-bottom: 20px;">请刷新页面重试，如果问题持续存在请联系管理员</p>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer;">
        刷新页面
      </button>
    </div>
  `;
}