import request from '@/utils/request'
import type { 
  CardInfo, 
  CardQueryParams, 
  CreateCardParams, 
  UpdateCardParams,
  ApiResponse,
  PaginatedResponse 
} from '@/types'

// 卡管理API
export const cardApi = {
  // 获取卡列表
  getCards(params: CardQueryParams): Promise<ApiResponse<PaginatedResponse<CardInfo>>> {
    return request({
      url: '/api/cards',
      method: 'get',
      params
    })
  },

  // 获取卡详情
  getCard(id: string): Promise<ApiResponse<CardInfo>> {
    return request({
      url: `/api/cards/${id}`,
      method: 'get'
    })
  },

  // 创建卡
  createCard(data: CreateCardParams): Promise<ApiResponse<CardInfo>> {
    return request({
      url: '/api/cards',
      method: 'post',
      data
    })
  },

  // 更新卡
  updateCard(id: string, data: UpdateCardParams): Promise<ApiResponse<CardInfo>> {
    return request({
      url: `/api/cards/${id}`,
      method: 'put',
      data
    })
  },

  // 删除卡
  deleteCard(id: string): Promise<ApiResponse<void>> {
    return request({
      url: `/api/cards/${id}`,
      method: 'delete'
    })
  },

  // 上架卡
  publishCard(id: string): Promise<ApiResponse<CardInfo>> {
    return request({
      url: `/api/cards/${id}/publish`,
      method: 'put'
    })
  },

  // 下架卡
  unpublishCard(id: string): Promise<ApiResponse<CardInfo>> {
    return request({
      url: `/api/cards/${id}/unpublish`,
      method: 'put'
    })
  },

  // 批量上架
  batchPublish(ids: string[]): Promise<ApiResponse<void>> {
    return request({
      url: '/api/cards/batch-publish',
      method: 'put',
      data: { ids }
    })
  },

  // 批量下架
  batchUnpublish(ids: string[]): Promise<ApiResponse<void>> {
    return request({
      url: '/api/cards/batch-unpublish',
      method: 'put',
      data: { ids }
    })
  },

  // 批量删除
  batchDelete(ids: string[]): Promise<ApiResponse<void>> {
    return request({
      url: '/api/cards/batch-delete',
      method: 'delete',
      data: { ids }
    })
  }
}

// 带错误处理和重试机制的安全API
export const safeCardApi = {
  async getCards(params: CardQueryParams, retries = 3) {
    try {
      return await cardApi.getCards(params)
    } catch (error) {
      if (retries > 0) {
        console.warn(`获取卡列表失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.getCards(params, retries - 1)
      }
      throw error
    }
  },

  async getCard(id: string, retries = 3) {
    try {
      return await cardApi.getCard(id)
    } catch (error) {
      if (retries > 0) {
        console.warn(`获取卡详情失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.getCard(id, retries - 1)
      }
      throw error
    }
  },

  async createCard(data: CreateCardParams, retries = 3) {
    try {
      return await cardApi.createCard(data)
    } catch (error) {
      if (retries > 0) {
        console.warn(`创建卡失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.createCard(data, retries - 1)
      }
      throw error
    }
  },

  async updateCard(id: string, data: UpdateCardParams, retries = 3) {
    try {
      return await cardApi.updateCard(id, data)
    } catch (error) {
      if (retries > 0) {
        console.warn(`更新卡失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.updateCard(id, data, retries - 1)
      }
      throw error
    }
  }
}