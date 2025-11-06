# LeafCard - Maple Card Management System

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafCard?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafCard/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafCard?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafCard/network/members)
[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafCard?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafCard/issues)
[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafCard?style=for-the-badge)](https://github.com/YangShengzhou03/LeafCard/blob/main/LICENSE)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

</div>

## 📋 Description

LeafCard is a modern card verification backend management system built with a frontend-backend separation architecture. It provides comprehensive card management, user authentication, and permission control functionalities.

### ✨ Key Features

- 🚀 **Modern Frontend**: Vue 3 + Element Plus based interface
- 🔒 **Stable Backend**: Spring Boot framework with reliable API services
- 📱 **Responsive Design**: Multi-device compatibility
- 🔐 **Authentication**: Complete user authentication and permission management
- 📊 **Data Visualization**: Statistical analysis and reporting
- 🛡️ **Security**: Secure and reliable card verification mechanism

## 🏗️ Software Architecture

### 🔧 Technology Stack

#### Frontend Technology Stack
- **Vue 3.4.0** - Progressive JavaScript Framework
- **Element Plus 2.4.0** - Vue 3 based component library
- **Vue Router 4.2.0** - Official router for Vue.js
- **Axios 1.6.0** - HTTP client
- **Sass 1.69.0** - CSS preprocessor

#### Backend Technology Stack
- **Spring Boot 3.1.0** - Java enterprise development framework
- **Spring Data JPA** - Data persistence layer framework
- **MySQL 8.0.33** - Relational database
- **Maven** - Project build tool
- **Java 17** - Development language

**Project Structure:**
```
leaf-card/
├── frontend/                 # Frontend project
│   ├── src/
│   │   ├── components/      # Common components
│   │   ├── views/           # Page components
│   │   ├── route/           # Routing configuration
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── public/              # Static resources
└── backend/                 # Backend project
    └── src/main/java/       # Java source code
```

## ⚙️ Installation

### 📋 Environment Requirements
- **Node.js 16+** (Frontend)
- **Java 17+** (Backend)
- **MySQL 8.0+** (Database)
- **Maven 3.6+** (Backend build)

### 🖥️ Frontend Installation

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

### 🔧 Backend Installation

1. **Configure database**
```sql
CREATE DATABASE leaf_card CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Modify database configuration**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/leaf_card
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Compile and run backend**
```bash
cd backend
mvn clean package
java -jar target/leaf-card-backend-1.0.0.jar
```

## 🚀 Quick Start

### 🔧 Getting Started

1. **Start Backend Service**
   - Ensure MySQL service is running
   - Start backend application (default port 8080)

2. **Start Frontend Service**
   - Frontend development server (default port 8081)
   - Access http://localhost:8081

3. **System Login**
   - Default admin account: admin@leafcard.com / 123456
   - Change default password on first use

### 📋 Main Function Modules

- **👥 User Management**: User registration, login, permission management
- **💳 Card Management**: Card creation, verification, status management
- **📊 Data Statistics**: Usage statistics and report generation
- **⚙️ System Settings**: System parameter configuration and permission settings

## 💻 Development Guide

### 🖥️ Frontend Development

```bash
# Development mode (with hot reload)
npm run serve

# Code linting
npm run lint

# Production build
npm run build
```

### 🔧 Backend Development

```bash
# Compile project
mvn compile

# Run tests
mvn test

# Package for deployment
mvn clean package
```

## 🚀 Deployment

### 📦 Production Environment Deployment

1. **Frontend Deployment**
   - Execute `npm run build` to generate dist directory
   - Configure Nginx to point to dist directory
   - Set up API proxy to backend service

2. **Backend Deployment**
   - Use `mvn clean package` to generate jar file
   - Deploy using systemd or Docker
   - Configure production database connection

### 🐳 Docker Deployment (Optional)

```dockerfile
# Frontend Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/

# Backend Dockerfile
FROM openjdk:17-jre-slim
COPY target/leaf-card-backend-1.0.0.jar /app.jar
```

## 🤝 Contribution

We welcome contributions of all kinds!

### 📝 How to Contribute

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### 📋 Contribution Guidelines

- ✅ Follow code standards
- ✅ Write clear commit messages
- ✅ Add appropriate test cases
- ✅ Update relevant documentation

## 📋 Version History

### 📊 Release Overview

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| **v1.2.0** | 2024-03-15 | Optimized frontend performance, enhanced data visualization |
| **v1.1.0** | 2024-02-20 | Added batch operations, improved user interface |
| **v1.0.0** | 2024-01-01 | Initial release, basic card management and user authentication |

### 📝 Detailed Changelog

#### v1.2.0 (2024-03-15)
- ✨ Added data visualization chart components
- 🚀 Optimized frontend bundle size, reduced loading time by 30%
- 🔧 Improved API response format and error handling
- 📱 Enhanced mobile device adaptation

#### v1.1.0 (2024-02-20)
- ✨ Added batch card management functionality
- 🎨 Optimized UI design, improved user experience
- 🔒 Enhanced security verification mechanism
- 📊 Improved statistical reporting features

#### v1.0.0 (2024-01-01)
- 🎉 Initial version release
- 🔐 Complete user authentication system
- 💳 Basic card management functionality
- 📈 Basic data statistics functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **GitHub Repository**: [https://github.com/YangShengzhou03/LeafCard](https://github.com/YangShengzhou03/LeafCard)
- **Issue Tracker**: [GitHub Issues](https://github.com/YangShengzhou03/LeafCard/issues)
- **Email**: dev@leafcard.com
- **Project Homepage**: [https://github.com/YangShengzhou03/LeafCard](https://github.com/YangShengzhou03/LeafCard)

## 📊 Project Statistics

![GitHub Release](https://img.shields.io/github/v/release/YangShengzhou03/LeafCard?style=flat-square)
![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafCard?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafCard?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafCard?style=flat-square)

---

## 🙏 Thank You!

**Thank you for using LeafCard!** 🍁

<div align="center">

If this project helps you, please give it a ⭐ Star!

[![Star History Chart](https://api.star-history.com/svg?repos=YangShengzhou03/LeafCard&type=Date)](https://star-history.com/#YangShengzhou03/LeafCard&Date)

</div>