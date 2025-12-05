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
            <span class="logo-text">羽</span>
          </div>
          <h1 class="app-title">LeafCard</h1>
          <p class="subtitle">管理员系统</p>
        </div>

        <!-- 表单区域 -->
        <div class="form-section">
          <!-- 视图切换标题 -->
          <div class="view-header">
            <h2 class="view-title">{{ currentView === 'login' ? '登录' : currentView === 'register' ? '注册' : '重置密码' }}
            </h2>
            <div class="view-indicator">
              <div class="indicator-dot" :class="{ active: currentView === 'login' }"></div>
              <div class="indicator-dot" :class="{ active: currentView === 'register' }"></div>
              <div class="indicator-dot" :class="{ active: currentView === 'forgot' }"></div>
            </div>
          </div>

          <!-- 登录视图 -->
          <div v-if="currentView === 'login'" class="view-content">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0" class="form-content">
              <el-form-item prop="email">
                <div class="input-wrapper">
                  <el-input v-model="loginForm.email" placeholder="邮箱" prefix-icon="Message" size="large"
                    class="custom-input" />
                </div>
              </el-form-item>

              <el-form-item prop="password">
                <div class="input-wrapper">
                  <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock"
                    show-password size="large" class="custom-input" @keyup.enter="handleLogin" />
                </div>
              </el-form-item>

              <el-form-item class="remember-password-item">
                <el-checkbox v-model="loginForm.rememberPassword" class="remember-checkbox">
                  记住密码
                </el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="submit-btn" :loading="loginLoading" @click="handleLogin" size="large">
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
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="0"
              class="form-content">
              <el-form-item prop="email">
                <div class="input-wrapper">
                  <el-input v-model="registerForm.email" placeholder="邮箱" prefix-icon="Message" size="large"
                    class="custom-input" />
                </div>
              </el-form-item>

              <el-form-item prop="password">
                <div class="input-wrapper">
                  <el-input v-model="registerForm.password" type="password" placeholder="密码" prefix-icon="Lock"
                    show-password size="large" class="custom-input" @input="checkPasswordStrength" />
                </div>
                <div v-if="registerForm.password" class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-level" :class="passwordStrength.level"
                      :style="{ width: passwordStrength.width + '%' }"></div>
                  </div>
                </div>
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="registerForm.agreed" class="custom-checkbox">
                  我已阅读并同意 <el-link type="primary" @click="showUserAgreement">用户协议</el-link> 和 <el-link type="primary"
                    @click="showPrivacyPolicy">隐私政策</el-link>
                </el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="submit-btn" :loading="registerLoading" @click="handleRegister"
                  size="large">
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
            <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" label-width="0" class="form-content">
              <el-form-item prop="email">
                <div class="input-wrapper">
                  <el-input v-model="forgotForm.email" placeholder="管理员邮箱" prefix-icon="Message" size="large"
                    class="custom-input" />
                </div>
              </el-form-item>

              <el-form-item prop="verificationCode">
                <div class="verification-code-container">
                  <el-input v-model="forgotForm.verificationCode" placeholder="邮箱验证码" prefix-icon="Key" size="large" />
                  <el-button :disabled="forgotCodeSending || forgotCountdown > 0" :loading="forgotCodeSending"
                    @click="sendForgotVerificationCode" size="large" class="send-code-btn">
                    {{ forgotCountdown > 0 ? `${forgotCountdown}s` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item prop="newPassword">
                <div class="input-wrapper">
                  <el-input v-model="forgotForm.newPassword" type="password" placeholder="新密码" prefix-icon="Lock"
                    show-password size="large" class="custom-input" />
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="submit-btn" :loading="forgotLoading" @click="handleForgotPassword"
                  size="large">
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
import api from '../services/api'
import * as utils from '@/utils/utils.js'

const router = useRouter()

// 当前显示的视图：login, register, forgot
const currentView = ref('login')

// 登录表单
const loginFormRef = ref()
const loginForm = reactive({
  email: '',
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
  width: 0
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
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
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
    const response = await api.user.sendResetCode({ email: forgotForm.email })

    if (response && response.code === 200) {
      ElMessage.success('验证码已发送，请查收邮箱')
      startForgotCountdown()
    } else {
      ElMessage.error(response?.message || '验证码发送失败')
    }
  } catch (error) {

    ElMessage.error('验证码发送失败，请检查网络连接')
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
  } else if (score >= 50) {
    passwordStrength.level = 'medium'
    passwordStrength.width = 66
  } else {
    passwordStrength.level = 'weak'
    passwordStrength.width = 33
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
  router.push('/privacy-policy')
}

// ElMessageBox.alert(
//   '隐私政策内容...',
//   '隐私政策',
//   {
//     confirmButtonText: '我已阅读',
//     type: 'info'
//   }
// )

// 处理登录
const handleLogin = async () => {
  try {
    const response = await store.login(loginForm);
    if (response.success) {
      ElMessage.success('登录成功');
      router.replace('/admin');
    } else {
      ElMessage.error(response.message || '登录失败');
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络连接');
  }
};

// 处理注册
const handleRegister = async () => {
  try {
    // 将前端字段名映射到后端实体类的属性名
    const registerData = {
      email: registerForm.email,
      passwordHash: registerForm.password // 使用passwordHash来匹配实体类的属性名
    };

    const response = await store.register(registerData);
    if (response.success) {
      ElMessage.success('注册成功，正在自动登录...');
      // 由于store.register已经处理了token和用户信息的保存，直接跳转即可
      router.replace('/admin');
    } else {
      ElMessage.error(response.message || '注册失败')
    }
  } catch (error) {
    ElMessage.error('注册失败，请检查网络连接')
  }
};

// 处理忘记密码
const handleForgotPassword = async () => {
  try {
    const response = await store.resetPassword(forgotForm);
    if (response.success) {
      ElMessage.success('密码重置成功');
      currentView.value = 'login';
    } else {
      ElMessage.error(response.message || '密码重置失败');
    }
  } catch (error) {
    ElMessage.error('密码重置失败，请检查网络连接');
  }
};

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
    loginForm.email = savedCredentials.username
    loginForm.password = savedCredentials.password
    loginForm.rememberPassword = true

    // 如果保存的邮箱是admin@leaf.com，自动更正为正确的邮箱
    if (loginForm.email === 'admin@leaf.com') {
      loginForm.email = 'admin@leafcard.com'
    }
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 600px;
}

.card-inner {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 24px;
}

.logo-section {
  text-align: center;
  flex: 0 0 160px;
  padding: 24px 12px;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  background: #2c5aa0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  color: white;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c5aa0;
  margin: 8px 0 4px;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 表单区域 */
.form-section {
  flex: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 360px;
}

/* 视图切换标题 */
.view-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.view-title {
  color: #1a1a1a;
  margin: 0 0 12px 0;
  font-size: 24px;
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
  gap: 8px;
  margin-top: 8px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: #2c5aa0;
  transform: scale(1.4);
}

/* 视图内容 */
.view-content {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-content {
  margin-top: 8px;
}

.form-content .el-form-item {
  margin-bottom: 16px;
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
  flex-shrink: 0;
  /* 防止图标区域压缩输入区域 */
}

.form-content .el-input__inner {
  flex: 1;
  /* 输入区域占据剩余空间 */
  min-width: 0;
  /* 允许压缩 */
}

/* 验证码输入区域样式优化 */
.verification-code-container {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.verification-code-container .el-input {
  flex: 1;
}

.verification-code-container .send-code-btn {
  min-width: 132px;
  flex-shrink: 0;
}

.form-content .el-input__wrapper {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(224, 224, 224, 0.7);
  background: #fcfcfc;
  transition: all 0.3s ease;
  width: 100%;
}

.form-content .el-input__wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(44, 90, 160, 0.5);
  background: #ffffff;
}

.form-content .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.12);
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
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 8px;
  background: linear-gradient(135deg, #2c5aa0 0%, #1e4a8c 100%);
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(44, 90, 160, 0.3);
  transition: all 0.3s ease;
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
  box-shadow: 0 4px 16px rgba(44, 90, 160, 0.4);
  transform: translateY(-1px);
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:active {
  background: linear-gradient(135deg, #153a75 0%, #0f2a5a 100%);
  box-shadow: 0 1px 4px rgba(44, 90, 160, 0.25);
  transform: translateY(0);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 4px;
}

.form-footer .el-link {
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
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
  transition: width 0.3s ease;
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
  font-size: 14px;
}

.remember-checkbox :deep(.el-checkbox__label) {
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

/* 密码强度提示样式 */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 100%);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.strength-level {
  height: 100%;
  border-radius: 3px;
  transition: all 0.5s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.strength-level.weak {
  background: linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%);
}

.strength-level.medium {
  background: linear-gradient(90deg, #f39c12 0%, #f1c40f 100%);
}

.strength-level.strong {
  background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
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