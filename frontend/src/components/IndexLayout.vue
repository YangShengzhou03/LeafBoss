<!-- 首页展示页 -->
<template>
  <div class="index-layout">
    <header class="header">
      <div class="container">
        <div class="logo-area">
          <h1>枫叶网盘</h1>
        </div>
        <div class="auth-buttons" v-if="!isAuthenticated">
          <ElButton type="default" class="register-btn" @click="handleRegister">注册</ElButton>
          <ElButton type="primary" class="login-btn" @click="handleLogin">登录</ElButton>
        </div>
        <div class="user-info" v-else>
          <span class="welcome-text">
            您好，
            <span class="username-link" @click="goToUserLayout">{{ currentUser?.nickname || currentUser?.email || '枫叶用户' }}</span>
          </span>

        </div>
      </div>
    </header>

    <main class="main-content">
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1>安全可靠的云存储</h1>
            <p>轻松存储，随时访问，让您的数据安全无忧</p>
            <div class="cta-buttons">
              <ElButton type="primary" size="large" class="start-btn" @click="handleStart">
                {{ isAuthenticated ? '进入我的网盘' : '免费开始使用' }}
              </ElButton>
              <ElButton type="default" size="large" class="demo-btn" @click="handleDemo">查看演示</ElButton>
            </div>
          </div>
          <div class="hero-image">
            <h2>广告位展示</h2>
            <p>您能看到，您的潜在用户也能看到</p>
            <!-- <video src="https://www.bilibili.com/video/BV1KdkeYQEKg/" alt="枫叶网盘" controls></video> -->
          </div>
        </div>
      </section>

      <section id="features" class="features-section">
        <div class="container">
          <h2>枫叶的竞争力在哪？</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="el-icon-cloudy"></i>
              </div>
              <h3>数据安全</h3>
              <p>三重加密保护，数据安全是我们的生命。</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="el-icon-share"></i>
              </div>
              <h3>便捷分享</h3>
              <p>一键分享文件给朋友，自由查看和编辑。</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="el-icon-mobile-phone"></i>
              </div>
              <h3>多设备同步</h3>
              <p>电脑、手机浏览器随时访问，无需APP。</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="el-icon-download"></i>
              </div>
              <h3>全速下载</h3>
              <p>免费用户也能全速下载，您的时间比会员更宝贵。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="pricing-section" id="pricing">
        <div class="container">
          <h2>选择适合您的方案</h2>
          <div class="pricing-cards">
            <div class="pricing-card">
              <h3>入门体验</h3>
              <div class="price">免费</div>
              <ul class="features-list">
                <li>1GB 存储空间</li>
                <li>基础文件管理功能</li>
                <li>高速下载速度</li>
              </ul>
            </div>
            <div class="pricing-card popular">
              <div class="badge">热门选择</div>
              <h3>会员套餐</h3>
              <div class="price">¥0.99<span>/月</span></div>
              <ul class="features-list">
                <li>500GB 存储空间</li>
                <li>高级文件管理工具</li>
                <li>高速下载通道</li>
                <li>文件分享功能</li>
              </ul>
            </div>
            <div class="pricing-card">
              <h3>至尊套餐</h3>
              <div class="price">¥2.99<span>/月</span></div>
              <ul class="features-list">
                <li>2TB 存储空间</li>
                <li>专业文件管理工具</li>
                <li>高速下载通道</li>
                <li>文件分享功能</li>
                <li>团队协作工具</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>关于枫叶网盘</h3>
            <p>让每个人都能轻松享受云存储的便利</p>
          </div>
          <div class="footer-section">
            <h4>产品服务</h4>
            <ul>
              <li><a href="#features">功能特色</a></li>
              <li><a href="#pricing">价格方案</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>帮助支持</h4>
            <ul>
              <li><a href="/user-guide" target="_blank">使用指南</a></li>
              <li><a href="/contact-us" target="_blank">联系我们</a></li>
              <li><a href="/faq" target="_blank">常见问题</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>法律信息</h4>
            <ul>
              <li><a href="/author-info" target="_blank">作者介绍</a></li>
              <li><a href="/privacy-policy" target="_blank">隐私保护</a></li>
              <li><a href="/terms-of-service" target="_blank">服务条款</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024-2025 Jasun.xyz 版权所有 | ICP证：还在申请中 | 公网安备 还在备案中</p>
          <p>枫叶网盘 - 安全可靠的云存储服务</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ElButton, ElMessage } from 'element-plus';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/utils/store.js';

export default {
  name: 'IndexLayout',
  setup() {
    // 使用computed属性确保响应式
    const isAuthenticated = computed(() => store.state.isAuthenticated);
    const currentUser = computed(() => store.state.user);
    const router = useRouter();

    const goToUserLayout = () => {
      router.push('/user');
    };

    const handleLogin = () => {
      router.push('/login');
    };

    const handleRegister = () => {
      router.push('/login?mode=register');
    };

    const handleLogout = () => {
      store.logout();
      ElMessage.success('您已成功退出登录');
      router.push('/');
    };

    const handleDemo = () => {
      window.open('https://gitee.com/Yangshengzhou/leaf-pan', '_blank');
    };

    const handleStart = () => {
      if (isAuthenticated.value) {
        // 已登录，根据用户角色跳转到对应页面
        if (store.state.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } else {
        // 未登录，跳转到登录页面
        router.push('/login');
      }
    };

    return {
      isAuthenticated,
      currentUser,
      goToUserLayout,
      handleLogin,
      handleRegister,
      handleLogout,
      handleDemo,
      handleStart
    };
  }
}
</script>

<style scoped>
.index-layout {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.logo-area h1 {
  color: #409EFF;
  font-size: 24px;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #409EFF;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.register-btn {
  border-color: #409EFF;
  color: #409EFF;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.welcome-text {
  color: #606266;
  font-size: 14px;
}

.username-link {
  color: #409EFF;
  font-size: 14px;
  cursor: pointer;
  font-weight: normal;
  line-height: 1;
}

.username-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 0;
}

.hero-section .container {
  display: flex;
  align-items: center;
  gap: 50px;
}

.hero-content {
  flex: 1;
  text-align: left;
}

.hero-content h1 {
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #303133;
}

.hero-content p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #606266;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 15px;
}

.start-btn,
.demo-btn {
  padding: 12px 25px;
  font-size: 16px;
}

.hero-image {
  flex: 1;
  color: #303133;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  text-align: center;
}

.features-section h2 {
  font-size: 36px;
  margin-bottom: 50px;
  color: #303133;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: #fff;
  border-radius: 8px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #303133;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
}

/* Pricing Section */
.pricing-section {
  background-color: #f5f7fa;
  padding: 80px 0;
  text-align: center;
}

.pricing-section h2 {
  font-size: 36px;
  margin-bottom: 50px;
  color: #303133;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.pricing-card {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.pricing-card.popular {
  border: 2px solid #409EFF;
}

.badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #409EFF;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.pricing-card h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #303133;
}

.price {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 20px;
}

.price span {
  font-size: 16px;
  color: #909399;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
  text-align: left;
}

.features-list li {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 25px;
}

.features-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #67C23A;
  font-weight: bold;
}

.select-btn {
  width: 100%;
}

/* Footer */
.footer {
  background-color: #303133;
  color: #fff;
  padding: 50px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 20px;
  color: #fff;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #409EFF;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 20px;
  text-align: center;
  color: #bbb;
  font-size: 14px;
  line-height: 1.5;
}

.footer-bottom p {
  margin: 5px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 15px;
  }

  .nav-menu {
    display: none;
  }

  .hero-section .container {
    flex-direction: column;
    text-align: center;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .cta-buttons {
    justify-content: center;
  }

  .pricing-cards {
    grid-template-columns: 1fr;
  }
}
</style>