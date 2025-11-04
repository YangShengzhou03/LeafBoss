import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref([])
  const unreadCount = ref(0)
  
  // 添加通知
  const addNotification = (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      title: notification.title || '通知',
      message: notification.message || '',
      type: notification.type || 'info', // success, warning, info, error
      duration: notification.duration || 4500,
      showClose: notification.showClose !== false,
      timestamp: new Date(),
      read: false
    }
    
    notifications.value.unshift(newNotification)
    unreadCount.value++
    
    // 显示Element Plus通知
    ElNotification({
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      duration: newNotification.duration,
      showClose: newNotification.showClose
    })
    
    return id
  }
  
  // 标记为已读
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }
  
  // 标记所有为已读
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
    unreadCount.value = 0
  }
  
  // 删除通知
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
    }
  }
  
  // 清空所有通知
  const clearAllNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
  }
  
  // 便捷方法
  const success = (message, title = '成功') => {
    return addNotification({ title, message, type: 'success' })
  }
  
  const warning = (message, title = '警告') => {
    return addNotification({ title, message, type: 'warning' })
  }
  
  const info = (message, title = '信息') => {
    return addNotification({ title, message, type: 'info' })
  }
  
  const error = (message, title = '错误') => {
    return addNotification({ title, message, type: 'error', duration: 6000 })
  }
  
  return {
    // 状态
    notifications,
    unreadCount,
    
    // 方法
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    
    // 便捷方法
    success,
    warning,
    info,
    error
  }
})