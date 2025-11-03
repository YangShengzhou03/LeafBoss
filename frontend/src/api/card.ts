import service from './index'

export interface Card {
  id?: number
  uuid?: string
  cardNumber: string
  cardLevel: string
  productCategory: string
  cardStatus: number
  createTime?: string
  activateTime?: string
  useTime?: string
  expireTime?: string
  userId?: string
  userIp?: string
  rechargeTimes?: number
  lastRechargeTime?: string
  remark?: string
  version?: number
}

export interface CardQueryParams {
  page: number
  size: number
  cardNumber?: string
  cardLevel?: string
  productCategory?: string
  cardStatus?: number
}

export interface CardListResponse {
  records: Card[]
  total: number
  size: number
  current: number
  pages: number
}

// 获取卡列表
export const getCardList = (params: CardQueryParams) => {
  return service.get<CardListResponse>('/cards', { params })
}

// 获取卡详情
export const getCardDetail = (id: number) => {
  return service.get<Card>(`/cards/${id}`)
}

// 新增卡
export const addCard = (data: Card) => {
  return service.post<Card>('/cards', data)
}

// 更新卡
export const updateCard = (data: Card) => {
  return service.put<Card>(`/cards/${data.id}`, data)
}

// 删除卡
export const deleteCard = (id: number) => {
  return service.delete(`/cards/${id}`)
}

// 激活卡
export const activateCard = (id: number) => {
  return service.post(`/cards/${id}/activate`)
}

// 补充卡
export const rechargeCard = (id: number) => {
  return service.post(`/cards/${id}/recharge`)
}

// 导入卡
export const importCards = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return service.post('/cards/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 下载导入模板
export const downloadTemplate = () => {
  return service.get('/cards/import/template', {
    responseType: 'blob'
  })
}

// 导出卡数据
export const exportCards = (params: CardQueryParams) => {
  return service.get('/cards/export', {
    params,
    responseType: 'blob'
  })
}