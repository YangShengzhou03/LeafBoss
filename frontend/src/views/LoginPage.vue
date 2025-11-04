<template>
  <div class="login-container">
    <div class="login-form">
      <div class="logo-section">
        <div class="logo">枫</div>
        <h1>枫叶卡管</h1>
        <p class="subtitle">管理员系统</p>
      </div>
      
      <el-tabs v-model="activeTab" class="form-tabs" @tab-click="handleTabClick">
        <!-- 登录标签页 -->
        <el-tab-pane label="登录" name="login">
          <el-form 
            ref="loginFormRef" 
            :model="loginForm" 
            :rules="loginRules" 
            label-width="0"
            class="form-content"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="密码"
                prefix-icon="Lock"
                show-password
                size="large"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                class="submit-btn" 
                :loading="loginLoading"
                @click="handleLogin"
                size="large"
              >
                登录
              </el-button>
            </el-form-item>
            
            
            
            <div class="form-footer">
              <el-link type="primary" @click="activeTab = 'register'">没有账号？立即注册</el-link>
              <el-link type="info" @click="forgotPasswordDialogVisible = true">忘记密码？</el-link>
            </div>
          </el-form>
        </el-tab-pane>
        
        <!-- 注册标签页 -->
        <el-tab-pane label="注册" name="register">
          <el-form 
            ref="registerFormRef" 
            :model="registerForm" 
            :rules="registerRules" 
            label-width="0"
            class="form-content"
          >
            <el-form-item prop="email">
              <el-input 
                v-model="registerForm.email" 
                placeholder="邮箱"
                prefix-icon="Message"
                size="large"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="密码"
                prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>
            
            <el-form-item prop="verificationCode">
              <div class="verification-code-container">
                <el-input 
                  v-model="registerForm.verificationCode" 
                  placeholder="邮箱验证码"
                  prefix-icon="Key"
                  size="large"
                />
                <el-button 
                  :disabled="codeSending || countdown > 0"
                  :loading="codeSending"
                  @click="sendVerificationCode"
                  size="large"
                  class="send-code-btn"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-checkbox v-model="registerForm.agreed">
                我已阅读并同意 <el-link type="primary" @click="showUserAgreement">用户协议</el-link> 和 <el-link type="primary" @click="showPrivacyPolicy">隐私政策</el-link>
              </el-checkbox>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                class="submit-btn" 
                :loading="registerLoading"
                @click="handleRegister"
                size="large"
              >
                注册
              </el-button>
            </el-form-item>
            
            <div class="form-footer">
              <el-link type="primary" @click="activeTab = 'login'">已有账号？立即登录</el-link>
            </div>
          </el-form>
        </el-tab-pane>
        

      </el-tabs>
    </div>
    
    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="forgotPasswordDialogVisible"
      title="重置密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form 
        ref="forgotFormRef" 
        :model="forgotForm" 
        :rules="forgotRules" 
        label-width="80px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="forgotForm.email" 
            placeholder="管理员邮箱"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="验证码" prop="verificationCode">
          <div class="verification-code-container">
            <el-input 
              v-model="forgotForm.verificationCode" 
              placeholder="邮箱验证码"
              prefix-icon="Key"
              size="large"
            />
            <el-button 
              :disabled="forgotCodeSending || forgotCountdown > 0"
              :loading="forgotCodeSending"
              @click="sendForgotVerificationCode"
              size="large"
              class="send-code-btn"
            >
              {{ forgotCountdown > 0 ? `${forgotCountdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="forgotForm.newPassword" 
            type="password" 
            placeholder="新密码"
            prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="forgotForm.confirmPassword" 
            type="password" 
            placeholder="确认新密码"
            prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="forgotPasswordDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            :loading="forgotLoading"
            @click="handleForgotPassword"
          >
            重置密码
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import store from '@/utils/store.js'
import { UserService } from '@/services/api.js'

const router = useRouter()

// 当前活动标签页
const activeTab = ref('login')

// 登录表单
const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单
const registerFormRef = ref()
const registerForm = reactive({
  email: '',
  password: '',
  verificationCode: '',
  agreed: false
})

// 忘记密码表单
const forgotFormRef = ref()
const forgotForm = reactive({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

// 忘记密码对话框显示状态
const forgotPasswordDialogVisible = ref(false)

// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)
const forgotLoading = ref(false)

// 验证码相关状态
const codeSending = ref(false)
const countdown = ref(0)
const forgotCodeSending = ref(false)
const forgotCountdown = ref(0)

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

// 忘记密码表单验证规则
const forgotRules = {
  email: [
    { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== forgotForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 标签页切换处理
const handleTabClick = (tab) => {
  // 切换标签页时重置表单验证
  if (tab.name === 'login' && loginFormRef.value) {
    loginFormRef.value.clearValidate()
  } else if (tab.name === 'register' && registerFormRef.value) {
    registerFormRef.value.clearValidate()
  } else if (tab.name === 'forgot' && forgotFormRef.value) {
    forgotFormRef.value.clearValidate()
  }
}

// 发送注册验证码
const sendVerificationCode = async () => {
  if (!registerForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(registerForm.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }
  
  try {
    codeSending.value = true
    const response = await UserService.sendRegisterCode({ email: registerForm.email })
    
    if (response.code === 200) {
      ElMessage.success('验证码已发送，请查收邮箱')
      startCountdown()
    } else {
      ElMessage.error(response.message || '验证码发送失败')
    }
  } catch (error) {
    // 错误已由UserService处理，这里不需要额外处理
    console.error('发送注册验证码失败:', error)
  } finally {
    codeSending.value = false
  }
}

// 发送忘记密码验证码
const sendForgotVerificationCode = async () => {
  if (!forgotForm.email) {
    ElMessage.warning('请先输入管理员邮箱')
    return
  }
  
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(forgotForm.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }
  
  try {
    forgotCodeSending.value = true
    const response = await UserService.sendResetCode({ email: forgotForm.email })
    
    if (response.code === 200) {
      ElMessage.success('验证码已发送，请查收邮箱')
      startForgotCountdown()
    } else {
      ElMessage.error(response.message || '验证码发送失败')
    }
  } catch (error) {
    // 错误已由UserService处理，这里不需要额外处理
    console.error('发送重置验证码失败:', error)
  } finally {
    forgotCodeSending.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 开始忘记密码倒计时
const startForgotCountdown = () => {
  forgotCountdown.value = 60
  const timer = setInterval(() => {
    forgotCountdown.value--
    if (forgotCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 显示用户协议
const showUserAgreement = () => {
  ElMessageBox.alert(
    '管理员用户协议内容...',
    '用户协议',
    {
      confirmButtonText: '我已阅读',
      type: 'info'
    }
  )
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  ElMessageBox.alert(
    '隐私政策内容...',
    '隐私政策',
    {
      confirmButtonText: '我已阅读',
      type: 'info'
    }
  )
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loginLoading.value = true
    
    // 调用管理员登录API
    const result = await store.adminLogin(loginForm)
    
    if (result.success) {
      ElMessage.success('登录成功')
      // 确保store中的用户信息已更新
      await new Promise(resolve => setTimeout(resolve, 100))
      // 使用replace而不是push，确保不会保留登录页在历史记录中
      // 直接跳转到管理员控制台
      router.replace('/admin')
    } else {
      ElMessage.error(result.message || '登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请检查网络连接')
  } finally {
    loginLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return
    
    if (!registerForm.agreed) {
      ElMessage.warning('请阅读并同意用户协议和隐私政策')
      return
    }
    
    registerLoading.value = true
    
    // 调用管理员注册API
    const result = await store.adminRegister({
      email: registerForm.email,
      password: registerForm.password,
      verificationCode: registerForm.verificationCode
    })
    
    if (result.success) {
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
    } else {
      ElMessage.error(result.message || '注册失败')
    }
  } catch (error) {
    console.error('注册错误:', error)
    ElMessage.error('注册失败，请检查网络连接')
  } finally {
    registerLoading.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = async () => {
  if (!forgotFormRef.value) return
  
  try {
    const valid = await forgotFormRef.value.validate()
    if (!valid) return
    
    forgotLoading.value = true
    
    // 调用重置密码API
    const result = await UserService.resetPassword({
      email: forgotForm.email,
      verificationCode: forgotForm.verificationCode,
      newPassword: forgotForm.newPassword
    })
    
    if (result.code === 200) {
      ElMessage.success('密码重置成功，请使用新密码登录')
      activeTab.value = 'login'
    } else {
      ElMessage.error(result.message || '密码重置失败')
    }
  } catch (error) {
    // 错误已由UserService处理，这里不需要额外处理
    console.error('重置密码失败:', error)
  } finally {
    forgotLoading.value = false
  }
}

// 组件挂载时自动填充测试账号
onMounted(() => {
  loginForm.username = 'admin'
  loginForm.password = '123456'
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
}

.login-form {
  background: #ffffff;
  border: 1px solid #ddd;
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: #409eff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.logo-section h1 {
  color: #303133;
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  color: #909399;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
}

.form-tabs {
  margin-top: 16px;
}

.form-content {
  margin-top: 20px;
}

.form-content .el-form-item {
  margin-bottom: 20px;
}

.verification-code-container {
  display: flex;
  gap: 10px;
}

.verification-code-container .el-input {
  flex: 1;
}

.send-code-btn {
  min-width: 120px;
  white-space: nowrap;
}

.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  margin-top: 8px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 4px;
}

.form-footer .el-link {
  font-size: 13px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  padding: 0 16px 12px;
  color: #909399;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
}

:deep(.el-tabs__active-bar) {
  background-color: #409eff;
  height: 2px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e4e7ed;
}

:deep(.el-form-item__label) {
  font-weight: 400;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

:deep(.el-icon) {
  color: #c0c4cc;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .login-form {
    padding: 24px;
  }
  
  .logo-section {
    margin-bottom: 24px;
  }
  
  .logo-section h1 {
    font-size: 22px;
  }
  
  .logo {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 12px 10px;
  }
  
  :deep(.el-input__inner) {
    height: 36px;
    line-height: 36px;
  }
  
  .submit-btn {
    height: 36px;
  }
}
</style>