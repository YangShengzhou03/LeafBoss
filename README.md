# LeafBoss - 业务运营支撑系统

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/stargazers)&nbsp;[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/network/members)&nbsp;[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/issues)&nbsp;[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafBoss?style=for-the-badge)](https://github.com/YangShengzhou03/LeafBoss/blob/main/LICENSE)&nbsp;[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)&nbsp;[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**一个现代化的业务运营支撑系统，采用前后端分离架构**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [在线演示](#-在线演示) • [API文档](API_DOCUMENTATION.md)

</div>

## 功能特性

- **卡密管理** - 完整的卡密生命周期管理，支持创建、验证、激活、禁用
- **产品管理** - 产品信息管理，支持多规格配置
- **规格管理** - 灵活的规格定义，支持不同时长和价格的授权方案
- **公司管理** - 公司信息管理，支持评论统计
- **评论管理** - 用户评论管理，支持按公司和卡密筛选
- **管理员管理** - 管理员账户管理，支持权限控制
- **客户用户管理** - 客户用户信息管理，支持状态控制
- **数据统计** - 可视化数据报表，实时监控系统使用情况
- **操作日志** - 完整的操作审计日志，追踪系统操作记录
- **安全认证** - JWT Token认证机制，保障系统安全
- **响应式设计** - 支持PC、平板、手机等多端访问
- **高性能** - 基于Spring Boot 3和Vue 3的高性能架构

### 系统界面预览

![LEAF-BOSS 业务运营支撑系统](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Overview.png)


## 快速开始

## 环境要求

### 开发环境
- **Node.js**: 16.0+ (前端开发)
- **Java**: 17.0+ (后端开发)
- **MySQL**: 8.0+ (数据库)
- **Maven**: 3.6+ (后端构建)

### 生产环境
- **服务器**: Linux/Windows Server
- **内存**: 2GB+ RAM
- **存储**: 1GB+ 可用空间

## 安装部署

### 1. 克隆项目
```bash
git clone https://github.com/YangShengzhou03/LeafBoss.git
cd leaf-boss
```

### 2. 后端部署

#### 配置数据库
```sql
-- 创建数据库
CREATE DATABASE leaf_boss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 执行初始化脚本
USE leaf_boss;
SOURCE data.sql;
```

#### 配置应用
编辑 `backend/src/main/resources/application.yml`：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/leaf_boss?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456

app:
  jwt:
    secret: leaf-boss-secret-key-for-jwt-token-generation
    expiration: 86400000

server:
  port: 8081
```

#### 启动后端服务
```bash
cd backend

# 编译项目
mvn clean package

# 运行应用
java -jar target/leaf-boss-backend-1.0.0.jar
```

### 3. 前端部署

#### 安装依赖
```bash
cd frontend
npm install
```

#### 配置环境变量
编辑 `frontend/.env.development`：
```env
VUE_APP_API_BASE_URL=http://localhost:8081
VUE_APP_TITLE=LEAF-BOSS 业务运营支撑系统 (Development)
```

#### 启动前端服务
```bash
# 开发模式
npm run serve

# 或生产构建
npm run build
```

## 快速使用

### 1. 访问系统
- 前端地址: http://localhost:8080
- 后端API: http://localhost:8081/api

### 2. 默认账号
- **管理员**: admin@qq.com / 123456

![LEAF-BOSS 管理员登录](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Login.png)

### 3. 核心功能

#### 卡密管理
- 创建卡密批次
- 验证卡密有效性
- 查看卡密使用状态
- 批量导入/导出卡密

#### 产品管理
- 产品信息维护
- 产品规格配置
- 产品状态管理

![LEAF-BOSS 商品管理](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Product-Management.png)

#### 规格管理
- 规格定义和配置
- 不同时长和价格的授权方案
- 规格状态管理

#### 公司管理
- 公司信息维护
- 公司评论统计
- 公司状态管理

#### 评论管理
- 用户评论查看
- 按公司和卡密筛选
- 评论删除管理

#### 管理员管理
- 管理员账户管理
- 管理员信息维护
- 权限控制

#### 客户用户管理
- 客户用户信息维护
- 用户状态管理
- 用户查询和筛选

#### 操作日志
- 完整的操作审计
- 日志查询和统计
- 系统操作追踪

#### 数据统计
- 卡密使用统计
- 产品和规格统计
- 操作日志分析

![LEAF-BOSS 管理员仪表盘](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Dashboard.png)

#### 管理员管理
- 管理员账户管理
- 管理员信息维护
- 权限控制

![LEAF-BOSS 管理人员](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Admin-Management.png)

### 系统架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端界面层     │    │   后端服务层     │    │   数据存储层     │
│                 │    │                 │    │                 │
│  Vue 3 +        │◄──►│ Spring Boot 3   │◄──►│   MySQL 8.0     │
│  Element Plus   │    │ MyBatis Plus + JWT │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户交互层     │    │   业务逻辑层     │    │   数据持久层     │
│                 │    │                 │    │                 │
│  组件化开发     │    │  服务层封装     │    │  Repository     │
│  响应式设计     │    │  事务管理       │    │  数据映射       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术栈详情

#### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.4.0 | 渐进式JavaScript框架 |
| Element Plus | 2.4.0 | 基于Vue 3的UI组件库 |
| Vue Router | 4.2.0 | 官方路由管理器 |
| Axios | 1.6.0 | HTTP客户端库 |
| Sass | 1.69.0 | CSS预处理器 |

#### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.1.0 | Java企业级开发框架 |
| MyBatis Plus | 3.5.4.1 | 数据持久层框架 |
| MySQL | 8.0.33 | 关系型数据库 |
| Maven | 3.6+ | 项目构建工具 |
| Java | 17.0+ | 开发语言 |
| JWT | 0.11.5 | JSON Web Token认证 |

### 项目结构

```
leaf-boss/
├── frontend/                          # 前端项目
│   ├── public/                        # 静态资源
│   │   ├── index.html                 # HTML模板
│   │   └── favicon.svg                # 网站图标
│   ├── src/                           # 源代码
│   │   ├── components/                # 公共组件
│   │   │   ├── AdminLayout.vue        # 管理后台布局
│   │   │   └── IndexLayout.vue        # 首页布局
│   │   ├── views/                     # 页面组件
│   │   │   ├── LoginPage.vue          # 登录页
│   │   │   ├── admin/                 # 管理后台页面
│   │   │   │   ├── card/              # 卡密管理页面
│   │   │   │   │   ├── CardKeyGenerate.vue    # 卡密生成
│   │   │   │   │   ├── CardKeyManagement.vue  # 卡密管理
│   │   │   │   │   └── CardKeyVerify.vue      # 卡密验证
│   │   │   │   ├── jobs/              # 业务管理页面
│   │   │   │   │   ├── BossReviewManagement.vue  # 评论管理
│   │   │   │   │   └── CompanyManagement.vue    # 公司管理
│   │   │   │   ├── DashboardPage.vue          # 仪表盘
│   │   │   │   ├── LogsPage.vue               # 操作日志
│   │   │   │   ├── ProductManagement.vue      # 商品管理
│   │   │   │   ├── ProductSpecManagement.vue  # 规格管理
│   │   │   │   ├── ProfilePage.vue            # 个人资料
│   │   │   │   ├── AdminsPage.vue            # 管理员管理
│   │   │   │   └── CustomerUsersPage.vue      # 客户用户管理
│   │   │   └── index/                 # 首页页面
│   │   │       ├── AuthorInfoPage.vue         # 作者介绍
│   │   │       ├── ContactUsPage.vue          # 联系我们
│   │   │       ├── FaqPage.vue                # 常见问题
│   │   │       ├── PrivacyPolicyPage.vue      # 隐私保护
│   │   │       └── UserGuidePage.vue          # 使用指南
│   │   ├── route/                     # 路由配置
│   │   ├── services/                  # API服务
│   │   ├── utils/                     # 工具函数
│   │   └── App.vue                    # 根组件
│   ├── package.json                   # 依赖配置
│   └── vue.config.js                  # Vue配置
├── backend/                           # 后端项目
│   ├── src/main/java/                 # Java源代码
│   │   ├── controller/                # 控制器层
│   │   │   ├── AuthController.java    # 认证控制器
│   │   │   ├── AdminController.java  # 管理员控制器
│   │   │   ├── BossReviewController.java # 评论控制器
│   │   │   ├── CardKeyController.java # 卡密控制器
│   │   │   ├── CompanyController.java # 公司控制器
│   │   │   ├── CustomerUserController.java # 客户用户控制器
│   │   │   ├── DashboardController.java # 仪表盘控制器
│   │   │   ├── OperationLogController.java # 操作日志控制器
│   │   │   ├── ProductController.java # 产品控制器
│   │   │   ├── PublicBossReviewController.java # 公共评论控制器
│   │   │   ├── PublicCardKeyController.java # 公共卡密控制器
│   │   │   ├── SpecificationController.java # 规格控制器
│   │   │   └── UserController.java    # 用户控制器
│   │   ├── service/                   # 服务层
│   │   ├── mapper/                    # 数据访问层
│   │   ├── entity/                    # 实体类
│   │   ├── dto/                       # 数据传输对象
│   │   ├── config/                    # 配置类
│   │   ├── common/                    # 公共类
│   │   └── utils/                     # 工具类
│   ├── src/main/resources/            # 资源文件
│   │   ├── application.properties     # 应用配置
│   │   └── application.yml            # 应用配置
│   └── pom.xml                        # Maven配置
├── API_DOCUMENTATION.md                # API文档
└── README.md                          # 项目说明
```

## 开发指南

### 前端开发
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 运行测试
npm run test
```

### 后端开发
```bash
# 进入后端目录
cd backend

# 编译项目
mvn clean compile

# 运行应用
mvn spring-boot:run

# 打包部署
mvn clean package

# 运行测试
mvn test
```

### 数据库初始化
系统使用MyBatis Plus进行数据访问，首次启动时需要：
1. 创建数据库（见上文配置）
2. 系统会自动创建所需的数据表和初始管理员账户

## API接口

详细的API接口文档请参考：[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 认证接口示例
```javascript
// 用户登录
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@qq.com",
  "password": "123456"
}
```

### 卡密管理接口示例
```javascript
// 获取卡密列表
GET /api/card-keys?page=1&size=10&status=未使用
Authorization: Bearer {token}
```

### API 使用示例

#### 卡密验证核销示例

**验证卡密有效性（无需认证）：**
```bash
# 验证卡密并自动激活
curl -X GET "http://localhost:8081/api/public/card-keys/verify/vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh"
```

**成功响应：**
```json
{
    "code": 200,
    "message": "验证成功",
    "data": "VIP会员-月卡"
}
```

### 管理员登录获取令牌：
```bash
curl -X POST "http://localhost:8081/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@qq.com",
    "password": "123456"
  }'
```

**获取产品列表（需要认证）：**
```bash
curl -X GET "http://localhost:8081/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 开发指南

**前端开发：**
```bash
# 开发模式（带热重载）
npm run serve

# 代码检查
npm run lint

# 生产构建
npm run build
```

**后端开发：**
```bash
# 编译项目
mvn compile

# 运行测试
mvn test

# 打包部署
mvn clean package
```

#### 部署说明

**生产环境部署：**

1. **前端部署**
   - 执行 `npm run build` 生成 dist 目录
   - 配置 Nginx 指向 dist 目录
   - 设置 API 代理到后端服务

2. **后端部署**
   - 使用 `mvn clean package` 生成 jar 包
   - 使用 systemd 或 Docker 部署
   - 配置生产环境数据库连接

**Docker 部署（可选）：**
```dockerfile
# 前端 Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/

# 后端 Dockerfile
FROM openjdk:17-jre-slim
COPY target/leaf-boss-backend-1.0.0.jar /app.jar
```

#### 参与贡献

我们欢迎任何形式的贡献！

1. **Fork 本仓库**
2. **新建功能分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **提交代码**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **新建 Pull Request**

**贡献指南：**
- 遵循代码规范
- 编写清晰的提交信息
- 添加适当的测试用例
- 更新相关文档

## 版本历史

### 发布概览

| 版本 | 发布日期 | 主要特性 |
|------|----------|----------|
| **v2.0.0** | 2026-01-18 | LeafCard 升级为 LeafBoss 业务运营支撑系统 |
| **v1.0.0** | 2024-10-27 | LeafCard 业务运营支撑系统正式上线 |

### 详细变更日志

#### v2.0.0 (2026-01-18)
- 系统从 LeafCard 升级为 LeafBoss 业务运营支撑系统
- 重构系统架构，扩展为全面的业务运营支撑系统
- 更新所有文档和配置文件
- 优化UI设计，提升用户体验
- 增强安全验证机制
- 新增人员管理模块，支持管理员和普通用户管理
- 优化产品规格管理功能

#### v1.0.0 (2024-10-27)
- LeafCard 业务运营支撑系统正式上线
- 完整的用户认证系统
- 基础卡密管理功能
- 基础数据统计功能

### 开发历程

- **项目构思** (2024年1月) - 基于对现有业务运营支撑系统的分析，构思开发一个轻量级、易用的业务运营支撑系统
- **技术选型** (2024年2月) - 确定使用Vue 3 + Spring Boot 3的技术栈，开始系统架构设计
- **核心开发** (2024年3月-7月) - 完成前后端核心功能开发，包括密钥管理、用户管理、权限控制等
- **正式发布** (2024年10月27日) - LeafCard业务运营支撑系统正式上线，为用户提供服务
- **系统升级** (2026年1月18日) - LeafCard升级为LeafBoss业务运营支撑系统，支撑全面的系统

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- **GitHub 仓库**: [https://github.com/YangShengzhou03/LeafBoss](https://github.com/YangShengzhou03/LeafBoss)
- **问题反馈**: [GitHub Issues](https://github.com/YangShengzhou03/LeafBoss/issues)
- **邮箱**: dev@leafboss.com
- **项目主页**: [https://github.com/YangShengzhou03/LeafBoss](https://github.com/YangShengzhou03/LeafBoss)

## 项目统计

![GitHub Release](https://img.shields.io/github/v/release/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafBoss?style=flat-square)

---

**感谢使用 LeafBoss！**

<div align="center">

如果这个项目对您有帮助，请给个 Star 支持一下！

[![Star History Chart](https://api.star-history.com/svg?repos=YangShengzhou03/LeafBoss&type=Date)](https://star-history.com/#YangShengzhou03/LeafBoss&Date)

</div>
