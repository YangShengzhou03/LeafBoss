import { createApp } from 'vue';
import { markRaw } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './route';
import App from './App.vue';
import store from './utils/store.js';
import { ElMessage, ElNotification } from 'element-plus';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

app.config.errorHandler = (err) => {
  if (process.env.NODE_ENV === 'production') {
    ElMessage.error('应用发生错误，请刷新页面重试');
  } else {
    ElMessage.error(`应用错误: ${err.message || '未知错误'}`);
  }
};

app.config.warnHandler = (msg) => {
  if (process.env.NODE_ENV === 'development') {
    ElNotification({
      title: '开发警告',
      message: msg,
      type: 'warning',
      duration: 3000
    });
  }
};

if (process.env.NODE_ENV === 'development') {
  app.config.performance = true;
}

app.use(ElementPlus, {
  size: 'default',
  zIndex: 2000
});
app.use(router);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, markRaw(component));
}

app.config.globalProperties.$store = store;

app.config.globalProperties.$formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

try {
  app.mount('#app');
} catch (error) {
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