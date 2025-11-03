/* 统一导入管理 - 减少重复的依赖导入 */

// Vue 相关导入
export { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
export { useRoute, useRouter } from 'vue-router'

// Element Plus 组件导入
export { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// Element Plus 图标导入
export {
  Search,
  Plus,
  Edit,
  Delete,
  List,
  Setting,
  User,
  Lock,
  Refresh,
  Download,
  Upload,
  Filter,
  Sort,
  ArrowDown,
  ArrowUp,
  Close,
  Check,
  Warning,
  InfoFilled,
  SuccessFilled,
  CircleClose,
  View,
  Hide
} from '@element-plus/icons-vue'

// VueUse 工具函数导入
export { useDebounceFn } from '@vueuse/core'

// 常用工具函数
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export const throttle = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

// 日期格式化工具
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 数字格式化工具
export const formatNumber = (num, decimals = 0) => {
  if (isNaN(num)) return '0'
  return Number(num).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

// 验证工具函数
export const validators = {
  required: (message = '该字段为必填项') => ({
    required: true,
    message,
    trigger: 'blur'
  }),
  
  length: (min, max, message) => ({
    min,
    max,
    message: message || `长度在 ${min} 到 ${max} 个字符之间`,
    trigger: 'blur'
  }),
  
  email: (message = '请输入有效的邮箱地址') => ({
    type: 'email',
    message,
    trigger: 'blur'
  }),
  
  phone: (message = '请输入有效的手机号码') => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
    trigger: 'blur'
  })
}

// 状态管理工具
export const createStore = (initialState) => {
  const state = ref(initialState)
  
  const setState = (newState) => {
    Object.assign(state.value, newState)
  }
  
  const resetState = () => {
    state.value = { ...initialState }
  }
  
  return {
    state,
    setState,
    resetState
  }
}