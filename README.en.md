# LeafBoss - Business Operation Support System

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/stargazers)&nbsp;[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/network/members)&nbsp;[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/issues)&nbsp;[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafBoss?style=for-the-badge)](https://github.com/YangShengzhou03/LeafBoss/blob/main/LICENSE)&nbsp;[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)&nbsp;[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**A modern business operation support system with frontend-backend separation architecture**

[Quick Start](#-quick-start) • [Features](#-features) • [Online Demo](#-online-demo) • [API Documentation](API_DOCUMENTATION.md)

</div>

## Features

- **Card Key Management** - Complete card key lifecycle management with creation, verification, activation, and deactivation
- **Product Management** - Product information management with multi-specification support
- **Specification Management** - Flexible specification definition for different durations and prices
- **Company Management** - Company information management with comment statistics
- **Review Management** - User review management with filtering by company and card key
- **Admin Management** - Administrator account management with permission control
- **Customer User Management** - Customer user information management with status control
- **Data Statistics** - Visual data reports with real-time system usage monitoring
- **Operation Logs** - Complete operation audit logs for system operation tracking
- **Authentication** - JWT Token authentication mechanism for system security
- **Responsive Design** - Multi-device compatibility for PC, tablet, and mobile
- **High Performance** - High-performance architecture based on Spring Boot 3 and Vue 3

### System Interface Preview

![LEAF-BOSS Business Operation Support System](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Overview.png)


## Quick Start

## Environment Requirements

### Development Environment
- **Node.js**: 16.0+ (Frontend development)
- **Java**: 17.0+ (Backend development)
- **MySQL**: 8.0+ (Database)
- **Maven**: 3.6+ (Backend build)

### Production Environment
- **Server**: Linux/Windows Server
- **Memory**: 2GB+ RAM
- **Storage**: 1GB+ available space

## Installation and Deployment

### 1. Clone Project
```bash
git clone https://github.com/YangShengzhou03/LeafBoss.git
cd leaf-boss
```

### 2. Backend Deployment

#### Configure Database
```sql
-- Create database
CREATE DATABASE leaf_boss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Execute initialization script
USE leaf_boss;
SOURCE data.sql;
```

#### Configure Application
Edit `backend/src/main/resources/application.yml`:
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

#### Start Backend Service
```bash
cd backend

# Compile project
mvn clean package

# Run application
java -jar target/leaf-boss-backend-1.0.0.jar
```

### 3. Frontend Deployment

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
Edit `frontend/.env.development`:
```env
VUE_APP_API_BASE_URL=http://localhost:8081
VUE_APP_TITLE=LEAF-BOSS Business Operation Support System (Development)
```

#### Start Frontend Service
```bash
# Development mode
npm run serve

# Or production build
npm run build
```

## Quick Usage

### 1. Access System
- Frontend URL: http://localhost:8080
- Backend API: http://localhost:8081/api

### 2. Default Account
- **Admin**: admin@qq.com / 123456

![LEAF-BOSS Admin Login](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Login.png)

### 3. Core Functions

#### Card Key Management
- Create card key batches
- Verify card key validity
- View card key usage status
- Batch import/export card keys

#### Product Management
- Product information maintenance
- Product specification configuration
- Product status management

![LEAF-BOSS Product Management](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Product-Management.png)

#### Specification Management
- Specification definition and configuration
- Authorization schemes with different durations and prices
- Specification status management

#### Company Management
- Company information maintenance
- Company review statistics
- Company status management

#### Review Management
- View user reviews
- Filter by company and card key
- Review deletion management

#### Admin Management
- Administrator account management
- Administrator information maintenance
- Permission control

#### Customer User Management
- Customer user information maintenance
- User status management
- User query and filtering

#### Operation Logs
- Complete operation audit
- Log query and statistics
- System operation tracking

#### Data Statistics
- Card key usage statistics
- Product and specification statistics
- Operation log analysis

![LEAF-BOSS Admin Dashboard](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Dashboard.png)

#### Admin Management
- Administrator account management
- Administrator information maintenance
- Permission control

![LEAF-BOSS Admin Management](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Admin-Management.png)

### System Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend Layer │    │  Backend Layer  │    │  Data Layer     │
│                 │    │                 │    │                 │
│  Vue 3 +        │◄──►│ Spring Boot 3   │◄──►│   MySQL 8.0     │
│  Element Plus   │    │ MyBatis Plus + JWT │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Layer    │    │  Business Layer │    │  Persistence    │
│                 │    │                 │    │                 │
│  Component Dev  │    │  Service Layer  │    │  Repository     │
│  Responsive     │    │  Transaction    │    │  Data Mapping   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Details

#### Frontend Technology Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue 3 | 3.4.0 | Progressive JavaScript Framework |
| Element Plus | 2.4.0 | Vue 3 based UI component library |
| Vue Router | 4.2.0 | Official router for Vue.js |
| Axios | 1.6.0 | HTTP client library |
| Sass | 1.69.0 | CSS preprocessor |

#### Backend Technology Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.1.0 | Java enterprise development framework |
| MyBatis Plus | 3.5.4.1 | Data persistence layer framework |
| MySQL | 8.0.33 | Relational database |
| Maven | 3.6+ | Project build tool |
| Java | 17.0+ | Development language |
| JWT | 0.11.5 | JSON Web Token authentication |

### Project Structure

```
leaf-boss/
├── frontend/                          # Frontend project
│   ├── public/                        # Static resources
│   │   ├── index.html                 # HTML template
│   │   └── favicon.svg                # Website icon
│   ├── src/                           # Source code
│   │   ├── components/                # Common components
│   │   │   ├── AdminLayout.vue        # Admin layout
│   │   │   └── IndexLayout.vue        # Home layout
│   │   ├── views/                     # Page components
│   │   │   ├── LoginPage.vue          # Login page
│   │   │   ├── admin/                 # Admin pages
│   │   │   │   ├── card/              # Card key pages
│   │   │   │   │   ├── CardKeyGenerate.vue    # Card key generation
│   │   │   │   │   ├── CardKeyManagement.vue  # Card key management
│   │   │   │   │   └── CardKeyVerify.vue      # Card key verification
│   │   │   │   ├── jobs/              # Business management pages
│   │   │   │   │   ├── BossReviewManagement.vue  # Review management
│   │   │   │   │   └── CompanyManagement.vue    # Company management
│   │   │   │   ├── DashboardPage.vue          # Dashboard
│   │   │   │   ├── LogsPage.vue               # Operation logs
│   │   │   │   ├── ProductManagement.vue      # Product management
│   │   │   │   ├── ProductSpecManagement.vue  # Specification management
│   │   │   │   ├── ProfilePage.vue            # Profile
│   │   │   │   ├── AdminsPage.vue            # Admin management
│   │   │   │   └── CustomerUsersPage.vue      # Customer user management
│   │   │   └── index/                 # Home pages
│   │   │       ├── AuthorInfoPage.vue         # Author info
│   │   │       ├── ContactUsPage.vue          # Contact us
│   │   │       ├── FaqPage.vue                # FAQ
│   │   │       ├── PrivacyPolicyPage.vue      # Privacy policy
│   │   │       └── UserGuidePage.vue          # User guide
│   │   ├── route/                     # Routing configuration
│   │   ├── services/                  # API services
│   │   ├── utils/                     # Utility functions
│   │   └── App.vue                    # Root component
│   ├── package.json                   # Dependency configuration
│   └── vue.config.js                  # Vue configuration
├── backend/                           # Backend project
│   ├── src/main/java/                 # Java source code
│   │   ├── controller/                # Controller layer
│   │   │   ├── AuthController.java    # Authentication controller
│   │   │   ├── AdminController.java  # Admin controller
│   │   │   ├── BossReviewController.java # Review controller
│   │   │   ├── CardKeyController.java # Card key controller
│   │   │   ├── CompanyController.java # Company controller
│   │   │   ├── CustomerUserController.java # Customer user controller
│   │   │   ├── DashboardController.java # Dashboard controller
│   │   │   ├── OperationLogController.java # Operation log controller
│   │   │   ├── ProductController.java # Product controller
│   │   │   ├── PublicBossReviewController.java # Public review controller
│   │   │   ├── PublicCardKeyController.java # Public card key controller
│   │   │   ├── SpecificationController.java # Specification controller
│   │   │   └── UserController.java    # User controller
│   │   ├── service/                   # Service layer
│   │   ├── mapper/                    # Data access layer
│   │   ├── entity/                    # Entity classes
│   │   ├── dto/                       # Data transfer objects
│   │   ├── config/                    # Configuration classes
│   │   ├── common/                    # Common classes
│   │   └── utils/                     # Utility classes
│   ├── src/main/resources/            # Resource files
│   │   ├── application.properties     # Application configuration
│   │   └── application.yml            # Application configuration
│   └── pom.xml                        # Maven configuration
├── API_DOCUMENTATION.md                # API documentation
└── README.md                          # Project description
```

## Development Guide

### Frontend Development
```bash
# Enter frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run serve

# Build production version
npm run build

# Run tests
npm run test
```

### Backend Development
```bash
# Enter backend directory
cd backend

# Compile project
mvn clean compile

# Run application
mvn spring-boot:run

# Package for deployment
mvn clean package

# Run tests
mvn test
```

### Database Initialization
The system uses MyBatis Plus for data access. On first startup, you need to:
1. Create the database (see configuration above)
2. The system will automatically create required tables and initial admin account

## API Interfaces

For detailed API documentation, please refer to: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Authentication Interface Example
```javascript
// User login
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@qq.com",
  "password": "123456"
}
```

### Card Key Management Interface Example
```javascript
// Get card key list
GET /api/card-keys?page=1&size=10&status=Unused
Authorization: Bearer {token}
```

### API Usage Examples

#### Card Key Verification and Redemption Example

**Verify card key validity (no authentication required):**
```bash
# Verify card key and automatically activate
curl -X GET "http://localhost:8081/api/public/card-keys/verify/vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh"
```

**Success Response:**
```json
{
    "code": 200,
    "message": "Verification successful",
    "data": "VIP Member - Monthly Card"
}
```

### Admin Login to Get Token:
```bash
curl -X POST "http://localhost:8081/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@qq.com",
    "password": "123456"
  }'
```

**Get Product List (requires authentication):**
```bash
curl -X GET "http://localhost:8081/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Development Guide

**Frontend Development:**
```bash
# Development mode (with hot reload)
npm run serve

# Code linting
npm run lint

# Production build
npm run build
```

**Backend Development:**
```bash
# Compile project
mvn compile

# Run tests
mvn test

# Package for deployment
mvn clean package
```

#### Deployment Instructions

**Production Environment Deployment:**

1. **Frontend Deployment**
   - Execute `npm run build` to generate dist directory
   - Configure Nginx to point to dist directory
   - Set up API proxy to backend service

2. **Backend Deployment**
   - Use `mvn clean package` to generate jar file
   - Deploy using systemd or Docker
   - Configure production database connection

**Docker Deployment (Optional):**
```dockerfile
# Frontend Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/

# Backend Dockerfile
FROM openjdk:17-jre-slim
COPY target/leaf-boss-backend-1.0.0.jar /app.jar
```

#### Contributing

We welcome contributions of all kinds!

1. **Fork repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open Pull Request**

**Contribution Guidelines:**
- Follow code standards
- Write clear commit messages
- Add appropriate test cases
- Update relevant documentation

## Version History

### Release Overview

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| **v2.0.0** | 2026-01-18 | LeafCard upgraded to LeafBoss Business Operation Support System |
| **v1.0.0** | 2024-10-27 | LeafCard Business Operation Support System officially launched |

### Detailed Changelog

#### v2.0.0 (2026-01-18)
- System upgraded from LeafCard to LeafBoss Business Operation Support System
- Refactored system architecture, expanded to comprehensive business operation support system
- Updated all documentation and configuration files
- Optimized UI design, improved user experience
- Enhanced security verification mechanism
- Added personnel management module, supporting administrator and regular user management
- Optimized product specification management functionality

#### v1.0.0 (2024-10-27)
- LeafCard Business Operation Support System officially launched
- Complete user authentication system
- Basic card key management functionality
- Basic data statistics functionality

### Development Timeline

- **Project Conception** (January 2024) - Conceived a lightweight, easy-to-use business operation support system based on analysis of existing systems
- **Technology Selection** (February 2024) - Selected Vue 3 + Spring Boot 3 technology stack, began system architecture design
- **Core Development** (March-July 2024) - Completed frontend and backend core functionality development, including card key management, user management, permission control, etc.
- **Official Launch** (October 27, 2024) - LeafCard Business Operation Support System officially launched, providing services to users
- **System Upgrade** (January 18, 2026) - LeafCard upgraded to LeafBoss Business Operation Support System, supporting comprehensive systems

## License

This project is licensed under MIT License - see [LICENSE](LICENSE) file for details.

## Contact

- **GitHub Repository**: [https://github.com/YangShengzhou03/LeafBoss](https://github.com/YangShengzhou03/LeafBoss)
- **Issue Tracker**: [GitHub Issues](https://github.com/YangShengzhou03/LeafBoss/issues)
- **Email**: dev@leafboss.com
- **Project Homepage**: [https://github.com/YangShengzhou03/LeafBoss](https://github.com/YangShengzhou03/LeafBoss)

## Project Statistics

![GitHub Release](https://img.shields.io/github/v/release/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafBoss?style=flat-square)

---

## Thank You!

**Thank you for using LeafBoss!**

<div align="center">

If this project helps you, please give it a Star support!

[![Star History Chart](https://api.star-history.com/svg?repos=YangShengzhou03/LeafBoss&type=Date)](https://star-history.com/#YangShengzhou03/LeafBoss&Date)

</div>
