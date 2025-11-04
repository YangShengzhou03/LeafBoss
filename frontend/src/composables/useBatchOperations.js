import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNotificationStore } from '@/stores/notification'

// 批量操作组合式函数
export function useBatchOperations() {
  const notificationStore = useNotificationStore()
  
  // 状态
  const selectedItems = ref([])
  const batchOperationLoading = ref(false)
  
  // 计算属性
  const hasSelection = computed(() => selectedItems.value.length > 0)
  const selectionCount = computed(() => selectedItems.value.length)
  const isAllSelected = computed(() => {
    // 这个需要在具体组件中实现，因为需要知道总数据量
    return false
  })
  const isIndeterminate = computed(() => {
    // 这个需要在具体组件中实现
    return false
  })
  
  // 方法
  // 选择/取消选择单个项目
  const toggleSelection = (item, items) => {
    const index = selectedItems.value.findIndex(selected => selected.id === item.id)
    if (index === -1) {
      selectedItems.value.push(item)
    } else {
      selectedItems.value.splice(index, 1)
    }
  }
  
  // 全选/取消全选
  const toggleSelectAll = (items, isSelected) => {
    if (isSelected) {
      // 全选
      items.forEach(item => {
        if (!selectedItems.value.some(selected => selected.id === item.id)) {
          selectedItems.value.push(item)
        }
      })
    } else {
      // 取消全选
      const itemIds = items.map(item => item.id)
      selectedItems.value = selectedItems.value.filter(
        selected => !itemIds.includes(selected.id)
      )
    }
  }
  
  // 清空选择
  const clearSelection = () => {
    selectedItems.value = []
  }
  
  // 批量删除确认
  const confirmBatchDelete = async (itemName = '项目') => {
    if (selectedItems.value.length === 0) {
      notificationStore.warning('请先选择要删除的项目')
      return false
    }
    
    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedItems.value.length} 个${itemName}吗？此操作不可恢复！`,
        '批量删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      )
      return true
    } catch {
      return false
    }
  }
  
  // 批量操作确认
  const confirmBatchOperation = async (operationName, itemName = '项目') => {
    if (selectedItems.value.length === 0) {
      notificationStore.warning('请先选择要操作的项目')
      return false
    }
    
    try {
      await ElMessageBox.confirm(
        `确定要对选中的 ${selectedItems.value.length} 个${itemName}执行${operationName}操作吗？`,
        '批量操作确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      return true
    } catch {
      return false
    }
  }
  
  // 批量操作结果处理
  const handleBatchResult = (result, successMessage, errorMessage) => {
    if (result.success || (result.data && result.data.success)) {
      const count = result.count || result.data?.count || selectedItems.value.length
      notificationStore.success(`${successMessage}，共处理 ${count} 个项目`)
      clearSelection()
      return true
    } else {
      notificationStore.error(errorMessage || '批量操作失败')
      return false
    }
  }
  
  // 设置批量操作加载状态
  const setBatchLoading = (loading) => {
    batchOperationLoading.value = loading
  }
  
  // 获取选中项的ID列表
  const getSelectedIds = () => {
    return selectedItems.value.map(item => item.id)
  }
  
  // 检查项目是否被选中
  const isItemSelected = (item) => {
    return selectedItems.value.some(selected => selected.id === item.id)
  }
  
  return {
    // 状态
    selectedItems,
    batchOperationLoading,
    
    // 计算属性
    hasSelection,
    selectionCount,
    isAllSelected,
    isIndeterminate,
    
    // 方法
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    confirmBatchDelete,
    confirmBatchOperation,
    handleBatchResult,
    setBatchLoading,
    getSelectedIds,
    isItemSelected
  }
}

// 卡密批量操作
export function useCardBatchOperations() {
  const { selectedItems, ...batchOps } = useBatchOperations()
  const notificationStore = useNotificationStore()
  
  // 批量删除卡密
  const batchDeleteCards = async (deleteFunction) => {
    const confirmed = await batchOps.confirmBatchDelete('卡密')
    if (!confirmed) return
    
    batchOps.setBatchLoading(true)
    try {
      const ids = batchOps.getSelectedIds()
      const result = await deleteFunction(ids)
      batchOps.handleBatchResult(result, '卡密删除成功', '卡密删除失败')
      return result
    } catch (error) {
      console.error('批量删除卡密失败:', error)
      notificationStore.error('批量删除卡密失败')
    } finally {
      batchOps.setBatchLoading(false)
    }
  }
  
  // 批量导出卡密
  const batchExportCards = async (exportFunction) => {
    if (selectedItems.value.length === 0) {
      notificationStore.warning('请先选择要导出的卡密')
      return
    }
    
    batchOps.setBatchLoading(true)
    try {
      const ids = batchOps.getSelectedIds()
      const result = await exportFunction(ids)
      notificationStore.success('卡密导出成功')
      return result
    } catch (error) {
      console.error('批量导出卡密失败:', error)
      notificationStore.error('批量导出卡密失败')
    } finally {
      batchOps.setBatchLoading(false)
    }
  }
  
  // 批量更改状态
  const batchChangeStatus = async (status, changeFunction) => {
    const statusText = status ? '激活' : '禁用'
    const confirmed = await batchOps.confirmBatchOperation(statusText, '卡密')
    if (!confirmed) return
    
    batchOps.setBatchLoading(true)
    try {
      const ids = batchOps.getSelectedIds()
      const result = await changeFunction(ids, status)
      batchOps.handleBatchResult(result, `卡密${statusText}成功`, `卡密${statusText}失败`)
      return result
    } catch (error) {
      console.error(`批量${statusText}卡密失败:`, error)
      notificationStore.error(`批量${statusText}卡密失败`)
    } finally {
      batchOps.setBatchLoading(false)
    }
  }
  
  return {
    selectedItems,
    batchOperationLoading: batchOps.batchOperationLoading,
    hasSelection: batchOps.hasSelection,
    selectionCount: batchOps.selectionCount,
    isAllSelected: batchOps.isAllSelected,
    isIndeterminate: batchOps.isIndeterminate,
    
    toggleSelection: batchOps.toggleSelection,
    toggleSelectAll: batchOps.toggleSelectAll,
    clearSelection: batchOps.clearSelection,
    isItemSelected: batchOps.isItemSelected,
    
    batchDeleteCards,
    batchExportCards,
    batchChangeStatus,
    setBatchLoading: batchOps.setBatchLoading
  }
}

// 商品批量操作
export function useProductBatchOperations() {
  const { selectedItems, ...batchOps } = useBatchOperations()
  const notificationStore = useNotificationStore()
  
  // 批量删除商品
  const batchDeleteProducts = async (deleteFunction) => {
    const confirmed = await batchOps.confirmBatchDelete('商品')
    if (!confirmed) return
    
    batchOps.setBatchLoading(true)
    try {
      const ids = batchOps.getSelectedIds()
      const result = await deleteFunction(ids)
      batchOps.handleBatchResult(result, '商品删除成功', '商品删除失败')
      return result
    } catch (error) {
      console.error('批量删除商品失败:', error)
      notificationStore.error('批量删除商品失败')
    } finally {
      batchOps.setBatchLoading(false)
    }
  }
  
  // 批量更改状态
  const batchChangeStatus = async (status, changeFunction) => {
    const statusText = status ? '上架' : '下架'
    const confirmed = await batchOps.confirmBatchOperation(statusText, '商品')
    if (!confirmed) return
    
    batchOps.setBatchLoading(true)
    try {
      const ids = batchOps.getSelectedIds()
      const result = await changeFunction(ids, status)
      batchOps.handleBatchResult(result, `商品${statusText}成功`, `商品${statusText}失败`)
      return result
    } catch (error) {
      console.error(`批量${statusText}商品失败:`, error)
      notificationStore.error(`批量${statusText}商品失败`)
    } finally {
      batchOps.setBatchLoading(false)
    }
  }
  
  return {
    selectedItems,
    batchOperationLoading: batchOps.batchOperationLoading,
    hasSelection: batchOps.hasSelection,
    selectionCount: batchOps.selectionCount,
    isAllSelected: batchOps.isAllSelected,
    isIndeterminate: batchOps.isIndeterminate,
    
    toggleSelection: batchOps.toggleSelection,
    toggleSelectAll: batchOps.toggleSelectAll,
    clearSelection: batchOps.clearSelection,
    isItemSelected: batchOps.isItemSelected,
    
    batchDeleteProducts,
    batchChangeStatus,
    setBatchLoading: batchOps.setBatchLoading
  }
}