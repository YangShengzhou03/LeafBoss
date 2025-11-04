<template>
  <div class="user-guide-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>使用指南</h1>
        <p>LeafPan网盘系统的完整使用教程和操作说明</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="guide-sections">
          <!-- 快速入门部分 -->
          <section class="guide-section">
            <div class="section-header">
              <h2>快速入门</h2>
              <p>新手用户快速上手LeafPan网盘系统</p>
            </div>
            <div class="guide-content">
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item name="register" title="注册账号">
                  <div class="collapse-content">
                    <p>访问LeafPan首页，点击"注册"按钮，填写用户名、邮箱和密码完成注册。注册后需要验证邮箱才能使用完整功能。用户名要求3-20个字符，支持中英文、数字和下划线，密码要求8-20个字符且必须包含字母和数字。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="login" title="登录系统">
                  <div class="collapse-content">
                    <p>在登录页面输入用户名/邮箱和密码即可登录。支持记住登录状态和自动登录功能，登录失败超过5次会暂时锁定账户。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="upload" title="上传文件">
                  <div class="collapse-content">
                    <p>登录后进入文件管理页面，点击"上传"按钮选择文件或直接将文件拖拽到上传区域。支持所有常见文件格式，单个文件大小限制为5GB，支持断点续传和批量上传。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="manage" title="管理文件">
                  <div class="collapse-content">
                    <p>在文件列表中可以创建文件夹、移动文件、重命名、删除等操作。支持多选、拖拽移动，搜索功能可以按文件名和内容搜索，删除文件会在回收站保留30天。</p>
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
  name: 'UserGuidePage',
  setup() {
    const activeNames = ref(['register']);
    
    return {
      activeNames
    };
  }
}
</script>

<style scoped>
.user-guide-page {
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

.guide-sections {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.guide-section {
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

.guide-content {
  padding: 32px;
}

.collapse-content {
  padding: 16px 0;
}

.collapse-content p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
  text-align: justify; /* 两端对齐 */
  text-align-last: left; /* 最后一行左对齐 */
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
  
  .guide-content {
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