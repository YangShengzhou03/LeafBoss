# LEAF-BOSS API 接口文档

所有接口均以 `/api` 开头，需要认证的接口需在 Header 中携带 `Authorization: Bearer <Token>`

## 公共接口 (无需认证，供外部客户端使用)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/public/card-keys/verify/{cardKey}` | 验证并激活卡密（供桌面客户端使用） |
| GET | `/api/public/boss-reviews?company_name={name}` | 查询评论（按公司名） |
| POST | `/api/public/boss-reviews` | 提交评论（需卡密验证） |

## 认证接口 (Auth)

| 方法 | URL | 说明 |
|------|-----|------|
| POST | `/api/auth/login` | 管理员登录 |
| POST | `/api/auth/register` | 管理员注册 |
| GET | `/api/auth/me` | 获取当前用户信息 |
| PUT | `/api/auth/me` | 更新当前用户信息 |
| PUT | `/api/auth/password` | 修改当前用户密码 |
| GET | `/api/auth/storage` | 获取存储配额信息 |
| POST | `/api/auth/logout` | 登出系统 |

## 管理员管理 (Admins)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/admins` | 分页查询管理员列表 |
| GET | `/api/admins/{id}` | 获取指定管理员 |
| POST | `/api/admins` | 创建管理员 |
| PUT | `/api/admins/{id}` | 更新指定管理员信息 |
| DELETE | `/api/admins/{id}` | 删除管理员 |
| POST | `/api/admins/reset-password` | 重置管理员密码(验证码) |
| POST | `/api/admins/admin-reset-password` | 管理员直接重置密码 |
| POST | `/api/admins/send-reset-code` | 发送重置验证码 |
| GET | `/api/admins/storage` | 获取存储配额信息 |

## 商品管理 (Products)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/products` | 查询商品列表 |
| GET | `/api/products/{id}` | 查询指定商品 |
| POST | `/api/products` | 创建商品 |
| PUT | `/api/products/{id}` | 更新商品 |
| DELETE | `/api/products/{id}` | 删除商品 |
| GET | `/api/products/statistics` | 获取统计 |

## 规格管理 (Specifications)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/specifications` | 查询规格列表(分页) |
| GET | `/api/specifications/{id}` | 查询指定规格 |
| GET | `/api/specifications/product/{productId}` | 根据产品ID查询规格 |
| GET | `/api/specifications/status/{status}` | 根据状态查询规格 |
| POST | `/api/specifications` | 创建规格 |
| PUT | `/api/specifications/{id}` | 更新规格 |
| DELETE | `/api/specifications/{id}` | 删除规格 |
| GET | `/api/specifications/statistics` | 获取统计 |
| GET | `/api/specifications/dto` | 查询规格DTO(全量) |
| GET | `/api/specifications/dto/pagination` | 查询规格DTO(分页) |

## 卡密管理 (Card Keys)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/card-keys` | 查询列表 |
| GET | `/api/card-keys/with-details` | 详情列表(分页) |
| GET | `/api/card-keys/search?cardKey={cardKey}` | 搜索卡密 |
| GET | `/api/card-keys/verify/{cardKey}` | 验证卡密 |
| POST | `/api/card-keys` | 创建卡密 |
| POST | `/api/card-keys/activate` | 激活卡密 |
| POST | `/api/card-keys/disable` | 禁用卡密 |
| POST | `/api/card-keys/{cardKey}/status` | 切换卡密状态 |
| POST | `/api/card-keys/batch-generate` | 批量生成卡密 |
| GET | `/api/card-keys/statistics` | 获取统计 |
| DELETE | `/api/card-keys/{id}` | 删除卡密(按ID) |
| DELETE | `/api/card-keys/by-card-key/{cardKey}` | 删除卡密(按卡密) |
| DELETE | `/api/card-keys/batch-delete-used` | 批量删除已使用 |

## 用户管理 (Users)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/users` | 查询用户列表 |
| GET | `/api/users/{id}` | 查询指定用户 |
| POST | `/api/users` | 创建用户 |
| PUT | `/api/users/{id}` | 更新用户 |
| DELETE | `/api/users/{id}` | 删除用户 |
| POST | `/api/users/reset-password` | 重置用户密码 |

## 公司管理 (Companies)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/companies` | 查询公司列表 |
| GET | `/api/companies/{id}` | 查询指定公司 |
| POST | `/api/companies` | 创建公司 |
| PUT | `/api/companies/{id}` | 更新公司 |
| DELETE | `/api/companies/{id}` | 删除公司 |

## 评论管理 (Reviews)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/boss-reviews` | 查询评论列表 |
| GET | `/api/boss-reviews/{id}` | 查询指定评论 |
| POST | `/api/boss-reviews` | 创建评论 |
| DELETE | `/api/boss-reviews/{id}` | 删除评论 |

## 仪表盘与日志 (Dashboard & Logs)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/api/admin/stats` | 核心指标统计 |
| GET | `/api/admin/today-sales-distribution` | 销售分布 |
| GET | `/api/operation-logs` | 查询日志 |
| GET | `/api/operation-logs/stats` | 获取日志统计 |
| GET | `/api/operation-logs/type/{operationType}` | 按类型查询日志 |
| DELETE | `/api/operation-logs` | 清空日志 |
| POST | `/api/operation-logs` | 记录操作日志 |
