<template>
  <div class="contact-us-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>联系我们</h1>
        <p>我们随时为您提供帮助和支持</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="contact-sections">
          <!-- 联系方式部分 -->
          <section class="contact-section">
            <div class="section-header">
              <h2>联系方式</h2>
            </div>
            <div class="contact-methods">
              <div class="contact-method">
                <h3>电子邮件</h3>
                <p>如有任何问题或建议，请通过邮件联系我们</p>
                <a href="mailto:yangsz03@foxmail.com" class="contact-link">yangsz03@foxmail.com</a>
              </div>
              <div class="contact-method">
                <h3>QQ交流群</h3>
                <p>加入我们的QQ群，与其他用户和开发者交流</p>
                <a href="https://qm.qq.com/q/OXBUbJCmAM" target="_blank" class="contact-link">加入QQ群</a>
              </div>
              <div class="contact-method">
                <h3>开源项目</h3>
                <p>欢迎访问我们的开源项目，参与贡献和讨论</p>
                <a href="https://gitee.com/Yangshengzhou/leaf-pan" target="_blank" class="contact-link">查看源码</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'ContactUsPage',
  setup() {
    onMounted(() => {
      // 页面加载完成后的逻辑
    });
  }
}
</script>

<style scoped>
.contact-us-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  background: #2d3748;
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 700;
}

.page-header p {
  font-size: 18px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.page-content {
  padding: 60px 0 80px;
}

.contact-sections {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.contact-section {
  background: white;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  background: #2d3748;
  padding: 24px 32px;
  color: white;
}

.section-header h2 {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.contact-methods {
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.contact-method {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.contact-method h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
  font-weight: 600;
}

.contact-method p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
}

.contact-link {
  display: inline-block;
  color: #3182ce;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #3182ce;
  border-radius: 4px;
  transition: all 0.2s;
}

.contact-link:hover {
  background: #3182ce;
  color: white;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .section-header {
    padding: 20px;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
  
  .contact-methods {
    padding: 24px 20px;
    grid-template-columns: 1fr;
  }
}
</style>