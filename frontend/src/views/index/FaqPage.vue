<template>
  <div class="faq-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>常见问题</h1>
        <p>LeafCard枫叶卡管系统的常见问题解答和使用帮助</p>
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
                
                <el-collapse-item name="card" title="卡管理问题">
                  <div class="collapse-content">
                    <p>如何添加新卡？在卡管理页面点击"添加卡片"按钮，填写卡号、持卡人信息、有效期等必要信息后保存。</p>
                    <p>卡信息修改失败怎么办？检查必填字段是否完整，卡号格式是否正确。确保有足够的权限进行修改操作。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="search" title="搜索查询问题">
                  <div class="collapse-content">
                    <p>搜索不到卡片怎么办？检查搜索关键词是否正确，确保卡片信息已正确录入。可以尝试使用模糊搜索或按不同字段搜索。</p>
                    <p>搜索结果不准确如何解决？检查搜索条件设置，可以尝试使用高级搜索功能，按多个条件组合查询。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="permission" title="权限管理问题">
                  <div class="collapse-content">
                    <p>权限设置不生效怎么办？检查用户角色是否正确分配，确保权限配置已保存。可能需要重新登录系统使权限生效。</p>
                    <p>如何设置不同用户的访问权限？在用户管理页面可以为不同用户设置不同的角色和权限，支持细粒度的权限控制。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="data" title="数据管理问题">
                  <div class="collapse-content">
                    <p>数据导入失败怎么办？检查导入文件格式是否正确，确保必填字段完整。支持Excel、CSV等格式，文件大小不超过10MB。</p>
                    <p>如何备份系统数据？系统支持数据导出功能，可以定期导出数据备份。重要数据建议定期手动备份到本地。</p>
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