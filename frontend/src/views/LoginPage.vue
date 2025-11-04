<template>
  <div class="login-container">
    <div class="login-form">
      <div class="logo-section">
        <!-- <img src="@/assets/logo.png" alt="枫叶网盘" class="logo"> -->
        <h1>枫叶网盘</h1>
        <p class="subtitle">安全、简单的个人网盘服务</p>
      </div>
      
      <div class="form-tabs">
        <el-tabs v-model="activeTab" stretch @tab-click="handleTabClick">
          <el-tab-pane label="登录" name="login">
            <el-form 
              ref="loginFormRef" 
              :model="loginForm" 
              :rules="loginRules" 
              label-width="0"
              class="form-content"
            >
              <el-form-item prop="email">
                <el-input 
                  v-model="loginForm.email" 
                  placeholder="邮箱地址"
                  prefix-icon="Message"
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
              
              <el-form-item prop="agreeToTerms">
                <el-checkbox v-model="loginForm.agreeToTerms">
                  我已阅读并同意<a href="#" @click.prevent="showTerms">《用户协议》</a>和<a href="#" @click.prevent="showPrivacy">《隐私政策》</a>
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
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="注册" name="register">
            <el-form 
              ref="registerFormRef" 
              :model="registerForm" 
              :rules="registerRules" 
              label-width="0"
              class="form-content"
            >
              <el-form-item prop="phone">
                <el-input 
                  v-model="registerForm.phone" 
                  placeholder="手机号"
                  prefix-icon="Phone"
                  size="large"
                />
              </el-form-item>
              
              <el-form-item prop="email">
                <el-input 
                  v-model="registerForm.email" 
                  placeholder="邮箱地址"
                  prefix-icon="Message"
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
                    type="primary" 
                    class="send-code-btn"
                    :disabled="isSendingCode || countdown > 0"
                    @click="sendVerificationCode"
                    size="large"
                  >
                    {{ countdown > 0 ? `${countdown}s后重试` : '发送验证码' }}
                  </el-button>
                </div>
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input 
                  v-model="registerForm.password" 
                  type="password" 
                  placeholder="密码"
                  prefix-icon="Lock"
                  show-password
                  size="large"
                  @keyup.enter="handleRegister"
                />
              </el-form-item>
              
              <el-form-item prop="agreeToTerms">
                <el-checkbox v-model="registerForm.agreeToTerms">
                  我已阅读并同意<a href="#" @click.prevent="showTerms">《用户协议》</a>和<a href="#" @click.prevent="showPrivacy">《隐私政策》</a>
                </el-checkbox>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="success" 
                  class="submit-btn" 
                  :loading="registerLoading"
                  @click="handleRegister"
                  size="large"
                >
                  注册
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import store from '@/utils/store.js'

const router = useRouter()
const route = useRoute()

// 激活的标签页
const activeTab = ref('login')

// 登录表单
const loginFormRef = ref()
const loginForm = reactive({
  email: '',
  password: '',
  agreeToTerms: false
})

// 注册表单
const registerFormRef = ref()
const registerForm = reactive({
  phone: '',
  email: '',
  verificationCode: '',
  password: '',
  agreeToTerms: false
})

// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)

// 验证码相关状态
const isSendingCode = ref(false)
const countdown = ref(0)
let countdownTimer = null

// 组件挂载时检查路由参数
onMounted(() => {
  // 检查路由中是否有 mode 参数，且值为 register
  if (route.query.mode === 'register') {
    activeTab.value = 'register'
  }
})

// 登录表单验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  agreeToTerms: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 注册表单验证规则
const registerRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  agreeToTerms: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 处理标签切换
const handleTabClick = (tab) => {
  // 重置表单
  if (tab.paneName === 'login') {
    registerFormRef.value?.resetFields()
    // 清除验证码倒计时
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
      countdown.value = 0
    }
  } else {
    loginFormRef.value?.resetFields()
  }
}

// 发送邮箱验证码
const sendVerificationCode = async () => {
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!registerForm.email || !emailRegex.test(registerForm.email)) {
    ElMessage.error('请输入正确的邮箱地址')
    return
  }
  
  try {
    isSendingCode.value = true
    
    // 调用发送验证码API
    const result = await store.sendVerificationCode(registerForm.email)
    
    if (result.success) {
      ElMessage.success('验证码已发送，请查收邮箱')
      
      // 开始倒计时
      countdown.value = 60
      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }, 1000)
    } else {
      ElMessage.error(result.message || '发送验证码失败，请稍后重试')
    }
  } catch (error) {
    ElMessage.error('发送验证码失败，请稍后重试')
  } finally {
    isSendingCode.value = false
  }
}

// 显示用户协议
const showTerms = () => {
  ElMessage.info('用户协议页面开发中...')
}

// 显示隐私政策
const showPrivacy = () => {
  ElMessage.info('隐私政策页面开发中...')
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loginLoading.value = true
    
    // 调用登录API
    const result = await store.login(loginForm)
    
    if (result.success) {
      ElMessage.success('登录成功')
      // 根据用户角色跳转到不同页面
      if (store.state.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/user')
      }
    } else {
      ElMessage.error(result.message || '登录失败，请检查邮箱和密码')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查邮箱和密码')
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
    
    registerLoading.value = true
    
    // 调用注册API
    const result = await store.register(registerForm)
    
    if (result.success) {
      if (result.token) {
        // 注册成功后自动登录
        ElMessage.success('注册成功，已自动登录')
        
        // 根据用户角色跳转到不同页面
        if (store.state.isAdmin) {
          router.push('/admin')
        } else {
          router.push('/user')
        }
      } else {
        // 如果后端没有返回token，注册成功但需要手动登录
        ElMessage.success('注册成功，请登录')
        activeTab.value = 'login'
        registerFormRef.value.resetFields()
      }
    } else {
      ElMessage.error(result.message || '注册失败，请稍后重试')
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 0px;
}

.login-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.logo-section h1 {
  color: #2c3e50;
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
  margin-top: 20px;
}

.form-content {
  margin-top: 24px;
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
  font-size: 15px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-top: 8px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  padding: 0 16px 12px;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
}

:deep(.el-tabs__active-bar) {
  background-color: #409eff;
  height: 2px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-icon) {
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form {
    margin: 16px;
    padding: 24px;
    border-radius: 8px;
  }
  
  .logo-section h1 {
    font-size: 22px;
  }
  
  .logo {
    width: 56px;
    height: 56px;
  }
}
</style>