<template>
  <div class="faq-page">
    <header class="page-header">
      <div class="container">
        <h1>常见问题</h1>
        <p>使用过程中的常见疑问与解答</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="faq-card">
          <h3>常见问题解答</h3>
          <p class="faq-subtitle">点击问题类别查看详细解答</p>
          <div class="faq-content">
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item name="account" title="账户相关问题">
                <div class="collapse-content">
                  <p><strong>忘记密码？</strong>点击登录页"忘记密码"，系统将发送重置链接到注册邮箱。若邮箱无法访问，请联系客服人工验证后重置。</p>
                  <p><strong>账户被锁定？</strong>连续登录失败5次将锁定30分钟。可等待自动解锁，或使用密码重置功能。</p>
                </div>
              </el-collapse-item>

              <el-collapse-item name="card" title="授权管理问题">
                <div class="collapse-content">
                  <p><strong>如何添加授权？</strong>在授权管理页面点击"添加授权"，填写密钥、用户信息、有效期等必要信息后保存。</p>
                  <p><strong>授权修改失败？</strong>请检查必填字段是否完整、密钥格式是否正确，并确认有修改权限。</p>
                </div>
              </el-collapse-item>

              <el-collapse-item name="search" title="搜索查询问题">
                <div class="collapse-content">
                  <p><strong>搜索不到授权？</strong>检查关键词是否正确，确认数据已录入。可尝试模糊搜索或切换搜索字段。</p>
                  <p><strong>结果不准确？</strong>使用高级搜索功能，按多个条件组合查询以精确定位。</p>
                </div>
              </el-collapse-item>

              <el-collapse-item name="permission" title="权限管理问题">
                <div class="collapse-content">
                  <p><strong>权限不生效？</strong>检查用户角色是否正确分配，确认权限配置已保存。可能需要重新登录刷新权限。</p>
                  <p><strong>如何设置不同权限？</strong>在用户管理页面为不同用户分配角色，支持细粒度的权限控制。</p>
                </div>
              </el-collapse-item>

              <el-collapse-item name="data" title="数据管理问题">
                <div class="collapse-content">
                  <p><strong>数据导入失败？</strong>检查文件格式是否正确、必填字段是否完整。支持 Excel、CSV 格式，文件不超过10MB。</p>
                  <p><strong>如何备份数据？</strong>使用系统数据导出功能定期备份。重要数据建议同时保存到本地。</p>
                </div>
              </el-collapse-item>

              <el-collapse-item name="security" title="安全问题">
                <div class="collapse-content">
                  <p><strong>数据安全性？</strong>所有传输使用SSL加密，存储采用分布式架构和多重备份。敏感文件建议设置分享密码和有效期。</p>
                  <p><strong>账户安全建议？</strong>使用强密码并定期更换，避免在公共设备保存登录状态。</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'FaqPage',
  setup() {
    const activeNames = ref(['account']);

    onMounted(() => {
      document.title = '常见问题 - LEAF-BOSS';
    });

    return {
      activeNames
    };
  }
}
</script>

<style scoped>
.faq-page {
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-feature-settings: "ss01";
}

.page-header {
  background-color: #1c1e54;
  color: white;
  padding: 80px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 300;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -0.96px;
}

.page-header p {
  font-size: 18px;
  font-weight: 300;
  line-height: 1.40;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

.page-content {
  padding: 80px 0;
  background-color: #f8fafc;
}

.faq-card {
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5edf5;
  box-shadow: rgba(23, 23, 23, 0.06) 0px 3px 6px;
  padding: 48px;
  transition: box-shadow 0.3s ease;
}

.faq-card:hover {
  box-shadow: rgba(23, 23, 23, 0.08) 0px 6px 16px;
}

.faq-card h3 {
  font-size: 22px;
  font-weight: 300;
  line-height: 1.10;
  margin: 0 0 8px 0;
  color: #061b31;
  letter-spacing: -0.22px;
}

.faq-subtitle {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.40;
  color: #64748d;
  margin: 0 0 32px 0;
}

.faq-content {
  margin-top: 0;
}

.collapse-content {
  padding: 16px 0;
}

.collapse-content p {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.40;
  color: #64748d;
  margin: 0 0 12px 0;
}

.collapse-content p:last-child {
  margin-bottom: 0;
}

.collapse-content p strong {
  color: #061b31;
  font-weight: 400;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 0;
  }

  .page-header h1 {
    font-size: 32px;
    letter-spacing: -0.64px;
  }

  .page-header p {
    font-size: 16px;
  }

  .page-content {
    padding: 40px 0;
  }

  .faq-card {
    padding: 32px 24px;
  }

  .faq-card h3 {
    font-size: 18px;
    letter-spacing: -0.18px;
  }

  .collapse-content p {
    font-size: 13px;
  }
}
</style>
