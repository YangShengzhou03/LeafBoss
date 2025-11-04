<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
    
    <!-- 登录表单卡片 -->
    <div class="login-card">
      <div class="card-inner">
        <div class="logo-section">
          <div class="logo">
            <span class="logo-text">枫</span>
            <div class="logo-glow"></div>
          </div>
          <h1 class="app-title">枫叶卡管</h1>
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
                <div class="input-wrapper">
                  <el-input 
                    v-model="loginForm.username" 
                    placeholder="用户名"
                    prefix-icon="User"
                    size="large"
                    class="custom-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item prop="password">
                <div class="input-wrapper">
                  <el-input 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="密码"
                    prefix-icon="Lock"
                    show-password
                    size="large"
                    class="custom-input"
                    @keyup.enter="handleLogin"
                  />
                </div>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  class="submit-btn" 
                  :loading="loginLoading"
                  @click="handleLogin"
                  size="large"
                >
                  <span v-if="!loginLoading">登录</span>
                  <span v-else>登录中...</span>
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
                <div class="input-wrapper">
                  <el-input 
                    v-model="registerForm.email" 
                    placeholder="邮箱"
                    prefix-icon="Message"
                    size="large"
                    class="custom-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item prop="password">
                <div class="input-wrapper">
                  <el-input 
                    v-model="registerForm.password" 
                    type="password" 
                    placeholder="密码"
                    prefix-icon="Lock"
                    show-password
                    size="large"
                    class="custom-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item prop="verificationCode">
                <div class="verification-code-container">
                  <div class="input-wrapper">
                    <el-input 
                      v-model="registerForm.verificationCode" 
                      placeholder="邮箱验证码"
                      prefix-icon="Key"
                      size="large"
                      class="custom-input"
                    />
                  </div>
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
                <el-checkbox v-model="registerForm.agreed" class="custom-checkbox">
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
                  <span v-if="!registerLoading">注册</span>
                  <span v-else>注册中...</span>
                </el-button>
              </el-form-item>
              
              <div class="form-footer">
                <el-link type="primary" @click="activeTab = 'login'">已有账号？立即登录</el-link>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="forgotPasswordDialogVisible"
      title="重置密码"
      width="400px"
      :close-on-click-modal="false"
      class="forgot-dialog"
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
import { ref, reactive, onMounted, markRaw } from 'vue'
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

// 在模板挂载后设置组件引用为markRaw
onMounted(() => {
  // 确保组件引用不被响应式化
  if (loginFormRef.value) {
    loginFormRef.value = markRaw(loginFormRef.value)
  }
  if (registerFormRef.value) {
    registerFormRef.value = markRaw(registerFormRef.value)
  }
  if (forgotFormRef.value) {
    forgotFormRef.value = markRaw(forgotFormRef.value)
  }
  
  // 组件挂载时自动填充测试账号
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: 2s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  perspective: 1000px;
}

.card-inner {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-inner:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Logo部分 */
.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  position: relative;
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff9558 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(255, 107, 53, 0.3);
  overflow: hidden;
}

.logo-text {
  color: white;
  font-size: 28px;
  font-weight: 700;
  z-index: 2;
  position: relative;
}

.logo-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo:hover .logo-glow {
  opacity: 1;
}

.app-title {
  color: #303133;
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #909399;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
}

/* 表单样式 */
.form-tabs {
  margin-top: 20px;
}

.form-content {
  margin-top: 20px;
}

.form-content .el-form-item {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
}

.custom-input {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.verification-code-container {
  display: flex;
  gap: 12px;
}

.verification-code-container .input-wrapper {
  flex: 1;
}

.send-code-btn {
  min-width: 110px;
  white-space: nowrap;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.send-code-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.send-code-btn:disabled {
  background: #e4e7ed;
  color: #909399;
  transform: none;
  box-shadow: none;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 8px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff9558 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 4px;
}

.form-footer .el-link {
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.form-footer .el-link:hover {
  transform: translateY(-1px);
}

.custom-checkbox {
  font-size: 14px;
}

.custom-checkbox :deep(.el-checkbox__label) {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

/* 对话框样式 */
.forgot-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.forgot-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-bottom: none;
}

.forgot-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.forgot-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

.forgot-dialog :deep(.el-dialog__body) {
  padding: 24px 20px;
}

.forgot-dialog :deep(.el-dialog__footer) {
  padding: 16px 20px 20px;
  border-top: 1px solid #f0f0f0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Element Plus组件样式覆盖 */
:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  padding: 0 20px 14px;
  color: #606266;
  transition: all 0.3s ease;
}

:deep(.el-tabs__item:hover) {
  color: #ff6b35;
}

:deep(.el-tabs__item.is-active) {
  color: #ff6b35;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #ff6b35, #ff9558);
  height: 3px;
  border-radius: 3px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06);
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  padding: 4px 12px;
  transition: all 0.3s ease;
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc;
  box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #303133;
}

:deep(.el-input__inner::placeholder) {
  color: #a8abb2;
}

:deep(.el-input__prefix) {
  color: #a8abb2;
}

:deep(.el-icon) {
  color: #a8abb2;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #ff6b35 0%, #ff9558 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
}

:deep(.el-link) {
  transition: all 0.3s ease;
}

:deep(.el-link:hover) {
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .card-inner {
    padding: 30px 24px;
  }
  
  .logo-section {
    margin-bottom: 24px;
  }
  
  .app-title {
    font-size: 24px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 15px;
    padding: 0 16px 12px;
  }
  
  :deep(.el-input__inner) {
    height: 36px;
    line-height: 36px;
  }
  
  .submit-btn {
    height: 44px;
    font-size: 15px;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .form-footer .el-link {
    text-align: center;
    margin: 4px 0;
  }
  
  .verification-code-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .send-code-btn {
    min-width: 100%;
  }
}

/* 超小屏幕适配 */
@media (max-width: 320px) {
  .card-inner {
    padding: 24px 20px;
  }
  
  .logo-section {
    margin-bottom: 20px;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .app-title {
    font-size: 22px;
  }
  
  :deep(.el-input__inner) {
    height: 32px;
    line-height: 32px;
  }
  
  .submit-btn {
    height: 40px;
    font-size: 14px;
  }
}
</style>