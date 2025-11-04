import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCardStore = defineStore('card', () => {
  // 状态
  const cards = ref([])
  const cardStats = ref({
    total: 0,
    used: 0,
    unused: 0,
    todayActivated: 0
  })
  const loading = ref(false)
  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  
  // 计算属性
  const unusedCards = computed(() => cards.value.filter(card => card.status === 'unused'))
  const usedCards = computed(() => cards.value.filter(card => card.status === 'used'))
  
  // 方法
  const setCards = (newCards) => {
    cards.value = newCards
  }
  
  const addCards = (newCards) => {
    cards.value = [...cards.value, ...newCards]
  }
  
  const updateCard = (id, updatedCard) => {
    const index = cards.value.findIndex(card => card.id === id)
    if (index !== -1) {
      cards.value[index] = { ...cards.value[index], ...updatedCard }
    }
  }
  
  const deleteCard = (id) => {
    const index = cards.value.findIndex(card => card.id === id)
    if (index !== -1) {
      cards.value.splice(index, 1)
    }
  }
  
  const setCardStats = (stats) => {
    cardStats.value = { ...cardStats.value, ...stats }
  }
  
  const setPagination = (pag) => {
    pagination.value = { ...pagination.value, ...pag }
  }
  
  const setLoading = (status) => {
    loading.value = status
  }
  
  return {
    cards,
    cardStats,
    loading,
    pagination,
    unusedCards,
    usedCards,
    setCards,
    addCards,
    updateCard,
    deleteCard,
    setCardStats,
    setPagination,
    setLoading
  }
})