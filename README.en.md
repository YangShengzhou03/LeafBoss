# LeafBoss - Business Operation Support System

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/stargazers)&nbsp;[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/network/members)&nbsp;[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/issues)&nbsp;[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafBoss?style=for-the-badge)](https://github.com/YangShengzhou03/LeafBoss/blob/main/LICENSE)&nbsp;[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)&nbsp;[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**A modern business operation support system with frontend-backend separation architecture**

[Quick Start](#-quick-start) • [Features](#-features) • [Online Demo](#-online-demo) • [API Documentation](API_DOCUMENTATION.md)

</div>

## Description

LeafBoss is a modern business operation support system built with a frontend-backend separation architecture. It provides comprehensive card key management, product management, specification management, user authentication, and permission control functionalities.

### Key Features

- **Card Key Management**: Complete card key lifecycle management with creation, verification, activation, and deactivation
- **Product Management**: Product information management with multi-specification support
- **Specification Management**: Flexible specification definition for different durations and prices
- **Company Management**: Company information management with comment statistics
- **Review Management**: User review management with filtering by company and card key
- **Admin Management**: Administrator account management with permission control
- **Customer User Management**: Customer user information management with status control
- **Data Statistics**: Visual data reports with real-time system usage monitoring
- **Operation Logs**: Complete operation audit logs for system operation tracking
- **Authentication**: JWT Token authentication mechanism for system security
- **Responsive Design**: Multi-device compatibility for PC, tablet, and mobile
- **High Performance**: High-performance architecture based on Spring Boot 3 and Vue 3

## Software Architecture

### Technology Stack

#### Frontend Technology Stack
- **Vue 3.4.0** - Progressive JavaScript Framework
- **Element Plus 2.4.0** - Vue 3 based component library
- **Vue Router 4.2.0** - Official router for Vue.js
- **Axios 1.6.0** - HTTP client
- **Sass 1.69.0** - CSS preprocessor

#### Backend Technology Stack
- **Spring Boot 3.1.0** - Java enterprise development framework
- **MyBatis Plus 3.5.4.1** - Data persistence layer framework
- **MySQL 8.0.33** - Relational database
- **Maven 3.6+** - Project build tool
- **Java 17** - Development language
- **JWT 0.11.5** - JSON Web Token authentication

**Project Structure:**
```
leaf-boss/
├── frontend/                 # Frontend project
│   ├── public/              # Static resources
│   │   ├── index.html       # HTML template
│   │   └── favicon.svg      # Website icon
│   ├── src/                 # Source code
│   │   ├── components/      # Common components
│   │   │   ├── AdminLayout.vue        # Admin layout
│   │   │   └── IndexLayout.vue        # Home layout
│   │   ├── views/           # Page components
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
│   │   │   │   └── CustomerUsersPage.vue      # User management
│   │   │   └── index/                 # Home pages
│   │   │       ├── AuthorInfoPage.vue         # Author info
│   │   │       ├── ContactUsPage.vue          # Contact us
│   │   │       ├── FaqPage.vue                # FAQ
│   │   │       ├── PrivacyPolicyPage.vue      # Privacy policy
│   │   │       └── UserGuidePage.vue          # User guide
│   │   ├── route/          # Routing configuration
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.vue          # Root component
│   ├── package.json         # Dependency configuration
│   └── vue.config.js        # Vue configuration
└── backend/                 # Backend project
    ├── src/main/java/       # Java source code
    │   ├── controller/      # Controller layer
    │   │   ├── AuthController.java    # Authentication controller
    │   │   ├── AdminController.java  # Admin controller
    │   │   ├── BossReviewController.java # Review controller
    │   │   ├── CardKeyController.java # Card key controller
    │   │   ├── DashboardController.java # Dashboard controller
    │   │   ├── OperationLogController.java # Operation log controller
    │   │   ├── ProductController.java # Product controller
    │   │   ├── PublicBossReviewController.java # Public review controller
    │   │   ├── PublicCardKeyController.java # Public card key controller
    │   │   ├── SpecificationController.java # Specification controller
    │   │   └── UserController.java    # User controller
    │   ├── service/         # Service layer
    │   ├── mapper/          # Data access layer
    │   ├── entity/          # Entity classes
    │   ├── dto/             # Data transfer objects
    │   ├── config/          # Configuration classes
    │   ├── common/          # Common classes
    │   └── utils/           # Utility classes
    ├── src/main/resources/  # Resource files
    │   ├── application.properties # Application configuration
    │   └── application.yml            # Application configuration
    └── pom.xml              # Maven configuration
```

## Installation

### Environment Requirements
- **Node.js 16+** (Frontend)
- **Java 17+** (Backend)
- **MySQL 8.0+** (Database)
- **Maven 3.6+** (Backend build)

### Frontend Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run serve
# Or use development mode
npm run dev
```

4. **Build production version**
```bash
npm run build
```

### Backend Installation

1. **Configure database**
```sql
CREATE DATABASE leaf_boss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Execute initialization script
USE leaf_boss;
SOURCE data.sql;
```

2. **Modify database configuration**
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

3. **Compile and run backend**
```bash
cd backend
mvn clean package
java -jar target/leaf-boss-backend-1.0.0.jar
```

## Quick Start

### Getting Started

1. **Start Backend Service**
   - Ensure MySQL service is running
   - Start backend application (default port 8081)

2. **Start Frontend Service**
   - Frontend development server (default port 8080)
   - Access http://localhost:8080

3. **System Login**
   - Default admin account: admin@qq.com / 123456
   - Change default password on first use

### Main Function Modules

- **Card Key Management**: Complete card key lifecycle management with creation, verification, activation, and deactivation
- **Product Management**: Product information management with multi-specification support
- **Specification Management**: Flexible specification definition for different durations and prices
- **Company Management**: Company information management with comment statistics
- **Review Management**: User review management with filtering by company and card key
- **Admin Management**: Administrator account management with permission control
- **Customer User Management**: Customer user information management with status control
- **Data Statistics**: Visual data reports with real-time system usage monitoring
- **Operation Logs**: Complete operation audit logs for system operation tracking
- **System Settings**: System parameter configuration and permission settings

## Development Guide

### Frontend Development

```bash
# Development mode (with hot reload)
npm run serve

# Code linting
npm run lint

# Production build
npm run build
```

### Backend Development

```bash
# Compile project
mvn compile

# Run tests
mvn test

# Package for deployment
mvn clean package
```

## Deployment

### Production Environment Deployment

1. **Frontend Deployment**
   - Execute `npm run build` to generate dist directory
   - Configure Nginx to point to dist directory
   - Set up API proxy to backend service

2. **Backend Deployment**
   - Use `mvn clean package` to generate jar file
   - Deploy using systemd or Docker
   - Configure production database connection

### Docker Deployment (Optional)

```dockerfile
# Frontend Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/

# Backend Dockerfile
FROM openjdk:17-jre-slim
COPY target/leaf-boss-backend-1.0.0.jar /app.jar
```

## Contribution

We welcome contributions of all kinds!

### How to Contribute

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
5. **Open a Pull Request**

### Contribution Guidelines

- Follow code standards
- Write clear commit messages
- Add appropriate test cases
- Update relevant documentation

## Version History

### Release Overview

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| **v2.0.0** | 2026-01-18 | LeafCard upgraded to LeafBoss Business Operation Support System |
| **v1.0.0** | 2024-10-27 | LeafCard Card Management System officially launched |

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
- LeafCard Card Management System officially launched
- Complete user authentication system
- Basic card management functionality
- Basic data statistics functionality

### Development Timeline

- **Project Conception** (January 2024) - Conceived a lightweight, easy-to-use card management system based on analysis of existing card management systems
- **Technology Selection** (February 2024) - Selected Vue 3 + Spring Boot 3 technology stack, began system architecture design
- **Core Development** (March-July 2024) - Completed frontend and backend core functionality development, including card management, user management, permission control, etc.
- **Official Launch** (October 27, 2024) - LeafCard Card Management System officially launched, providing services to users
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
