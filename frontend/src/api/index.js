import userApi from './user'
import productApi from './product'
import specificationApi from './specification'
import cardKeyApi from './cardKey'
import operationLogApi from './operationLog'
import adminApi from './admin'

/**
 * API服务集合
 */
export {
  userApi,
  productApi,
  specificationApi,
  cardKeyApi,
  operationLogApi,
  adminApi
}

/**
 * 默认导出所有API服务
 */
export default {
  user: userApi,
  product: productApi,
  specification: specificationApi,
  cardKey: cardKeyApi,
  operationLog: operationLogApi,
  admin: adminApi
}