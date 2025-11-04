// 工具函数集合

// 检查用户是否已登录
export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

// 保存token到localStorage
export function saveToken(token) {
  localStorage.setItem('token', token)
}

// 设置token（与saveToken功能相同，为了保持命名一致性）
export function setToken(token) {
  localStorage.setItem('token', token)
}

// 从localStorage移除token
export function removeToken() {
  localStorage.removeItem('token')
}

// 获取token
export function getToken() {
  return localStorage.getItem('token')
}

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// 获取文件扩展名
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// 检查是否为图片文件
export function isImageFile(filename) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico']
  const extension = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(extension)
}

// 检查是否为视频文件
export function isVideoFile(filename) {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']
  const extension = getFileExtension(filename).toLowerCase()
  return videoExtensions.includes(extension)
}

// 检查是否为音频文件
export function isAudioFile(filename) {
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a']
  const extension = getFileExtension(filename).toLowerCase()
  return audioExtensions.includes(extension)
}

// 检查是否为文档文件
export function isDocumentFile(filename) {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp']
  const extension = getFileExtension(filename).toLowerCase()
  return documentExtensions.includes(extension)
}

// 检查是否为压缩文件
export function isArchiveFile(filename) {
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const extension = getFileExtension(filename).toLowerCase()
  return archiveExtensions.includes(extension)
}

// 获取文件类型图标
export function getFileIcon(filename) {
  const extension = getFileExtension(filename).toLowerCase()
  
  if (isImageFile(filename)) return 'el-icon-picture'
  if (isVideoFile(filename)) return 'el-icon-video-play'
  if (isAudioFile(filename)) return 'el-icon-headset'
  if (isDocumentFile(filename)) return 'el-icon-document'
  if (isArchiveFile(filename)) return 'el-icon-folder-opened'
  
  // 特定文件扩展名的图标
  const iconMap = {
    'js': 'el-icon-cpu',
    'css': 'el-icon-brush',
    'html': 'el-icon-monitor',
    'json': 'el-icon-data-line',
    'xml': 'el-icon-document-copy',
    'exe': 'el-icon-setting',
    'msi': 'el-icon-setting'
  }
  
  return iconMap[extension] || 'el-icon-document'
}

// 生成随机字符串
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 解析JWT token
export function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT解析错误:', error);
    return {};
  }
}

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}

// 节流函数
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}