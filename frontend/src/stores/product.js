import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  // 状态
  const goods = ref([])
  const specifications = ref([])
  const categories = ref([])
  const loading = ref(false)
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 方法
  const setGoods = (newGoods) => {
    goods.value = newGoods
  }
  
  const addGood = (good) => {
    goods.value.push(good)
  }
  
  const updateGood = (id, updatedGood) => {
    const index = goods.value.findIndex(good => good.id === id)
    if (index !== -1) {
      goods.value[index] = { ...goods.value[index], ...updatedGood }
    }
  }
  
  const deleteGood = (id) => {
    const index = goods.value.findIndex(good => good.id === id)
    if (index !== -1) {
      goods.value.splice(index, 1)
    }
  }
  
  const setSpecifications = (specs) => {
    specifications.value = specs
  }
  
  const addSpecification = (spec) => {
    specifications.value.push(spec)
  }
  
  const updateSpecification = (id, updatedSpec) => {
    const index = specifications.value.findIndex(spec => spec.id === id)
    if (index !== -1) {
      specifications.value[index] = { ...specifications.value[index], ...updatedSpec }
    }
  }
  
  const deleteSpecification = (id) => {
    const index = specifications.value.findIndex(spec => spec.id === id)
    if (index !== -1) {
      specifications.value.splice(index, 1)
    }
  }
  
  const setCategories = (cats) => {
    categories.value = cats
  }
  
  const setLoading = (status) => {
    loading.value = status
  }
  
  const setPagination = (pag) => {
    pagination.value = { ...pagination.value, ...pag }
  }
  
  return {
    goods,
    specifications,
    categories,
    loading,
    pagination,
    setGoods,
    addGood,
    updateGood,
    deleteGood,
    setSpecifications,
    addSpecification,
    updateSpecification,
    deleteSpecification,
    setCategories,
    setLoading,
    setPagination
  }
})