<template>
  <div class="author-info-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>关于作者</h1>
        <p>LeafPan网盘系统开发者简介</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="author-sections">
          <!-- 开发者简介 -->
          <section class="author-section">
            <div class="section-header">
              <h2>开发者简介</h2>
            </div>
            <div class="section-content">
              <div class="author-profile">
                <div class="profile-avatar">
                  <div class="avatar-circle">
                    <span class="avatar-text">Yang</span>
                  </div>
                </div>
                <div class="profile-info">
                  <div class="name-title">
                    <h3>Yangshengzhou</h3>
                    <span class="developer-badge">Leaf-Pan 开发者</span>
                  </div>
                                    <div class="expertise-tags">
                    <span class="tag">Vue.js</span>
                    <span class="tag">Spring Boot</span>
                    <span class="tag">MySQL</span>
                    <span class="tag">Docker</span>
                    <span class="tag">Microservices</span>
                  </div>
                  <p class="profile-bio">
                    独立开发者，热爱从零到一打造实用的产品。热爱探索新的技术和创意，
                    喜欢专研用户需求，然后自己动手把想法变成现实——从界面设计到前后端开发，
                    再到部署上线，整个流程都能独立搞定。作品有LeafAuto、LeafView、Lucky_SMS等项目，
                    享受把创意落地为实用工具的成就感。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- 开发历程 -->
          <section class="author-section">
            <div class="section-header">
              <h2>开发历程</h2>
            </div>
            <div class="section-content">
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>项目构思(2025年1月)</h3>
                    <p>基于对现有网盘系统的分析，构思开发一个轻量级、易用的个人网盘系统</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>技术选型(2025年2月)</h3>
                    <p>确定使用Vue 3 + Spring Boot 3的技术栈，开始系统架构设计</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>核心开发(2025年3月-7月)</h3>
                    <p>完成前后端核心功能开发，包括文件上传下载、用户管理、权限控制等</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>测试优化(2025年8月-9月)</h3>
                    <p>进行系统测试和性能优化，完善用户体验</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>正式发布(2025年10月27日)</h3>
                    <p>LeafPan网盘系统正式上线，为用户提供服务</p>
                  </div>
                </div>
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
  name: 'AuthorInfoPage',
  setup() {
    onMounted(() => {
      // 页面加载完成后的逻辑
    });
  }
}
</script>

<style scoped>
.author-info-page {
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

.author-sections {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.author-section {
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

.section-content {
  padding: 32px;
}

.author-profile {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  border: 4px solid white;
  position: relative;
  overflow: hidden;
}

.avatar-circle::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.avatar-text {
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.profile-info {
  flex: 1;
}

.name-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.name-title h3 {
  font-size: 32px;
  margin: 0;
  color: #2c3e50;
  font-weight: 700;
  background: linear-gradient(135deg, #2c3e50 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.developer-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.profile-title {
  font-size: 18px;
  color: #667eea;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.profile-bio {
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 20px;
  text-align: justify;
  text-justify: inter-ideograph;
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.tag {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  color: #1890ff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #91d5ff;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}



.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: #3182ce;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #3182ce;
}

.timeline-content h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #2c3e50;
}



.timeline-content p {
  color: #4a5568;
  line-height: 1.6;
}



.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .page-content {
    padding: 40px 0 60px;
  }
  
  .author-profile {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .avatar-circle {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  
  .avatar-text {
    font-size: 36px;
  }
  
  .name-title {
    flex-direction: column;
    gap: 12px;
  }
  
  .name-title h3 {
    font-size: 24px;
  }
  
  .profile-title {
    font-size: 16px;
  }
  
  .profile-bio {
    font-size: 14px;
    padding: 16px;
  }
  
  .section-header {
    padding: 20px;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
  
  .section-content {
    padding: 24px 20px;
  }
  

  
  .expertise-tags {
    justify-content: center;
  }
}
</style>