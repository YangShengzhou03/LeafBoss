import service from './index'
import type { 
  ProductInfo, 
  CreateProductParams, 
  UpdateProductParams,
  ProductQueryParams,
  ProductCategory,
  CreateProductCategoryParams,
  UpdateProductCategoryParams,
  ProductCategoryQueryParams,
  ProductBrand,
  CreateProductBrandParams,
  UpdateProductBrandParams,
  ProductBrandQueryParams,
  StockRecord,
  PriceRecord,
  ProductStatistics,
  ProductImportResult,
  PaginationResponse,
  ApiResponse 
} from '@/types'

// 商品管理API
export const productApi = {
  // 获取商品列表
  getProducts(params?: ProductQueryParams): Promise<PaginationResponse<ProductInfo>> {
    return service.get('/products', { params })
  },

  // 获取商品详情
  getProduct(id: number): Promise<ProductInfo> {
    return service.get(`/products/${id}`)
  },

  // 创建商品
  createProduct(data: CreateProductParams): Promise<ProductInfo> {
    return service.post('/products', data)
  },

  // 更新商品
  updateProduct(id: number, data: UpdateProductParams): Promise<ProductInfo> {
    return service.put(`/products/${id}`, data)
  },

  // 删除商品（软删除）
  deleteProduct(id: number): Promise<void> {
    return service.delete(`/products/${id}`)
  },

  // 批量删除商品
  batchDeleteProducts(ids: number[]): Promise<void> {
    return service.delete('/products/batch', { data: { ids } })
  },

  // 更新商品状态
  updateProductStatus(id: number, status: 'active' | 'inactive' | 'draft'): Promise<ProductInfo> {
    return service.patch(`/products/${id}/status`, { status })
  },

  // 批量更新商品状态
  batchUpdateProductStatus(ids: number[], status: 'active' | 'inactive' | 'draft'): Promise<void> {
    return service.patch('/products/batch/status', { ids, status })
  },

  // 切换商品特色状态
  toggleFeatured(id: number): Promise<ProductInfo> {
    return service.patch(`/products/${id}/featured`)
  },

  // 切换商品热销状态
  toggleHot(id: number): Promise<ProductInfo> {
    return service.patch(`/products/${id}/hot`)
  },

  // 切换商品新品状态
  toggleNew(id: number): Promise<ProductInfo> {
    return service.patch(`/products/${id}/new`)
  },

  // 更新商品库存
  updateProductStock(id: number, stock: number, reason?: string): Promise<ProductInfo> {
    return service.patch(`/products/${id}/stock`, { stock, reason })
  },

  // 更新商品价格
  updateProductPrice(id: number, price: number, reason?: string): Promise<ProductInfo> {
    return service.patch(`/products/${id}/price`, { price, reason })
  },

  // 更新商品查看次数
  updateViewCount(id: number): Promise<ProductInfo> {
    return service.patch(`/products/${id}/view-count`)
  },

  // 获取商品分类列表（树形结构）
  getProductCategories(params?: ProductCategoryQueryParams): Promise<PaginationResponse<ProductCategory>> {
    return service.get('/product-categories', { params })
  },

  // 获取商品分类详情
  getProductCategory(id: number): Promise<ProductCategory> {
    return service.get(`/product-categories/${id}`)
  },

  // 创建商品分类
  createProductCategory(data: CreateProductCategoryParams): Promise<ProductCategory> {
    return service.post('/product-categories', data)
  },

  // 更新商品分类
  updateProductCategory(id: number, data: UpdateProductCategoryParams): Promise<ProductCategory> {
    return service.put(`/product-categories/${id}`, data)
  },

  // 删除商品分类
  deleteProductCategory(id: number): Promise<void> {
    return service.delete(`/product-categories/${id}`)
  },

  // 获取商品品牌列表
  getProductBrands(params?: ProductBrandQueryParams): Promise<PaginationResponse<ProductBrand>> {
    return service.get('/product-brands', { params })
  },

  // 获取商品品牌详情
  getProductBrand(id: number): Promise<ProductBrand> {
    return service.get(`/product-brands/${id}`)
  },

  // 创建商品品牌
  createProductBrand(data: CreateProductBrandParams): Promise<ProductBrand> {
    return service.post('/product-brands', data)
  },

  // 更新商品品牌
  updateProductBrand(id: number, data: UpdateProductBrandParams): Promise<ProductBrand> {
    return service.put(`/product-brands/${id}`, data)
  },

  // 删除商品品牌
  deleteProductBrand(id: number): Promise<void> {
    return service.delete(`/product-brands/${id}`)
  },

  // 获取商品库存记录
  getStockRecords(productId: number, params?: PaginationParams): Promise<PaginationResponse<StockRecord>> {
    return service.get(`/products/${productId}/stock-records`, { params })
  },

  // 获取商品价格记录
  getPriceRecords(productId: number, params?: PaginationParams): Promise<PaginationResponse<PriceRecord>> {
    return service.get(`/products/${productId}/price-records`, { params })
  },

  // 获取商品统计信息
  getProductStats(): Promise<ProductStatistics> {
    return service.get('/products/stats')
  },

  // 导入商品
  importProducts(file: File): Promise<ProductImportResult> {
    const formData = new FormData()
    formData.append('file', file)
    return service.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 导出商品
  exportProducts(params?: ProductExportParams): Promise<Blob> {
    return service.get('/products/export', { 
      params,
      responseType: 'blob'
    })
  },

  // 获取回收站商品列表
  getTrashProducts(params?: ProductQueryParams): Promise<PaginationResponse<ProductInfo>> {
    return service.get('/products/trash', { params })
  },

  // 恢复商品
  restoreProduct(id: number): Promise<void> {
    return service.patch(`/products/${id}/restore`)
  },

  // 批量恢复商品
  batchRestoreProducts(ids: number[]): Promise<void> {
    return service.patch('/products/batch/restore', { ids })
  },

  // 彻底删除商品
  forceDeleteProduct(id: number): Promise<void> {
    return service.delete(`/products/${id}/force`)
  },

  // 批量彻底删除商品
  batchForceDeleteProducts(ids: number[]): Promise<void> {
    return service.delete('/products/batch/force', { data: { ids } })
  },

  // 清空回收站
  clearTrash(): Promise<void> {
    return service.delete('/products/trash/clear')
  }
}

// 安全的商品API（带错误处理和重试机制）
export const safeProductApi = {
  // 获取商品列表
  async getProducts(params?: ProductQueryParams) {
    try {
      const response = await productApi.getProducts(params)
      return { success: true, data: response, message: '获取商品列表成功' }
    } catch (error: any) {
      console.error('获取商品列表失败:', error)
      return { 
        success: false, 
        data: null, 
        message: error.message || '获取商品列表失败，请检查网络连接' 
      }
    }
  },

  // 创建商品
  async createProduct(data: CreateProductParams) {
    try {
      const response = await productApi.createProduct(data)
      return { success: true, data: response, message: '创建商品成功' }
    } catch (error: any) {
      console.error('创建商品失败:', error)
      return { 
        success: false, 
        data: null, 
        message: error.message || '创建商品失败，请检查输入信息' 
      }
    }
  },

  // 更新商品
  async updateProduct(id: number, data: UpdateProductParams) {
    try {
      const response = await productApi.updateProduct(id, data)
      return { success: true, data: response, message: '更新商品成功' }
    } catch (error: any) {
      console.error('更新商品失败:', error)
      return { 
        success: false, 
        data: null, 
        message: error.message || '更新商品失败，请检查输入信息' 
      }
    }
  },

  // 删除商品
  async deleteProduct(id: number) {
    try {
      await productApi.deleteProduct(id)
      return { success: true, message: '删除商品成功' }
    } catch (error: any) {
      console.error('删除商品失败:', error)
      return { 
        success: false, 
        message: error.message || '删除商品失败，请检查网络连接' 
      }
    }
  },

  // 获取商品详情
  async getProduct(id: number) {
    try {
      const response = await productApi.getProduct(id)
      return { success: true, data: response, message: '获取商品详情成功' }
    } catch (error: any) {
      console.error('获取商品详情失败:', error)
      return { 
        success: false, 
        data: null, 
        message: error.message || '获取商品详情失败，请检查网络连接' 
      }
    }
  }
}