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
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo">
            <span class="logo-text">枫</span>
          </div>
          <h1 class="app-title">LeafCard</h1>
          <p class="subtitle">枫叶卡管系统 - 管理员系统</p>
        </div>
        
        <!-- 表单区域 -->
        <div class="form-section">
          <!-- 视图切换标题 -->
          <div class="view-header">
            <h2 class="view-title">{{ currentView === 'login' ? '登录' : currentView === 'register' ? '注册' : '重置密码' }}</h2>
            <div class="view-indicator">
              <div class="indicator-dot" :class="{ active: currentView === 'login' }"></div>
              <div class="indicator-dot" :class="{ active: currentView === 'register' }"></div>
              <div class="indicator-dot" :class="{ active: currentView === 'forgot' }"></div>
            </div>
          </div>
          
          <!-- 登录视图 -->
          <div v-if="currentView === 'login'" class="view-content">
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
              
              <el-form-item class="remember-password-item">
                <el-checkbox v-model="loginForm.rememberPassword" class="remember-checkbox">
                  记住密码
                </el-checkbox>
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
                <el-link type="primary" @click="currentView = 'register'">没有账号？立即注册</el-link>
                <el-link type="info" @click="currentView = 'forgot'">忘记密码？</el-link>
              </div>
            </el-form>
          </div>
          
          <!-- 注册视图 -->
          <div v-else-if="currentView === 'register'" class="view-content">
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
                    @input="checkPasswordStrength"
                  />
                </div>
                <div v-if="registerForm.password" class="password-strength">
                  <div class="strength-bar">
                    <div 
                      class="strength-level" 
                      :class="passwordStrength.level"
                      :style="{ width: passwordStrength.width + '%' }"
                    ></div>
                  </div>
                  <div class="strength-text">{{ passwordStrength.text }}</div>
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
                <el-link type="primary" @click="currentView = 'login'">已有账号？立即登录</el-link>
              </div>
            </el-form>
          </div>
          
          <!-- 忘记密码视图 -->
          <div v-else-if="currentView === 'forgot'" class="view-content">
            <el-form 
              ref="forgotFormRef" 
              :model="forgotForm" 
              :rules="forgotRules" 
              label-width="0"
              class="form-content"
            >
              <el-form-item prop="email">
                <div class="input-wrapper">
                  <el-input 
                    v-model="forgotForm.email" 
                    placeholder="管理员邮箱"
                    prefix-icon="Message"
                    size="large"
                    class="custom-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item prop="verificationCode">
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
              
              <el-form-item prop="newPassword">
                <div class="input-wrapper">
                  <el-input 
                    v-model="forgotForm.newPassword" 
                    type="password" 
                    placeholder="新密码"
                    prefix-icon="Lock"
                    show-password
                    size="large"
                    class="custom-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  class="submit-btn" 
                  :loading="forgotLoading"
                  @click="handleForgotPassword"
                  size="large"
                >
                  <span v-if="!forgotLoading">重置密码</span>
                  <span v-else>重置中...</span>
                </el-button>
              </el-form-item>
              
              <div class="form-footer">
                <el-link type="primary" @click="currentView = 'login'">返回登录</el-link>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import store from '@/utils/store.js'
import { UserService } from '@/services/api.js'
import * as utils from '@/utils/utils.js'

const router = useRouter()

// 当前显示的视图：login, register, forgot
const currentView = ref('login')

// 登录表单
const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: '',
  rememberPassword: false
})

// 注册表单
const registerFormRef = ref()
const registerForm = reactive({
  email: '',
  password: '',
  agreed: false
})

// 密码强度检测
const passwordStrength = reactive({
  level: 'weak', // weak, medium, strong
  width: 0,
  text: ''
})

// 忘记密码表单
const forgotFormRef = ref()
const forgotForm = reactive({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})



// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)
const forgotLoading = ref(false)

// 验证码相关状态（仅用于忘记密码功能）
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
  ]
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

// 检查密码强度
const checkPasswordStrength = () => {
  const password = registerForm.password
  if (!password) {
    passwordStrength.level = 'weak'
    passwordStrength.width = 0
    passwordStrength.text = ''
    return
  }
  
  let score = 0
  
  // 长度评分
  if (password.length >= 8) score += 25
  else if (password.length >= 6) score += 15
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score += 15
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 15
  
  // 包含数字
  if (/[0-9]/.test(password)) score += 15
  
  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) score += 20
  
  // 设置强度等级
  if (score >= 80) {
    passwordStrength.level = 'strong'
    passwordStrength.width = 100
    passwordStrength.text = '密码强度：强'
  } else if (score >= 50) {
    passwordStrength.level = 'medium'
    passwordStrength.width = 66
    passwordStrength.text = '密码强度：中'
  } else {
    passwordStrength.level = 'weak'
    passwordStrength.width = 33
    passwordStrength.text = '密码强度：弱'
  }
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
      // 如果用户选择了记住密码，保存凭据
      if (loginForm.rememberPassword) {
        utils.saveCredentials(loginForm.username, loginForm.password)
      } else {
        // 如果用户没有选择记住密码，清除可能存在的凭据
        utils.removeCredentials()
      }
      
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
      password: registerForm.password
    })
    
    if (result.success) {
      ElMessage.success('注册成功，请登录')
      currentView.value = 'login'
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
      currentView.value = 'login'
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
  
  // 检查是否有保存的登录凭据
  const savedCredentials = utils.getCredentials()
  if (savedCredentials) {
    // 自动填充保存的凭据
    loginForm.username = savedCredentials.username
    loginForm.password = savedCredentials.password
    loginForm.rememberPassword = true
  } else {
    // 如果没有保存的凭据，填充测试账号
    loginForm.username = 'admin'
    loginForm.password = '123456'
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(44, 90, 160, 0.03) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, -10px) rotate(1deg); }
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.card-inner {
  background: #ffffff;
  border-radius: 10px;
  padding: 24px 28px;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.05),
    0 3px 8px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(224, 224, 224, 0.6);
  display: flex;
  align-items: stretch;
  gap: 16px;
  backdrop-filter: blur(6px);
  min-height: 320px;
}

/* Logo部分 */
.logo-section {
  text-align: center;
  flex: 0 0 140px;
  padding: 20px 8px;
  border-right: 1px solid rgba(224, 224, 224, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.logo-section::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 75%;
  background: linear-gradient(to bottom, transparent, rgba(224, 224, 224, 0.6), transparent);
}

.logo {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2c5aa0 0%, #1e4a8c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(44, 90, 160, 0.2);
}

.logo-text {
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.app-title {
  color: #1a1a1a;
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c5aa0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.1px;
  line-height: 1.3;
}

/* 表单区域 */
.form-section {
  flex: 1;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 340px;
}

/* 视图切换标题 */
.view-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.view-title {
  color: #1a1a1a;
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.4px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c5aa0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.view-indicator {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 6px;
}

.indicator-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: all 0.2s ease;
}

.indicator-dot.active {
  background: #2c5aa0;
  transform: scale(1.3);
}

/* 视图内容 */
.view-content {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-content {
  margin-top: 6px;
}

.form-content .el-form-item {
  margin-bottom: 14px;
}

/* 统一输入框和按钮宽度 */
.form-content .el-input,
.form-content .submit-btn {
  width: 100% !important;
}

/* 修复输入框和按钮宽度不一致问题 */
.form-content .el-form-item__content {
  width: 100%;
}

.input-wrapper {
  width: 100%;
}

/* 统一盒模型和宽度计算 */
.form-content .el-input,
.form-content .el-input__wrapper,
.form-content .el-input__inner,
.form-content .submit-btn {
  box-sizing: border-box !important;
  width: 100% !important;
}

/* 确保输入框内部元素不限制宽度 */
.form-content .el-input__prefix,
.form-content .el-input__suffix {
  flex-shrink: 0; /* 防止图标区域压缩输入区域 */
}

.form-content .el-input__inner {
  flex: 1; /* 输入区域占据剩余空间 */
  min-width: 0; /* 允许压缩 */
}

/* 验证码输入区域样式优化 */
.verification-code-container {
  display: flex;
  justify-content: space-between; /* 分散对齐 */
  gap: 8px;
  align-items: center;
}

.verification-code-container .el-input {
  flex: 1;
}

.verification-code-container .send-code-btn {
  min-width: 120px;
  flex-shrink: 0;
}

.form-content .el-input__wrapper {
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(224, 224, 224, 0.7);
  background: #fcfcfc;
  transition: all 0.2s ease;
  width: 100%;
}

.form-content .el-input__wrapper:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-color: rgba(44, 90, 160, 0.4);
  background: #ffffff;
}

.form-content .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.08);
  border-color: #2c5aa0;
  background: #ffffff;
}

.input-wrapper {
  position: relative;
}

.custom-input {
  border-radius: 8px;
}



.submit-btn {
  width: 100%;
  height: 36px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 6px;
  background: linear-gradient(135deg, #2c5aa0 0%, #1e4a8c 100%);
  border: none;
  color: white;
  box-shadow: 0 1px 4px rgba(44, 90, 160, 0.25);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.4s;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #1e4a8c 0%, #153a75 100%);
  box-shadow: 0 3px 12px rgba(44, 90, 160, 0.3);
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:active {
  background: linear-gradient(135deg, #153a75 0%, #0f2a5a 100%);
  box-shadow: 0 1px 4px rgba(44, 90, 160, 0.25);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding: 0 2px;
}

.form-footer .el-link {
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.form-footer .el-link::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background: #2c5aa0;
  transition: width 0.2s ease;
}

.form-footer .el-link:hover {
  color: #2c5aa0;
}

.form-footer .el-link:hover::after {
  width: 100%;
}

.custom-checkbox {
  font-size: 13px;
}

.custom-checkbox :deep(.el-checkbox__label) {
  color: #555;
  font-size: 13px;
  line-height: 1.4;
}

/* 记住密码样式 */
.remember-password-item {
  margin-bottom: 16px !important;
}

.remember-checkbox {
  font-size: 13px;
}

.remember-checkbox :deep(.el-checkbox__label) {
  color: #555;
  font-size: 13px;
  line-height: 1.4;
}

/* 密码强度提示样式 */
.password-strength {
  margin-top: 6px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 100%);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.strength-level {
  height: 100%;
  border-radius: 2px;
  transition: all 0.5s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.strength-level.weak {
  background: linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%);
}

.strength-level.medium {
  background-color: #f39c12;
}

.strength-level.strong {
  background-color: #27ae60;
}

.strength-text {
  font-size: 10px;
  color: #666;
  text-align: right;
}

/* 对话框样式 */
.forgot-dialog :deep(.el-dialog) {
  border-radius: 4px;
  overflow: hidden;
}

.forgot-dialog :deep(.el-dialog__header) {
  background: #2c5aa0;
  color: white;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #e0e0e0;
}

.forgot-dialog :deep(.el-dialog__title) {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.forgot-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

.forgot-dialog :deep(.el-dialog__body) {
  padding: 12px 16px;
}

.forgot-dialog :deep(.el-dialog__footer) {
  padding: 8px 16px 12px;
  border-top: 1px solid #e0e0e0;
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
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  padding: 2px 10px;
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
  height: 36px;
  line-height: 36px;
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
    padding: 8px;
  }
  
  .card-inner {
    padding: 16px 12px;
    flex-direction: column;
    gap: 20px;
  }
  
  .logo-section {
    margin-bottom: 16px;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
  }
  
  .app-title {
    font-size: 18px;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
  }
  
  :deep(.el-input__inner) {
    height: 32px;
    line-height: 32px;
  }
  
  .submit-btn {
    height: 32px;
    font-size: 12px;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .form-footer .el-link {
    text-align: center;
    margin: 2px 0;
    font-size: 10px;
  }
  
  .verification-code-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .send-code-btn {
    min-width: 100%;
    font-size: 11px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 320px) {
  .card-inner {
    padding: 12px 8px;
    gap: 16px;
  }
  
  .logo-section {
    margin-bottom: 12px;
    padding-bottom: 12px;
  }
  
  .logo {
    width: 40px;
    height: 40px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .app-title {
    font-size: 16px;
  }
  
  :deep(.el-input__inner) {
    height: 28px;
    line-height: 28px;
  }
  
  .submit-btn {
    height: 28px;
    font-size: 11px;
  }
}
</style>