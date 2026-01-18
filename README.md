# Job Search Server 🚀

Backend API server for the Job Search platform, facilitating connections between Job Seekers and Recruiters. Built with **Spring Boot 3** and **MongoDB**, featuring advanced search, realtime chat, and comprehensive profile management.

## 📚 Table of Contents
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Architecture & Design](#-architecture--design)
- [API Overview](#-api-overview)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🛠 Tech Stack
- **Language**: Java 17+ (Utilizing Records, `var`, and modern syntax).
- **Framework**: Spring Boot 3.x (Web MVC, Security, WebSocket).
- **Database**: MongoDB (Spring Data MongoDB).
- **Security**: Spring Security + JWT (Self-hosted, Stateless).
- **Realtime**: WebSocket over STOMP protocol.
- **Utilities**: Lombok, Dotenv (Environment management), Jackson.
- **Build Tool**: Maven.

## ✨ Key Features

### 👤 User Management
- **Auth**: Registration, Login (JWT), Email Verification, Password Reset.
- **Roles**: `USER` (Candidate), `RECRUITER`, `ADMIN`.
- **Status**: Active, Inactive, Banned.

### 💼 Job Board
- **Advanced Search**: Filter by keyword, location, salary range, experience, and job type.
- **Management**: Post, update, close, and delete jobs.
- **Cascading**: Deleting a job automatically removes associated applications.

### 📄 Profiles & CV
- **Composite Profile**: Manage Skills, Experience, Education, and Projects in a single view.
- **Sync**: Auto-synchronization between Profile name and User account.

### 🏢 Companies
- **Company Profiles**: Recruiters can create and manage company details.
- **Verification**: Admin verification workflow (`isVerified`).

### 📝 Recruitment Flow
- **Applications**: Candidates apply with CV URLs.
- **Tracking**: Status workflow (`PENDING` -> `INTERVIEWING` -> `OFFERED` / `REJECTED`).
- **Dashboard**: Recruiters view candidate lists and statistics.

### 💬 Realtime Chat
- **Direct Messaging**: Private chat between Candidate and Recruiter.
- **Inbox**: List conversations sorted by latest message.
- **Tech**: Powered by WebSocket (STOMP) for instant delivery.

## 🏗 Architecture & Design
The project follows a strict **Layered Architecture**:

1.  **Controller Layer**: Handles HTTP requests, validates DTOs (`@Valid`), maps Entity to DTO.
2.  **Service Layer**: Contains business logic, transaction management, and validation rules.
3.  **Repository Layer**: MongoDB interaction, Custom Queries with `MongoTemplate`.
4.  **Model Layer**: MongoDB Documents (`@Document`).

## 🔌 API Overview
**Base URL**: `/api`

| Domain | Prefix | Description |
| :--- | :--- | :--- |
| **Auth & Users** | `/api/users` | Login, Register, Profile management. |
| **Jobs** | `/api/jobs` | Search, CRUD Jobs. |
| **Profiles** | `/api/profiles` | Candidate CVs, Skills. |
| **Companies** | `/api/companies` | Company profiles, Verification. |
| **Applications** | `/api/applications` | Apply, Status tracking. |
| **Chat** | `/api/chat` | History, Inbox. |
| **General** | `/api/general` | System statistics. |

*Realtime WebSocket Endpoint*: `/ws`

## 🚀 Getting Started

### Prerequisites
- Java 17 SDK
- MongoDB (Running locally on port 27017 or via Atlas)
- Maven

### Configuration
Create a `.env` file in the root directory (handled by `Dotenv`):
```properties
MONGO_URI=mongodb://localhost:27017/jobsearch
JWT_SECRET=your_super_secret_key_must_be_long_enough
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Run Locally
```bash
./mvnw spring-boot:run
```

## 📦 Deployment
Deployed on **AWS EC2** (Amazon Linux 2023).
- **Process Manager**: Systemd (`jobsearch.service`).
- **Reverse Proxy**: Nginx (SSL Termination, WebSocket Upgrade).
- **SSL**: Let's Encrypt (Certbot).

## 🤝 Contributing
To contribute to this project:
1.  Define **Model** (Entity).
2.  Create **Repository**.
3.  Define **DTOs** (Records).
4.  Implement **Service** (Business Logic).
5.  Implement **Controller** (REST Endpoint).