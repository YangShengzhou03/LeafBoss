<template>
  <div class="user-guide-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>使用指南</h1>
        <p>LeafBoss 业务运营支撑系统快速入门指南</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="guide-sections">
          <!-- 快速入门部分 -->
          <section class="guide-section">
            <div class="section-header">
              <h2>快速入门</h2>
              <p>新手用户快速上手LeafBoss 业务运营支撑系统</p>
            </div>
            <div class="guide-content">
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item name="register" title="注册账号">
                  <div class="collapse-content">
                    <p>注册 LEAF-BOSS 业务运营支撑系统账号的要求如下：</p>
                    <ul>
                      <li>用户名：3-20个字符，支持中文、英文、数字和下划线</li>
                      <li>密码：6-100个字符，支持明文存储（按业务需求）</li>
                      <li>邮箱：用于登录和系统通知</li>
                    </ul>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="login" title="登录系统">
                  <div class="collapse-content">
                    <p>在登录页面输入用户名/邮箱和密码即可登录。支持记住登录状态和自动登录功能，登录失败超过5次会暂时锁定账户。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="card" title="卡密与授权管理">
                  <div class="collapse-content">
                    <p>LEAF-BOSS 业务运营支撑系统支持完整的卡密生命周期管理：</p>
                    <ul>
                      <li>生成卡密：在管理后台根据产品规格批量生成授权密钥</li>
                      <li>验证激活：用户通过验证页面激活卡密并绑定邮箱/用户ID</li>
                      <li>状态监控：实时监控卡密的有效状态、激活时间及过期时间</li>
                    </ul>
                    <p>支持功能：卡密批量导入导出、状态一键切换、过期自动清理等。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="product" title="产品规格配置">
                  <div class="collapse-content">
                    <p>系统支持灵活的产品与规格定义，方便业务快速上线：</p>
                    <ul>
                      <li>产品管理：创建不同的业务产品线，设置产品状态与描述</li>
                      <li>规格定义：为每个产品配置不同的规格（如：月卡、年卡、永久版）</li>
                      <li>价格库存：精细化控制每个规格的价格、有效期及库存数量</li>
                    </ul>
                  </div>
                </el-collapse-item>

                <el-collapse-item name="review" title="业务评论管理">
                  <div class="collapse-content">
                    <p>LEAF-BOSS 集成了 Boss 评论管理模块，支持用户对公司/业务进行评价：</p>
                    <ul>
                      <li>评论提交：用户持有效卡密可对特定公司发表业务评论</li>
                      <li>评论审核：管理员在后台对用户提交的评论进行审核与管理</li>
                      <li>公司关联：评论与特定公司主体关联，支持评论总数自动统计</li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </section>
          <section class="guide-section">
            <div class="section-header">
              <h2>发展历程</h2>
              <p>LEAF-BOSS 业务运营支撑系统的成长历程</p>
            </div>
            <div class="guide-content">
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-content">
                    <h3>项目启动 · 2025年6月</h3>
                    <p>深入分析业务运营支撑系统痛点，确立系统架构与技术选型，采用 Vue 3 + Spring Boot 3 现代化技术栈。</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-content">
                    <h3>核心开发 · 2025年9月</h3>
                    <p>完成前后端核心功能开发，实现授权密钥管理、用户权限控制、产品规格配置等关键核心业务模块。</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-content">
                    <h3>正式发布 · 2026年1月</h3>
                    <p>LEAF-BOSS 业务运营支撑系统正式上线并持续迭代优化，为用户提供稳定可靠的业务运营支持服务。</p>
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
  background-color: #f5f7fa;
}

.page-header {
  background: #2d3748;
  color: white;
  padding: 40px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 600;
}

.page-header p {
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.page-content {
  padding: 40px 0 60px;
}

.guide-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.guide-section {
  background: white;
  border-radius: 4px;
  padding: 0;
}

.section-header {
  background: #2d3748;
  padding: 20px 24px;
  color: white;
}

.section-header h2 {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.guide-content {
  padding: 24px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  border-left: 2px solid #2d3748;
  padding-left: 20px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0;
  width: 12px;
  height: 12px;
  background: #2d3748;
  border-radius: 50%;
}

.timeline-content h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #2d3748;
}

.timeline-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.collapse-content {
  padding: 12px 0;
}

.collapse-content p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .page-header p {
    font-size: 14px;
  }
  
  .section-header {
    padding: 16px 20px;
  }
  
  .section-header h2 {
    font-size: 18px;
  }
  
  .guide-content {
    padding: 20px;
  }
}
</style>