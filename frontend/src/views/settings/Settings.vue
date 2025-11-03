<template>
  <div class="settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="120px">
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="basicForm.siteName" placeholder="请输入网站名称" />
            </el-form-item>
            
            <el-form-item label="网站标题" prop="siteTitle">
              <el-input v-model="basicForm.siteTitle" placeholder="请输入网站标题" />
            </el-form-item>
            
            <el-form-item label="网站描述" prop="siteDescription">
              <el-input 
                v-model="basicForm.siteDescription" 
                type="textarea" 
                :rows="3" 
                placeholder="请输入网站描述" 
              />
            </el-form-item>
            
            <el-form-item label="关键词" prop="keywords">
              <el-input 
                v-model="basicForm.keywords" 
                placeholder="请输入关键词，多个用逗号分隔" 
              />
            </el-form-item>
            
            <el-form-item label="备案号" prop="icp">
              <el-input v-model="basicForm.icp" placeholder="请输入备案号" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form ref="securityFormRef" :model="securityForm" :rules="securityRules" label-width="120px">
            <el-form-item label="登录超时" prop="sessionTimeout">
              <el-input-number v-model="securityForm.sessionTimeout" :min="5" :max="480" />
              <span style="margin-left: 10px; color: #909399;">分钟</span>
            </el-form-item>
            
            <el-form-item label="密码强度" prop="passwordStrength">
              <el-select v-model="securityForm.passwordStrength" placeholder="请选择密码强度要求">
                <el-option label="低（6位以上）" value="low" />
                <el-option label="中（8位以上，包含字母和数字）" value="medium" />
                <el-option label="高（10位以上，包含大小写字母、数字和特殊字符）" value="high" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="登录失败锁定" prop="loginLock">
              <el-switch v-model="securityForm.loginLock" />
            </el-form-item>
            
            <el-form-item label="最大失败次数" prop="maxLoginAttempts" v-if="securityForm.loginLock">
              <el-input-number v-model="securityForm.maxLoginAttempts" :min="3" :max="10" />
              <span style="margin-left: 10px; color: #909399;">次</span>
            </el-form-item>
            
            <el-form-item label="锁定时间" prop="lockDuration" v-if="securityForm.loginLock">
              <el-input-number v-model="securityForm.lockDuration" :min="5" :max="60" />
              <span style="margin-left: 10px; color: #909399;">分钟</span>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置" name="email">
          <el-form ref="emailFormRef" :model="emailForm" :rules="emailRules" label-width="120px">
            <el-form-item label="SMTP服务器" prop="smtpHost">
              <el-input v-model="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            
            <el-form-item label="端口" prop="smtpPort">
              <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" />
            </el-form-item>
            
            <el-form-item label="加密方式" prop="encryption">
              <el-radio-group v-model="emailForm.encryption">
                <el-radio label="none">无</el-radio>
                <el-radio label="ssl">SSL</el-radio>
                <el-radio label="tls">TLS</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="发件人邮箱" prop="fromEmail">
              <el-input v-model="emailForm.fromEmail" placeholder="请输入发件人邮箱" />
            </el-form-item>
            
            <el-form-item label="发件人名称" prop="fromName">
              <el-input v-model="emailForm.fromName" placeholder="请输入发件人名称" />
            </el-form-item>
            
            <el-form-item label="用户名" prop="username">
              <el-input v-model="emailForm.username" placeholder="请输入用户名" />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input v-model="emailForm.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveEmailSettings">保存设置</el-button>
              <el-button @click="testEmailConnection">测试连接</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Settings',
  setup() {
    const activeTab = ref('basic')
    
    // 基本设置
    const basicFormRef = ref()
    const basicForm = reactive({
      siteName: 'Leaf Card',
      siteTitle: 'Leaf Card - 卡片管理系统',
      siteDescription: '一个功能强大的卡片管理系统',
      keywords: '卡片,管理,系统',
      icp: ''
    })
    
    const basicRules = {
      siteName: [
        { required: true, message: '请输入网站名称', trigger: 'blur' }
      ],
      siteTitle: [
        { required: true, message: '请输入网站标题', trigger: 'blur' }
      ]
    }
    
    // 安全设置
    const securityFormRef = ref()
    const securityForm = reactive({
      sessionTimeout: 30,
      passwordStrength: 'medium',
      loginLock: true,
      maxLoginAttempts: 5,
      lockDuration: 30
    })
    
    const securityRules = {
      sessionTimeout: [
        { required: true, message: '请输入登录超时时间', trigger: 'blur' }
      ]
    }
    
    // 邮件设置
    const emailFormRef = ref()
    const emailForm = reactive({
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      encryption: 'tls',
      fromEmail: 'noreply@example.com',
      fromName: 'Leaf Card',
      username: '',
      password: ''
    })
    
    const emailRules = {
      smtpHost: [
        { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
      ],
      smtpPort: [
        { required: true, message: '请输入端口号', trigger: 'blur' }
      ],
      fromEmail: [
        { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
      ]
    }
    
    const saveBasicSettings = async () => {
      try {
        await basicFormRef.value.validate()
        // 模拟保存操作
        ElMessage.success('基本设置保存成功')
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const saveSecuritySettings = async () => {
      try {
        await securityFormRef.value.validate()
        // 模拟保存操作
        ElMessage.success('安全设置保存成功')
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const saveEmailSettings = async () => {
      try {
        await emailFormRef.value.validate()
        // 模拟保存操作
        ElMessage.success('邮件设置保存成功')
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const testEmailConnection = async () => {
      try {
        await emailFormRef.value.validate()
        // 模拟测试连接
        ElMessage.success('邮件连接测试成功')
      } catch (error) {
        console.error('邮件连接测试失败:', error)
        ElMessage.error('邮件连接测试失败')
      }
    }
    
    onMounted(() => {
      // 可以在这里加载设置数据
    })
    
    return {
      activeTab,
      basicFormRef,
      basicForm,
      basicRules,
      securityFormRef,
      securityForm,
      securityRules,
      emailFormRef,
      emailForm,
      emailRules,
      saveBasicSettings,
      saveSecuritySettings,
      saveEmailSettings,
      testEmailConnection
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form {
  max-width: 600px;
}
</style>