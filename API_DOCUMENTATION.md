# Leaf Card 卡密管理系统 API 文档

## 概述

Leaf Card 是一个卡密管理系统，提供用户管理、产品管理、规格管理、卡密管理等功能。本文档详细描述了所有API接口的前端请求格式和后端响应格式。

## 基础信息

- **基础URL**: `http://localhost:8080/api`
- **认证方式**: 目前为简单认证，后续可集成JWT
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
    "code": 200,
    "message": "success",
    "data": {}
}
```

### 错误响应
```json
{
    "code": 400,
    "message": "错误信息",
    "data": null
}
```

## 用户管理 API

### 1. 用户登录

**接口地址**: `POST /api/auth/login`

**请求参数**:
```json
{
    "email": "admin@leafcard.com",
    "password": "123456"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "jwt-token-string",
        "user": {
            "id": "uuid-string",
            "username": "admin",
            "email": "admin@leafcard.com",
            "status": "active",
            "lastLoginTime": "2024-01-15T14:30:00"
        }
    }
}
```

### 2. 获取用户信息

**接口地址**: `GET /users/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "uuid-string",
        "username": "user1",
        "email": "user1@leafcard.com",
        "nickname": "普通用户",
        "avatar": null,
        "role": "user",
        "status": "active",
        "lastLoginTime": "2024-01-15T14:30:00",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T14:30:00"
    }
}
```

### 3. 创建用户

**接口地址**: `POST /users`

**请求参数**:
```json
{
    "username": "newuser",
    "email": "newuser@leafcard.com",
    "passwordHash": "encrypted_password",
    "nickname": "新用户",
    "role": "user"
}
```

## 产品管理 API

### 1. 分页查询产品列表

**接口地址**: `GET /products?page=1&size=10`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": "uuid-string",
                "name": "VIP会员",
                "description": "VIP会员专属权益，享受高级服务",
                "category": "virtual",
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 5,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 根据ID查询产品

**接口地址**: `GET /products/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "uuid-string",
        "name": "VIP会员",
        "description": "VIP会员专属权益，享受高级服务",
        "category": "virtual",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 3. 创建产品

**接口地址**: `POST /products`

**请求参数**:
```json
{
    "name": "新产品",
    "description": "新产品描述",
    "category": "virtual",
    "status": "active"
}
```

### 4. 更新产品

**接口地址**: `PUT /products/{id}`

**请求参数**:
```json
{
    "name": "更新后的产品名",
    "description": "更新后的描述",
    "category": "virtual",
    "status": "active"
}
```

### 5. 删除产品

**接口地址**: `DELETE /products/{id}`

## 规格管理 API

### 1. 分页查询规格列表

**接口地址**: `GET /specifications?page=1&size=10`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": "uuid-string",
                "productId": "product-uuid",
                "name": "月卡",
                "description": "VIP会员专属月卡，享受专属权益",
                "durationDays": 30,
                "price": 29.9,
                "currency": "CNY",
                "stockQuantity": 1000,
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 8,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 根据产品ID查询规格

**接口地址**: `GET /specifications/product/{productId}`

## 卡密管理 API

### 1. 分页查询卡密列表

**接口地址**: `GET /card-keys?page=1&size=10`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": "uuid-string",
                "cardKey": "LEAF-2024-001-ABCD-EFGH",
                "specificationId": "spec-uuid",
                "status": "未使用",
                "userId": null,
                "userEmail": null,
                "activateTime": null,
                "expireTime": null,
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 10,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 搜索卡密

**接口地址**: `GET /card-keys/search?cardKey=LEAF-2024-001`

### 3. 激活卡密

**接口地址**: `POST /card-keys/{id}/activate`

**请求参数**:
```json
{
    "userId": "user-uuid",
    "userEmail": "user@example.com"
}
```

### 4. 禁用卡密

**接口地址**: `POST /card-keys/{id}/disable`

### 5. 获取卡密统计

**接口地址**: `GET /card-keys/statistics`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalCards": 10,
        "unusedCards": 6,
        "usedCards": 3,
        "disabledCards": 1
    }
}
```

## 操作日志 API

### 1. 分页查询操作日志

**接口地址**: `GET /operation-logs?page=1&size=10`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": "uuid-string",
                "userId": "user-uuid",
                "operationType": "user_login",
                "targetId": null,
                "targetType": null,
                "description": "用户登录系统",
                "ipAddress": "192.168.1.1",
                "createdAt": "2024-01-15T14:30:00"
            }
        ],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

## 前端请求示例

### Vue.js 请求示例

```javascript
// 用户登录
async login(username, password) {
    try {
        const response = await this.$http.post('/api/users/login', {
            username: username,
            password: password
        });
        
        if (response.data.code === 200) {
            // 登录成功，保存用户信息
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('登录失败:', error);
        throw error;
    }
}

// 获取产品列表
async getProducts(page = 1, size = 10) {
    try {
        const response = await this.$http.get(`/api/products?page=${page}&size=${size}`);
        return response.data.data;
    } catch (error) {
        console.error('获取产品列表失败:', error);
        throw error;
    }
}

// 激活卡密
async activateCard(cardId, userId, userEmail) {
    try {
        const response = await this.$http.post(`/api/card-keys/${cardId}/activate`, {
            userId: userId,
            userEmail: userEmail
        });
        
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('激活卡密失败:', error);
        throw error;
    }
}
```

### Axios 配置示例

```javascript
import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        // 添加认证token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            // 未授权，跳转到登录页
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default http;
```

## 错误码说明

| 错误码 | 说明 | 处理建议 |
|-------|------|----------|
| 200 | 成功 | 正常处理 |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 未授权 | 重新登录获取token |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 资源不存在 | 检查请求路径 |
| 500 | 服务器内部错误 | 联系系统管理员 |

## 部署说明

### 后端部署

1. 配置数据库连接信息
2. 执行数据库初始化脚本
3. 打包项目：`mvn clean package`
4. 运行：`java -jar target/leaf-card-backend-1.0.0.jar`

### 前端部署

1. 安装依赖：`npm install`
2. 构建项目：`npm run build`
3. 部署到Web服务器

## 注意事项

1. 所有时间字段使用ISO 8601格式
2. 金额字段使用数字类型，单位为元
3. 分页查询默认页码为1，页大小为10
4. 生产环境请配置HTTPS和安全的认证方式