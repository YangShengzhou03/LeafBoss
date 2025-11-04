<template>
  <div class="faq-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>常见问题</h1>
        <p>LeafPan网盘系统的常见问题解答和使用帮助</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="faq-sections">
          <!-- 常见问题部分 -->
          <section class="faq-section">
            <div class="section-header">
              <h2>常见问题解答</h2>
              <p>用户在使用过程中遇到的主要问题及解决方案</p>
            </div>
            <div class="faq-content">
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item name="account" title="账户相关问题">
                  <div class="collapse-content">
                    <p>忘记密码怎么办？可以通过登录页面的"忘记密码"功能重置密码，系统会发送重置链接到您的注册邮箱。如果邮箱也无法访问，请联系客服人工验证身份后重置。</p>
                    <p>账户被锁定如何处理？连续登录失败5次会暂时锁定账户30分钟，这是安全保护措施。如果忘记密码导致锁定，请等待30分钟后重试或使用密码重置功能。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="upload" title="文件上传问题">
                  <div class="collapse-content">
                    <p>上传文件失败怎么办？检查网络连接是否稳定，文件大小是否超过5GB限制，浏览器是否支持HTML5文件API。建议使用Chrome、Firefox等现代浏览器。</p>
                    <p>上传速度慢如何解决？上传速度受网络带宽、服务器负载和文件大小影响。可以尝试在网络空闲时段上传，或使用断点续传功能分多次上传大文件。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="download" title="文件下载问题">
                  <div class="collapse-content">
                    <p>下载文件失败如何处理？检查网络连接，确保有足够的存储空间。如果下载链接失效，请重新生成分享链接或联系文件分享者。</p>
                    <p>下载速度慢怎么办？下载速度受网络带宽和服务器负载影响。可以尝试在网络空闲时段下载，或使用下载工具支持断点续传。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="share" title="文件分享问题">
                  <div class="collapse-content">
                    <p>分享链接失效怎么办？分享链接默认有效期为7天，过期后需要重新生成。私密分享需要密码验证，请确保密码正确。</p>
                    <p>如何设置分享权限？在分享设置中可以设置有效期、访问密码、下载权限等。公开分享任何人都可访问，私密分享需要密码验证。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="storage" title="存储空间问题">
                  <div class="collapse-content">
                    <p>存储空间不足怎么办？用户有基础存储空间，可以通过删除不需要的文件、清空回收站来释放空间。也可以联系管理员申请更多存储空间。</p>
                    <p>如何查看存储使用情况？在个人中心可以查看当前存储使用情况和剩余空间。回收站中的文件仍占用存储空间，需要彻底删除才能释放。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="security" title="安全问题">
                  <div class="collapse-content">
                    <p>文件安全性如何保障？所有文件传输都使用SSL加密，存储采用分布式存储和多重备份。敏感文件建议设置分享密码和有效期限制。</p>
                    <p>账户安全如何保护？建议使用强密码，定期更换密码，不要在公共设备上保存登录状态。启用双重验证可以提供额外安全保护。</p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FaqPage',
  setup() {
    const activeNames = ref(['account']);
    
    return {
      activeNames
    };
  }
}
</script>

<style scoped>
.faq-page {
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

.faq-sections {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.faq-section {
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

.faq-content {
  padding: 32px;
}

.collapse-content {
  padding: 16px 0;
}

.collapse-content p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-size: 14px;
  text-align: justify; /* 两端对齐 */
  text-align-last: left; /* 最后一行左对齐 */
}

.collapse-content p:last-child {
  margin-bottom: 0;
}

/* 自定义手风琴样式 */
:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

:deep(.el-collapse-item:last-child .el-collapse-item__header) {
  border-bottom: none;
}

:deep(.el-collapse-item__arrow) {
  color: #4a5568;
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
  
  .faq-content {
    padding: 24px 20px;
  }
  
  :deep(.el-collapse-item__header) {
    font-size: 14px;
    padding: 12px 0;
  }
  
  .collapse-content p {
    font-size: 13px;
    text-align: left; /* 移动端使用左对齐 */
    text-align-last: left;
  }
}
</style>