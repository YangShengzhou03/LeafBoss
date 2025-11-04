// 导出API服务
export { apiService, useApiStore } from './service'
export { cardService, productService, userService, authService, statsService } from './modules'

// 导出原有的API接口（向后兼容）
export { cardAPI, specificationAPI, cardLogAPI, apiUtils } from './legacy'

// 默认导出
export { default } from './service'